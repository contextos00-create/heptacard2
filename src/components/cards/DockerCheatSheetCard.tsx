import React, { useState } from 'react';
import { Copy, Check, Terminal, ExternalLink, Bookmark, CheckCircle2 } from 'lucide-react';
import { DockerCheatSheetData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: DockerCheatSheetData;
  onOpenDetail?: () => void;
}

export const DockerCheatSheetCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { copyToClipboard, toggleBookmark } = useAppStore();
  const bookmarked = data.isBookmarked ?? false;
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeExec, setActiveExec] = useState<string | null>(null);

  const handleCopy = (command: string, id: string) => {
    copyToClipboard(command, `Copied: ${command}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleSimulate = (id: string) => {
    setActiveExec(id);
    setTimeout(() => setActiveExec(null), 2500);
  };

  return (
    <article
      className="neo-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8]"
      aria-label={data.title}
    >
      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span
              className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400 shrink-0"
              aria-hidden="true"
            />
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
              title={bookmarked ? "Remove bookmark" : "Bookmark card"}
              aria-label="Bookmark"
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-500 text-amber-500" : "text-neutral-500"}`} />
            </button>
          </div>
        </div>

        {/* Metadata subheader */}
        <div className="neo-border rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium mb-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
          <span className="truncate">{data.metadata}</span>
          <span className="text-[10px] font-mono uppercase bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded ml-2 shrink-0">
            v2.4
          </span>
        </div>

        {/* Two-panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Left panel: Terminal */}
          <div className="neo-border rounded-xl p-3 sm:p-3.5 bg-[#0f141c] text-emerald-400 flex flex-col justify-between font-mono text-xs sm:text-[13px] shadow-inner min-h-[140px]">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between pb-1 border-b border-neutral-800 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3 h-3 text-neutral-400" /> bash shell
                </span>
                <span className="text-[10px] text-neutral-500">1-click copy</span>
              </div>
              {data.commands.map((cmd) => (
                <div
                  key={cmd.id}
                  onClick={() => handleCopy(cmd.command, cmd.id)}
                  className="group cursor-pointer flex items-center justify-between p-1.5 rounded hover:bg-neutral-800/80 transition-all border border-transparent hover:border-neutral-700"
                  title="Click to copy command"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleCopy(cmd.command, cmd.id)}
                >
                  <div className="truncate pr-2">
                    <span className="text-amber-400 mr-1">$</span>
                    <span className="text-neutral-200 font-semibold">{cmd.command.replace(/^\$\s*/, '')}</span>
                  </div>
                  <button
                    className="opacity-60 group-hover:opacity-100 p-1 text-neutral-400 hover:text-white shrink-0"
                    aria-label="Copy command"
                  >
                    {copiedId === cmd.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {activeExec && (
              <div className="mt-2 text-[10px] text-cyan-300 font-mono bg-cyan-950/60 p-1.5 rounded border border-cyan-800 animate-pulse">
                [daemon] container context_db (healthy) CPU 1.2% MEM 142MB
              </div>
            )}
          </div>

          {/* Right panel: Essential Flags */}
          <div className="neo-border rounded-xl p-3 sm:p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-2 text-[#1a1a1a] dark:text-[#f5f0e8]">
                ESSENTIAL FLAGS
              </h3>
              <ul className="space-y-2 text-xs sm:text-[13px] text-[#2d2d2d] dark:text-neutral-300">
                {data.essentialFlags.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-mono font-bold text-[#1a1a1a] dark:text-amber-400 shrink-0">
                      • {item.flag}:
                    </span>
                    <span className="text-neutral-700 dark:text-neutral-300 leading-tight">
                      {item.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-3 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 font-medium">Staging cluster v2.4</span>
              <button
                onClick={() => handleSimulate(data.commands[0].id)}
                className="text-xs font-semibold underline hover:text-amber-600 dark:hover:text-amber-400"
              >
                Test Compose Stack
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-neutral-800 dark:text-neutral-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="text-[11px] sm:text-xs">{data.footer}</span>
        </div>
        {onOpenDetail && (
          <button
            onClick={onOpenDetail}
            className="text-[11px] font-bold underline flex items-center gap-1 hover:text-amber-600"
          >
            Deep Dive <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>
    </article>
  );
};
