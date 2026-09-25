import React, { useState } from 'react';
import { Play, Pause, Bookmark, Video, Youtube, ExternalLink, FastForward } from 'lucide-react';
import { VideoExcerptData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: VideoExcerptData;
  onOpenDetail?: () => void;
}

export const VideoExcerptCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { toggleBookmark, isPlayingVideo, toggleVideoPlayback, videoTimestampSeconds, setVideoTimestamp, showToast } = useAppStore();
  const [pulseActive, setPulseActive] = useState(false);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleJumpTimestamp = (targetSecs: number, label: string) => {
    setVideoTimestamp(targetSecs);
    setPulseActive(true);
    showToast(`Jumped to ${label} (${formatTime(targetSecs)})`, 'info');
    setTimeout(() => setPulseActive(false), 2000);
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

        {/* Video Player Header Bar */}
        <div className="neo-border rounded-lg p-2.5 mb-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="truncate">{data.sourceTitle}</span>
            <button
              onClick={() => showToast('Opening Grant Sanderson’s 3Blue1Brown Neural Networks chapter...', 'info')}
              className="flex items-center gap-1 px-2 py-0.5 rounded border border-[#1a1a1a] dark:border-neutral-400 text-[10px] font-bold bg-[#faf7f2] dark:bg-neutral-800 hover:bg-neutral-200 shrink-0 ml-2"
            >
              <Youtube className="w-3 h-3 text-red-600" /> YouTube HD Embed
            </button>
          </div>

          {/* Scrubber and Play Controls */}
          <div className="flex items-center gap-2.5 pt-1">
            <button
              onClick={toggleVideoPlayback}
              className="p-1.5 rounded-full border border-black dark:border-white bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black hover:scale-105 transition-transform shrink-0"
              aria-label={isPlayingVideo ? "Pause video" : "Play video"}
            >
              {isPlayingVideo ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
            </button>
            <div className="flex-1 relative flex items-center">
              <input
                type="range"
                min="0"
                max="1162" // 19:22 in seconds
                value={videoTimestampSeconds}
                onChange={(e) => setVideoTimestamp(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-600"
              />
            </div>
            <span className="font-mono text-[11px] font-bold text-neutral-700 dark:text-neutral-300 shrink-0">
              {formatTime(videoTimestampSeconds)} / {data.totalTime}
            </span>
          </div>
        </div>

        {/* Two-panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Left panel: Partial derivative formula and Neural Network Diagram */}
          <div className="neo-border rounded-xl p-3 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              {/* Backprop derivative chain rule formula */}
              <div className="text-center font-serif py-1 font-bold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                <span className="inline-flex items-center gap-1">
                  <span>∂C / ∂w</span>
                  <span>=</span>
                  <span>(∂z / ∂w)</span>
                  <span>*</span>
                  <span>(∂a / ∂z)</span>
                  <span>*</span>
                  <span>(∂C / ∂a)</span>
                </span>
              </div>

              {/* Crisp SVG Neural Network Graphic matching the drawing in Image 8 */}
              <div className="relative mt-2 p-2 bg-[#f4efe5]/60 dark:bg-neutral-950/60 rounded border border-neutral-300 dark:border-neutral-800 flex items-center justify-center">
                <svg
                  viewBox="0 0 200 100"
                  className="w-full max-w-[210px] h-[90px] overflow-visible"
                  aria-label="Neural network layers with backpropagation gradient arrow"
                >
                  {/* Layer connections */}
                  <g stroke="currentColor" strokeWidth="0.8" className="text-neutral-400 dark:text-neutral-600">
                    <line x1="40" y1="30" x2="90" y2="25" />
                    <line x1="40" y1="30" x2="90" y2="45" />
                    <line x1="40" y1="30" x2="90" y2="65" />
                    <line x1="40" y1="30" x2="90" y2="85" />

                    <line x1="40" y1="50" x2="90" y2="25" />
                    <line x1="40" y1="50" x2="90" y2="45" />
                    <line x1="40" y1="50" x2="90" y2="65" />
                    <line x1="40" y1="50" x2="90" y2="85" />

                    <line x1="40" y1="70" x2="90" y2="25" />
                    <line x1="40" y1="70" x2="90" y2="45" />
                    <line x1="40" y1="70" x2="90" y2="65" />
                    <line x1="40" y1="70" x2="90" y2="85" />

                    {/* Hidden to Output */}
                    <line x1="90" y1="25" x2="150" y2="35" />
                    <line x1="90" y1="45" x2="150" y2="35" />
                    <line x1="90" y1="65" x2="150" y2="65" />
                    <line x1="90" y1="85" x2="150" y2="65" />
                  </g>

                  {/* Input Layer Nodes */}
                  <circle cx="40" cy="30" r="5" className="fill-white dark:fill-neutral-900 stroke-black dark:stroke-white stroke-[1.5]" />
                  <circle cx="40" cy="50" r="5" className="fill-white dark:fill-neutral-900 stroke-black dark:stroke-white stroke-[1.5]" />
                  <circle cx="40" cy="70" r="5" className="fill-white dark:fill-neutral-900 stroke-black dark:stroke-white stroke-[1.5]" />

                  {/* Hidden Layer Nodes */}
                  <circle cx="90" cy="25" r="4.5" className="fill-white dark:fill-neutral-900 stroke-black dark:stroke-white stroke-[1.5]" />
                  <circle cx="90" cy="45" r="4.5" className="fill-white dark:fill-neutral-900 stroke-black dark:stroke-white stroke-[1.5]" />
                  <circle cx="90" cy="65" r="4.5" className="fill-white dark:fill-neutral-900 stroke-black dark:stroke-white stroke-[1.5]" />
                  <circle cx="90" cy="85" r="4.5" className="fill-white dark:fill-neutral-900 stroke-black dark:stroke-white stroke-[1.5]" />

                  {/* Output Layer Nodes */}
                  <circle
                    cx="150"
                    cy="35"
                    r="5"
                    className={`stroke-black dark:stroke-white stroke-[1.5] ${
                      isPlayingVideo || pulseActive ? 'fill-amber-400 animate-pulse' : 'fill-white dark:fill-neutral-900'
                    }`}
                  />
                  <circle
                    cx="150"
                    cy="65"
                    r="5"
                    className={`stroke-black dark:stroke-white stroke-[1.5] ${
                      isPlayingVideo || pulseActive ? 'fill-emerald-400 animate-pulse' : 'fill-white dark:fill-neutral-900'
                    }`}
                  />

                  {/* Backprop Weight annotation arrow */}
                  <path
                    d="M 15 45 C 10 35, 20 60, 32 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    markerEnd="url(#arrow)"
                    className="text-black dark:text-amber-400"
                  />
                  <text x="2" y="48" className="text-[8px] font-serif italic fill-black dark:fill-amber-400 font-bold">
                    ∂w
                  </text>
                  <text x="160" y="38" className="text-[8px] font-serif italic fill-black dark:fill-emerald-400 font-bold">
                    ∂a
                  </text>
                </svg>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex justify-between items-center text-[10px] text-neutral-500">
              <span>Chapter 4: Gradient Flow</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">● 60 FPS Vector Render</span>
            </div>
          </div>

          {/* Right panel: Key Insights */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-3 text-[#1a1a1a] dark:text-[#f5f0e8]">
                KEY INSIGHTS
              </h3>

              <ul className="space-y-2.5 text-xs sm:text-[13px] text-[#2d2d2d] dark:text-neutral-300">
                {data.keyInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#1a1a1a] dark:text-amber-400 shrink-0">•</span>
                    <span className="leading-snug">
                      {idx === 2 ? (
                        <span>
                          Re-watch timestamp{' '}
                          <button
                            onClick={() => handleJumpTimestamp(750, '12:30')}
                            className="font-mono font-bold underline text-amber-600 dark:text-amber-400 hover:text-black"
                          >
                            12:30
                          </button>{' '}
                          for matrix dimensions
                        </span>
                      ) : (
                        insight
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 font-medium">Synced timestamp</span>
              <button
                onClick={() => handleJumpTimestamp(525, '08:45')}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <FastForward className="w-3 h-3" /> Jump to 08:45
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs truncate">{data.footer}</span>
        <span className="text-[10px] font-mono text-neutral-500 shrink-0 ml-2">ANNOTATOR SYNCED</span>
      </div>
    </article>
  );
};
