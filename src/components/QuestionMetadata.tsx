import React, { useState } from 'react';
import { SourceReference } from '../types/question';
import { ChevronDown, ChevronUp, BookOpen, AlertTriangle } from 'lucide-react';

interface QuestionMetadataProps {
  currentNumber: number;
  totalQuestions: number;
  marks: number;
  sources: SourceReference[];
  topic?: string | null;
  hasDiscrepancyFlag?: boolean;
}

export const QuestionMetadata: React.FC<QuestionMetadataProps> = ({
  currentNumber,
  totalQuestions,
  marks,
  sources,
  topic,
  hasDiscrepancyFlag,
}) => {
  const [showOtherSources, setShowOtherSources] = useState(false);

  const primarySource = sources[0];
  const secondarySources = sources.slice(1);

  return (
    <div className="border-b border-gray-100 pb-4 mb-5">
      {/* Top row: Question counter & Marks */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono font-semibold tracking-wider uppercase text-gray-500 mb-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
            QUESTION {currentNumber} OF {totalQuestions}
          </span>
          <span>·</span>
          <span className="text-gray-600">{marks} MARK</span>
          {topic && (
            <>
              <span>·</span>
              <span className="text-gray-500 lowercase first-letter:uppercase font-sans font-medium px-2 py-0.5 bg-gray-100 rounded">
                {topic}
              </span>
            </>
          )}
        </div>

        {hasDiscrepancyFlag && (
          <div className="inline-flex items-center gap-1 text-[11px] font-sans font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Document Note Flagged</span>
          </div>
        )}
      </div>

      {/* Source attribution line */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 mt-2">
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-gray-400" />
          <span className="font-semibold uppercase tracking-wider text-[10px] text-gray-400">SOURCE:</span>
          {primarySource ? (
            <span className="font-medium text-gray-700">
              {primarySource.reference || primarySource.document}
              {primarySource.difficulty && (
                <span className="ml-2 text-[10px] font-semibold uppercase px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {primarySource.difficulty}
                </span>
              )}
            </span>
          ) : (
            <span className="italic text-gray-400">Source unavailable</span>
          )}
        </div>

        {secondarySources.length > 0 && (
          <button
            onClick={() => setShowOtherSources(!showOtherSources)}
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline focus:outline-hidden"
          >
            <span>{secondarySources.length} other source{secondarySources.length > 1 ? 's' : ''}</span>
            {showOtherSources ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>

      {/* Secondary sources accordion */}
      {showOtherSources && secondarySources.length > 0 && (
        <div className="mt-2.5 p-2.5 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-600 space-y-1.5 animate-fadeIn">
          {secondarySources.map((s, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span>{s.reference || s.document}</span>
              {s.difficulty && (
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-white border border-gray-200 rounded">
                  {s.difficulty}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
