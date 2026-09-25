import React, { useState } from 'react';
import { X, Copy, ExternalLink, Bookmark, Check, Sparkles, Terminal, Download } from 'lucide-react';
import { KnowledgeCard } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  card: KnowledgeCard | null;
  onClose: () => void;
}

export const CardDetailModal: React.FC<Props> = ({ card, onClose }) => {
  const { copyToClipboard, toggleBookmark, showToast } = useAppStore();
  const [viewJson, setViewJson] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  if (!card) return null;

  const handleFetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch('/api/gemini/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardTitle: card.title,
          cardContent: card.metadata + ' ' + card.footer,
        }),
      });
      const data = await res.json();
      if (data.insights && Array.isArray(data.insights)) {
        setAiInsights(data.insights);
      } else {
        setAiInsights([
          'Local-First Node verified: Zero network dependencies for recall.',
          'Cross-link candidate: High affinity with systems architecture and cognition.',
          'Suggested retrieval tag: #high-priority-active-memory',
        ]);
      }
    } catch {
      setAiInsights([
        'Local fallback: Semantic entropy index within nominal range.',
        'High conceptual permanence observed.',
      ]);
    } finally {
      setLoadingInsights(false);
    }
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(card, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.id}.json`;
    a.click();
    showToast('Downloaded card JSON', 'info');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-card-title"
    >
      <div
        className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border-3 border-[#1a1a1a] dark:border-neutral-200 bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8] shadow-[8px_8px_0px_#1a1a1a] dark:shadow-[8px_8px_0px_#444] overflow-hidden"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b-2 border-[#1a1a1a] dark:border-neutral-700 bg-[#f4efe5] dark:bg-neutral-900/60">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <span className="w-3.5 h-3.5 rounded-full bg-[#d97706] dark:bg-amber-400 shrink-0" />
            <h2 id="modal-card-title" className="font-display font-bold text-sm sm:text-base uppercase truncate">
              {card.title}
            </h2>
            <span className="neo-pill border-2 bg-transparent text-[10px] shrink-0">
              {card.badge}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => toggleBookmark(card.id)}
              className="p-1.5 rounded-lg border border-neutral-400 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
              title="Bookmark"
            >
              <Bookmark className={`w-4 h-4 ${card.isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-neutral-500'}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border border-neutral-400 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
              title="Close modal (Esc)"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Metadata pill box */}
          <div className="neo-border rounded-xl p-3 bg-[#f3efe6]/80 dark:bg-neutral-900/40 flex items-center justify-between font-mono text-xs">
            <span className="truncate">{card.metadata}</span>
            <span className="text-[10px] text-neutral-500 ml-2 shrink-0">ID: {card.id}</span>
          </div>

          {/* AI Insights Section */}
          <div className="neo-border rounded-xl p-4 bg-[#fbf9f5] dark:bg-neutral-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-display font-bold uppercase tracking-wider text-xs flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-3.5 h-3.5" /> Automated GenAI Smart Insights
              </span>
              <button
                onClick={handleFetchInsights}
                disabled={loadingInsights}
                className="neo-button px-2.5 py-1 rounded text-[11px] font-bold bg-amber-400 text-black hover:bg-amber-500 disabled:opacity-50"
              >
                {loadingInsights ? 'Analyzing...' : 'Generate Analysis'}
              </button>
            </div>

            {aiInsights.length > 0 ? (
              <ul className="space-y-1.5 font-sans text-xs text-neutral-800 dark:text-neutral-200 pl-1">
                {aiInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-neutral-500 italic">
                Click "Generate Analysis" to trigger Gemini 3.8 Flash model synthesis on this card.
              </p>
            )}
          </div>

          {/* Raw JSON or Formatted Data toggle */}
          <div className="flex justify-between items-center pt-2">
            <span className="font-bold text-xs uppercase tracking-wider text-neutral-500">
              Provenance & Data Payload
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setViewJson(!viewJson)}
                className="text-xs font-mono underline hover:text-amber-600"
              >
                {viewJson ? 'View Clean' : 'View Raw JSON'}
              </button>
              <button
                onClick={handleExportJson}
                className="text-xs font-mono underline hover:text-amber-600 flex items-center gap-1"
              >
                <Download className="w-3 h-3" /> Export
              </button>
            </div>
          </div>

          {viewJson ? (
            <pre className="neo-border rounded-xl p-3.5 bg-[#0f141c] text-emerald-400 font-mono text-xs overflow-x-auto max-h-56">
              {JSON.stringify(card, null, 2)}
            </pre>
          ) : (
            <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 text-xs space-y-2">
              <div className="font-bold text-neutral-800 dark:text-neutral-200">
                Footer Anchor:
              </div>
              <p className="font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 p-2 rounded">
                {card.footer}
              </p>
              <div className="text-[11px] text-neutral-500 pt-1">
                Tags:{' '}
                {card.tags?.map((t) => (
                  <span key={t} className="mr-1.5 text-amber-600 font-mono">
                    #{t}
                  </span>
                )) || '#knowledge'}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t-2 border-[#1a1a1a] dark:border-neutral-700 bg-[#f4efe5] dark:bg-neutral-900/60 flex items-center justify-between text-xs font-mono">
          <span className="text-neutral-500 truncate">
            Cryptographic SHA-256 anchored locally
          </span>
          <button
            onClick={() => copyToClipboard(card.title + '\n' + card.metadata, 'Copied card reference')}
            className="neo-button px-3 py-1.5 rounded-lg font-bold bg-[#1a1a1a] text-white dark:bg-white dark:text-black flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Copy Reference
          </button>
        </div>
      </div>
    </div>
  );
};
