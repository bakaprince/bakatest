import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Option } from '../types/question';

interface AnswerFeedbackProps {
  isCorrect: boolean;
  userSelection: 'A' | 'B' | 'C' | 'D' | null;
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  options: Option[];
}

export const AnswerFeedback: React.FC<AnswerFeedbackProps> = ({
  isCorrect,
  userSelection,
  correctAnswer,
  options,
}) => {
  const userOptionText = options.find(o => o.label === userSelection)?.text || '';
  const correctOptionText = options.find(o => o.label === correctAnswer)?.text || '';

  if (isCorrect) {
    return (
      <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 animate-fadeIn">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-sm sm:text-base text-emerald-800">
            Correct Answer!
          </div>
          <p className="text-xs sm:text-sm text-emerald-700 mt-0.5">
            You chose <span className="font-mono font-bold">{userSelection}</span> — excellent job.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-950 space-y-3 animate-fadeIn">
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div>
          <div className="font-semibold text-sm sm:text-base text-rose-800">
            Incorrect Answer
          </div>
          <p className="text-xs sm:text-sm text-rose-700 mt-0.5">
            Review the correct solution below to reinforce this concept.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
        <div className="bg-white/80 p-2.5 rounded-lg border border-rose-100">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-rose-600 block mb-1">
            YOUR ANSWER
          </span>
          <span className="font-mono font-bold text-rose-700 mr-1.5">{userSelection}</span>
          <span className="text-gray-700">{userOptionText}</span>
        </div>

        <div className="bg-white/80 p-2.5 rounded-lg border border-emerald-200">
          <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-600 block mb-1">
            CORRECT ANSWER
          </span>
          <span className="font-mono font-bold text-emerald-700 mr-1.5">{correctAnswer}</span>
          <span className="text-gray-700">{correctOptionText}</span>
        </div>
      </div>
    </div>
  );
};
