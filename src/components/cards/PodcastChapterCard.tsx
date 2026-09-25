import React, { useState, useEffect } from 'react';
import { Play, Pause, Bookmark, Volume2, Sparkles, Target, ExternalLink } from 'lucide-react';
import { PodcastChapterData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: PodcastChapterData;
  onOpenDetail?: () => void;
}

export const PodcastChapterCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { toggleBookmark, isPlayingAudio, toggleAudioPlayback, setFocusStareModalOpen, showToast } = useAppStore();
  const [waveformWave, setWaveformWave] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setWaveformWave((prev) => (prev + 1) % 100);
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleStartStare = () => {
    setFocusStareModalOpen(true);
    showToast('Initiating 90-second Prefrontal Focus Stare Protocol', 'info');
  };

  return (
    <article
      className="neo-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8]"
      aria-label={data.title}
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400 shrink-0" aria-hidden="true" />
            <h2 className="font-display font-bold tracking-tight text-xs sm:text-sm md:text-base uppercase truncate">
              {data.title}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="neo-pill bg-transparent border-2">
              {data.badge}
            </span>
            <button
              onClick={() => toggleBookmark(data.id)}
              className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
              title="Bookmark"
              aria-label="Bookmark"
            >
              <Bookmark className={`w-3.5 h-3.5 ${data.isBookmarked ? "fill-amber-500 text-amber-500" : "text-neutral-500"}`} />
            </button>
          </div>
        </div>

        {/* Audio Player Header Box matching Image 9 */}
        <div className="neo-border rounded-lg p-2.5 mb-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleAudioPlayback}
              className="p-1.5 rounded-full border border-black dark:border-white bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black hover:scale-105 transition-transform"
              aria-label={isPlayingAudio ? "Pause podcast" : "Play podcast"}
            >
              {isPlayingAudio ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>
            <span className="font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {data.currentTime} / {data.totalTime}
            </span>
          </div>

          {/* Interactive animated audio waveform */}
          <div
            onClick={toggleAudioPlayback}
            className="flex items-center gap-1 h-5 px-2 cursor-pointer flex-1 max-w-[200px] justify-center"
            title="Click to toggle playback"
          >
            {[4, 12, 18, 8, 22, 14, 6, 20, 16, 10, 24, 15, 8, 18, 12, 6, 20, 14, 8, 16].map((baseHeight, i) => {
              const dynHeight = isPlayingAudio
                ? Math.min(22, Math.max(4, baseHeight + Math.sin(waveformWave + i * 0.8) * 8))
                : baseHeight * 0.6;
              return (
                <span
                  key={i}
                  style={{ height: `${dynHeight}px` }}
                  className={`w-0.5 rounded-full transition-all duration-100 ${
                    i < 8 ? 'bg-amber-600 dark:bg-amber-400' : 'bg-neutral-400 dark:bg-neutral-600'
                  }`}
                />
              );
            })}
          </div>

          <div className="neo-border rounded-md px-2 py-0.5 text-[11px] font-bold tracking-tight bg-[#faf7f2] dark:bg-neutral-800 shrink-0">
            {data.chapterTitle}
          </div>
        </div>

        {/* Center Quote Box */}
        <div className="neo-border rounded-xl p-4 sm:p-5 bg-[#fbf9f5] dark:bg-neutral-900/40 relative">
          <blockquote className="text-xs sm:text-[13px] md:text-sm leading-relaxed font-serif italic text-[#1a1a1a] dark:text-neutral-100">
            {data.quoteText}
          </blockquote>

          <div className="mt-4 pt-3 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="font-mono text-neutral-500 text-[11px]">Dr. Andrew Huberman • Stanford School of Medicine</span>
            <button
              onClick={handleStartStare}
              className="neo-button rounded-lg px-2.5 py-1 text-[11px] font-bold bg-amber-400 text-black hover:bg-amber-500 flex items-center gap-1.5 uppercase"
            >
              <Target className="w-3.5 h-3.5" /> Start 90s Stare Protocol
            </button>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs truncate">{data.footer}</span>
        <button
          onClick={() => showToast('Opening Spotify Chapter Anchor...', 'info')}
          className="text-[10px] font-bold underline hover:text-amber-600 ml-2 shrink-0 flex items-center gap-1"
        >
          Spotify <ExternalLink className="w-2.5 h-2.5" />
        </button>
      </div>
    </article>
  );
};
