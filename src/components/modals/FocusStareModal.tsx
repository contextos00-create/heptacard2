import React, { useState, useEffect } from 'react';
import { X, Play, RotateCcw, Target, CheckCircle2, Sparkles } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const FocusStareModal: React.FC = () => {
  const { focusStareModalOpen, setFocusStareModalOpen, showToast } = useAppStore();
  const [secondsLeft, setSecondsLeft] = useState(90);
  const [isActive, setIsActive] = useState(false);
  const [targetType, setTargetType] = useState<'amber' | 'crosshair' | 'pulsing'>('amber');

  useEffect(() => {
    let timer: any = null;
    if (isActive && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((s) => s - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      showToast('Visual Stare Session Complete: Prefrontal Circuits Activated!', 'success');
    }
    return () => clearInterval(timer);
  }, [isActive, secondsLeft, showToast]);

  if (!focusStareModalOpen) return null;

  const handleStart = () => {
    setIsActive(true);
  };

  const handleReset = (duration = 90) => {
    setIsActive(false);
    setSecondsLeft(duration);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg rounded-3xl border-3 border-[#1a1a1a] dark:border-neutral-200 bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8] shadow-[8px_8px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_#444] overflow-hidden flex flex-col items-center p-5 sm:p-7 text-center space-y-4">
        {/* Top bar */}
        <div className="w-full flex items-center justify-between pb-2 border-b-2 border-[#1a1a1a] dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400" />
            <span className="font-display font-bold text-xs sm:text-sm uppercase tracking-wider">
              Huberman Lab: Visual Stare Protocol
            </span>
          </div>
          <button
            onClick={() => setFocusStareModalOpen(false)}
            className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Protocol Instruction */}
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm">
          Keep your gaze fixated firmly on the center target for 60 to 90 seconds. Blinking is fine, but resist looking away.
        </p>

        {/* Visual Target Container */}
        <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-2xl border-2 border-[#1a1a1a] dark:border-neutral-500 bg-[#f4efe5] dark:bg-neutral-900 flex items-center justify-center overflow-hidden shadow-inner">
          {/* Target options */}
          {targetType === 'amber' && (
            <div className={`w-8 h-8 rounded-full bg-[#d97706] shadow-[0_0_24px_#d97706] border-2 border-black ${isActive ? 'scale-105 transition-transform' : ''}`} />
          )}

          {targetType === 'crosshair' && (
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute w-full h-0.5 bg-[#d97706]" />
              <div className="absolute h-full w-0.5 bg-[#d97706]" />
              <div className="w-4 h-4 rounded-full border-2 border-[#d97706]" />
            </div>
          )}

          {targetType === 'pulsing' && (
            <div className="w-7 h-7 rounded-full bg-emerald-500 animate-ping opacity-75" />
          )}

          {/* Concentric subtle rings */}
          <div className="absolute w-28 h-28 rounded-full border border-dashed border-neutral-400/40 pointer-events-none" />
          <div className="absolute w-40 h-40 rounded-full border border-neutral-300/40 pointer-events-none" />
        </div>

        {/* Countdown */}
        <div className="space-y-1">
          <div className="font-display font-bold text-4xl sm:text-5xl font-mono tracking-tight">
            00:{secondsLeft.toString().padStart(2, '0')}
          </div>
          <div className="text-[11px] font-mono text-neutral-500">
            {isActive ? 'Prefrontal recruitment active • Maintain fixation' : 'Session Ready'}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 pt-2">
          {!isActive ? (
            <button
              onClick={handleStart}
              className="neo-button px-5 py-2 rounded-xl text-xs font-bold bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black flex items-center gap-1.5 uppercase"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Begin Protocol
            </button>
          ) : (
            <button
              onClick={() => setIsActive(false)}
              className="neo-button px-5 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black flex items-center gap-1.5 uppercase"
            >
              Pause
            </button>
          )}

          <button
            onClick={() => handleReset(90)}
            className="neo-button px-3 py-2 rounded-xl text-xs font-bold bg-neutral-200 dark:bg-neutral-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 90s
          </button>
          <button
            onClick={() => handleReset(60)}
            className="neo-button px-3 py-2 rounded-xl text-xs font-bold bg-neutral-200 dark:bg-neutral-800 flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> 60s
          </button>
        </div>

        <div className="text-[10px] text-neutral-500 pt-1 font-mono">
          Chapter 04: Visual Stare Technique • Stanford Neuroscience Anchor
        </div>
      </div>
    </div>
  );
};
