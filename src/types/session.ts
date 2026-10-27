import { SessionQuestionState } from './question';

export type SessionType = 'practice' | 'retry' | 'full';

export interface TimerConfig {
  mode: 'elapsed' | 'countdown';
  countdownMinutes: number | null; // e.g. 10, 25, 50, or custom
}

export interface PracticeSession {
  id: string;
  type: SessionType;
  questionIds: string[];
  currentIndex: number;
  questionStates: Record<string, SessionQuestionState>;
  startTime: number;
  lastActiveTime: number;
  elapsedSeconds: number;
  timerConfig: TimerConfig;
  deadlineTimestamp: number | null; // For countdown
  isCompleted: boolean;
}

export interface SessionSummaryData {
  sessionId: string;
  type: SessionType;
  totalQuestions: number;
  checkedCount: number;
  correctCount: number;
  incorrectCount: number;
  skippedCount: number;
  unansweredCount: number;
  accuracy: number;
  totalTimeSeconds: number;
  averageTimePerQuestion: number;
  completedAt: number;
  incorrectQuestionIds: string[];
}
