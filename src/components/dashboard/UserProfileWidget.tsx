import React, { useState } from 'react';
import { User, Bell, HardDrive, Wifi, WifiOff, RefreshCw, Bookmark, CheckCircle, ShieldCheck, Sun, Moon, Type } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const UserProfileWidget: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    isOnline,
    setIsOnline,
    pendingSyncQueue,
    syncOfflineQueue,
    pushEnabled,
    enablePushNotifications,
    darkMode,
    toggleDarkMode,
    fontScale,
    setFontScale,
    highContrast,
    toggleHighContrast,
    cards,
    showToast,
  } = useAppStore();

  const [isEditing, setIsEditing] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [roleInput, setRoleInput] = useState(userProfile.role);

  const bookmarkedCount = cards.filter((c) => c.isBookmarked).length;
  const readCount = cards.filter((c) => c.isRead).length;

  const handleSaveProfile = () => {
    updateUserProfile({ name: nameInput, role: roleInput });
    setIsEditing(false);
    showToast('Profile information saved', 'success');
  };

  return (
    <div className="neo-card rounded-2xl p-5 sm:p-6 bg-[#faf7f2] dark:bg-[#1a1918] text-[#1a1a1a] dark:text-[#f5f0e8] space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-[#1a1a1a] dark:border-neutral-700">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400" />
          <h2 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight">
            Knowledge Operator Profile
          </h2>
        </div>
        <span className="neo-pill border-2 bg-transparent text-[10px]">
          LOCAL-FIRST VERIFIED
        </span>
      </div>

      {/* User Info Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border-2 border-[#1a1a1a] dark:border-neutral-600 bg-[#f4efe5]/60 dark:bg-neutral-900/40">
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border-2 border-[#1a1a1a] dark:border-white shadow-[2px_2px_0px_#1a1a1a]"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-black ${
                isOnline ? 'bg-emerald-500' : 'bg-red-500'
              }`}
              title={isOnline ? 'Online' : 'Offline'}
            />
          </div>

          <div>
            {isEditing ? (
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-2 py-0.5 text-sm font-bold border border-black dark:border-white rounded bg-white dark:bg-neutral-800"
                />
                <input
                  type="text"
                  value={roleInput}
                  onChange={(e) => setRoleInput(e.target.value)}
                  className="px-2 py-0.5 text-xs border border-black dark:border-white rounded bg-white dark:bg-neutral-800 block"
                />
              </div>
            ) : (
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg leading-tight">
                  {userProfile.name}
                </h3>
                <p className="text-xs font-mono text-neutral-600 dark:text-neutral-400">
                  {userProfile.handle} • {userProfile.role}
                </p>
              </div>
            )}

            <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500">
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                🔥 {userProfile.streakDays}-Day Capture Streak
              </span>
              <span>•</span>
              <span>{userProfile.lastSynced}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {isEditing ? (
            <button
              onClick={handleSaveProfile}
              className="neo-button px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black"
            >
              Save Profile
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="neo-button px-3 py-1.5 rounded-lg text-xs font-bold bg-[#fbf9f5] dark:bg-neutral-800"
            >
              Edit Details
            </button>
          )}
        </div>
      </div>

      {/* Bio / Mission statement */}
      <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-serif italic pl-2 border-l-2 border-amber-500">
        "{userProfile.bio}"
      </p>

      {/* Stats Quad */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#fbf9f5] dark:bg-neutral-900/40">
          <div className="text-neutral-500 text-[10px]">TOTAL NODES</div>
          <div className="text-xl font-bold font-display mt-0.5">{cards.length}</div>
        </div>

        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#fbf9f5] dark:bg-neutral-900/40">
          <div className="text-neutral-500 text-[10px]">BOOKMARKED</div>
          <div className="text-xl font-bold font-display mt-0.5 text-amber-600 dark:text-amber-400">
            {bookmarkedCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#fbf9f5] dark:bg-neutral-900/40">
          <div className="text-neutral-500 text-[10px]">VERIFIED READ</div>
          <div className="text-xl font-bold font-display mt-0.5 text-emerald-600 dark:text-emerald-400">
            {readCount}
          </div>
        </div>

        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#fbf9f5] dark:bg-neutral-900/40">
          <div className="text-neutral-500 text-[10px]">LOCAL STORAGE</div>
          <div className="text-xl font-bold font-display mt-0.5">
            {userProfile.storageMb} MB
          </div>
        </div>
      </div>

      {/* Storage Quota Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-semibold">
          <span className="flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-neutral-500" /> Offline Memory Quota
          </span>
          <span className="font-mono text-neutral-500">
            {userProfile.storageMb} MB / {userProfile.maxStorageMb} MB ({Math.round((userProfile.storageMb / userProfile.maxStorageMb) * 100)}%)
          </span>
        </div>
        <div className="w-full h-2.5 rounded-full border-2 border-[#1a1a1a] dark:border-neutral-500 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          <div
            style={{ width: `${(userProfile.storageMb / userProfile.maxStorageMb) * 100}%` }}
            className="h-full bg-amber-500"
          />
        </div>
      </div>

      {/* Offline & Synchronization Controls */}
      <div className="p-4 rounded-xl border-2 border-[#1a1a1a] dark:border-neutral-600 bg-[#f4efe5]/60 dark:bg-neutral-900/40 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            {isOnline ? (
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <Wifi className="w-4 h-4" /> Live Connection: Synchronized
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <WifiOff className="w-4 h-4" /> Offline Cache Operating
              </span>
            )}
          </div>
          <button
            onClick={() => setIsOnline(!isOnline)}
            className="text-[11px] font-mono underline hover:text-amber-600"
          >
            Simulate {isOnline ? 'Go Offline' : 'Go Online'}
          </button>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-300 dark:border-neutral-700 flex-wrap gap-2">
          <span className="text-neutral-600 dark:text-neutral-400">
            Pending Sync Mutations: <strong>{pendingSyncQueue.length}</strong> items in local transaction log
          </span>
          <button
            onClick={syncOfflineQueue}
            disabled={pendingSyncQueue.length === 0 || !isOnline}
            className={`neo-button px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
              pendingSyncQueue.length > 0 && isOnline
                ? 'bg-amber-400 text-black hover:bg-amber-500'
                : 'opacity-50 cursor-not-allowed bg-neutral-200 dark:bg-neutral-800'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${userProfile.isSyncing ? 'animate-spin' : ''}`} />
            Sync Now
          </button>
        </div>
      </div>

      {/* Accessibility & System Preferences */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Notifications */}
        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <div>
              <div className="font-bold">Push Notifications</div>
              <div className="text-[10px] text-neutral-500">Real-time alerts for digests</div>
            </div>
          </div>
          <button
            onClick={enablePushNotifications}
            className={`neo-button px-2.5 py-1 rounded text-[11px] font-bold ${
              pushEnabled ? 'bg-emerald-500 text-white' : 'bg-neutral-200 dark:bg-neutral-800'
            }`}
          >
            {pushEnabled ? 'Enabled' : 'Enable'}
          </button>
        </div>

        {/* Dark Mode */}
        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {darkMode ? <Moon className="w-4 h-4 text-amber-400" /> : <Sun className="w-4 h-4 text-amber-600" />}
            <div>
              <div className="font-bold">Neo-Brutalist Theme</div>
              <div className="text-[10px] text-neutral-500">{darkMode ? 'Dark Warm Paper' : 'Light Bauhaus Paper'}</div>
            </div>
          </div>
          <button
            onClick={toggleDarkMode}
            className="neo-button px-2.5 py-1 rounded text-[11px] font-bold bg-neutral-200 dark:bg-neutral-800"
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Font Scaling */}
        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <div>
              <div className="font-bold">Typography Scale</div>
              <div className="text-[10px] text-neutral-500">Current: {fontScale}</div>
            </div>
          </div>
          <div className="flex gap-1">
            {(['compact', 'normal', 'large'] as const).map((scale) => (
              <button
                key={scale}
                onClick={() => setFontScale(scale)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  fontScale === scale
                    ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black border-transparent font-bold'
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}
              >
                {scale[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* High Contrast */}
        <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            <div>
              <div className="font-bold">High Contrast A11y</div>
              <div className="text-[10px] text-neutral-500">Max border weight</div>
            </div>
          </div>
          <button
            onClick={toggleHighContrast}
            className={`neo-button px-2.5 py-1 rounded text-[11px] font-bold ${
              highContrast ? 'bg-amber-500 text-black' : 'bg-neutral-200 dark:bg-neutral-800'
            }`}
          >
            {highContrast ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>
    </div>
  );
};
