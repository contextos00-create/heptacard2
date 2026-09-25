import React, { useState } from 'react';
import { Cpu, HardDrive, Layers, Bookmark, Copy, ExternalLink, Network } from 'lucide-react';
import { CuratedThreadData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: CuratedThreadData;
  onOpenDetail?: () => void;
}

export const CuratedThreadCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { copyToClipboard, toggleBookmark, showToast } = useAppStore();
  const [activeParallel, setActiveParallel] = useState<number | null>(null);

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
          <span className="text-[10px] font-mono text-neutral-500 shrink-0 ml-2">Readwise Sync</span>
        </div>

        {/* Two-panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Left panel: Core Quote */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <blockquote className="text-xs sm:text-[13px] md:text-sm leading-relaxed font-serif italic text-[#1a1a1a] dark:text-neutral-200">
                {data.quoteText}
              </blockquote>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
              <span className="font-mono text-neutral-500">{data.author}</span>
              <button
                onClick={() => copyToClipboard(data.quoteText, 'Copied Karpathy quote')}
                className="text-xs font-bold underline flex items-center gap-1 hover:text-amber-600"
              >
                <Copy className="w-3 h-3" /> Copy Quote
              </button>
            </div>
          </div>

          {/* Right panel: Conceptual Parallels */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-3 text-[#1a1a1a] dark:text-[#f5f0e8]">
                CONCEPTUAL PARALLELS
              </h3>

              <div className="space-y-2 text-xs sm:text-[13px]">
                {data.conceptualParallels.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveParallel(activeParallel === idx ? null : idx)}
                    className={`p-2 rounded border border-neutral-300 dark:border-neutral-700 cursor-pointer transition-all flex items-center justify-between ${
                      activeParallel === idx
                        ? 'bg-amber-100 dark:bg-amber-950/70 border-amber-500'
                        : 'bg-[#f4efe5]/60 dark:bg-neutral-800/40 hover:bg-neutral-200/60'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-mono">
                      <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                      <span className="font-bold text-neutral-900 dark:text-neutral-100">
                        {item.concept}
                      </span>
                      <span className="text-neutral-500">=</span>
                      <span className="text-neutral-800 dark:text-neutral-200 font-sans">
                        {item.mapping}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 font-medium">Architecture mapping</span>
              <button
                onClick={() => showToast('Opening System Architecture ERD Diagram...', 'info')}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <Network className="w-3 h-3" /> View ERD
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs truncate">{data.footer}</span>
        <span className="text-[10px] font-mono text-neutral-500 shrink-0 ml-2">ERD-LINKED</span>
      </div>
    </article>
  );
};
