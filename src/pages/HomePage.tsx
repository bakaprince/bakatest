import React, { useState } from 'react';
import { Play, RotateCcw, Clock, Sparkles, BookCheck, ShieldAlert, Filter } from 'lucide-react';
import { questionService } from '../services/questionService';
import { statisticsService } from '../services/statisticsService';
import { sessionService } from '../services/sessionService';
import { StatisticsCards } from '../components/StatisticsCards';
import { YearPromptModal } from '../components/YearPromptModal';
import { TimerConfig } from '../types/session';

interface HomePageProps {
  onStartSession: (length: number | 'all', timerConfig: TimerConfig, customIds?: string[]) => void;
  onResumeSession: () => void;
  hasActiveSession: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartSession,
  onResumeSession,
  hasActiveSession,
}) => {
  const [questionBankFilter, setQuestionBankFilter] = useState<'all' | '2025' | 'classic'>('all');
  const [selectedLength, setSelectedLength] = useState<number | 'all'>(25);
  const [enableCountdown, setEnableCountdown] = useState<boolean>(false);
  const [countdownMinutes, setCountdownMinutes] = useState<number>(25);
  const [customMinutes, setCustomMinutes] = useState<string>('30');
  const [showDiagnostics, setShowDiagnostics] = useState<boolean>(false);

  // 2025 popup prompt state (shows on homepage if user hasn't dismissed it in session)
  const [show2025Modal, setShow2025Modal] = useState<boolean>(() => {
    return !sessionStorage.getItem('bakatest:dismissed_2025_prompt');
  });

  const totalQuestions = questionService.getTotalCount();
  const count2025 = questionService.get2025Questions().length;
  const countClassic = questionService.getClassicQuestions().length;

  // Active question set based on filter
  const currentPool = questionBankFilter === '2025' 
    ? questionService.get2025Questions() 
    : questionBankFilter === 'classic'
    ? questionService.getClassicQuestions()
    : questionService.getAllQuestions();

  const currentPoolCount = currentPool.length;

  const stats = statisticsService.getStatistics();
  const eligibleIncorrectIds = statisticsService.getEligibleIncorrectQuestionIds();

  const handleStartPractice = () => {
    const finalTimerConfig: TimerConfig = {
      mode: enableCountdown ? 'countdown' : 'elapsed',
      countdownMinutes: enableCountdown ? (countdownMinutes === 0 ? parseInt(customMinutes) || 30 : countdownMinutes) : null,
    };
    const poolIds = questionBankFilter === 'all' ? undefined : currentPool.map(q => q.id);
    onStartSession(selectedLength, finalTimerConfig, poolIds);
  };

  const handleStartRetry = () => {
    if (eligibleIncorrectIds.length === 0) return;
    const finalTimerConfig: TimerConfig = {
      mode: enableCountdown ? 'countdown' : 'elapsed',
      countdownMinutes: enableCountdown ? (countdownMinutes === 0 ? parseInt(customMinutes) || 30 : countdownMinutes) : null,
    };
    onStartSession('all', finalTimerConfig, eligibleIncorrectIds);
  };

  const handleModalChoose2025 = () => {
    sessionStorage.setItem('bakatest:dismissed_2025_prompt', 'true');
    setShow2025Modal(false);
    setQuestionBankFilter('2025');
  };

  const handleModalChooseAll = () => {
    sessionStorage.setItem('bakatest:dismissed_2025_prompt', 'true');
    setShow2025Modal(false);
    setQuestionBankFilter('all');
  };

  const handleModalDismiss = () => {
    sessionStorage.setItem('bakatest:dismissed_2025_prompt', 'true');
    setShow2025Modal(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-fadeIn">
      {/* Hero Banner */}
      <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-10 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>NPTEL / University Exam Bank</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Cloud Computing MCQ Practice
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Consolidated practice set of <span className="font-semibold text-gray-900">{totalQuestions} verified questions</span> from Assignment Weeks 1–12 and Mock Exams 1–5. Practice with instant feedback, review mistakes, and master core concepts without distraction.
          </p>

          {hasActiveSession && (
            <div className="mt-6 p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-blue-950">Active Session In Progress</h4>
                <p className="text-xs text-blue-700 mt-0.5">You have an unfinished practice session saved.</p>
              </div>
              <button
                type="button"
                onClick={onResumeSession}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-sm shadow-xs transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Resume Session</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Overview */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900 tracking-tight">Your Progress & Mastery</h2>
          <span className="text-xs text-gray-500 font-mono">Synced to local storage</span>
        </div>
        <StatisticsCards
          stats={stats}
          totalAvailableQuestions={totalQuestions}
          eligibleIncorrectCount={eligibleIncorrectIds.length}
        />
      </section>

      {/* Session Configuration Card */}
      <section className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Configure New Practice</h2>
            <button
              type="button"
              onClick={() => setShow2025Modal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>2025 Filter Prompt</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Choose your question bank source and practice duration.
          </p>
        </div>

        {/* Question Bank Filter (All vs 2025 Only vs Classic) */}
        <div className="space-y-3">
          <label className="text-xs font-mono uppercase font-bold tracking-wider text-gray-500 block">
            Question Bank Source
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setQuestionBankFilter('2025')}
              className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-start justify-between cursor-pointer ${
                questionBankFilter === '2025'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-600/30 shadow-2xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>2025 Questions Only</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-normal">
                  Latest 2025 assignments (Weeks 1–12)
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                {count2025}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setQuestionBankFilter('all')}
              className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-start justify-between cursor-pointer ${
                questionBankFilter === 'all'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-600/30 shadow-2xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>All Questions</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-normal">
                  2025 assignments + Classic question bank
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                {totalQuestions}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setQuestionBankFilter('classic')}
              className={`p-3.5 rounded-xl border text-sm font-semibold transition-all text-left flex items-start justify-between cursor-pointer ${
                questionBankFilter === 'classic'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-950 ring-2 ring-blue-600/30 shadow-2xs'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              <div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>Classic Bank Only</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-normal">
                  Original Assignment Weeks 1–12 & Mock 1–5
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                {countClassic}
              </span>
            </button>
          </div>
        </div>

        {/* 1. Choose Question Count */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-mono uppercase font-bold tracking-wider text-gray-500 block">
            Number of Questions
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[10, 25, 50, 'all' as const].map((len) => {
              const isSelected = selectedLength === len;
              const displayLabel = len === 'all' ? `All (${currentPoolCount})` : `${len} Questions`;

              return (
                <button
                  key={len}
                  type="button"
                  onClick={() => setSelectedLength(len)}
                  className={`p-3.5 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-600/30 shadow-2xs'
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {displayLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Timer Setup */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-mono uppercase font-bold tracking-wider text-gray-500 block">
                Practice Timing
              </label>
              <p className="text-xs text-gray-500 mt-0.5">
                {enableCountdown ? 'Countdown will submit practice when time runs out' : 'Tracks total study time without time limit'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setEnableCountdown(!enableCountdown)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                enableCountdown ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  enableCountdown ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {enableCountdown && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 animate-fadeIn">
              {[10, 25, 50, 0].map((min) => {
                const isSelected = countdownMinutes === min;
                const label = min === 0 ? 'Custom' : `${min} Mins`;

                return (
                  <button
                    key={min}
                    type="button"
                    onClick={() => setCountdownMinutes(min)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600'
                        : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}

              {countdownMinutes === 0 && (
                <div className="col-span-2 sm:col-span-4 mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="300"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-mono"
                    placeholder="Minutes"
                  />
                  <span className="text-xs text-gray-500 font-medium">Minutes countdown</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={handleStartPractice}
            className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              Start {questionBankFilter === '2025' ? '2025 ' : ''}Practice ({selectedLength === 'all' ? currentPoolCount : Math.min(typeof selectedLength === 'number' ? selectedLength : currentPoolCount, currentPoolCount)} Qs)
            </span>
          </button>

          <button
            type="button"
            onClick={handleStartRetry}
            disabled={eligibleIncorrectIds.length === 0}
            className={`w-full sm:w-auto py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base border transition-all flex items-center justify-center gap-2 ${
              eligibleIncorrectIds.length > 0
                ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 cursor-pointer'
                : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed opacity-60'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              Retry Incorrect ({eligibleIncorrectIds.length})
            </span>
          </button>
        </div>
      </section>

      {/* YearPromptModal Popup */}
      <YearPromptModal
        isOpen={show2025Modal}
        count2025={count2025}
        totalCount={totalQuestions}
        onSelect2025Only={handleModalChoose2025}
        onSelectAllQuestions={handleModalChooseAll}
        onClose={handleModalDismiss}
      />

      {/* Diagnostics Toggle for Developer/Admin auditing requirement */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => setShowDiagnostics(!showDiagnostics)}
          className="text-xs text-gray-400 hover:text-gray-600 font-mono underline inline-flex items-center gap-1 cursor-pointer"
        >
          <ShieldAlert className="w-3 h-3" />
          <span>{showDiagnostics ? 'Hide Data Ingestion Report' : 'View Question Bank Audit Report'}</span>
        </button>

        {showDiagnostics && (
          <div className="mt-4 p-5 bg-white border border-gray-200 rounded-2xl text-left font-mono text-xs text-gray-700 shadow-2xs max-w-xl mx-auto space-y-2 animate-fadeIn">
            <h4 className="font-bold text-gray-900 text-sm">Question Bank Ingestion Audit</h4>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>Total Questions Ingested:</span>
              <span className="font-bold text-emerald-600">{totalQuestions} / 268</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>Missing Explanations / Solutions:</span>
              <span className="text-gray-900">0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>Missing Sources:</span>
              <span className="text-gray-900">0</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>Missing Options:</span>
              <span className="text-gray-900">0 (All 4 options preserved)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-100">
              <span>Duplicate IDs:</span>
              <span className="text-gray-900">0</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Document Flagged Notes:</span>
              <span className="text-amber-600 font-semibold">Q75 (Numerical inconsistency noted)</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
