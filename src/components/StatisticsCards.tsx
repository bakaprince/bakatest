import React from 'react';
import { Target, CheckCircle2, XCircle, RotateCcw, Clock, Award } from 'lucide-react';
import { UserStatistics } from '../types/statistics';
import { formatTime } from '../utils/scoring';

interface StatisticsCardsProps {
  stats: UserStatistics;
  totalAvailableQuestions: number;
  eligibleIncorrectCount: number;
}

export const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  stats,
  totalAvailableQuestions,
  eligibleIncorrectCount,
}) => {
  const hasHistory = stats.totalAttempts > 0;

  if (!hasHistory) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 text-center shadow-2xs">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <Target className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-gray-900">No practice history yet</h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mt-1">
          Pick your preferred session length below to begin practicing Cloud Computing questions with instant feedback and detailed explanations.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Unique Questions Covered */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gray-500">
            BANK COVERAGE
          </span>
          <Target className="w-4 h-4 text-blue-500" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {stats.uniqueQuestionsAttempted}
          </span>
          <span className="text-xs text-gray-400 font-mono font-medium">
            / {totalAvailableQuestions}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {Math.round((stats.uniqueQuestionsAttempted / totalAvailableQuestions) * 100)}% of question bank
        </p>
      </div>

      {/* Accuracy */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gray-500">
            ACCURACY
          </span>
          <Award className="w-4 h-4 text-emerald-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            {stats.overallAccuracy}%
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1.5">
          <span className="text-emerald-600 font-semibold">{stats.totalCorrect} right</span>
          <span>·</span>
          <span className="text-rose-600 font-semibold">{stats.totalIncorrect} wrong</span>
        </p>
      </div>

      {/* Needs Revision / Incorrect pool */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gray-500">
            NEEDS REVISION
          </span>
          <RotateCcw className="w-4 h-4 text-amber-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${eligibleIncorrectCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {eligibleIncorrectCount}
          </span>
          <span className="text-xs text-gray-400 font-mono font-medium">questions</span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {eligibleIncorrectCount > 0 ? 'Ready for retry practice' : 'All caught up!'}
        </p>
      </div>

      {/* Study Time & Sessions */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between text-gray-400 mb-2">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-gray-500">
            STUDY TIME
          </span>
          <Clock className="w-4 h-4 text-indigo-500" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight font-mono">
            {formatTime(stats.totalStudyTimeSeconds)}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Across {stats.completedSessionsCount} completed sessions
        </p>
      </div>
    </div>
  );
};
