import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { PresencePrompt, PresenceResponse, SessionStatus } from '../types/presence';

const SESSION_DURATION = 600;
const PROMPT_DURATION = 15;

interface PresenceStore {
  sessionId: string | null;
  sessionStartTime: number | null;
  sessionTimeLeft: number;
  isSessionActive: boolean;
  currentPrompt: PresencePrompt | null;
  promptTimeLeft: number;
  scheduledPrompts: number[];
  presenceHistory: PresenceResponse[];

  initializeSession: () => void;
  updateSessionTimer: () => void;
  triggerPrompt: () => void;
  updatePromptTimer: () => void;
  handlePromptResponse: () => Promise<void>;
  handlePromptTimeout: () => Promise<void>;
  getSessionStats: () => SessionStatus;
}

export const usePresenceStore = create(
  persist<PresenceStore>(
    (set, get) => ({
      sessionId: null,
      sessionStartTime: null,
      sessionTimeLeft: SESSION_DURATION,
      isSessionActive: false,
      currentPrompt: null,
      promptTimeLeft: 0,
      scheduledPrompts: [],
      presenceHistory: [],

      initializeSession: () => {
        const sessionId = Math.random().toString(36).substring(2, 9);
        const prompts: number[] = [];
        const numberOfPrompts = Math.floor(Math.random() * 2) + 2;

        for (let i = 0; i < numberOfPrompts; i++) {
          prompts.push(Math.floor(Math.random() * (SESSION_DURATION - 60)) + 30);
        }

        set({
          sessionId,
          sessionStartTime: Date.now(),
          scheduledPrompts: prompts.sort((a, b) => b - a),
          isSessionActive: true,
          sessionTimeLeft: SESSION_DURATION,
          presenceHistory: [],
          currentPrompt: null,
        });

        console.log(`New session started. Prompts at:`,
          prompts.map(p => `${Math.floor(p / 60)}:${(p % 60).toString().padStart(2, '0')}`));
      },

      updateSessionTimer: () => {
        const state = get();
        if (!state.isSessionActive || state.sessionTimeLeft <= 0) return;

        const newTime = state.sessionTimeLeft - 1;

        if (state.scheduledPrompts.length > 0 && newTime === state.scheduledPrompts[0]) {
          get().triggerPrompt();
          set({ scheduledPrompts: state.scheduledPrompts.slice(1) });
        }

        set({
          sessionTimeLeft: newTime,
          isSessionActive: newTime > 0,
        });
      },

      triggerPrompt: () => {
        const state = get();
        set({
          currentPrompt: {
            sessionId: state.sessionId!,
            promptTime: new Date().toISOString(),
            startTime: Date.now(),
          },
          promptTimeLeft: PROMPT_DURATION,
        });
        console.log('Presence prompt appeared.');
      },

      updatePromptTimer: () => {
        const state = get();
        if (!state.currentPrompt || state.promptTimeLeft <= 0) return;
        const newTime = state.promptTimeLeft - 1;
        if (newTime <= 0) {
          get().handlePromptTimeout();
        } else {
          set({ promptTimeLeft: newTime });
        }
      },

      handlePromptResponse: async () => {
        const state = get();
        if (!state.currentPrompt) return;
        const responseTime = (Date.now() - state.currentPrompt.startTime) / 1000;
        const promptData: PresenceResponse = {
          sessionId: state.sessionId!,
          promptTime: state.currentPrompt.promptTime,
          responseTime,
          status: 'responded',
        };
        fetch('http://localhost:3000/api/presence-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promptData),
        }).catch(err => console.error('API call failed:', err));
        set({
          currentPrompt: null,
          presenceHistory: [...state.presenceHistory, promptData],
        });
      },

      handlePromptTimeout: async () => {
        const state = get();
        if (!state.currentPrompt) return;
        console.log('Prompt missed.');
        const promptData: PresenceResponse = {
          sessionId: state.sessionId!,
          promptTime: state.currentPrompt.promptTime,
          responseTime: null,
          status: 'missed',
        };
        fetch('http://localhost:3000/api/presence-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(promptData),
        }).catch(err => console.error('API call failed:', err));
        set({
          currentPrompt: null,
          presenceHistory: [...state.presenceHistory, promptData],
        });
      },

      getSessionStats: (): SessionStatus => {
        const { presenceHistory } = get();
        const responded = presenceHistory.filter(p => p.status === 'responded').length;
        const total = presenceHistory.length;
        return {
          total,
          responded,
          missed: total - responded,
          responseRate: total > 0 ? Math.round((responded / total) * 100) : 0,
        };
      },
    }),
    {
      name: 'presence-check-session',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (!state || !state.isSessionActive || !state.sessionStartTime) return;
        
        console.log('Restoring previous session.');
        const elapsedTime = Math.floor((Date.now() - state.sessionStartTime) / 1000);
        state.sessionTimeLeft = Math.max(0, SESSION_DURATION - elapsedTime);

        if (state.currentPrompt?.startTime) {
          const promptElapsedTime = Math.floor((Date.now() - state.currentPrompt.startTime) / 1000);
          state.promptTimeLeft = Math.max(0, PROMPT_DURATION - promptElapsedTime);
        }
      },
    }
  )
);

export default usePresenceStore;
