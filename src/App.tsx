import React, { useEffect, useMemo, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { Sidebar } from './components/navigation/Sidebar';
import { Header } from './components/navigation/Header';
import { GenericCardRenderer } from './components/cards/GenericCardRenderer';
import { DraggableCardContainer } from './components/DraggableCardContainer';
import { AnalyticsCharts } from './components/dashboard/AnalyticsCharts';
import { UserProfileWidget } from './components/dashboard/UserProfileWidget';
import { KnowledgeDataTable } from './components/datatable/KnowledgeDataTable';
import { CardDetailModal } from './components/modals/CardDetailModal';
import { AiGeneratorModal } from './components/modals/AiGeneratorModal';
import { FocusStareModal } from './components/modals/FocusStareModal';
import { Toast } from './components/ui/Toast';
import { Sparkles, LayoutGrid, Search, Bookmark, CheckCircle2, SlidersHorizontal, RefreshCw } from 'lucide-react';
import { KnowledgeCard } from './types';

export default function App() {
  const {
    activeTab,
    sidebarOpen,
    searchQuery,
    filterCategory,
    cards,
    selectedCardId,
    setSelectedCardId,
    aiModalOpen,
    setAiModalOpen,
    setIsOnline,
    darkMode,
    fontScale,
    highContrast,
    pendingSyncQueue,
    syncOfflineQueue,
    moveCard,
    showToast,
  } = useAppStore();

  const [draggingCardId, setDraggingCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggingCardId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (dragOverCardId !== id) {
      setDragOverCardId(id);
    }
  };

  const handleDrop = (targetId: string) => {
    if (draggingCardId && draggingCardId !== targetId) {
      moveCard(draggingCardId, targetId);
      const movedCard = cards.find((c) => c.id === draggingCardId);
      if (movedCard) {
        showToast(`Reordered: "${movedCard.title.slice(0, 22)}..."`, 'info');
      }
    }
    setDraggingCardId(null);
    setDragOverCardId(null);
  };

  const handleDragEnd = () => {
    setDraggingCardId(null);
    setDragOverCardId(null);
  };

  // Selected card for detail modal
  const selectedCard = useMemo(
    () => cards.find((c) => c.id === selectedCardId) || null,
    [cards, selectedCardId]
  );

  // Setup online/offline listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial theme sync with document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setIsOnline, darkMode]);

  // Filtered cards based on search and category
  const filteredCards = useMemo(() => {
    return cards.filter((card) => {
      const matchesCat = filterCategory === 'all' || card.category === filterCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const cardStr = JSON.stringify(card).toLowerCase();
      return cardStr.includes(q);
    });
  }, [cards, filterCategory, searchQuery]);

  return (
    <div
      className={`min-h-screen flex transition-colors duration-200 ${
        fontScale === 'large' ? 'text-[15px]' : fontScale === 'compact' ? 'text-[12px]' : 'text-[13px]'
      } ${highContrast ? 'contrast-125' : ''}`}
    >
      {/* Neo-brutalist Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          sidebarOpen ? 'lg:pl-72' : 'lg:pl-20'
        }`}
      >
        <Header />

        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Offline Sync Banner if pending mutations */}
          {pendingSyncQueue.length > 0 && (
            <div className="p-3 rounded-2xl border-2 border-amber-600 bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 text-xs font-bold flex items-center justify-between flex-wrap gap-2 shadow-[2px_2px_0px_#1a1a1a]">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-700" />
                Offline Mode Active: {pendingSyncQueue.length} transaction(s) queued for synchronization upon reconnection.
              </span>
              <button
                onClick={syncOfflineQueue}
                className="px-2.5 py-1 bg-amber-500 text-black rounded-lg border border-black text-[11px] font-bold hover:bg-amber-400"
              >
                Sync Queue
              </button>
            </div>
          )}

          {/* TAB 1: ALL 10 CARDS DECK */}
          {activeTab === 'cards' && (
            <section aria-label="10 Cards Knowledge Deck">
              {/* Deck Summary Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b-2 border-[#1a1a1a] dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-sm sm:text-base uppercase tracking-wider">
                    Knowledge Canvas Nodes
                  </span>
                  <span className="neo-pill border-2 bg-transparent text-[10px]">
                    {filteredCards.length} of {cards.length} Active
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    ⋮⋮ Drag & Drop Enabled
                  </span>
                  <span>•</span>
                  <span>10-Component Modular Layout</span>
                </div>
              </div>

              {/* Cards Grid: Responsive 1 col on mobile, 2 cols on tablet/desktop */}
              {filteredCards.length === 0 ? (
                <div className="neo-card rounded-2xl p-10 text-center space-y-3 bg-[#faf7f2] dark:bg-[#1a1918]">
                  <Search className="w-8 h-8 mx-auto text-neutral-400" />
                  <h3 className="font-display font-bold text-base uppercase">
                    No matching knowledge cards found
                  </h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Try searching for another keyword or generate a new card using Gemini 3.8.
                  </p>
                  <button
                    onClick={() => setAiModalOpen(true)}
                    className="neo-button px-4 py-2 rounded-xl text-xs font-bold bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black inline-flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Synthesize with GenAI
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-start">
                  {filteredCards.map((card, idx) => (
                    <DraggableCardContainer
                      key={card.id}
                      card={card}
                      index={idx}
                      totalCards={filteredCards.length}
                      onOpenDetail={(id) => setSelectedCardId(id)}
                      onDragStartItem={handleDragStart}
                      onDragOverItem={handleDragOver}
                      onDropItem={handleDrop}
                      onDragEndItem={handleDragEnd}
                      isDraggingCurrent={draggingCardId === card.id}
                      isDragOverCurrent={dragOverCardId === card.id && draggingCardId !== card.id}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* TAB 2: ANALYTICS & DASHBOARD CHARTS */}
          {activeTab === 'dashboard' && (
            <section aria-label="Analytics and Charts Dashboard">
              <AnalyticsCharts />
            </section>
          )}

          {/* TAB 3: KNOWLEDGE DATA TABLE */}
          {activeTab === 'datatable' && (
            <section aria-label="Data Table">
              <KnowledgeDataTable onSelectCard={(id) => setSelectedCardId(id)} />
            </section>
          )}

          {/* TAB 4: USER PROFILE & OFFLINE CONTROL */}
          {activeTab === 'profile' && (
            <section aria-label="User Profile Widget">
              <UserProfileWidget />
            </section>
          )}
        </main>
      </div>

      {/* Global Modals */}
      <CardDetailModal
        card={selectedCard}
        onClose={() => setSelectedCardId(null)}
      />

      <AiGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
      />

      <FocusStareModal />

      {/* Toast Feedback */}
      <Toast />
    </div>
  );
}
