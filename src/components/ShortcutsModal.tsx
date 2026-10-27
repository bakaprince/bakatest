import React from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'A', desc: 'Select Option A' },
    { key: 'B', desc: 'Select Option B' },
    { key: 'C', desc: 'Select Option C' },
    { key: 'D', desc: 'Select Option D' },
    { key: 'Enter', desc: 'Check Answer (when option is selected)' },
    { key: '→ (Right Arrow)', desc: 'Next Question (after checking)' },
    { key: '← (Left Arrow)', desc: 'Previous Question' },
    { key: 'Esc', desc: 'Close dialog / modal' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-fadeIn">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="shortcuts-title"
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-100"
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-blue-600" />
            <h3 id="shortcuts-title" className="text-base font-bold text-gray-900">
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between text-sm py-1.5 px-2 rounded-lg hover:bg-gray-50">
              <span className="text-gray-600">{sc.desc}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-semibold text-gray-800 bg-gray-100 border border-gray-300 rounded-md shadow-2xs">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            Shortcuts are active during question practice when not focused in an input.
          </p>
        </div>
      </div>
    </div>
  );
};
