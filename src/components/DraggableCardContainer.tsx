import React, { useState } from 'react';
import { GripVertical, ArrowUp, ArrowDown } from 'lucide-react';
import { GenericCardRenderer } from './cards/GenericCardRenderer';
import { KnowledgeCard } from '../types';
import { useAppStore } from '../store/useAppStore';

interface Props {
  card: KnowledgeCard;
  index: number;
  totalCards: number;
  onOpenDetail?: (id: string) => void;
  onDragStartItem: (id: string) => void;
  onDragOverItem: (e: React.DragEvent, id: string) => void;
  onDropItem: (id: string) => void;
  onDragEndItem: () => void;
  isDraggingCurrent: boolean;
  isDragOverCurrent: boolean;
}

export const DraggableCardContainer: React.FC<Props> = ({
  card,
  index,
  totalCards,
  onOpenDetail,
  onDragStartItem,
  onDragOverItem,
  onDropItem,
  onDragEndItem,
  isDraggingCurrent,
  isDragOverCurrent,
}) => {
  const { moveCard, showToast } = useAppStore();
  const [touchStart, setTouchStart] = useState<{ y: number } | null>(null);

  const handleMoveUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index > 0) {
      const prevCardId = useAppStore.getState().cards[index - 1]?.id;
      if (prevCardId) {
        moveCard(card.id, prevCardId);
        showToast(`Moved "${card.title.slice(0, 20)}..." up`, 'info');
      }
    }
  };

  const handleMoveDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (index < totalCards - 1) {
      const nextCardId = useAppStore.getState().cards[index + 1]?.id;
      if (nextCardId) {
        moveCard(nextCardId, card.id);
        showToast(`Moved "${card.title.slice(0, 20)}..." down`, 'info');
      }
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', card.id);
        e.dataTransfer.effectAllowed = 'move';
        onDragStartItem(card.id);
      }}
      onDragOver={(e) => onDragOverItem(e, card.id)}
      onDrop={(e) => {
        e.preventDefault();
        onDropItem(card.id);
      }}
      onDragEnd={onDragEndItem}
      className={`group/drag relative transition-all duration-200 ${
        isDraggingCurrent ? 'opacity-40 scale-95 pointer-events-none' : 'opacity-100'
      } ${
        isDragOverCurrent
          ? 'ring-4 ring-amber-500 rounded-2xl transform -translate-y-1 shadow-2xl'
          : ''
      }`}
    >
      {/* Neo-brutalist Drag Handle Bar */}
      <div className="absolute top-3 right-16 z-20 flex items-center gap-1 opacity-70 group-hover/drag:opacity-100 transition-opacity">
        {/* Quick Shift Up / Down arrows for accessibility & mobile viewports */}
        <div className="flex items-center bg-[#faf7f2] dark:bg-neutral-800 border-1.5 border-[#1a1a1a] dark:border-neutral-500 rounded-md shadow-[1px_1px_0px_#1a1a1a] overflow-hidden">
          <button
            onClick={handleMoveUp}
            disabled={index === 0}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition-colors"
            title="Move card up in order"
            aria-label="Move card up"
          >
            <ArrowUp className="w-3 h-3 text-[#1a1a1a] dark:text-[#f5f0e8]" />
          </button>
          <span className="w-[1px] h-3 bg-neutral-300 dark:bg-neutral-600" />
          <button
            onClick={handleMoveDown}
            disabled={index === totalCards - 1}
            className="p-1 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-30 transition-colors"
            title="Move card down in order"
            aria-label="Move card down"
          >
            <ArrowDown className="w-3 h-3 text-[#1a1a1a] dark:text-[#f5f0e8]" />
          </button>
        </div>

        {/* Drag handle */}
        <div
          className="cursor-grab active:cursor-grabbing p-1 bg-amber-400 text-black border-1.5 border-[#1a1a1a] rounded-md shadow-[1px_1px_0px_#1a1a1a] flex items-center justify-center"
          title="Drag and drop to rearrange"
          aria-label="Drag handle"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Render target card */}
      <GenericCardRenderer card={card} onOpenDetail={onOpenDetail} />
    </div>
  );
};
