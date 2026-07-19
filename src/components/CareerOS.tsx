import React, { useState } from 'react';
import { 
  Sparkles, Calendar, BookOpen, Clock, Award, 
  ArrowUpRight, Target, Compass, Bell, CheckCircle2 
} from 'lucide-react';
import { Circular } from '../types';

interface CareerOSProps {
  circulars: Circular[];
}

export default function CareerOS({ circulars }: CareerOSProps) {
  const [selectedCir, setSelectedCir] = useState<Circular | null>(circulars[0] || null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn text-slate-100">
      
      {/* Target Timeline Grid - 7 Columns */}
      <div className="lg:col-span-8 space-y-6">
        
        <header className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider font-mono text-cyan-400">
            Government Job Registry & Exam Circulars
          </h3>
          <p className="text-xs text-slate-500">
            Real time alerts retrieved from Bangladesh Gazettes, Ministry releases, and major board circulars.
          </p>
        </header>

        {/* Circular Checklist Map */}
        <div className="space-y-3">
          {circulars.map((job) => (
            <div 
              key={job.id}
              onClick={() => setSelectedCir(job)}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                selectedCir?.id === job.id 
                  ? 'bg-slate-900 border-cyan-400/50' 
                  : 'bg-slate-900/40 border-slate-900 hover:border-slate-800'
              }`}
            >
              <div className="space-y-1 select-none flex-1 truncate">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-xs font-bold text-slate-200">{job.title}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                  <span>{job.organization}</span>
                  <span>•</span>
                  <span>{job.vacancyCount.toLocaleString()} Slots Available</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-[9px] text-slate-500 uppercase font-mono block">Deadline</span>
                  <span className="text-xs text-rose-300 font-mono font-bold">
                    {job.countdownDays} Days Left
                  </span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-500" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Syllabus decomposition and requirements - 4 Columns */}
      <div className="lg:col-span-4 space-y-6">
        {selectedCir ? (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 animate-fadeIn">
            
            {/* Quick Header */}
            <div className="space-y-2">
              <span className="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/30 uppercase font-mono font-semibold">
                Syllabus blueprint
              </span>
              <h4 className="text-base font-bold text-white leading-snug">{selectedCir.title}</h4>
              <p className="text-[11px] text-slate-500">{selectedCir.organization}</p>
            </div>

            <div className="w-[1px] h-6 bg-slate-800" />

            {/* Step components */}
            <div className="space-y-4">
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono block font-semibold">
                Syllabus milestones checklist
              </span>

              <div className="space-y-2 text-xs">
                {selectedCir.syllabusOverview.map((item, idx) => (
                  <div key={idx} className="flex gap-2.5 p-3 rounded-lg bg-slate-950 border border-slate-850">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block text-slate-300">Phase {idx + 1}</span>
                      <p className="text-[11px] text-slate-400 leading-normal mt-0.5">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification alert */}
            <div className="p-3.5 bg-indigo-950/20 border border-indigo-900/30 rounded-xl text-xs flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-400 flex-shrink-0 animate-bounce" />
              <span className="text-[11px] text-slate-300">Countdown reminders mapped inside Google calendars.</span>
            </div>

          </div>
        ) : (
          <div className="text-center p-8 bg-slate-900 rounded-2xl border border-slate-800 text-xs text-slate-500">
            Select a job circular registry to analyze syllabus decompositions.
          </div>
        )}
      </div>

    </div>
  );
}
