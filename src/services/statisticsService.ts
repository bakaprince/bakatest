import { UserStatistics } from '../types/statistics';
import { QuestionAttempt } from '../types/question';
import { SessionSummaryData } from '../types/session';
import { loadStoredStats, saveStoredStats, clearAllStoredData } from '../utils/storage';

export const statisticsService = {
  getStatistics(): UserStatistics {
    return loadStoredStats();
  },

  recordAttempt(attempt: QuestionAttempt): UserStatistics {
    const stats = loadStoredStats();

    stats.totalAttempts += 1;
    if (attempt.isCorrect) {
      stats.totalCorrect += 1;
    } else {
      stats.totalIncorrect += 1;
    }

    // Update Question Mastery
    const existing = stats.questionMastery[attempt.questionId];
    stats.questionMastery[attempt.questionId] = {
      latestCorrect: attempt.isCorrect,
      totalAttempts: (existing?.totalAttempts || 0) + 1,
      lastAttemptedAt: attempt.timestamp,
    };

    // Calculate unique questions attempted
    stats.uniqueQuestionsAttempted = Object.keys(stats.questionMastery).length;

    // Overall accuracy
    if (stats.totalAttempts > 0) {
      stats.overallAccuracy = Math.round((stats.totalCorrect / stats.totalAttempts) * 1000) / 10;
    }

    // Append attempt log (keep last 1000)
    stats.attemptsHistory = [attempt, ...(stats.attemptsHistory || [])].slice(0, 1000);

    saveStoredStats(stats);
    return stats;
  },

  recordCompletedSession(summary: SessionSummaryData): UserStatistics {
    const stats = loadStoredStats();

    stats.completedSessionsCount += 1;
    stats.totalStudyTimeSeconds += summary.totalTimeSeconds;
    stats.sessionHistory = [summary, ...(stats.sessionHistory || [])].slice(0, 50);

    saveStoredStats(stats);
    return stats;
  },

  /**
   * Defines retry pool:
   * Questions that have at least one recorded attempt and whose latest recorded attempt is still incorrect.
   */
  getEligibleIncorrectQuestionIds(): string[] {
    const stats = loadStoredStats();
    const incorrectIds: string[] = [];

    for (const [qId, mastery] of Object.entries(stats.questionMastery)) {
      if (!mastery.latestCorrect) {
        incorrectIds.push(qId);
      }
    }
    return incorrectIds;
  },

  resetAll(): void {
    clearAllStoredData();
  },
};
