import { describe, it, expect, beforeEach } from 'vitest';
import { shuffleArray } from '../utils/shuffle';
import { calculateSessionSummary, formatTime } from '../utils/scoring';
import { questionService } from '../services/questionService';
import { statisticsService } from '../services/statisticsService';
import { clearAllStoredData } from '../utils/storage';

describe('Question Bank Data Integrity', () => {
  it('should load all 377 integrated questions without error', () => {
    const all = questionService.getAllQuestions();
    expect(all).toHaveLength(377);
    expect(questionService.getClassicQuestions()).toHaveLength(268);
    expect(questionService.get2025Questions()).toHaveLength(109);
  });

  it('every question must have non-empty question statement, valid options, and correct answer', () => {
    const all = questionService.getAllQuestions();
    for (const q of all) {
      expect(q.id).toMatch(/^q-\d{3}$/);
      expect(q.question.trim().length).toBeGreaterThan(0);
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(['A', 'B', 'C', 'D']).toContain(q.correctAnswer);
      for (const opt of q.options) {
        expect(opt.text.trim().length).toBeGreaterThan(0);
      }
      expect(q.solution.trim().length).toBeGreaterThan(0);
      expect(q.source.length).toBeGreaterThan(0);
    }
  });
});

describe('Shuffle Algorithm', () => {
  it('Fisher-Yates shuffle preserves elements count and set', () => {
    const original = ['q-001', 'q-002', 'q-003', 'q-004', 'q-005'];
    const shuffled = shuffleArray(original);
    expect(shuffled).toHaveLength(original.length);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });
});

describe('Scoring Logic', () => {
  it('calculates score and accuracy accurately, excluding skipped from incorrect', () => {
    const qIds = ['q-1', 'q-2', 'q-3', 'q-4'];
    const states = {
      'q-1': { questionId: 'q-1', selectedAnswer: 'A' as const, isChecked: true, isCorrect: true, isSkipped: false, timeSpentSeconds: 10 },
      'q-2': { questionId: 'q-2', selectedAnswer: 'B' as const, isChecked: true, isCorrect: false, isSkipped: false, timeSpentSeconds: 15 },
      'q-3': { questionId: 'q-3', selectedAnswer: null, isChecked: false, isCorrect: null, isSkipped: true, timeSpentSeconds: 5 },
      'q-4': { questionId: 'q-4', selectedAnswer: null, isChecked: false, isCorrect: null, isSkipped: false, timeSpentSeconds: 0 },
    };

    const summary = calculateSessionSummary('test-sess', 'practice', qIds, states, 30);
    expect(summary.totalQuestions).toBe(4);
    expect(summary.checkedCount).toBe(2);
    expect(summary.correctCount).toBe(1);
    expect(summary.incorrectCount).toBe(1);
    expect(summary.skippedCount).toBe(1);
    expect(summary.unansweredCount).toBe(1);
    // Accuracy = 1 correct / 2 checked = 50%
    expect(summary.accuracy).toBe(50);
  });

  it('evaluates answers properly even if user moves forward without clicking Check Answer', () => {
    const qIds = ['q-1', 'q-2'];
    const states = {
      // User selected 'A' without clicking Check Answer
      'q-1': { questionId: 'q-1', selectedAnswer: 'A' as const, isChecked: false, isCorrect: true, isSkipped: false, timeSpentSeconds: 10 },
      // User selected 'B' without clicking Check Answer
      'q-2': { questionId: 'q-2', selectedAnswer: 'B' as const, isChecked: false, isCorrect: false, isSkipped: false, timeSpentSeconds: 15 },
    };

    const summary = calculateSessionSummary('test-sess', 'practice', qIds, states, 25);
    expect(summary.checkedCount).toBe(2);
    expect(summary.correctCount).toBe(1);
    expect(summary.incorrectCount).toBe(1);
    expect(summary.accuracy).toBe(50);
  });

  it('formats time to HH:MM:SS properly', () => {
    expect(formatTime(0)).toBe('00:00:00');
    expect(formatTime(65)).toBe('00:01:05');
    expect(formatTime(3661)).toBe('01:01:01');
  });
});

describe('Statistics and Retry Logic', () => {
  beforeEach(() => {
    clearAllStoredData();
  });

  it('tracks mistakes and resolves them upon correct retry', () => {
    // Attempt q-001 incorrectly
    statisticsService.recordAttempt({
      questionId: 'q-001',
      selectedOption: 'A',
      isCorrect: false,
      timestamp: Date.now(),
      sessionId: 'sess-1',
    });

    let retryPool = statisticsService.getEligibleIncorrectQuestionIds();
    expect(retryPool).toContain('q-001');

    // Attempt q-001 again correctly in retry session
    statisticsService.recordAttempt({
      questionId: 'q-001',
      selectedOption: 'B',
      isCorrect: true,
      timestamp: Date.now() + 1000,
      sessionId: 'sess-2',
    });

    // Now latest attempt is correct, should leave the retry pool
    retryPool = statisticsService.getEligibleIncorrectQuestionIds();
    expect(retryPool).not.toContain('q-001');
  });
});
