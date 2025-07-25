export interface Question {
    id: number;
    question: string;
    options: string[];
    answer: string;
  }
  
  export interface QuizAnswer {
    sessionId: string;
    questionId: number;
    userAnswer: string;
    isCorrect: boolean;
    timeTaken: number;
    videoTimestamp: number;
}