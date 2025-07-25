import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Question, QuizAnswer } from '../types/quiz';

interface QuizState {
  sessionId: string;
  currentQuestion: Question | null;
  showQuiz: boolean;
  answers: QuizAnswer[];
  videoProgress: number;
  videoDuration: number;
  isPlaying: boolean;
  quizStartTime: number;
  triggeredPercentages: Set<number>;

  startSession: () => void;
  setVideoDuration: (duration: number) => void;
  showQuizModal: (question: Question, videoTime: number) => void;
  submitAnswer: (answer: string) => void;
  updateProgress: (progress: number) => void;
  playVideo: () => void;
  pauseVideo: () => void;
}

const questions: Question[] = [
  {
    id: 1,
    question: "What is React used for?",
    options: ["Building UIs", "Databases", "Servers", "Files"],
    answer: "Building UIs"
  },
  {
    id: 2,
    question: "What does JSX mean?",
    options: ["JavaScript XML", "Java Extension", "JSON XML", "JS Extra"],
    answer: "JavaScript XML"
  },
  {
    id: 3,
    question: "Which hook manages state?",
    options: ["useEffect", "useState", "useContext", "useRef"],
    answer: "useState"
  }
];

export const useQuizStore = create<QuizState>(
    (set, get) => ({
      sessionId: '',
      currentQuestion: null,
      showQuiz: false,
      answers: [],
      videoProgress: 0,
      videoDuration: 0,
      isPlaying: false,
      quizStartTime: 0,
      triggeredPercentages: new Set(),

      startSession: () => {
        const sessionId = `quiz_${Date.now()}`;
        console.log('Starting new quiz session:', sessionId);
        set({
          sessionId,
          answers: [],
          triggeredPercentages: new Set(),
          videoDuration: 0,
          videoProgress: 0
        });
      },

      setVideoDuration: (duration: number) => {
        console.log('Video duration set:', Math.round(duration), 'seconds');
        set({ videoDuration: duration });
      },

      showQuizModal: (question: Question, videoTime: number) => {
        console.log('Showing quiz:', question.question);
        set({
          currentQuestion: question,
          showQuiz: true,
          isPlaying: false,
          quizStartTime: Date.now()
        });
      },

      submitAnswer: (userAnswer: string) => {
        const state = get();
        if (!state.currentQuestion) return;

        const timeTaken = (Date.now() - state.quizStartTime) / 1000;
        const isCorrect = userAnswer === state.currentQuestion.answer;
        
        console.log(`Answer: ${userAnswer} (${isCorrect ? 'Correct' : 'Incorrect'})`);
        
        const newAnswer: QuizAnswer = {
          sessionId: state.sessionId,
          questionId: state.currentQuestion.id,
          userAnswer,
          isCorrect,
          timeTaken: Math.round(timeTaken * 10) / 10,
          videoTimestamp: state.videoProgress
        };

        fetch('http://localhost:3000/api/quiz-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAnswer),
        }).catch(() => console.log('Could not send quiz response to API.'));

        set({
          answers: [...state.answers, newAnswer],
          showQuiz: false,
          currentQuestion: null,
          isPlaying: true
        });
      },

      updateProgress: (progressSeconds: number) => {
        const state = get();
        if (state.videoDuration === 0 || !progressSeconds) return;
        
        set({ videoProgress: progressSeconds });

        const currentPercent = (progressSeconds / state.videoDuration) * 100;
        const triggers = [25, 50, 75];
        
        for (const trigger of triggers) {
          if (currentPercent >= trigger && !state.triggeredPercentages.has(trigger) && !state.showQuiz) {
            console.log(`Quiz triggered at ${trigger}%`);
            const randomQ = questions[Math.floor(Math.random() * questions.length)];
            get().showQuizModal(randomQ, progressSeconds);
            set(prevState => ({
              triggeredPercentages: new Set(prevState.triggeredPercentages).add(trigger)
            }));
            break;
          }
        }
      },

      playVideo: () => set({ isPlaying: true }),
      pauseVideo: () => set({ isPlaying: false })
    }),

  );
