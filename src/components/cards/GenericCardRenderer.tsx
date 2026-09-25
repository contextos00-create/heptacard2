import React from 'react';
import { KnowledgeCard } from '../../types';
import { DockerCheatSheetCard } from './DockerCheatSheetCard';
import { RssFeedCard } from './RssFeedCard';
import { FounderInterviewCard } from './FounderInterviewCard';
import { PdfExcerptCard } from './PdfExcerptCard';
import { SourdoughRecipeCard } from './SourdoughRecipeCard';
import { CuratedThreadCard } from './CuratedThreadCard';
import { StratecheryNewsletterCard } from './StratecheryNewsletterCard';
import { VideoExcerptCard } from './VideoExcerptCard';
import { PodcastChapterCard } from './PodcastChapterCard';
import { WebClipCard } from './WebClipCard';
import { Bookmark, Sparkles, Trash2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  card: KnowledgeCard;
  onOpenDetail?: (id: string) => void;
}

export const GenericCardRenderer: React.FC<Props> = ({ card, onOpenDetail }) => {
  const { toggleBookmark, deleteCard, showToast } = useAppStore();

  switch (card.category) {
    case 'cheat-sheet':
      return <DockerCheatSheetCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'rss-dispatch':
      return <RssFeedCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'interview-qa':
      return <FounderInterviewCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'pdf-excerpt':
      return <PdfExcerptCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'recipe-log':
      return <SourdoughRecipeCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'x-thread':
      return <CuratedThreadCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'newsletter':
      return <StratecheryNewsletterCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'video-clip':
      return <VideoExcerptCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'audio-podcast':
      return <PodcastChapterCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'web-article':
      return <WebClipCard data={card} onOpenDetail={() => onOpenDetail?.(card.id)} />;
    case 'ai-generated':
    default:
      // Generic AI card renderer adhering to exact neo-brutalist schema
      const aiCard = card as any;
      return (
        <article
          className="neo-card rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8]"
          aria-label={aiCard.title}
        >
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400 shrink-0" aria-hidden="true" />
                <h2 className="font-display font-bold tracking-tight text-xs sm:text-sm md:text-base uppercase truncate">
                  {aiCard.title}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="neo-pill bg-transparent border-2">
                  {aiCard.badge || 'AI SYNTHESIS'}
                </span>
                <button
                  onClick={() => toggleBookmark(aiCard.id)}
                  className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors"
                  title="Bookmark"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${aiCard.isBookmarked ? "fill-amber-500 text-amber-500" : "text-neutral-500"}`} />
                </button>
                <button
                  onClick={() => deleteCard(aiCard.id)}
                  className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-950 text-red-600 transition-colors"
                  title="Delete card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="neo-border rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium mb-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
              <span className="truncate">{aiCard.metadata}</span>
              <span className="text-[10px] font-mono text-amber-600 flex items-center gap-1 shrink-0 ml-2">
                <Sparkles className="w-3 h-3" /> GenAI 3.8
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
              <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-xs uppercase text-neutral-500 mb-2">
                    {aiCard.leftTitle || 'Core Extract'}
                  </h3>
                  <p className="text-xs sm:text-[13px] leading-relaxed font-serif text-neutral-800 dark:text-neutral-200">
                    {aiCard.leftContent}
                  </p>
                </div>
              </div>

              <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-xs uppercase text-neutral-500 mb-2">
                    {aiCard.rightTitle || 'Key Patterns'}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-neutral-800 dark:text-neutral-200">
                    {aiCard.rightItems?.map((item: string, idx: number) => (
                      <li key={idx} className="leading-snug">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
            <span className="text-[11px] sm:text-xs truncate">{aiCard.footer}</span>
            <span className="text-[10px] font-mono text-emerald-600">● LIVE INGEST</span>
          </div>
        </article>
      );
  }
};
