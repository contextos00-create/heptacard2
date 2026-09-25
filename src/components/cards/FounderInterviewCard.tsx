import React, { useState } from 'react';
import { Mic, Zap, Bookmark, Copy, Check, Quote, Volume2 } from 'lucide-react';
import { FounderInterviewData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: FounderInterviewData;
  onOpenDetail?: () => void;
}

export const FounderInterviewCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { copyToClipboard, toggleBookmark, showToast } = useAppStore();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedQuote, setCopiedQuote] = useState(false);

  const handlePlayClip = () => {
    setIsPlayingAudio(true);
    showToast('Playing Whisper audio excerpt (14:20 - 14:45)', 'info');
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  const handleCopyQuote = (quote: string) => {
    copyToClipboard(quote, 'Copied Linus quote to clipboard');
    setCopiedQuote(true);
    setTimeout(() => setCopiedQuote(false), 2000);
  };

  const linusQuote = data.transcript.find((t) => t.isQuote)?.text || data.transcript[1]?.text || '';

  return (
    <article
      className="neo-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8]"
      aria-label={data.title}
    >
      <div>
        {/* Top title label */}
        {data.titleLabel && (
          <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] dark:bg-amber-400 shrink-0" aria-hidden="true" />
            <span className="truncate">{data.titleLabel}</span>
          </div>
        )}

        {/* Main Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
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
          <button
            onClick={handlePlayClip}
            className="flex items-center gap-1 text-[11px] font-mono uppercase bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded ml-2 shrink-0 hover:bg-amber-500 hover:text-white transition-colors"
          >
            <Volume2 className={`w-3 h-3 ${isPlayingAudio ? 'animate-bounce text-amber-600' : ''}`} />
            {isPlayingAudio ? 'Playing...' : 'Audio [14:20]'}
          </button>
        </div>

        {/* Two-panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Left panel: Transcript Exchange */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-300 dark:border-neutral-700 pb-1 flex items-center justify-between">
                <span>Transcript Exchange</span>
                <span className="font-mono text-[10px]">Whisper v3</span>
              </div>

              {data.transcript.map((item, idx) => (
                <div key={idx} className="text-xs sm:text-[13px] leading-relaxed">
                  <div className="font-mono font-bold text-neutral-800 dark:text-neutral-200 mb-0.5">
                    {item.speaker} [{item.timestamp}]:
                  </div>
                  {item.isQuote ? (
                    <div
                      onClick={() => handleCopyQuote(item.text)}
                      className="group cursor-pointer relative pl-3.5 border-l-2 border-[#1a1a1a] dark:border-amber-400 italic text-neutral-900 dark:text-neutral-100 font-serif text-[13px] sm:text-[14px] bg-[#f2eee5]/50 dark:bg-neutral-800/40 p-2 rounded-r"
                    >
                      <Quote className="w-3 h-3 text-neutral-400 absolute top-1.5 left-1 opacity-50" />
                      <span>{item.text}</span>
                      <div className="mt-1 text-[10px] font-sans font-semibold text-neutral-500 flex items-center gap-1 opacity-60 group-hover:opacity-100">
                        {copiedQuote ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        Click to copy citation
                      </div>
                    </div>
                  ) : (
                    <p className="text-neutral-600 dark:text-neutral-400 font-sans pl-1">
                      {item.text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: Core Insights / Emergent Themes */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider border-b border-neutral-300 dark:border-neutral-700 pb-1 mb-2.5">
                Core Insights
              </div>

              <h3 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-3 text-[#1a1a1a] dark:text-[#f5f0e8]">
                EMERGENT THEMES
              </h3>

              <div className="space-y-2.5">
                {data.emergentThemes.map((theme, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#f3efe6]/80 dark:bg-neutral-800/60 border border-neutral-300 dark:border-neutral-700"
                  >
                    <Zap className="w-4 h-4 text-amber-500 shrink-0 fill-amber-400" />
                    <span className="font-semibold text-xs sm:text-[13px] text-[#1a1a1a] dark:text-neutral-200">
                      {theme}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-neutral-300 dark:border-neutral-700 text-[11px] text-neutral-500 flex items-center justify-between">
              <span>Whisper Large-v3 Confidence: 99.4%</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">● Validated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs truncate">{data.footer}</span>
        <span className="text-[10px] font-mono text-neutral-500 ml-2">CH-02-REF</span>
      </div>
    </article>
  );
};
