import React from 'react';
import { Cloud, RotateCcw, Home, HelpCircle } from 'lucide-react';

interface AppHeaderProps {
  onHomeClick?: () => void;
  onResetClick?: () => void;
  title?: string;
  subtitle?: string;
  onShowShortcuts?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onHomeClick,
  onResetClick,
  title = 'BakaTest',
  subtitle = 'Cloud Computing MCQ Practice',
  onShowShortcuts,
}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div 
          onClick={onHomeClick}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
          aria-label="Return to Home"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onHomeClick?.(); }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-xs">
            <Cloud className="w-5 h-5 transition-transform group-hover:scale-110" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-gray-900 tracking-tight">{title}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">Practice</span>
            </div>
            <p className="text-xs text-gray-500 font-medium">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onShowShortcuts && (
            <button
              onClick={onShowShortcuts}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              title="Keyboard Shortcuts"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Shortcuts</span>
            </button>
          )}

          {onResetClick && (
            <button
              onClick={onResetClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200/60"
              title="Reset All Saved Progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Progress</span>
            </button>
          )}

          {onHomeClick && (
            <button
              onClick={onHomeClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
