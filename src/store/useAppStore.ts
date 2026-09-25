import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { KnowledgeCard, UserProfile, NotificationItem, CardCategory } from '../types';
import { INITIAL_CARDS } from '../data/initialCards';

interface ToastState {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'alert';
}

interface AppStore {
  // Navigation & Layout
  activeTab: 'cards' | 'dashboard' | 'analytics' | 'datatable' | 'profile';
  setActiveTab: (tab: 'cards' | 'dashboard' | 'analytics' | 'datatable' | 'profile') => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Visual Theme & A11y
  darkMode: boolean;
  toggleDarkMode: () => void;
  fontScale: 'normal' | 'large' | 'compact';
  setFontScale: (scale: 'normal' | 'large' | 'compact') => void;
  highContrast: boolean;
  toggleHighContrast: () => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterCategory: CardCategory | 'all';
  setFilterCategory: (category: CardCategory | 'all') => void;
  selectedCardId: string | null;
  setSelectedCardId: (id: string | null) => void;

  // Knowledge Cards
  cards: KnowledgeCard[];
  addCard: (card: KnowledgeCard) => void;
  deleteCard: (id: string) => void;
  toggleBookmark: (id: string) => void;
  markCardRead: (id: string, read?: boolean) => void;
  reorderCards: (newCards: KnowledgeCard[]) => void;
  moveCard: (sourceId: string, targetId: string) => void;

  // Specialized Card State
  sourdoughLoaves: number;
  sourdoughHydration: number;
  updateSourdough: (loaves: number, hydration: number) => void;
  ingestRssToCanvas: (cardId: string) => void;
  markRssItemRead: (cardId: string, itemId: string) => void;

  // Media Player states
  isPlayingAudio: boolean;
  audioProgress: number; // in seconds
  toggleAudioPlayback: () => void;
  isPlayingVideo: boolean;
  videoTimestampSeconds: number;
  toggleVideoPlayback: () => void;
  setVideoTimestamp: (seconds: number) => void;
  focusStareModalOpen: boolean;
  setFocusStareModalOpen: (open: boolean) => void;

  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  // Offline & Synchronization
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  pendingSyncQueue: { id: string; action: string; timestamp: string }[];
  queueSyncAction: (action: string) => void;
  syncOfflineQueue: () => void;

