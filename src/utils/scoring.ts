import { SessionQuestionState } from '../types/question';
import { SessionSummaryData, SessionType } from '../types/session';

/**
 * Calculates score and session summary metrics accurately.
 * Accuracy formula per requirements: Correct Answers / Checked Questions * 100
 * Skipped questions are tracked separately and not counted as incorrect.
 */
export function calculateSessionSummary(
  sessionId: string,
  type: SessionType,
  questionIds: string[],
  states: Record<string, SessionQuestionState>,
  elapsedSeconds: number
): SessionSummaryData {
  let checkedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;
  let unansweredCount = 0;
  const incorrectQuestionIds: string[] = [];

  for (const qId of questionIds) {
    const state = states[qId];
    const isAnswered = state && state.selectedAnswer !== null;

    if (!state || (!isAnswered && !state.isSkipped)) {
      unansweredCount++;
    } else if (isAnswered) {
      checkedCount++; // Count as attempted/answered
      if (state.isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
        incorrectQuestionIds.push(qId);
      }
    } else if (state.isSkipped) {
      skippedCount++;
    }
  }

  const accuracy = checkedCount > 0 ? Math.round((correctCount / checkedCount) * 1000) / 10 : 0;
  const averageTimePerQuestion = checkedCount > 0 ? Math.round(elapsedSeconds / checkedCount) : 0;

  return {
    sessionId,
    type,
    totalQuestions: questionIds.length,
    checkedCount,
    correctCount,
    incorrectCount,
    skippedCount,
    unansweredCount,
    accuracy,
    totalTimeSeconds: elapsedSeconds,
    averageTimePerQuestion,
    completedAt: Date.now(),
    incorrectQuestionIds,
  };
}

/**
 * Format seconds into HH:MM:SS
 */
export function formatTime(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
