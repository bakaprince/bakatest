import React, { useEffect } from 'react';
import { Award, CheckCircle2, XCircle, Clock, RotateCcw, Home, Eye, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SessionSummaryData } from '../types/session';
import { formatTime } from '../utils/scoring';

interface ResultsPageProps {
  summary: SessionSummaryData;
  onRetryIncorrect: (incorrectIds: string[]) => void;
  onReviewAnswers: () => void;
  onStartNewPractice: () => void;
  onReturnHome: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  summary,
  onRetryIncorrect,
  onReviewAnswers,
  onStartNewPractice,
  onReturnHome,
}) => {
  useEffect(() => {
    // If high score (>70%), launch celebratory confetti
    if (summary.accuracy >= 70 && summary.checkedCount > 0) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore if canvas-confetti isn't available in test env
      }
    }
  }, [summary.accuracy, summary.checkedCount]);

  const hasMistakes = summary.incorrectCount > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 animate-fadeIn">
      {/* Result Card Header */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 sm:p-10 shadow-xs text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs border border-blue-100">
          <Award className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-mono uppercase font-bold tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            SESSION COMPLETED
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mt-3">
            Practice Performance
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Completed on {new Date(summary.completedAt).toLocaleDateString()} at {new Date(summary.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Score & Accuracy Highlight */}
        <div className="py-6 px-4 bg-gray-50/70 rounded-2xl border border-gray-100 flex items-center justify-around">
          <div>
            <span className="text-xs font-mono uppercase text-gray-400 font-semibold block">
              ACCURACY
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              {summary.accuracy}%
            </span>
          </div>

          <div className="h-12 w-px bg-gray-200" />

          <div>
            <span className="text-xs font-mono uppercase text-gray-400 font-semibold block">
              SCORE
            </span>
            <span className="text-4xl sm:text-5xl font-extrabold text-blue-600 tracking-tight">
              {summary.correctCount}
              <span className="text-lg text-gray-400 font-mono font-medium"> / {summary.checkedCount}</span>
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50">
            <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correct</span>
            </div>
            <span className="text-2xl font-bold text-emerald-950 font-mono">
              {summary.correctCount}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50">
            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-semibold mb-1">
              <XCircle className="w-3.5 h-3.5" />
              <span>Incorrect</span>
            </div>
            <span className="text-2xl font-bold text-rose-950 font-mono">
              {summary.incorrectCount}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>Time Spent</span>
            </div>
            <span className="text-xl font-bold text-gray-900 font-mono">
              {formatTime(summary.totalTimeSeconds)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/70">
            <div className="flex items-center gap-1.5 text-gray-600 text-xs font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Avg per Q</span>
            </div>
            <span className="text-xl font-bold text-gray-900 font-mono">
              {summary.averageTimePerQuestion}s
            </span>
          </div>
        </div>

        {/* Skipped or Unanswered note */}
        {(summary.skippedCount > 0 || summary.unansweredCount > 0) && (
          <p className="text-xs text-gray-500 font-mono">
            * {summary.skippedCount} question(s) skipped · {summary.unansweredCount} question(s) left unanswered.
          </p>
        )}

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
          {hasMistakes && (
            <button
              type="button"
              onClick={() => onRetryIncorrect(summary.incorrectQuestionIds)}
              className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Mistakes ({summary.incorrectCount})</span>
            </button>
          )}

          <button
            type="button"
            onClick={onReviewAnswers}
            className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>Review All Questions</span>
          </button>

          <button
            type="button"
            onClick={onStartNewPractice}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>New Practice</span>
          </button>

          <button
            type="button"
            onClick={onReturnHome}
            className="w-full sm:w-auto p-3 rounded-2xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            title="Return Home"
          >
            <Home className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