  // Push Notifications & Alerts
  notifications: NotificationItem[];
  pushEnabled: boolean;
  enablePushNotifications: () => Promise<boolean>;
  sendPushNotification: (title: string, message: string, type?: 'info' | 'alert' | 'success') => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Feedback Toasts
  activeToast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'alert') => void;
  dismissToast: () => void;
  copyToClipboard: (text: string, label?: string) => Promise<void>;

  // AI Modal
  aiModalOpen: boolean;
  setAiModalOpen: (open: boolean) => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      activeTab: 'cards',
      setActiveTab: (tab) => set({ activeTab: tab }),
      sidebarOpen: true,
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      darkMode: false,
      toggleDarkMode: () => {
        set((state) => {
          const next = !state.darkMode;
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { darkMode: next };
        });
      },
      fontScale: 'normal',
      setFontScale: (scale) => set({ fontScale: scale }),
      highContrast: false,
      toggleHighContrast: () => set((state) => ({ highContrast: !state.highContrast })),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),
      filterCategory: 'all',
      setFilterCategory: (category) => set({ filterCategory: category }),
      selectedCardId: null,
      setSelectedCardId: (id) => set({ selectedCardId: id }),

      cards: INITIAL_CARDS,
      addCard: (card) => {
        set((state) => ({
          cards: [card, ...state.cards],
          userProfile: {
            ...state.userProfile,
            cardsCount: state.cards.length + 1,
            storageMb: +(state.userProfile.storageMb + 0.12).toFixed(2),
          },
        }));
        get().queueSyncAction(`Created card ${card.title}`);
        get().showToast(`Added: ${card.title.slice(0, 30)}...`, 'success');
      },
      deleteCard: (id) => {
        set((state) => ({
          cards: state.cards.filter((c) => c.id !== id),
          userProfile: {
            ...state.userProfile,
            cardsCount: Math.max(0, state.cards.length - 1),
          },
        }));
        get().queueSyncAction(`Deleted card ${id}`);
        get().showToast('Card deleted', 'info');
      },
      toggleBookmark: (id) => {
        set((state) => ({
          cards: state.cards.map((c) =>
            c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c
          ),
        }));
      },
      markCardRead: (id, read = true) => {
        set((state) => ({
          cards: state.cards.map((c) => (c.id === id ? { ...c, isRead: read } : c)),
        }));
      },
      reorderCards: (newCards) => {
        set({ cards: newCards });
        get().queueSyncAction('Reordered knowledge cards on canvas');
      },
      moveCard: (sourceId, targetId) => {
        if (sourceId === targetId) return;
        set((state) => {
          const currentCards = [...state.cards];
          const sourceIndex = currentCards.findIndex((c) => c.id === sourceId);
          const targetIndex = currentCards.findIndex((c) => c.id === targetId);
          if (sourceIndex === -1 || targetIndex === -1) return state;

          const [movedCard] = currentCards.splice(sourceIndex, 1);
          currentCards.splice(targetIndex, 0, movedCard);
          return { cards: currentCards };
        });
        get().queueSyncAction(`Moved card ${sourceId} to position of ${targetId}`);
      },

      sourdoughLoaves: 2,
      sourdoughHydration: 78,
      updateSourdough: (loaves, hydration) => {
        set({ sourdoughLoaves: loaves, sourdoughHydration: hydration });
        get().queueSyncAction(`Updated Sourdough Yield (${loaves} loaves, ${hydration}%)`);
      },

      ingestRssToCanvas: (cardId) => {
        set((state) => {
          const card = state.cards.find((c) => c.id === cardId);
          if (card && card.category === 'rss-dispatch') {
            const updatedItems = card.items.map((i) => ({ ...i, read: true }));
            return {
              cards: state.cards.map((c) =>
                c.id === cardId ? { ...c, unreadCount: 0, items: updatedItems } : c
              ),
            };
          }
          return state;
        });
        get().showToast('Ingested 3 RSS items directly to Canvas Graph', 'success');
        get().queueSyncAction('Ingested RSS stream');
      },

      markRssItemRead: (cardId, itemId) => {
        set((state) => {
          return {
            cards: state.cards.map((c) => {
              if (c.id === cardId && c.category === 'rss-dispatch') {
                const items = c.items.map((it) =>
                  it.id === itemId ? { ...it, read: true } : it
                );
                const unread = items.filter((it) => !it.read).length;
                return { ...c, items, unreadCount: unread };
              }
              return c;
            }),
          };
        });
      },

      isPlayingAudio: false,
      audioProgress: 2052, // 34:12 in seconds
      toggleAudioPlayback: () => {
        const next = !get().isPlayingAudio;
        set({ isPlayingAudio: next });
        if (next) {
          get().showToast('Playing Huberman Lab #84 (34:12)', 'info');
        }
      },

      isPlayingVideo: false,
      videoTimestampSeconds: 525, // 08:45
      toggleVideoPlayback: () => {
        const next = !get().isPlayingVideo;
        set({ isPlayingVideo: next });
        if (next) {
          get().showToast('Playing 3Blue1Brown Neural Networks excerpt', 'info');
        }
      },
      setVideoTimestamp: (seconds) => {
        set({ videoTimestampSeconds: seconds });
      },

      focusStareModalOpen: false,
      setFocusStareModalOpen: (open) => set({ focusStareModalOpen: open }),

      userProfile: {
        name: 'Anthony Cota',
        handle: '@anthonycota',
        role: 'Principal Systems Architect',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        bio: 'Researching local-first computational media, neuroplasticity, and neo-brutalist interaction paradigms.',
        cardsCount: 10,
        storageMb: 14.8,
        maxStorageMb: 100,
        streakDays: 42,
        lastSynced: 'Just now',
        isSyncing: false,
      },
      updateUserProfile: (profile) =>
        set((state) => ({ userProfile: { ...state.userProfile, ...profile } })),

      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      setIsOnline: (online) => {
        set({ isOnline: online });
        if (online) {
          get().syncOfflineQueue();
        } else {
          get().showToast('Offline Mode: Changes will queue locally', 'alert');
        }
      },
      pendingSyncQueue: [],
      queueSyncAction: (action) => {
        if (!get().isOnline) {
          set((state) => ({
            pendingSyncQueue: [
              ...state.pendingSyncQueue,
              { id: `sync-${Date.now()}`, action, timestamp: new Date().toLocaleTimeString() },
            ],
          }));
        }
      },
      syncOfflineQueue: () => {
        const queue = get().pendingSyncQueue;
        if (queue.length > 0) {
          set((state) => ({
            userProfile: { ...state.userProfile, isSyncing: true },
          }));
          setTimeout(() => {
            set((state) => ({
              pendingSyncQueue: [],
              userProfile: {
                ...state.userProfile,
                isSyncing: false,
                lastSynced: 'Just now',
              },
            }));
            get().showToast(`Synchronized ${queue.length} pending offline mutations`, 'success');
          }, 800);
        }
      },

      notifications: [
        {
          id: 'notif-1',
          title: 'Docker verified',
          message: 'Compose v2.4 configuration verified against cluster specs.',
          time: '12m ago',
          read: false,
          type: 'success',
        },
        {
          id: 'notif-2',
          title: 'RSS Feed Ingested',
          message: '14 new articles synced from Tech & CogSci dispatch.',
          time: '24m ago',
          read: false,
          type: 'info',
        },
        {
          id: 'notif-3',
          title: 'Baker’s Ratio Alert',
          message: 'Fermentation window optimal at 14h cold retard.',
          time: '1h ago',
          read: true,
          type: 'alert',
        },
      ],
      pushEnabled: false,
      enablePushNotifications: async () => {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          try {
            const permission = await Notification.requestPermission();
            const granted = permission === 'granted';
            set({ pushEnabled: granted });
            if (granted) {
              get().showToast('Push Notifications Activated for Real-Time Alerts', 'success');
              new Notification('Bauhaus Canvas Active', {
                body: 'Real-time alerts and background sync are now configured.',
                icon: '/favicon.ico',
              });
            }
            return granted;
          } catch (e) {
            console.error('Push permission error', e);
          }
        }
        return false;
      },
      sendPushNotification: (title, message, type = 'info') => {
        const newNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title,
          message,
          time: 'Just now',
          read: false,
          type,
        };
        set((state) => ({
          notifications: [newNotif, ...state.notifications],
        }));
        get().showToast(`${title}: ${message}`, type);

        if (get().pushEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(title, { body: message });
        }
      },
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
      },
      clearNotifications: () => set({ notifications: [] }),

      activeToast: null,
      showToast: (message, type = 'info') => {
        const id = `toast-${Date.now()}`;
        set({ activeToast: { id, message, type } });
        setTimeout(() => {
          set((state) => (state.activeToast?.id === id ? { activeToast: null } : state));
        }, 3200);
      },
      dismissToast: () => set({ activeToast: null }),

      copyToClipboard: async (text, label = 'Copied to clipboard') => {
        try {
          if (navigator.clipboard) {
            await navigator.clipboard.writeText(text);
          }
          get().showToast(label, 'success');
        } catch {
          get().showToast(`Copied: ${text.slice(0, 24)}`, 'info');
        }
      },

      aiModalOpen: false,
      setAiModalOpen: (open) => set({ aiModalOpen: open }),
    }),
    {
      name: 'bauhaus-knowledge-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        cards: state.cards,
        userProfile: state.userProfile,
        sourdoughLoaves: state.sourdoughLoaves,
        sourdoughHydration: state.sourdoughHydration,
        pendingSyncQueue: state.pendingSyncQueue,
        pushEnabled: state.pushEnabled,
        fontScale: state.fontScale,
        highContrast: state.highContrast,
      }),
    }
  )
);
