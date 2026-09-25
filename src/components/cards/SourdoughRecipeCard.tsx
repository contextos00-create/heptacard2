import React, { useState } from 'react';
import { Utensils, Timer, Bookmark, Sliders, CheckCircle2, RotateCcw } from 'lucide-react';
import { SourdoughRecipeData } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface Props {
  data: SourdoughRecipeData;
  onOpenDetail?: () => void;
}

export const SourdoughRecipeCard: React.FC<Props> = ({ data, onOpenDetail }) => {
  const { sourdoughLoaves, sourdoughHydration, updateSourdough, toggleBookmark, showToast } = useAppStore();
  const [showCalculator, setShowCalculator] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState<number | null>(null);

  // Baker's percentage math:
  // Base total flour = 500g per loaf (so 2 loaves = 1000g total flour)
  const totalFlour = sourdoughLoaves * 500;
  const breadFlourWeight = Math.round(totalFlour * 0.8);
  const wholeWheatWeight = Math.round(totalFlour * 0.2);
  const waterWeight = Math.round(totalFlour * (sourdoughHydration / 100));
  const leavenWeight = Math.round(totalFlour * 0.2);
  const saltWeight = Math.round(totalFlour * 0.02);

  const calculatedIngredients = [
    { name: 'Bread Flour (King Arthur)', weight: `${breadFlourWeight}g`, pct: '80%' },
    { name: 'Whole Wheat Flour', weight: `${wholeWheatWeight}g`, pct: '20%' },
    { name: 'Water (filtered, 80°F)', weight: `${waterWeight}g`, pct: `${sourdoughHydration}%` },
    { name: 'Mature Leaven (100% hyd)', weight: `${leavenWeight}g`, pct: '20%' },
    { name: 'Fine Sea Salt', weight: `${saltWeight}g`, pct: '2.0%' },
  ];

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

        {/* Metadata subheader */}
        <div className="neo-border rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium mb-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
          <span className="truncate">
            Yield: {sourdoughLoaves} Loaves ({sourdoughLoaves * 425}g) • Hydration: {sourdoughHydration}% • Fermentation: 14 hrs cold retard
          </span>
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center gap-1 text-[11px] font-mono bg-neutral-200 dark:bg-neutral-800 px-2 py-0.5 rounded ml-2 shrink-0 hover:bg-amber-500 hover:text-white transition-colors"
          >
            <Sliders className="w-3 h-3" />
            {showCalculator ? 'Close Calc' : 'Recalculate'}
          </button>
        </div>

        {/* Interactive Baker's Calculator Drawer */}
        {showCalculator && (
          <div className="mb-3.5 p-3 rounded-xl border-2 border-[#1a1a1a] dark:border-neutral-500 bg-[#f4efe5] dark:bg-neutral-800/80 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider">Baker's Ratio Controls:</span>
              <button
                onClick={() => updateSourdough(2, 78)}
                className="text-[10px] underline flex items-center gap-1 text-neutral-600 dark:text-neutral-400"
              >
                <RotateCcw className="w-2.5 h-2.5" /> Reset (2 Loaves / 78%)
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium mb-1">
                  Loaf Yield: <span className="font-bold text-amber-600">{sourdoughLoaves} loaves</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={sourdoughLoaves}
                  onChange={(e) => updateSourdough(parseInt(e.target.value), sourdoughHydration)}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium mb-1">
                  Target Hydration: <span className="font-bold text-amber-600">{sourdoughHydration}%</span>
                </label>
                <input
                  type="range"
                  min="68"
                  max="85"
                  value={sourdoughHydration}
                  onChange={(e) => updateSourdough(sourdoughLoaves, parseInt(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* Two-panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-3.5">
          {/* Left panel: Recipe Table */}
          <div className="neo-border rounded-xl p-3 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div className="overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#1a1a1a] dark:border-neutral-500 text-left font-bold">
                    <th className="pb-1.5 pr-2">[ INGREDIENT</th>
                    <th className="pb-1.5 px-2 text-right">WEIGHT</th>
                    <th className="pb-1.5 pl-2 text-right">BAKER'S % ]</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  {calculatedIngredients.map((item, idx) => (
                    <tr key={idx} className="hover:bg-amber-500/10 transition-colors">
                      <td className="py-1 pr-2 truncate max-w-[140px] text-neutral-800 dark:text-neutral-200">
                        [ {item.name}
                      </td>
                      <td className="py-1 px-2 text-right font-bold text-amber-600 dark:text-amber-400">
                        {item.weight}
                      </td>
                      <td className="py-1 pl-2 text-right text-neutral-600 dark:text-neutral-400">
                        {item.pct} ]
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-2 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex justify-between text-[11px] text-neutral-500">
              <span>Total Dough: {breadFlourWeight + wholeWheatWeight + waterWeight + leavenWeight + saltWeight}g</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">Levain: 100% Hyd</span>
            </div>
          </div>

          {/* Right panel: Timed Procedure Steps */}
          <div className="neo-border rounded-xl p-3.5 bg-[#fbf9f5] dark:bg-neutral-900/40 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-xs sm:text-sm tracking-wider uppercase mb-3 text-[#1a1a1a] dark:text-[#f5f0e8]">
                TIMED PROCEDURE STEPS
              </h3>

              <div className="space-y-2.5">
                {data.procedureSteps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveStepIdx(activeStepIdx === idx ? null : idx)}
                    className={`flex items-start gap-2 text-xs sm:text-[13px] p-1.5 rounded cursor-pointer transition-colors ${
                      activeStepIdx === idx
                        ? 'bg-amber-100 dark:bg-amber-950/60 border border-amber-400'
                        : 'hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <span className="font-bold text-[#1a1a1a] dark:text-amber-400 shrink-0">•</span>
                    <div>
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 mr-1.5">
                        {step.time}:
                      </span>
                      <span className="text-neutral-700 dark:text-neutral-300">{step.step}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-2 border-t border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500 font-medium">Baking: 450°F Dutch Oven</span>
              <button
                onClick={() => showToast('Timer set for 30m stretch & fold cycle', 'info')}
                className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <Timer className="w-3 h-3" /> Set Timer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div className="neo-border rounded-lg px-3 py-2 text-xs font-semibold tracking-wide uppercase mt-3.5 bg-[#f3efe6]/70 dark:bg-neutral-900/50 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs truncate">{data.footer}</span>
        <span className="text-[10px] font-mono text-neutral-500 ml-2">BATCH #24</span>
      </div>
    </article>
  );
};
