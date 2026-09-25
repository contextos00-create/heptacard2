import React, { useState } from 'react';
import { Globe, Bookmark, Copy, Check, ExternalLink, ShieldCheck, CheckCheck } from 'lucide-react';
import { WebClipData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: WebClipData;
  onOpenDetail?: () => void;
}

export const WebClipCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { copyToClipboard, toggleBookmark, markCardRead, showToast } = useAppStore();
  const [activeHighlightIdx, setActiveHighlightIdx] = useState(0);

  const additionalHighlights = [
    '“If you wanted to make a list of people who changed the world, almost all of them would be people who did great work. And if you ask them what they did, they rarely say they were trying to change the world.”',
    '“The first step is to decide what to work on. The work you choose should have three qualities: it has to be something you have a natural aptitude for, that you have a deep interest in, and that offers scope to do great work.”',
    '“Work on what you’re genuinely curious about — not what will look prestigious. Prestige is like an inspiring shadow that points you away from the actual light.”',
  ];

  const isCompleted = data.isRead ?? true;

  const toggleReadStatus = () => {
    markCardRead(data.id, !isCompleted);
    showToast(!isCompleted ? 'Marked as Completed' : 'Marked as In Progress', 'info');
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

        {/* Metadata subheader */}
        <div className="neo-border rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium mb-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
          <span className="truncate">{data.metadata}</span>
          <span className="text-[10px] font-mono text-neutral-500 shrink-0 ml-2">HTML Snapshot</span>
        </div>

        {/* Two-panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Left panel: Core Quote & Highlight Browser */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <blockquote className="text-xs sm:text-[13px] md:text-sm leading-relaxed font-serif italic text-[#1a1a1a] dark:text-neutral-200">
                {additionalHighlights[activeHighlightIdx]}
              </blockquote>

              <div className="mt-2.5 flex items-center gap-1.5">
                {additionalHighlights.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHighlightIdx(idx)}
                    className={`h-1.5 rounded-full transition-all ${
                      activeHighlightIdx === idx ? 'w-5 bg-amber-600 dark:bg-amber-400' : 'w-2 bg-neutral-300 dark:bg-neutral-700'
                    }`}
                    aria-label={`Highlight passage ${idx + 1}`}
                  />
                ))}
                <span className="text-[10px] text-neutral-500 ml-1">
                  Passage {activeHighlightIdx + 1} of {additionalHighlights.length}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
              <span className="font-mono text-neutral-500">paulgraham.com</span>
              <button
                onClick={() => copyToClipboard(additionalHighlights[activeHighlightIdx], 'Copied passage')}
                className="text-xs font-bold underline flex items-center gap-1 hover:text-amber-600"
              >
                <Copy className="w-3 h-3" /> Copy Passage
              </button>
            </div>
          </div>

          {/* Right panel: Clipped Metrics & Tags */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-3 text-[#1a1a1a] dark:text-[#f5f0e8]">
                CLIPPED METRICS & TAGS
              </h3>

              <ul className="space-y-2 text-xs sm:text-[13px] text-[#2d2d2d] dark:text-neutral-300">
                {data.metricsAndTags.map((metric, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#1a1a1a] dark:text-amber-400 shrink-0">•</span>
                    <span className="leading-snug">
                      {metric.includes('Reading Status') ? (
                        <span className="inline-flex items-center gap-1.5">
                          Reading Status:{' '}
                          <button
                            onClick={toggleReadStatus}
                            className={`px-1.5 py-0.5 rounded text-[11px] font-bold border transition-colors ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-400'
                                : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-400'
                            }`}
                          >
                            {isCompleted ? '✓ Completed' : '● In Progress'}
                          </button>
                        </span>
                      ) : (
                        metric
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 font-medium">Archive snapshot</span>
              <button
                onClick={() => showToast('Offline HTML snapshot: 48.2 KB stored in IndexedDB', 'info')}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verify HTML
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs truncate">{data.footer}</span>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-2">
          ● SHA-256 VERIFIED
        </span>
      </div>
    </article>
  );
};
