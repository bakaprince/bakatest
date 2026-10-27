import React, { useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2, XCircle, BookOpen } from 'lucide-react';
import { SessionSummaryData } from '../types/session';
import { questionService } from '../services/questionService';
import { SessionQuestionState } from '../types/question';
import { QuestionMetadata } from '../components/QuestionMetadata';
import { SolutionPanel } from '../components/SolutionPanel';

interface ReviewPageProps {
  summary: SessionSummaryData;
  questionStates: Record<string, SessionQuestionState>;
  onBackToResults: () => void;
  onReturnHome: () => void;
}

export const ReviewPage: React.FC<ReviewPageProps> = ({
  summary,
  questionStates,
  onBackToResults,
  onReturnHome,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'incorrect' | 'correct'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter questions based on filterMode
  const allIds = Object.keys(questionStates);
  const filteredIds = allIds.filter(id => {
    const s = questionStates[id];
    if (filterMode === 'incorrect') return s?.selectedAnswer !== null && s?.isCorrect === false;
    if (filterMode === 'correct') return s?.selectedAnswer !== null && s?.isCorrect === true;
    return true;
  });

  const activeQuestionId = filteredIds[currentIndex];
  const question = activeQuestionId ? questionService.getQuestionById(activeQuestionId) : undefined;
  const state = activeQuestionId ? questionStates[activeQuestionId] : undefined;

  const handleNext = () => {
    if (currentIndex < filteredIds.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBackToResults}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Summary</span>
        </button>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => { setFilterMode('all'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'all' ? 'bg-white text-gray-900 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            All ({allIds.length})
          </button>
          <button
            type="button"
            onClick={() => { setFilterMode('incorrect'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'incorrect' ? 'bg-white text-rose-700 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Mistakes ({summary.incorrectCount})
          </button>
          <button
            type="button"
            onClick={() => { setFilterMode('correct'); setCurrentIndex(0); }}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              filterMode === 'correct' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Correct ({summary.correctCount})
          </button>
        </div>
      </div>

      {filteredIds.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center text-gray-500">
          No questions match this filter.
        </div>
      ) : question ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-xs space-y-5">
          {/* Metadata */}
          <QuestionMetadata
            currentNumber={currentIndex + 1}
            totalQuestions={filteredIds.length}
            marks={question.marks}
            sources={question.source}
            topic={question.topic}
            hasDiscrepancyFlag={question.hasDiscrepancyFlag}
          />

          {/* Question text */}
          <div className="text-base sm:text-lg text-gray-900 font-medium leading-relaxed whitespace-pre-line">
            {question.question}
          </div>

          {/* User Selection vs Correct option cards */}
          <div className="space-y-2.5">
            {question.options.map((opt) => {
              const isSelected = state?.selectedAnswer === opt.label;
              const isCorrect = opt.label === question.correctAnswer;

              let cardBg = 'border-gray-200 bg-gray-50/40 text-gray-600';
              let badgeBg = 'bg-gray-100 text-gray-500 border-gray-200';

              if (isCorrect) {
                cardBg = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500';
                badgeBg = 'bg-emerald-600 text-white border-emerald-600';
              } else if (isSelected && !isCorrect) {
                cardBg = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-400';
                badgeBg = 'bg-rose-600 text-white border-rose-600';
              }

              return (
                <div
                  key={opt.label}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 text-sm ${cardBg}`}
                >
                  <div className="flex items-start gap-3">
                    <span className={`w-7 h-7 rounded-lg border font-mono font-bold text-xs flex items-center justify-center shrink-0 ${badgeBg}`}>
                      {opt.label}
                    </span>
                    <span className="leading-relaxed pt-0.5">{opt.text}</span>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isCorrect && (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-xs bg-emerald-100/70 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Correct Answer</span>
                      </span>
                    )}
                    {isSelected && !isCorrect && (
                      <span className="inline-flex items-center gap-1 text-rose-700 font-semibold text-xs bg-rose-100/70 px-2 py-0.5 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Your Choice</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Solution Panel */}
          <SolutionPanel
            solution={question.solution}
            sources={question.source}
            hasDiscrepancyFlag={question.hasDiscrepancyFlag}
          />

          {/* Navigation between reviewed questions */}
          <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                currentIndex === 0
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Question</span>
            </button>

            <span className="text-xs font-mono text-gray-500">
              Reviewing {currentIndex + 1} of {filteredIds.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              disabled={currentIndex === filteredIds.length - 1}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold inline-flex items-center gap-1.5 transition-colors ${
                currentIndex === filteredIds.length - 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-100 cursor-pointer'
              }`}
            >
              <span>Next Question</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
