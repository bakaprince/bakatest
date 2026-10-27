import React from 'react';
import { SessionQuestionState } from '../types/question';

interface AnswerSheetProps {
  questionIds: string[];
  questionStates: Record<string, SessionQuestionState>;
  currentIndex: number;
  onSelectIndex: (index: number) => void;
}

export const AnswerSheet: React.FC<AnswerSheetProps> = ({
  questionIds,
  questionStates,
  currentIndex,
  onSelectIndex,
}) => {
  // Compute counts
  let answeredCount = 0;
  let checkedCount = 0;
  let correctCount = 0;
  let incorrectCount = 0;

  questionIds.forEach(id => {
    const s = questionStates[id];
    if (s?.selectedAnswer) {
      answeredCount++;
    }
    if (s?.isChecked) {
      checkedCount++;
      if (s.isCorrect) correctCount++;
      else incorrectCount++;
    }
  });

  const remaining = questionIds.length - answeredCount;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 shadow-2xs">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3.5">
        <div>
          <h3 className="font-bold text-sm text-gray-900 tracking-tight uppercase">
            Answer Sheet
          </h3>
          <p className="text-xs text-gray-500 font-mono mt-0.5">
            {answeredCount} of {questionIds.length} answered
          </p>
        </div>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5 gap-2 max-h-[340px] overflow-y-auto pr-1">
        {questionIds.map((qId, idx) => {
          const state = questionStates[qId];
          const isCurrent = idx === currentIndex;

          let btnStyle = 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100';

          if (state?.isChecked) {
            if (state.isCorrect) {
              btnStyle = 'bg-emerald-500 text-white border-emerald-600 font-semibold shadow-2xs';
            } else {
              btnStyle = 'bg-rose-500 text-white border-rose-600 font-semibold shadow-2xs';
            }
          } else if (state?.selectedAnswer) {
            btnStyle = 'bg-blue-600 text-white border-blue-700 font-semibold shadow-2xs';
          } else if (state?.isSkipped) {
            btnStyle = 'bg-amber-50 text-amber-700 border-amber-300';
          }

          const ringStyle = isCurrent
            ? 'ring-2 ring-blue-600 ring-offset-2 ring-offset-white z-10'
            : '';

          return (
            <button
              key={qId}
              type="button"
              onClick={() => onSelectIndex(idx)}
              title={`Question ${idx + 1}`}
              className={`h-9 rounded-lg border text-xs font-mono font-medium flex items-center justify-center transition-all cursor-pointer ${btnStyle} ${ringStyle}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Answer status legend */}
      <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-600 shrink-0" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
          <span>Checked Correct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-rose-500 shrink-0" />
          <span>Checked Wrong</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-gray-100 border border-gray-300 shrink-0" />
          <span>Unanswered ({remaining})</span>
        </div>
      </div>
    </div>
  );
};
