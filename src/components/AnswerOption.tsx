import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface AnswerOptionProps {
  label: 'A' | 'B' | 'C' | 'D';
  text: string;
  isSelected: boolean;
  isChecked: boolean;
  isCorrectOption: boolean;
  isUserSelection: boolean;
  onSelect: (label: 'A' | 'B' | 'C' | 'D') => void;
  disabled: boolean;
}

export const AnswerOption: React.FC<AnswerOptionProps> = ({
  label,
  text,
  isSelected,
  isChecked,
  isCorrectOption,
  isUserSelection,
  onSelect,
  disabled,
}) => {
  // Determine card appearance based on state
  let cardStyles = 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50 text-gray-800';
  let badgeStyles = 'bg-gray-100 text-gray-700 border-gray-200';

  if (isChecked) {
    if (isCorrectOption) {
      // Highlight correct option in green
      cardStyles = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-1 ring-emerald-500 shadow-xs';
      badgeStyles = 'bg-emerald-600 text-white border-emerald-600';
    } else if (isUserSelection && !isCorrectOption) {
      // Highlight user wrong selection in red
      cardStyles = 'border-rose-400 bg-rose-50/70 text-rose-950 ring-1 ring-rose-400 shadow-xs';
      badgeStyles = 'bg-rose-600 text-white border-rose-600';
    } else {
      // Other unselected options after submission
      cardStyles = 'border-gray-200 bg-gray-50/40 text-gray-500 opacity-75';
      badgeStyles = 'bg-gray-100 text-gray-400 border-gray-200';
    }
  } else if (isSelected) {
    // Selected before checking
    cardStyles = 'border-blue-600 bg-blue-50/60 text-blue-950 ring-2 ring-blue-600/30 shadow-xs';
    badgeStyles = 'bg-blue-600 text-white border-blue-600';
  }

  return (
    <button
      type="button"
      onClick={() => onSelect(label)}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`Option ${label}: ${text}`}
      className={`w-full text-left p-4 sm:p-4.5 rounded-xl border transition-all duration-150 flex items-start gap-3.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 select-none ${cardStyles} ${
        disabled ? 'cursor-default' : 'cursor-pointer active:scale-[0.995]'
      }`}
    >
      {/* Label Badge (A, B, C, D) */}
      <span
        className={`shrink-0 w-8 h-8 rounded-lg border font-mono font-bold text-sm flex items-center justify-center transition-colors ${badgeStyles}`}
      >
        {label}
      </span>

      {/* Option Text */}
      <span className="flex-1 pt-1 text-sm sm:text-base font-normal leading-relaxed text-inherit">
        {text}
      </span>

      {/* Trailing Icon for Checked State */}
      {isChecked && (
        <span className="shrink-0 pt-1">
          {isCorrectOption && (
            <span className="inline-flex items-center text-emerald-600 font-semibold text-xs gap-1 bg-emerald-100/70 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              <span className="hidden sm:inline">Correct</span>
            </span>
          )}
          {isUserSelection && !isCorrectOption && (
            <span className="inline-flex items-center text-rose-600 font-semibold text-xs gap-1 bg-rose-100/70 px-2 py-0.5 rounded-full">
              <XCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Your choice</span>
            </span>
          )}
        </span>
      )}
    </button>
  );
};
