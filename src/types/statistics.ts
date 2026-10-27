import { QuestionAttempt } from './question';
import { SessionSummaryData } from './session';

export interface UserStatistics {
  totalAttempts: number; // Sum of all checks ever made
  uniqueQuestionsAttempted: number; // Unique questions tried at least once
  totalCorrect: number;
  totalIncorrect: number;
  overallAccuracy: number;
  totalStudyTimeSeconds: number;
  completedSessionsCount: number;
  // Map of questionId -> latest attempt status
  questionMastery: Record<string, {
    latestCorrect: boolean;
    totalAttempts: number;
    lastAttemptedAt: number;
  }>;
  // History of completed sessions
  sessionHistory: SessionSummaryData[];
  // Raw attempts log (capped at e.g. 1000 for storage sanity)
  attemptsHistory: QuestionAttempt[];
}
