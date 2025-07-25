import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { SessionReport, FocusLossEvent } from '../types/focus';


interface FocusState {
  sessionId: string | null;
  sessionStartTime: number | null;
  durationLeft: number;
  isPageFocused: boolean;
  switchCount: number;
  totalTimeAwaySeconds: number;
  lastBlurTimestamp: number | null;
  trustScore: number;
  isSessionOver: boolean;
  focusLossHistory: FocusLossEvent[]

  startSession: () => void;
  updateSessionTimer: () => void;
  handleBlur: () => void;
  handleFocus: () => void;
  endSession: () => void;
}

export const useFocusStore = create(
  persist<FocusState>(
    (set, get) => ({
      sessionId: null,
      sessionStartTime: null,
      durationLeft: 600,
      isPageFocused: true,
      switchCount: 0,
      totalTimeAwaySeconds: 0,
      lastBlurTimestamp: null,
      trustScore: 100,
      isSessionOver: false,
      focusLossHistory: [],

      startSession: () => {
        console.log('Starting new focus session.');
        set({
          sessionId: `focus_session_${Date.now()}`,
          sessionStartTime: Date.now(),
          durationLeft: 600,
          isSessionOver: false,
          switchCount: 0,
          totalTimeAwaySeconds: 0,
          trustScore: 100,
        });
      },
      
      updateSessionTimer: () => {
        const state = get();
        if (state.isSessionOver || state.durationLeft <= 0) return;

        const newTime = state.durationLeft - 1;

        if (newTime <= 0) {
          set({ durationLeft: 0 });
          get().endSession();
        } else {
          set({ durationLeft: newTime });
        }
      },

      handleBlur: () => {
        if (get().isSessionOver) return;
        console.log('Page lost focus.');
        set(state => ({
          isPageFocused: false,
          switchCount: state.switchCount + 1,
          lastBlurTimestamp: Date.now(),
        }));
      },

      handleFocus: () => {
        const { lastBlurTimestamp, sessionId } = get();
        if (get().isSessionOver || !lastBlurTimestamp) return;

        console.log('Page regained focus.');
        const durationSeconds = Math.round((Date.now() - lastBlurTimestamp) / 1000);

        const state = get();


        const currentFocusLossEvent : FocusLossEvent = {
            sessionId: state.sessionId,
            timeStamp: state.lastBlurTimestamp,
            durationSeconds: durationSeconds,
        }
        
        set(state => ({
          totalTimeAwaySeconds: state.totalTimeAwaySeconds + durationSeconds,
          focusLossHistory: [...state.focusLossHistory,currentFocusLossEvent]
        }));
        
        set({ isPageFocused: true, lastBlurTimestamp: null });
      },

      endSession: () => {
        const state = get();
        if (state.isSessionOver) return;
        console.log('Session ended. Calculating final score.');
        const score = 100 - (state.switchCount * 10 + state.totalTimeAwaySeconds * 0.5);
        const finalTrustScore = Math.max(0, Math.round(score));

        set({ trustScore: finalTrustScore, isSessionOver: true });

        const report: SessionReport = {
          sessionId: state.sessionId!,
          totalSwitches: state.switchCount,
          totalTimeAway: state.totalTimeAwaySeconds,
          trustscore: finalTrustScore,
          focusLossHistory: state.focusLossHistory
        };

        console.log("------->",report,"<------------");

        fetch('http://localhost:3000/api/session-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(report),
        }).catch(() => console.log('Could not send session summary to API.'));
      },
    }),
    {
      name: 'focus-tracker-session',
      storage: createJSONStorage(() => sessionStorage),
      onRehydrateStorage: () => (state) => {
        if (state && !state.isSessionOver && state.sessionStartTime) {
          const elapsedTime = Math.floor((Date.now() - state.sessionStartTime) / 1000);
          state.durationLeft = Math.max(0, 600 - elapsedTime);
        }
      },
    }
  )
);
