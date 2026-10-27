import React from 'react';
import { Sparkles, ArrowRight, BookOpen, Layers } from 'lucide-react';

interface YearPromptModalProps {
  isOpen: boolean;
  onSelect2025Only: () => void;
  onSelectAllQuestions: () => void;
  onClose: () => void;
  count2025: number;
  totalCount: number;
}

export const YearPromptModal: React.FC<YearPromptModalProps> = ({
  isOpen,
  onSelect2025Only,
  onSelectAllQuestions,
  onClose,
  count2025,
  totalCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs animate-fadeIn">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative overflow-hidden"
      >
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-blue-100/60 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-2.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full w-fit mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>New 2025 Assignment Questions Added!</span>
        </div>

        <h3 id="modal-headline" className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-snug">
          Practice 2025 Questions Only?
        </h3>

        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
          We recently added <span className="font-semibold text-gray-900">{count2025} brand new unique questions</span> from the 2025 Cloud Computing Assignments. Would you like to practice only the 2025 question bank or the full combined bank?
        </p>

        {/* Choice Cards */}
        <div className="mt-6 space-y-3">
          {/* Option 1: 2025 Only */}
          <button
            type="button"
            onClick={onSelect2025Only}
            className="w-full text-left p-4 rounded-2xl border-2 border-blue-600 bg-blue-50/60 hover:bg-blue-100/60 transition-all flex items-center justify-between group cursor-pointer shadow-xs"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-blue-950 flex items-center gap-2">
                  <span>Only 2025 Questions</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-200/80 text-blue-800 font-bold">
                    {count2025} Qs
                  </span>
                </div>
                <p className="text-xs text-blue-800/80 mt-0.5">
                  Focus exclusively on the latest 2025 assignments (Weeks 1–12)
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-blue-600 shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: All Questions */}
          <button
            type="button"
            onClick={onSelectAllQuestions}
            className="w-full text-left p-4 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-between group cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0 group-hover:bg-gray-200 transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm sm:text-base text-gray-900 flex items-center gap-2">
                  <span>All Combined Questions</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                    {totalCount} Qs
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Mix 2025 assignments + classic question bank & mock exams
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-gray-400 shrink-0 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dismiss footer */}
        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600 font-medium px-2 py-1 rounded cursor-pointer"
          >
            Dismiss popup
          </button>
        </div>
      </div>
    </div>
  );
};
