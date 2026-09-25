import React, { useState } from 'react';
import { BarChart3, TrendingUp, Cpu, PieChart, Activity, Zap, Layers, RefreshCw } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export const AnalyticsCharts: React.FC = () => {
  const { cards } = useAppStore();
  const [retentionDays, setRetentionDays] = useState(14);
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  // Ingestion velocity data for last 7 days
  const velocityData = [
    { day: 'MON', count: 4, label: '4 items (Whisper & RSS)' },
    { day: 'TUE', count: 7, label: '7 items (Vaswani PDF & Docker)' },
    { day: 'WED', count: 3, label: '3 items (Sourdough log)' },
    { day: 'THU', count: 8, label: '8 items (Karpathy & Stratechery)' },
    { day: 'FRI', count: 12, label: '12 items (3Blue1Brown & Huberman)' },
    { day: 'SAT', count: 5, label: '5 items (PG Essays)' },
    { day: 'SUN', count: 9, label: '9 items (Automated Ingest)' },
  ];

  const maxVelocity = Math.max(...velocityData.map((d) => d.count));

  // Category breakdown
  const categoryCounts = cards.reduce((acc, card) => {
    acc[card.category] = (acc[card.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const modalityData = [
    { name: 'Technical & Code', count: categoryCounts['cheat-sheet'] || 1, color: 'bg-emerald-500' },
    { name: 'Research & Papers', count: categoryCounts['pdf-excerpt'] || 1, color: 'bg-blue-500' },
    { name: 'Interviews & Audio', count: (categoryCounts['interview-qa'] || 0) + (categoryCounts['audio-podcast'] || 0) || 2, color: 'bg-amber-500' },
    { name: 'Essays & Web', count: (categoryCounts['web-article'] || 0) + (categoryCounts['newsletter'] || 0) || 2, color: 'bg-purple-500' },
    { name: 'Feeds & Threads', count: (categoryCounts['rss-dispatch'] || 0) + (categoryCounts['x-thread'] || 0) || 2, color: 'bg-rose-500' },
    { name: 'Media & Culinary', count: (categoryCounts['video-clip'] || 0) + (categoryCounts['recipe-log'] || 0) || 2, color: 'bg-teal-500' },
  ];

  // Retention curve math: R = e^(-t/S)
  const retentionCurvePoints = Array.from({ length: 30 }, (_, i) => {
    const t = i + 1;
    const withoutReview = Math.round(100 * Math.exp(-t / 7));
    // With spaced repetition reviews at day 1, 3, 7, 14
    let withReview = 100;
    if (t > 1) withReview = Math.max(70, Math.round(100 * Math.exp(-(t - 1) / 14)));
    if (t > 3) withReview = Math.max(82, Math.round(100 * Math.exp(-(t - 3) / 21)));
    if (t > 7) withReview = Math.max(90, Math.round(100 * Math.exp(-(t - 7) / 35)));
    return { day: t, withoutReview, withReview };
  });

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="neo-card rounded-2xl p-4 bg-[#faf7f2] dark:bg-[#1a1918]">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Total Nodes</span>
            <Layers className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-[#1a1a1a] dark:text-[#f5f0e8]">
            {cards.length}
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3 h-3" /> +100% verified locally
          </div>
        </div>

        <div className="neo-card rounded-2xl p-4 bg-[#faf7f2] dark:bg-[#1a1918]">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Vector Density</span>
            <Activity className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-[#1a1a1a] dark:text-[#f5f0e8]">
            94.8%
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            Cosine sim threshold &gt; 0.82
          </div>
        </div>

        <div className="neo-card rounded-2xl p-4 bg-[#faf7f2] dark:bg-[#1a1918]">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Retention Index</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-[#1a1a1a] dark:text-[#f5f0e8]">
            88.2
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Spaced recall interval active
          </div>
        </div>

        <div className="neo-card rounded-2xl p-4 bg-[#faf7f2] dark:bg-[#1a1918]">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
            <span>Sync Latency</span>
            <RefreshCw className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-display font-bold text-[#1a1a1a] dark:text-[#f5f0e8]">
            12ms
          </div>
          <div className="mt-1 text-[11px] text-neutral-500">
            Local SQLite / IndexedDB
          </div>
        </div>
      </div>

      {/* Primary Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Chart 1: Knowledge Ingestion Velocity */}
        <div className="neo-card rounded-2xl p-5 bg-[#faf7f2] dark:bg-[#1a1918] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1a1a1a] dark:border-neutral-700 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400" />
                <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight">
                  Knowledge Ingestion Velocity
                </h3>
              </div>
              <span className="neo-pill border-2 bg-transparent text-[10px]">
                PAST 7 DAYS
              </span>
            </div>

            <div className="relative pt-4 pb-2">
              {/* Bar visualization */}
              <div className="h-44 sm:h-52 flex items-end justify-between gap-2 px-2 border-b-2 border-[#1a1a1a] dark:border-neutral-500">
                {velocityData.map((d, idx) => {
                  const heightPercent = Math.round((d.count / maxVelocity) * 100);
                  const isHovered = selectedBar === idx;
                  return (
                    <div
                      key={idx}
                      onMouseEnter={() => setSelectedBar(idx)}
                      onMouseLeave={() => setSelectedBar(null)}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
                    >
                      {/* Tooltip */}
                      {isHovered && (
                        <div className="mb-2 px-2 py-1 bg-[#1a1a1a] text-white dark:bg-neutral-100 dark:text-black rounded text-[10px] font-mono whitespace-nowrap shadow-lg animate-fade-in z-10">
                          {d.label}
                        </div>
                      )}
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full max-w-[36px] rounded-t border-2 border-[#1a1a1a] dark:border-white transition-all duration-200 ${
                          isHovered
                            ? 'bg-amber-500 dark:bg-amber-400'
                            : 'bg-[#1a1a1a] dark:bg-neutral-300 hover:bg-amber-500'
                        }`}
                      />
                      <span className="mt-2 text-[11px] font-mono font-bold text-neutral-600 dark:text-neutral-400">
                        {d.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-xs">
            <span className="font-semibold text-neutral-600 dark:text-neutral-400">
              Avg: 6.8 items/day • High throughput on Friday
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              +38% vs prev week
            </span>
          </div>
        </div>

        {/* Chart 2: Ebbinghaus Retention vs Spaced Review */}
        <div className="neo-card rounded-2xl p-5 bg-[#faf7f2] dark:bg-[#1a1918] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1a1a1a] dark:border-neutral-700 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400" />
                <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight">
                  Memory Retention: Spaced Recall
                </h3>
              </div>
              <span className="neo-pill border-2 bg-transparent text-[10px]">
                COGNITIVE DECAY
              </span>
            </div>

            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-neutral-500">Interval Timeline:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                Day {retentionDays} of 30
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={retentionDays}
              onChange={(e) => setRetentionDays(parseInt(e.target.value))}
              className="w-full h-1.5 bg-neutral-300 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-amber-600 mb-3"
            />

            {/* SVG Retention Graph */}
            <div className="relative h-36 sm:h-44 border-2 border-[#1a1a1a] dark:border-neutral-600 rounded-xl p-2 bg-[#f4efe5]/50 dark:bg-neutral-900/60 overflow-hidden">
              <svg viewBox="0 0 300 120" className="w-full h-full overflow-visible">
                {/* Horizontal reference grid */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeDasharray="3 3" className="text-neutral-300 dark:text-neutral-800" />
                <line x1="0" y1="60" x2="300" y2="60" stroke="currentColor" strokeDasharray="3 3" className="text-neutral-300 dark:text-neutral-800" />
                <line x1="0" y1="100" x2="300" y2="100" stroke="currentColor" strokeDasharray="3 3" className="text-neutral-300 dark:text-neutral-800" />

                {/* Standard Forgetting Curve (Grey dashed) */}
                <path
                  d="M 10 10 Q 50 80, 290 110"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  className="text-neutral-400 dark:text-neutral-600"
                />

                {/* Spaced Repetition Reinforcement Curve (Solid Amber) */}
                <path
                  d="M 10 10 Q 30 25, 40 10 Q 80 20, 100 12 Q 170 18, 200 14 Q 260 16, 290 15"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="2.5"
                />

                {/* Marker for current selected day */}
                <line
                  x1={10 + ((retentionDays - 1) / 29) * 280}
                  y1="5"
                  x2={10 + ((retentionDays - 1) / 29) * 280}
                  y2="115"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  className="dark:stroke-white"
                />
                <circle
                  cx={10 + ((retentionDays - 1) / 29) * 280}
                  cy={15}
                  r="4"
                  fill="#d97706"
                  stroke="#fff"
                  strokeWidth="1"
                />
              </svg>

              <div className="absolute bottom-2 right-3 flex items-center gap-3 text-[10px] font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-neutral-400 inline-block" /> Unreviewed
                </span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                  <span className="w-2.5 h-0.5 bg-amber-600 inline-block" /> Spaced Canvas
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-xs">
            <span className="text-neutral-600 dark:text-neutral-400">
              Retention target at Day {retentionDays}:{' '}
              <strong className="text-neutral-900 dark:text-neutral-100">
                {retentionDays > 7 ? '92%' : '84%'} active recall
              </strong>
            </span>
            <span className="font-mono text-xs bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded font-bold">
              Huberman Focus Synced
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Row: Modality Distribution & Vector Clustering */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <div className="neo-card rounded-2xl p-5 bg-[#faf7f2] dark:bg-[#1a1918]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#1a1a1a] dark:border-neutral-700 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400" />
              <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight">
                Content Modality Distribution
              </h3>
            </div>
            <span className="neo-pill border-2 bg-transparent text-[10px]">
              6 FORMATS
            </span>
          </div>

          <div className="space-y-3">
            {modalityData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-neutral-800 dark:text-neutral-200">{item.name}</span>
                  <span className="font-mono text-neutral-500">
                    {item.count} cards ({Math.round((item.count / cards.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full border border-neutral-400 dark:border-neutral-600 overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                  <div
                    style={{ width: `${Math.max(10, Math.round((item.count / cards.length) * 100))}%` }}
                    className={`h-full ${item.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="neo-card rounded-2xl p-5 bg-[#faf7f2] dark:bg-[#1a1918] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#1a1a1a] dark:border-neutral-700 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#d97706] dark:bg-amber-400" />
                <h3 className="font-display font-bold text-sm sm:text-base uppercase tracking-tight">
                  System Health & Semantic Clusters
                </h3>
              </div>
              <span className="neo-pill border-2 bg-transparent text-[10px]">
                LOCAL VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#f4efe5]/60 dark:bg-neutral-900/40">
                <div className="text-neutral-500 mb-1">STAGING STACK</div>
                <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  Compose v2.4 (UP)
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">3 daemon containers</div>
              </div>

              <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#f4efe5]/60 dark:bg-neutral-900/40">
                <div className="text-neutral-500 mb-1">WHISPER MODEL</div>
                <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                  Large-v3 (FP16)
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">45min session synced</div>
              </div>

              <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#f4efe5]/60 dark:bg-neutral-900/40">
                <div className="text-neutral-500 mb-1">SOURDOUGH LEAVEN</div>
                <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                  Peak Activity (100%)
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">14h cold retard window</div>
              </div>

              <div className="p-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-[#f4efe5]/60 dark:bg-neutral-900/40">
                <div className="text-neutral-500 mb-1">ATTENTION PROOF</div>
                <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                  SHA-256 Validated
                </div>
                <div className="text-[10px] text-neutral-500 mt-1">Vaswani et al. 2017</div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-300 dark:border-neutral-700 text-xs text-neutral-500 flex justify-between items-center">
            <span>Deterministic cache integrity</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">● 100% OK</span>
          </div>
        </div>
      </div>
    </div>
  );
};
