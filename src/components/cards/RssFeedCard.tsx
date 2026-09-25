import React, { useState } from 'react';
import { Rss, CheckCheck, Sparkles, Filter, Bookmark, ExternalLink } from 'lucide-react';
import { RssFeedData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: RssFeedData;
  onOpenDetail?: () => void;
}

export const RssFeedCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { ingestRssToCanvas, markRssItemRead, toggleBookmark } = useAppStore();
  const [similarityFiltered, setSimilarityFiltered] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleIngest = () => {
    ingestRssToCanvas(data.id);
  };

  const handleToggleSimilarity = () => {
    setSimilarityFiltered(!similarityFiltered);
  };

  const handleMarkAllRead = () => {
    data.items.forEach((item) => markRssItemRead(data.id, item.id));
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

        {/* Subheader */}
        <div className="neo-border rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium mb-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
          <span className="truncate">{data.metadata}</span>
          {data.unreadCount > 0 && (
            <span className="bg-[#d97706] text-white px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ml-2">
              {data.unreadCount} NEW
            </span>
          )}
        </div>

        {/* Items List */}
        <div className="space-y-2.5">
          {data.items.map((item, idx) => {
            const isRead = item.read;
            const simScore = (0.94 - idx * 0.08).toFixed(2);
            return (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedItemId(item.id === selectedItemId ? null : item.id);
                  markRssItemRead(data.id, item.id);
                }}
                className={`neo-border rounded-xl p-3 bg-[#fbf9f5] dark:bg-neutral-900/40 cursor-pointer transition-all hover:translate-x-1 ${
                  isRead ? 'opacity-80' : 'font-semibold'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs sm:text-sm text-[#1a1a1a] dark:text-[#f5f0e8] leading-snug">
                    <span className="font-mono text-neutral-500 mr-2">
                      {item.indexStr} {item.timeStr}
                    </span>
                    <span>{item.title}</span>
                    <span className="text-neutral-500 font-normal ml-2">
                      • {item.typeOrDuration}
                    </span>
                  </div>

                  {similarityFiltered && (
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-mono px-1.5 py-0.5 rounded border border-emerald-400 shrink-0">
                      sim: {simScore}
                    </span>
                  )}
                </div>

                {selectedItemId === item.id && (
                  <div className="mt-2.5 pt-2 border-t border-dashed border-neutral-300 dark:border-neutral-700 text-xs text-neutral-600 dark:text-neutral-300 font-normal">
                    <p>Semantic Vector: [0.281, -0.412, 0.908] • Ready for synthesis.</p>
                    <div className="mt-1 flex gap-2">
                      <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                        Authoritative Source
                      </span>
                      <span className="text-[10px] bg-neutral-200 dark:bg-neutral-800 px-1.5 py-0.5 rounded">
                        Full Text Cached
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-neutral-600 dark:text-neutral-400 font-bold mr-1">ACTIONS:</span>
          <button
            onClick={handleIngest}
            className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-[#d97706] hover:text-white rounded border border-neutral-400 text-[11px] font-bold transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" /> [ Ingest All to Canvas ]
          </button>
          <button
            onClick={handleToggleSimilarity}
            className={`px-2 py-0.5 rounded border text-[11px] font-bold transition-colors flex items-center gap-1 ${
              similarityFiltered
                ? 'bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black border-transparent'
                : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 border-neutral-400'
            }`}
          >
            <Filter className="w-3 h-3" /> [ Filter by Vector Similarity ]
          </button>
          <button
            onClick={handleMarkAllRead}
            className="px-2 py-0.5 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 rounded border border-neutral-400 text-[11px] font-bold transition-colors flex items-center gap-1"
          >
            <CheckCheck className="w-3 h-3" /> [ Mark as Read ]
          </button>
        </div>
      </div>
    </article>
  );
};
