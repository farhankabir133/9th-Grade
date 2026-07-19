import React from 'react';
import { motion } from 'motion/react';
import { 
  Award, Flame, Compass, Target, ShieldAlert, 
  Sparkles, CheckCircle, Lock, TrendingUp, Zap, ZapOff, Play
} from 'lucide-react';
import { UserProfile } from '../types';

interface AchievementBadge {
  id: string;
  name: string;
  bnName: string;
  description: string;
  bnDescription: string;
  category: 'streak' | 'rank' | 'level' | 'score' | 'style';
  requirementText: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  bgGlowClass: string;
  isUnlocked: (profile: UserProfile) => boolean;
  getProgress: (profile: UserProfile) => { current: number; target: number; percent: number };
}

export const badgesList: AchievementBadge[] = [
  {
    id: 'streak_10',
    name: '10-Day Streak',
    bnName: '১০-দিনের অবিরাম ধারা',
    description: 'Maintain an unbroken learning pattern for 10 or more days to solidify knowledge acquisition.',
    bnDescription: 'টানা ১০ বা তার বেশি দিন সেশন সচল রাখুন।',
    category: 'streak',
    requirementText: 'Maintain active learning streak of 10+ days',
    icon: Flame,
    colorClass: 'text-amber-500 border-amber-500/30 bg-amber-950/20',
    bgGlowClass: 'from-amber-500/10 via-amber-600/5 to-transparent',
    isUnlocked: (profile) => profile.streak >= 10,
    getProgress: (profile) => ({
      current: profile.streak,
      target: 10,
      percent: Math.min(100, (profile.streak / 10) * 100),
    }),
  },
  {
    id: 'top_5_percent',
    name: 'Top 5% Rank Elite',
    bnName: 'শীর্ষ ৫% র‍্যাংক এলিট',
    description: 'Reach a projected placement rank within the top 5% of national cadres.',
    bnDescription: 'জাতীয় পর্যায়ে শীর্ষ ৫% প্রাক-নির্বাচন অবস্থানে পৌঁছান।',
    category: 'rank',
    requirementText: 'Projected rank within top 5% of overall cohort',
    icon: Award,
    colorClass: 'text-cyan-400 border-cyan-400/30 bg-cyan-950/20',
    bgGlowClass: 'from-cyan-400/10 via-cyan-500/5 to-transparent',
    isUnlocked: (profile) => (profile.predictedRank / profile.totalStudents) <= 0.05,
    getProgress: (profile) => {
      const currentPercentile = (1 - (profile.predictedRank / profile.totalStudents)) * 100;
      return {
        current: Math.round(currentPercentile * 10) / 10,
        target: 95,
        percent: Math.min(100, (currentPercentile / 95) * 100),
      };
    },
  },
  {
    id: 'level_5_master',
    name: 'Level 5 Master',
    bnName: 'লেভেল ৫ মাস্টার',
    description: 'Level up your experience points past the early Cadet grades to achieve deep mastery.',
    bnDescription: 'লেভেল ৫ অর্জনের মাধ্যমে দক্ষ গ্র্যাজুয়েট স্তরে উন্নীত হোন।',
    category: 'level',
    requirementText: 'Reach User Level 5',
    icon: Target,
    colorClass: 'text-indigo-400 border-indigo-400/30 bg-indigo-950/20',
    bgGlowClass: 'from-indigo-400/10 via-indigo-500/5 to-transparent',
    isUnlocked: (profile) => profile.level >= 5,
    getProgress: (profile) => ({
      current: profile.level,
      target: 5,
      percent: Math.min(100, (profile.level / 5) * 100),
    }),
  },
  {
    id: 'consistency_90',
    name: 'Consistency Master',
    bnName: 'স্থায়িত্ব ও ধারাবাহিকতা গুরু',
    description: 'Preserve high mental sharpness and steady preparation above 90% accuracy consistency.',
    bnDescription: 'সপ্তাহ জুড়েই ৯০% এর অধিক ধারাবাহিকতা স্কোরের ছন্দ বজায় রাখুন।',
    category: 'score',
    requirementText: 'Maintain consistency rating above 90%',
    icon: Compass,
    colorClass: 'text-emerald-400 border-emerald-400/30 bg-emerald-950/20',
    bgGlowClass: 'from-emerald-400/10 via-emerald-500/5 to-transparent',
    isUnlocked: (profile) => profile.consistencyScore >= 90,
    getProgress: (profile) => ({
      current: profile.consistencyScore,
      target: 90,
      percent: Math.min(100, (profile.consistencyScore / 90) * 100),
    }),
  },
  {
    id: 'readiness_80',
    name: 'High Flyer',
    bnName: 'উচ্চাকাঙ্ক্ষী এলিট',
    description: 'Secure an overall AI-generated pre-selection readiness score of 80% or greater.',
    bnDescription: 'প্রস্তুতি সূচকে ৮০% এর উপরে সামগ্রিক যোগ্যতা অর্জন করুন।',
    category: 'score',
    requirementText: 'Reach preparation readiness index of 80%+',
    icon: Sparkles,
    colorClass: 'text-purple-400 border-purple-400/30 bg-purple-950/20',
    bgGlowClass: 'from-purple-400/10 via-purple-500/5 to-transparent',
    isUnlocked: (profile) => profile.readinessScore >= 80,
    getProgress: (profile) => ({
      current: profile.readinessScore,
      target: 80,
      percent: Math.min(100, (profile.readinessScore / 80) * 100),
    }),
  },
  {
    id: 'analytical_architect',
    name: 'Analytical Architect',
    bnName: 'বিশ্লেষণাত্মক স্থপতি',
    description: 'Maintain a distinct cognitive style bias in system diagnostics focusing on logic patterns.',
    bnDescription: 'সিস্টেমে লজিক ও প্রমাণের ভিত্তিতে বিশ্লেষণাত্মক মানসিকতা প্রদর্শন করুন।',
    category: 'style',
    requirementText: "Have 'analytical' designated learning profile bias",
    icon: ShieldAlert,
    colorClass: 'text-rose-400 border-rose-400/30 bg-rose-950/20',
    bgGlowClass: 'from-rose-400/10 via-rose-500/5 to-transparent',
    isUnlocked: (profile) => profile.learningStyle === 'analytical',
    getProgress: (profile) => ({
      current: profile.learningStyle === 'analytical' ? 1 : 0,
      target: 1,
      percent: profile.learningStyle === 'analytical' ? 100 : 0,
    }),
  },
];

