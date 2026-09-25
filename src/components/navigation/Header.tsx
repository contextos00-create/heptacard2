import React from 'react';
import { Menu, Search, Bell, Sparkles, X, Filter, Bookmark, Plus } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { CardCategory } from '../../types';

export const Header: React.FC = () => {
  const {
    activeTab,
    toggleSidebar,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    notifications,
    setAiModalOpen,
    sendPushNotification,
    enablePushNotifications,
    pushEnabled,
    cards,
  } = useAppStore();

  const unreadAlerts = notifications.filter((n) => !n.read).length;

  const categories: { id: CardCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All 10 Cards' },
    { id: 'cheat-sheet', label: 'Code & Docker' },
    { id: 'rss-dispatch', label: 'RSS Feed' },
    { id: 'interview-qa', label: 'Whisper Q&A' },
    { id: 'pdf-excerpt', label: 'PDF Attention' },
    { id: 'recipe-log', label: 'Sourdough Ratios' },
    { id: 'x-thread', label: 'Karpathy OS' },
    { id: 'newsletter', label: 'Stratechery' },
    { id: 'video-clip', label: '3B1B Video' },
    { id: 'audio-podcast', label: 'Huberman Audio' },
    { id: 'web-article', label: 'PG Web Clip' },
  ];

  const handleNotificationClick = async () => {
    if (!pushEnabled) {
      await enablePushNotifications();
    } else {
      sendPushNotification('Knowledge Graph Sync', 'All 10 Bauhaus cards validated and cached in local memory.');
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b-3 border-[#1a1a1a] dark:border-neutral-700 bg-[#faf7f2]/95 dark:bg-[#161514]/95 backdrop-blur-sm px-4 sm:px-6 py-3 transition-colors">
      <div className="flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger & breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-lg border-2 border-[#1a1a1a] dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d97706] dark:bg-amber-400" />
              <h1 className="font-display font-bold text-sm sm:text-base md:text-lg uppercase tracking-tight truncate">
                {activeTab === 'cards' && 'Bauhaus Knowledge Deck'}
                {activeTab === 'dashboard' && 'Cognitive Velocity & Analytics'}
                {activeTab === 'datatable' && 'Knowledge Data Table'}
                {activeTab === 'profile' && 'Operator Profile & Offline Sync'}
              </h1>
            </div>
            <p className="text-[11px] font-mono text-neutral-500 hidden sm:block">
              10 Interactive Components • Neo-Brutalist Bauhaus Constitution
            </p>
          </div>
        </div>

        {/* Center: Search input */}
        <div className="flex-1 max-w-xs md:max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search concepts, quotes, docker commands, or formulas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-xs border-2 border-[#1a1a1a] dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-900 focus:outline-none focus:border-amber-500 font-sans shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification Alert Bell */}
          <button
            onClick={handleNotificationClick}
            className="relative p-2 rounded-xl border-2 border-[#1a1a1a] dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800"
            title="Real-time alerts & Push Notifications"
            aria-label="Alerts"
          >
            <Bell className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
            {unreadAlerts > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-black text-[9px] font-bold flex items-center justify-center border border-black font-mono">
                {unreadAlerts}
              </span>
            )}
          </button>

          {/* New Card Modal Button */}
          <button
            onClick={() => setAiModalOpen(true)}
            className="neo-button px-3 py-1.5 rounded-xl text-xs font-bold bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black flex items-center gap-1.5 uppercase shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Synthesize</span>
          </button>
        </div>
      </div>

      {/* Mobile search bar if on mobile */}
      <div className="mt-2.5 md:hidden">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search all 10 cards..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-1.5 text-xs border-2 border-[#1a1a1a] dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-900"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Category Filter Pills (Scrollable) */}
      {activeTab === 'cards' && (
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`neo-pill whitespace-nowrap transition-all ${
                filterCategory === cat.id
                  ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black border-transparent font-bold'
                  : 'bg-[#f4efe5]/80 dark:bg-neutral-900/60 text-neutral-700 dark:text-neutral-300 border-neutral-400 hover:border-black'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
