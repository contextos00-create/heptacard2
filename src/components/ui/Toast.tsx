import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Toast: React.FC = () => {
  const { activeToast, dismissToast } = useAppStore();

  if (!activeToast) return null;

  const getIcon = () => {
    switch (activeToast.type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-sm flex items-center justify-between gap-3 p-3.5 rounded-xl border-2 border-[#1a1a1a] dark:border-white bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8] shadow-[4px_4px_0px_#1a1a1a] dark:shadow-[4px_4px_0px_#fff] animate-bounce-short"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {getIcon()}
        <span className="text-xs font-bold leading-tight truncate">
          {activeToast.message}
        </span>
      </div>
      <button
        onClick={dismissToast}
        className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white shrink-0"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