interface AchievementsProps {
  profile: UserProfile;
}

export default function Achievements({ profile }: AchievementsProps) {
  const unlockedCount = badgesList.filter(badge => badge.isUnlocked(profile)).length;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-200">Personal OS Milestones & Achievements</h4>
          <p className="text-xs text-slate-500">Interactive telemetry tracking your real-time academic progression</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400">
              Unlocked: <span className="text-cyan-400 font-bold">{unlockedCount} / {badgesList.length}</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {badgesList.map((badge) => {
          const unlocked = badge.isUnlocked(profile);
          const progress = badge.getProgress(profile);
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.015, translateY: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className={`p-4 rounded-2xl border transition-all relative overflow-hidden group flex flex-col justify-between h-44 cursor-pointer ${
                unlocked 
                  ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700/80' 
                  : 'bg-slate-950/40 border-slate-900/80 opacity-60 hover:opacity-80'
              }`}
            >
              {/* Radial backdrop glow on hover */}
              <div className={`absolute -right-12 -top-12 w-32 h-32 bg-gradient-to-br ${badge.bgGlowClass} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

              <div className="flex items-start gap-3.5 relative z-10">
                <div className={`p-3 rounded-xl border transition-transform duration-300 group-hover:scale-110 ${badge.colorClass}`}>
                  <Icon className="w-5 h-5" />
                </div>
                
                <div className="space-y-1 select-none">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-black text-slate-200">{badge.name}</span>
                    <span className="text-[9px] font-mono font-medium text-slate-500">{badge.bnName}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal font-sans line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              </div>

              {/* Progress Tracker Footer */}
              <div className="space-y-2 pt-4 border-t border-slate-950/40 relative z-10 select-none">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-medium">
                    {badge.requirementText}
                  </span>
                  <span className={`font-mono font-bold ${unlocked ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {unlocked ? (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> UNLOCKED
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-600" /> {Math.round(progress.percent)}%
                      </span>
                    )}
                  </span>
                </div>
                
                {/* Micro Progress Bar */}
                <div className="w-full bg-slate-950/80 h-1.5 rounded-full overflow-hidden border border-slate-900">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress.percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full bg-gradient-to-r ${
                      unlocked 
                        ? 'from-cyan-400 to-indigo-500' 
                        : 'from-slate-700 to-slate-800'
                    }`} 
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
