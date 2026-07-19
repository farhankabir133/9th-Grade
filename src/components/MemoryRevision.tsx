import React, { useState } from 'react';
import { 
  Sparkles, RefreshCw, AlertTriangle, CheckCircle2, 
  Calendar, Flame, TrendingUp, Zap, ArrowRight, Brain 
} from 'lucide-react';
import { RevisionSchedule } from '../types';

interface MemoryRevisionProps {
  initialItems: RevisionSchedule[];
  onReviewCompleted: (topicId: string, newRetention: number) => void;
}

export default function MemoryRevision({ initialItems, onReviewCompleted }: MemoryRevisionProps) {
  const [items, setItems] = useState<RevisionSchedule[]>(initialItems);
  const [reviewingItem, setReviewingItem] = useState<RevisionSchedule | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState<boolean>(false);

  const handleStartReview = (item: RevisionSchedule) => {
    setReviewingItem(item);
    setSessionSuccess(false);
  };

  const handleSelectDifficulty = (multiplier: number) => {
    if (!reviewingItem) return;
    
    // Simulate updating retention index following memory recall effort
    const newRetention = Math.min(100, Math.round(reviewingItem.retentionProbability + (25 * multiplier)));
    const updatedItems = items.map(it => {
      if (it.id === reviewingItem.id) {
        return {
          ...it,
          urgencyScore: Math.max(10, Math.round(it.urgencyScore - (30 * multiplier))),
          retentionProbability: newRetention,
          daysSinceLastReview: 0,
          historyLength: it.historyLength + 1,
          nextScheduledDate: "In 4 Days"
        };
      }
      return it;
    });

    setItems(updatedItems);
    onReviewCompleted(reviewingItem.id, newRetention);
    setSessionSuccess(true);
    setTimeout(() => {
      setReviewingItem(null);
      setSessionSuccess(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      
      {/* Memory Scientific Overview */}
      <header className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-[#a5b4fc] uppercase bg-indigo-950/40 px-2.5 py-1 rounded border border-indigo-900/40 inline-block">
            HERMANN EBBINGHAUS MATHEMATICAL THEORY
          </span>
          <h2 className="text-2xl font-bold tracking-tight">Active Spaced Memory Revision Queue</h2>
          <p className="text-xs text-slate-400 max-w-xl">
            9Th Grade AI monitors the exact calendar moment your neural retention fades below 60%. Solve quick flashcards to refresh neural connections and push decay triggers forward by 4 days.
          </p>
        </div>

        {/* Global Memory strength */}
        <div className="pt-2 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Global Health Index</span>
            <span className="text-lg font-mono font-bold block text-cyan-400">79.4% Stability</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Active Forgetting Risk</span>
            <span className="text-lg font-mono font-bold block text-rose-400">2 Subjects Expired</span>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 uppercase font-mono">Spaced Interval Tier</span>
            <span className="text-lg font-mono font-bold block text-emerald-400">SuperMemo SM-2 Active</span>
          </div>
        </div>
      </header>

      {/* Main Study Zone */}
      {reviewingItem ? (
        <div className="p-6 rounded-2xl bg-slate-900 border-2 border-indigo-500/30 space-y-6">
          
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-indigo-400 font-semibold flex items-center gap-1.5 animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" /> ENGAGED RECONSTRUCTION DRAFT
            </span>
            <span>Urgency Index: {reviewingItem.urgencyScore}%</span>
          </div>

          <div className="space-y-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded">
              {reviewingItem.subject}
            </span>
            <h3 className="text-lg font-bold leading-snug">
              Active Recall Assessment: <strong className="text-white">"{reviewingItem.topic}"</strong>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              How confidently were you able to recall the rules, constitutional details, or formulas associated with this competitive topic without checking external materials?
            </p>
          </div>

          {sessionSuccess ? (
            <div className="p-4 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 rounded-xl text-center text-xs animate-fadeIn">
              🎉 Recall updated successfully! Neural forgetting curve has been delayed.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleSelectDifficulty(0.4)}
                className="p-4 rounded-xl bgs bg-slate-950 hover:bg-rose-950/30 border border-slate-800 hover:border-rose-900 text-center space-y-1 transition-all"
              >
                <span className="text-rose-400 font-bold block text-sm">Difficult / Forgot</span>
                <span className="text-[10px] text-slate-500 block">Restores retention marginally</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDifficulty(1.0)}
                className="p-4 rounded-xl bg-slate-950 hover:bg-cyan-950/30 border border-slate-800 hover:border-cyan-900 text-center space-y-1 transition-all"
              >
                <span className="text-cyan-400 font-bold block text-sm">Correct After Effort</span>
                <span className="text-[10px] text-slate-500 block">Optimal spaced interval recovery</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectDifficulty(1.5)}
                className="p-4 rounded-xl bg-slate-950 hover:bg-emerald-950/30 border border-slate-800 hover:border-emerald-900 text-center space-y-1 transition-all"
              >
                <span className="text-emerald-400 font-bold block text-sm">Perfect Recall</span>
                <span className="text-[10px] text-slate-500 block">Exponential interval multiplier</span>
              </button>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button 
              onClick={() => setReviewingItem(null)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel recall diagnostic
            </button>
          </div>

        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Expired Items listing */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-805 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Neural Decay Queue</h3>
              <p className="text-xs text-slate-500">Subjects requiring urgent cognitive commitment</p>
            </div>

            <div className="space-y-2.5">
              {items.map((item) => {
                const isUrgent = item.urgencyScore > 50;
                return (
                  <div 
                    key={item.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all ${
                      isUrgent ? 'bg-slate-950/90 border-rose-500/20' : 'bg-slate-950/40 border-slate-900 opacity-70'
                    }`}
                  >
                    <div className="space-y-1 select-none flex-1 truncate">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-rose-400 animate-pulse' : 'bg-slate-700'}`} />
                        <span className="text-xs font-semibold text-slate-200 truncate">{item.topic}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                        <span>{item.subject}</span>
                        <span>•</span>
                        <span>{item.historyLength} recalls</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right flex-shrink-0">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Retention</span>
                        <span className={`text-xs font-mono font-bold ${item.retentionProbability > 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.retentionProbability}%
                        </span>
                      </div>

                      <button
                        onClick={() => handleStartReview(item)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-0.5 ${
                          isUrgent 
                            ? 'bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-slate-950 border border-rose-500/20' 
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                        }`}
                      >
                        Recall
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Interactive Spaced repetition simulation calculator */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Personal Memory Decay Simulator</h3>
              <p className="text-xs text-slate-500">Calculate how many days your memory remains structured at different study frequencies</p>
            </div>

            {/* Simulated curve inputs */}
            <div className="space-y-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-2">
                <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-mono">SIMULATED DECAY PREDICTION RATE</span>
                <p className="text-xs text-slate-300 font-medium">
                  At your current interval frequency of <strong className="text-cyan-400">2.4 reviews/week</strong>, average syllabus structures disintegrate in <strong className="text-yellow-400">14.2 Days</strong>.
                </p>
                <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-rose-500 to-yellow-500 h-full w-[65%]" />
                </div>
              </div>

              <div className="p-4 bg-indigo-950/20 border border-indigo-900/30 rounded-xl space-y-2">
                <span className="text-[10px] text-[#a5b4fc] uppercase tracking-widest block font-mono">FORGETTING INTERMITTENT MULTIPLIERS</span>
                <ul className="text-[11px] text-slate-400 space-y-1.5 leading-relaxed">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> No recall effort: 100% decaying down to 20% in 48 hours.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full" /> Simple reading reviews: Retention duration stretches to 5 Days.
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Active Spaced Callbacks (SuperMemo): Retention duration expands to <strong className="text-emerald-400">28+ Days</strong>!
                  </li>
                </ul>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
