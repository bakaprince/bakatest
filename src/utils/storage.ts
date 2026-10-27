import { UserStatistics } from '../types/statistics';
import { PracticeSession } from '../types/session';

export const STORAGE_PREFIX = 'bakatest:v1';
export const SESSION_KEY = `${STORAGE_PREFIX}:active_session`;
export const STATS_KEY = `${STORAGE_PREFIX}:user_stats`;

export const DEFAULT_USER_STATISTICS: UserStatistics = {
  totalAttempts: 0,
  uniqueQuestionsAttempted: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  overallAccuracy: 0,
  totalStudyTimeSeconds: 0,
  completedSessionsCount: 0,
  questionMastery: {},
  sessionHistory: [],
  attemptsHistory: [],
};

export function loadStoredSession(): PracticeSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PracticeSession;
  } catch (e) {
    console.error('Failed to parse stored session, removing corrupted data', e);
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function saveStoredSession(session: PracticeSession | null): void {
  try {
    if (!session) {
      localStorage.removeItem(SESSION_KEY);
    } else {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  } catch (e) {
    console.error('Failed to save session to localStorage', e);
  }
}

export function loadStoredStats(): UserStatistics {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return DEFAULT_USER_STATISTICS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_USER_STATISTICS,
      ...parsed,
    };
  } catch (e) {
    console.error('Failed to parse statistics, recovering with defaults', e);
    return DEFAULT_USER_STATISTICS;
  }
}

export function saveStoredStats(stats: UserStatistics): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Failed to save stats to localStorage', e);
  }
}

export function clearAllStoredData(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (e) {
    console.error('Failed to clear stored data', e);
  }
}
