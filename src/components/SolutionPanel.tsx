import React, { useState } from 'react';
import { Lightbulb, ChevronDown, ChevronUp, BookOpen, AlertCircle } from 'lucide-react';
import { SourceReference } from '../types/question';

interface SolutionPanelProps {
  solution: string | null;
  sources: SourceReference[];
  hasDiscrepancyFlag?: boolean;
}

export const SolutionPanel: React.FC<SolutionPanelProps> = ({
  solution,
  sources,
  hasDiscrepancyFlag,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);

  const isLong = solution && solution.length > 280;

  return (
    <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/40 overflow-hidden transition-all">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-blue-50/80 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-blue-600" />
          <h3 className="font-semibold text-sm text-blue-950 tracking-tight">
            Detailed Solution
          </h3>
        </div>

        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-medium cursor-pointer"
          >
            <span>{isExpanded ? 'Collapse' : 'Expand'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Content */}
      <div className={`p-4 sm:p-5 text-sm text-gray-800 leading-relaxed ${!isExpanded ? 'hidden' : 'block'}`}>
        {hasDiscrepancyFlag && (
          <div className="mb-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Source Discrepancy Note:</span> This question's supplied answer key or numerical figure is preserved exactly from the document, though an errata or mathematical inconsistency was noted in the document remarks.
            </div>
          </div>
        )}

        {solution ? (
          <div className="space-y-2 whitespace-pre-line text-gray-700">
            {solution}
          </div>
        ) : (
          <p className="italic text-gray-400">
            No detailed solution was provided in the source document.
          </p>
        )}

        {/* Source References at bottom of explanation */}
        {sources && sources.length > 0 && (
          <div className="mt-4 pt-3 border-t border-blue-100/70 text-xs text-gray-500 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-gray-600">
              <BookOpen className="w-3.5 h-3.5 text-gray-400" />
              <span>Source Attribution:</span>
            </div>
            {sources.map((src, i) => (
              <div key={i} className="pl-5 text-gray-600 font-mono text-[11px]">
                • {src.reference || src.document}
                {src.lecture && ` (${src.lecture})`}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
