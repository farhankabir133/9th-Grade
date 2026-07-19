import React from 'react';
import { 
  Sparkles, Award, Target, Flame, Compass, 
  MapPin, UserCheck, Clock, Users, ShieldAlert 
} from 'lucide-react';
import { UserProfile } from '../types';
import Achievements from './Achievements';

interface ProfileIdentityProps {
  profile: UserProfile;
}

export default function ProfileIdentity({ profile }: ProfileIdentityProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn text-slate-100">
      
      {/* Target Left Column Profile Overview - 4 Columns */}
      <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-6">
        
        <div className="space-y-4 text-center">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-950" />
            <div className="absolute inset-0 rounded-full border-4 border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '30s' }} />
            <div className="w-20 h-20 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/10">
              <span className="text-2xl font-bold tracking-widest text-slate-950 font-sans">
                {profile.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold">{profile.name}</h3>
            <span className="text-[10px] font-mono uppercase bg-cyan-950 text-cyan-400 px-2.5 py-0.5 rounded border border-cyan-800/30">
              {profile.archetype}
            </span>
            <p className="text-xs text-slate-500 flex items-center gap-1 justify-center pt-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {profile.district} District • {profile.phone}
            </p>
          </div>
        </div>

        {/* XP Progress bar */}
        <div className="space-y-2 p-4 bg-slate-950/60 rounded-xl border border-slate-850">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Level {profile.level}</span>
            <span className="font-mono text-cyan-400 font-bold">{profile.xp} / 5,000 XP</span>
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full w-[65%]" />
          </div>
          <span className="text-[9px] text-slate-500 block text-right">3,250 XP remaining until next level upgrade</span>
        </div>

        {/* Quick statistics checklist */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between text-xs border-b border-slate-850 pb-2">
            <span className="text-slate-500">Target Syllabus Exam:</span>
            <span className="font-semibold">{profile.examType} Pre-Selection</span>
          </div>
          <div className="flex justify-between text-xs border-b border-slate-850 pb-2">
            <span className="text-slate-500">Streak Period Rank:</span>
            <span className="font-semibold">💧 {profile.streak} Days Active</span>
          </div>
          <div className="flex justify-between text-xs border-b border-indigo-950/40 pb-2">
            <span className="text-slate-500">Cognitive style bias:</span>
            <span className="font-semibold capitalize text-indigo-300">{profile.learningStyle} analytical</span>
          </div>
        </div>

      </div>

      {/* Target Right Column Achieved Medals / Badges - 8 Columns */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Achievements list */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
          <Achievements profile={profile} />
        </div>

        {/* Local District cohort rankings analysis */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-200">My Regional Cohort Metrics</h4>
            <p className="text-xs text-slate-500">Preparation diagnostics cross-analyzed against peers in your local district</p>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3 font-mono text-xs text-slate-400">
            <div className="flex justify-between">
              <span>Peers in {profile.district} district</span>
              <span className="text-slate-200">12,430 Aspirants</span>
            </div>
            <div className="flex justify-between">
              <span>My local district percentage ranking</span>
              <span className="text-emerald-400">Top 4.2% (Elite Cohort)</span>
            </div>
            <div className="flex justify-between">
              <span>District median syllabus accuracy rate</span>
              <span className="text-slate-300">64.5%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
