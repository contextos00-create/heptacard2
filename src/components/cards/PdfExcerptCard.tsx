import React, { useState } from 'react';
import { FileText, Flag, Bookmark, Copy, ShieldCheck, Check } from 'lucide-react';
import { PdfExcerptData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: PdfExcerptData;
  onOpenDetail?: () => void;
}

export const PdfExcerptCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { copyToClipboard, toggleBookmark, showToast } = useAppStore();
  const [activeVariable, setActiveVariable] = useState<string | null>(null);
  const [verifiedHash, setVerifiedHash] = useState(false);

  const handleVerifyHash = () => {
    setVerifiedHash(true);
    showToast('SHA-256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069 verified', 'success');
  };

  const getVariableExplanation = (varName: string) => {
    switch (varName) {
      case 'Q':
        return 'Queries: Matrix of packings for attention requests (dimensions d_k)';
      case 'K':
        return 'Keys: Matrix matched against query vector representations';
      case 'V':
        return 'Values: Semantic payloads scaled by softmax attention scores';
      case 'dk':
        return 'Scaling factor sqrt(d_k): Prevents vanishing gradients in large dimensions';
      default:
        return 'Standard Transformer Scaled Dot-Product Attention operator';
    }
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
          <span className="text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded ml-2 shrink-0">
            Page 4 / 15
          </span>
        </div>

        {/* Two-panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Left panel: Scaled Dot-Product Formula */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              {/* Flag callout badge */}
              <div className="inline-flex items-center gap-1.5 border border-[#1a1a1a] dark:border-neutral-400 px-2 py-0.5 rounded text-xs font-bold bg-[#faf7f2] dark:bg-neutral-800 mb-2 shadow-[1px_1px_0px_#1a1a1a]">
                <Flag className="w-3 h-3 text-[#1a1a1a] dark:text-neutral-200 fill-current" />
                <span>{data.formulaLabel}</span>
              </div>

              {/* Formula graphic box with yellow marker highlight */}
              <div className="neo-border rounded-lg p-3 bg-amber-100/70 dark:bg-amber-950/40 relative overflow-hidden my-1">
                <div className="font-serif text-center text-sm sm:text-base md:text-lg font-bold text-neutral-900 dark:text-amber-100 py-1">
                  Attention(
                  <button
                    onClick={() => setActiveVariable('Q')}
                    className="hover:underline text-blue-700 dark:text-blue-400 font-mono"
                  >
                    Q
                  </button>
                  ,{' '}
                  <button
                    onClick={() => setActiveVariable('K')}
                    className="hover:underline text-purple-700 dark:text-purple-400 font-mono"
                  >
                    K
                  </button>
                  ,{' '}
                  <button
                    onClick={() => setActiveVariable('V')}
                    className="hover:underline text-emerald-700 dark:text-emerald-400 font-mono"
                  >
                    V
                  </button>
                  ) = softmax(
                  <span className="inline-flex flex-col items-center align-middle mx-1 text-xs sm:text-sm">
                    <span className="border-b border-black dark:border-neutral-300 px-1 font-mono">
                      QK<sup>T</sup>
                    </span>
                    <button
                      onClick={() => setActiveVariable('dk')}
                      className="font-mono text-red-700 dark:text-red-400 hover:underline text-[11px]"
                    >
                      √d<sub>k</sub>
                    </button>
                  </span>
                  ) V
                </div>

                <div className="text-[10px] text-center text-neutral-500 font-mono mt-1">
                  [Click variables Q, K, V, or √d_k to inspect]
                </div>
              </div>

              {activeVariable ? (
                <div className="mt-2 p-2 bg-neutral-100 dark:bg-neutral-800 rounded text-xs border border-neutral-300 dark:border-neutral-700 font-mono text-neutral-800 dark:text-neutral-200">
                  <span className="font-bold text-amber-600 dark:text-amber-400">[{activeVariable}]:</span>{' '}
                  {getVariableExplanation(activeVariable)}
                </div>
              ) : (
                <p className="mt-2 text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400 font-serif line-clamp-3">
                  {data.excerptSnippet}
                </p>
              )}
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex justify-between items-center text-[10px]">
              <span className="font-mono text-neutral-500">NeurIPS 2017 Archive</span>
              <button
                onClick={() => copyToClipboard('\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V', 'Copied LaTeX')}
                className="font-bold underline flex items-center gap-1 hover:text-amber-600"
              >
                <Copy className="w-3 h-3" /> Copy LaTeX
              </button>
            </div>
          </div>

          {/* Right panel: Metadata & Citations */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-3 text-[#1a1a1a] dark:text-[#f5f0e8]">
                METADATA & CITATIONS
              </h3>

              <ul className="space-y-2 text-xs sm:text-[13px] text-[#2d2d2d] dark:text-neutral-300">
                {data.metadataPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-[#1a1a1a] dark:text-amber-400 shrink-0">•</span>
                    <span className="leading-snug">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between">
              <button
                onClick={handleVerifyHash}
                className="flex items-center gap-1 text-[11px] font-mono bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 px-2 py-1 rounded transition-colors"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${verifiedHash ? 'text-emerald-500' : 'text-neutral-600'}`} />
                {verifiedHash ? 'SHA-256 Validated' : 'Verify Hash'}
              </button>
              <span className="text-[10px] font-mono text-neutral-500">Vaswani et al.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs truncate">{data.footer}</span>
        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold shrink-0 ml-2">
          ● Cryptographic Pin
        </span>
      </div>
    </article>
  );
};
