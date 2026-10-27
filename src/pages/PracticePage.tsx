import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle, ChevronRight, HelpCircle } from 'lucide-react';
import { PracticeSession, SessionSummaryData } from '../types/session';
import { usePracticeSession } from '../hooks/usePracticeSession';
import { useTimer } from '../hooks/useTimer';
import { QuestionMetadata } from '../components/QuestionMetadata';
import { AnswerOption } from '../components/AnswerOption';
import { AnswerFeedback } from '../components/AnswerFeedback';
import { SolutionPanel } from '../components/SolutionPanel';
import { SessionTimer } from '../components/SessionTimer';
import { AnswerSheet } from '../components/AnswerSheet';
import { ConfirmationDialog } from '../components/ConfirmationDialog';

interface PracticePageProps {
  session: PracticeSession;
  onFinishSession: (summary: SessionSummaryData) => void;
  onExitToHome: () => void;
  onShowShortcuts?: () => void;
}

export const PracticePage: React.FC<PracticePageProps> = ({
  session: initialSession,
  onFinishSession,
  onExitToHome,
  onShowShortcuts,
}) => {
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const {
    session,
    currentQuestion,
    currentState,
    currentIndex,
    totalQuestions,
    selectedOption,
    validationError,
    handleSelectOption,
    handleCheckAnswer,
    handleSkipQuestion,
    handleNextQuestion,
    handlePrevQuestion,
    handleJumpToQuestion,
    finishSession,
    handleTimerTick,
  } = usePracticeSession(initialSession, onFinishSession);

  // Timer Integration
  const timer = useTimer({
    timerConfig: session.timerConfig,
    deadlineTimestamp: session.deadlineTimestamp,
    initialElapsedSeconds: session.elapsedSeconds,
    isActive: !session.isCompleted,
    onTick: handleTimerTick,
    onTimeExpire: () => {
      // Countdown expired: automatically finalize practice
      finishSession();
    },
  });

  const isChecked = Boolean(currentState?.isChecked);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Handle Next button click:
  // If user selected an answer, allow proceeding directly (saved automatically).
  // If question is completely unanswered, ask if they wish to skip.
  const onClickNext = () => {
    if (!selectedOption && !isChecked) {
      setShowSkipConfirm(true);
    } else {
      handleNextQuestion();
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in input or modal is open
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (showSkipConfirm || showExitConfirm) return;

      const key = e.key.toUpperCase();
      if (['A', 'B', 'C', 'D'].includes(key)) {
        if (!isChecked) {
          handleSelectOption(key as 'A' | 'B' | 'C' | 'D');
        }
      } else if (e.key === 'Enter') {
        if (!isChecked && selectedOption) {
          handleCheckAnswer();
        } else if (isChecked) {
          handleNextQuestion();
        }
      } else if (e.key === 'ArrowRight') {
        if (selectedOption || isChecked) {
          handleNextQuestion();
        } else {
          setShowSkipConfirm(true);
        }
      } else if (e.key === 'ArrowLeft') {
        handlePrevQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isChecked,
    selectedOption,
    showSkipConfirm,
    showExitConfirm,
    handleSelectOption,
    handleCheckAnswer,
    handleNextQuestion,
    handlePrevQuestion,
  ]);

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-500">Question not found.</p>
        <button
          onClick={onExitToHome}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Top action row */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </button>

        <div className="flex items-center gap-2">
          {onShowShortcuts && (
            <button
              onClick={onShowShortcuts}
              className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Shortcuts</span>
            </button>
          )}
          <span className="text-xs font-mono font-medium text-gray-500 px-2.5 py-1 bg-white border border-gray-200 rounded-lg">
            Progress: {currentIndex + 1} / {totalQuestions}
          </span>
        </div>
      </div>

      {/* Main Grid: Question area (Left) vs Answer Sheet & Timer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT / MAIN QUESTION CARD (8 cols on lg) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs">
            {/* Metadata (Progress, marks, source attribution) */}
            <QuestionMetadata
              currentNumber={currentIndex + 1}
              totalQuestions={totalQuestions}
              marks={currentQuestion.marks}
              sources={currentQuestion.source}
              topic={currentQuestion.topic}
              hasDiscrepancyFlag={currentQuestion.hasDiscrepancyFlag}
            />

            {/* Question Statement */}
            <div className="text-base sm:text-lg text-gray-900 font-medium leading-relaxed mb-6 whitespace-pre-line">
              {currentQuestion.question}
            </div>

            {/* Answer Options */}
            <div className="space-y-3" role="radiogroup" aria-label="Answer options">
              {currentQuestion.options.map((opt) => (
                <AnswerOption
                  key={opt.label}
                  label={opt.label}
                  text={opt.text}
                  isSelected={selectedOption === opt.label}
                  isChecked={isChecked}
                  isCorrectOption={opt.label === currentQuestion.correctAnswer}
                  isUserSelection={currentState?.selectedAnswer === opt.label}
                  onSelect={handleSelectOption}
                  disabled={isChecked}
                />
              ))}
            </div>

            {/* Validation Message */}
            {validationError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs sm:text-sm text-rose-700 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Checked Feedback Banner */}
            {isChecked && currentState && (
              <div className="mt-6">
                <AnswerFeedback
                  isCorrect={Boolean(currentState.isCorrect)}
                  userSelection={currentState.selectedAnswer}
                  correctAnswer={currentQuestion.correctAnswer}
                  options={currentQuestion.options}
                />
              </div>
            )}

            {/* Detailed Solution Panel */}
            {isChecked && (
              <SolutionPanel
                solution={currentQuestion.solution}
                sources={currentQuestion.source}
                hasDiscrepancyFlag={currentQuestion.hasDiscrepancyFlag}
              />
            )}

            {/* Action Bar (Check Answer & Next Question) */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={handlePrevQuestion}
                disabled={currentIndex === 0}
                className={`px-4 py-2.5 rounded-xl border text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                  currentIndex === 0
                    ? 'border-gray-200 text-gray-300 cursor-not-allowed bg-gray-50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer'
                }`}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>

              <div className="flex items-center gap-3">
                {/* Primary Action 1: Check Answer */}
                {!isChecked ? (
                  <button
                    type="button"
                    onClick={handleCheckAnswer}
                    disabled={!selectedOption}
                    className={`px-6 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all shadow-xs ${
                      selectedOption
                        ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer active:scale-95'
                        : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Check Answer</span>
                  </button>
                ) : null}

                {/* Primary Action 2: Next Question / Finish */}
                <button
                  type="button"
                  onClick={onClickNext}
                  className={`px-6 py-2.5 rounded-xl font-bold text-sm inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                >
                  <span>{isLastQuestion ? 'Finish Practice' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT / SIDEBAR (4 cols on lg) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Timer Card */}
          <SessionTimer
            elapsedSeconds={timer.elapsedSeconds}
            remainingSeconds={timer.remainingSeconds}
            isCountdown={timer.isCountdown}
            isWarning20Percent={timer.isWarning20Percent}
            isUrgent1Minute={timer.isUrgent1Minute}
          />

          {/* Answer Sheet Navigator */}
          <AnswerSheet
            questionIds={session.questionIds}
            questionStates={session.questionStates}
            currentIndex={currentIndex}
            onSelectIndex={handleJumpToQuestion}
          />

          {/* Session Progress Stats Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-xs text-gray-500 space-y-2">
            <div className="flex justify-between font-mono font-medium">
              <span>Session Type:</span>
              <span className="capitalize font-semibold text-gray-800">{session.type}</span>
            </div>
            <div className="flex justify-between font-mono font-medium">
              <span>Total in set:</span>
              <span className="font-semibold text-gray-800">{totalQuestions} Questions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Skip Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showSkipConfirm}
        title="Skip this question?"
        message="You haven't checked an answer for this question yet. Skipping will move to the next question without recording an answer."
        confirmLabel="Skip Question"
        cancelLabel="Stay & Answer"
        onConfirm={() => {
          setShowSkipConfirm(false);
          handleSkipQuestion();
        }}
        onCancel={() => setShowSkipConfirm(false)}
      />

      {/* Exit Session Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showExitConfirm}
        title="Leave Practice Session?"
        message="Your progress is saved locally. You can resume this session anytime from the home screen."
        confirmLabel="Leave Practice"
        cancelLabel="Continue Practicing"
        onConfirm={() => {
          setShowExitConfirm(false);
          onExitToHome();
        }}
        onCancel={() => setShowExitConfirm(false)}
      />
    </div>
  );
};
