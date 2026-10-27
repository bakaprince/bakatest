export interface Option {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
}

export interface SourceReference {
  document: string;
  reference: string;
  lecture?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard' | string;
}

export interface Question {
  id: string; // e.g. "q-001"
  originalNumber: number;
  marks: number;
  question: string;
  options: Option[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  solution: string;
  source: SourceReference[];
  sourceRaw?: string;
  topic?: string | null;
  hasDiscrepancyFlag?: boolean;
  year?: 'classic' | '2025' | string;
}

export interface QuestionAttempt {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect: boolean;
  timestamp: number;
  sessionId: string;
}

export type QuestionStatus = 'unanswered' | 'selected' | 'correct' | 'incorrect' | 'skipped';

export interface SessionQuestionState {
  questionId: string;
  selectedAnswer: 'A' | 'B' | 'C' | 'D' | null;
  isChecked: boolean;
  isCorrect: boolean | null;
  isSkipped: boolean;
  timeSpentSeconds: number;
}
