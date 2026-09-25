import React from 'react';
import {
  LayoutGrid,
  BarChart2,
  Table,
  User,
  Sparkles,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Bookmark,
  Layers,
  Target,
  ChevronLeft,
  ChevronRight,
  HardDrive,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    darkMode,
    toggleDarkMode,
    setAiModalOpen,
    setFocusStareModalOpen,
    isOnline,
    pendingSyncQueue,
    syncOfflineQueue,
    userProfile,
    cards,
  } = useAppStore();

  const navItems = [
    {
      id: 'cards',
      label: 'All 10 Cards Deck',
      icon: LayoutGrid,
      count: cards.length,
    },
    {
      id: 'dashboard',
      label: 'Analytics & Curves',
      icon: BarChart2,
      badge: 'LIVE',
    },
    {
      id: 'datatable',
      label: 'Knowledge Data Table',
      icon: Table,
      count: cards.length,
    },
    {
      id: 'profile',
      label: 'Operator & Offline Sync',
      icon: User,
      badge: pendingSyncQueue.length > 0 ? `${pendingSyncQueue.length} PENDING` : undefined,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col justify-between border-r-3 border-[#1a1a1a] dark:border-neutral-700 bg-[#faf7f2] dark:bg-[#161514] text-[#1a1a1a] dark:text-[#f5f0e8] transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64 sm:w-72' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
        } overflow-hidden`}
        aria-label="Main Navigation"
      >
        <div className="flex flex-col h-full justify-between p-4">
          {/* Top Branding */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#1a1a1a] dark:border-neutral-700">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="w-3.5 h-3.5 rounded-full bg-[#d97706] dark:bg-amber-400 shrink-0" />
                <div className={`${!sidebarOpen ? 'lg:hidden' : 'block'} truncate`}>
                  <div className="font-display font-bold text-sm tracking-tight uppercase leading-none">
                    BAUHAUS CANVAS
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 mt-0.5">
                    10-Node Architecture
                  </div>
                </div>
              </div>

              {/* Close button for mobile */}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded-lg border border-neutral-400 lg:hidden"
                aria-label="Close sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Action Button */}
            <div className="mt-4">
              <button
                onClick={() => setAiModalOpen(true)}
                className={`neo-button w-full py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-400 text-black hover:bg-amber-500 flex items-center justify-center gap-2 uppercase tracking-wider ${
                  !sidebarOpen ? 'lg:p-2 lg:aspect-square' : ''
                }`}
                title="Synthesize Card with Gemini 3.8"
              >
                <Sparkles className="w-4 h-4 shrink-0 fill-black" />
                <span className={!sidebarOpen ? 'lg:hidden' : 'inline'}>
                  + New GenAI Card
                </span>
              </button>
            </div>

            {/* Navigation links */}
            <nav className="mt-5 space-y-1.5" aria-label="Sections">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id as any);
                      if (window.innerWidth < 1024) setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all border-2 ${
                      isActive
                        ? 'border-[#1a1a1a] dark:border-white bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black shadow-[2px_2px_0px_#1a1a1a]'
                        : 'border-transparent hover:border-neutral-400 hover:bg-[#f3efe6] dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                    title={item.label}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className={!sidebarOpen ? 'lg:hidden' : 'truncate'}>
                        {item.label}
                      </span>
                    </div>

                    {sidebarOpen && (
                      <div className="shrink-0 ml-1">
                        {item.count !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              isActive
                                ? 'bg-neutral-800 text-white dark:bg-neutral-300 dark:text-black'
                                : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-black">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Special Protocol Trigger */}
              <button
                onClick={() => setFocusStareModalOpen(true)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all border-2 border-dashed border-amber-500/70 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-neutral-800 dark:text-neutral-200 mt-2 ${
                  !sidebarOpen ? 'lg:justify-center' : ''
                }`}
                title="90s Visual Focus Stare Protocol"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Target className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className={!sidebarOpen ? 'lg:hidden' : 'truncate'}>
                    90s Focus Stare (Huberman)
                  </span>
                </div>
              </button>
            </nav>
          </div>

          {/* Bottom Controls */}
          <div className="pt-4 border-t-2 border-[#1a1a1a] dark:border-neutral-700 space-y-3">
            {/* Offline Sync Status pill */}
            <div className={`p-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#f4efe5]/60 dark:bg-neutral-900/40 text-xs ${!sidebarOpen ? 'lg:hidden' : 'block'}`}>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-[11px]">
                  {isOnline ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Wifi className="w-3.5 h-3.5" /> Online
                    </span>
                  ) : (
                    <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <WifiOff className="w-3.5 h-3.5" /> Offline Mode
                    </span>
                  )}
                </span>
                {pendingSyncQueue.length > 0 && (
                  <button
                    onClick={syncOfflineQueue}
                    className="text-[10px] font-mono text-amber-600 underline font-bold flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Sync ({pendingSyncQueue.length})
                  </button>
                )}
              </div>
              <div className="text-[10px] text-neutral-500 mt-1 truncate">
                Storage: {userProfile.storageMb}MB / {userProfile.maxStorageMb}MB
              </div>
            </div>

            {/* Dark Mode & Collapse Controls */}
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={toggleDarkMode}
                className="flex-1 p-2 rounded-xl border-2 border-[#1a1a1a] dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center gap-2 text-xs font-bold"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
                <span className={!sidebarOpen ? 'lg:hidden' : 'inline'}>
                  {darkMode ? 'Light Theme' : 'Dark Theme'}
                </span>
              </button>

              <button
                onClick={toggleSidebar}
                className="hidden lg:flex p-2 rounded-xl border-2 border-[#1a1a1a] dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-800 items-center justify-center"
                aria-label="Toggle sidebar collapse"
              >
                {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
