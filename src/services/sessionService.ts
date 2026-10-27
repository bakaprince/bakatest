import { PracticeSession, SessionType, TimerConfig } from '../types/session';
import { questionService } from './questionService';
import { shuffleArray } from '../utils/shuffle';
import { loadStoredSession, saveStoredSession } from '../utils/storage';

export const sessionService = {
  getActiveSession(): PracticeSession | null {
    return loadStoredSession();
  },

  createPracticeSession(
    length: number | 'all',
    timerConfig: TimerConfig,
    type: SessionType = 'practice',
    customQuestionIds?: string[]
  ): PracticeSession {
    let pool: string[];

    if (customQuestionIds && customQuestionIds.length > 0) {
      pool = [...customQuestionIds];
    } else {
      const allQ = questionService.getAllQuestions();
      pool = allQ.map(q => q.id);
    }

    // Shuffle pool using Fisher-Yates
    const shuffled = shuffleArray(pool);

    const targetLength = length === 'all' ? shuffled.length : Math.min(length, shuffled.length);
    const selectedIds = shuffled.slice(0, targetLength);

    const now = Date.now();
    let deadlineTimestamp: number | null = null;
    if (timerConfig.mode === 'countdown' && timerConfig.countdownMinutes) {
      deadlineTimestamp = now + timerConfig.countdownMinutes * 60 * 1000;
    }

    const newSession: PracticeSession = {
      id: `session-${now}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      questionIds: selectedIds,
      currentIndex: 0,
      questionStates: {},
      startTime: now,
      lastActiveTime: now,
      elapsedSeconds: 0,
      timerConfig,
      deadlineTimestamp,
      isCompleted: false,
    };

    saveStoredSession(newSession);
    return newSession;
  },

  updateSession(session: PracticeSession): void {
    saveStoredSession(session);
  },

  endSession(session: PracticeSession): PracticeSession {
    const updated = {
      ...session,
      isCompleted: true,
      lastActiveTime: Date.now(),
    };
    saveStoredSession(null); // Clear active session from slot so home shows fresh options
    return updated;
  },

  clearActiveSession(): void {
    saveStoredSession(null);
  },
};
