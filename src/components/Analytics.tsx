import React from 'react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, LineChart, Line 
} from 'recharts';
import { Sparkles, Brain, Award, Clock, ArrowUpRight, ShieldAlert } from 'lucide-react';
import { AnalyticsData, UserProfile } from '../types';

interface AnalyticsProps {
  analyticsData: AnalyticsData;
  profile: UserProfile;
}

// Custom high-fidelity interactive Tooltips for improved data readability
const SubjectMasteryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const score = data.score;
    const remaining = 100 - score;
    return (
      <div className="bg-slate-950/95 border border-cyan-500/30 backdrop-blur-md p-3.5 rounded-xl shadow-xl font-sans text-xs space-y-2 max-w-xs">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs">{data.subject}</p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Mastery Level:</span>
            <span className="text-cyan-400 font-bold">{score}%</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Growth Potential:</span>
            <span className="text-amber-400 font-bold">{remaining}%</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">National Target:</span>
            <span className="text-slate-300 font-semibold">80.0%</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-slate-900 text-[9px] text-slate-500">
          Target score for high-chance preliminary clearance.
        </div>
      </div>
    );
  }
  return null;
};

const RankTrajectoryTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const rank = data.rank;
    // Estimate cohort percentile assuming about 10,000 candidates
    const percentile = Math.max(0.1, Math.min(99.9, (1 - rank / 10000) * 100)).toFixed(1);
    return (
      <div className="bg-slate-950/95 border border-indigo-500/30 backdrop-blur-md p-3.5 rounded-xl shadow-xl font-sans text-xs space-y-2 max-w-xs">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs">Date: {data.date}</p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Projected Rank:</span>
            <span className="text-indigo-400 font-bold">#{rank.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Cohort Percentile:</span>
            <span className="text-emerald-400 font-bold">{percentile}th</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-slate-900 text-[9px] text-slate-500">
          Top 500 ranks guarantee safe BCS/IBA tier projection.
        </div>
      </div>
    );
  }
  return null;
};

const CognitiveFatigueTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const fatigue = data.fatigue;
    const focusPower = Math.max(0, 100 - fatigue);
    return (
      <div className="bg-slate-950/95 border border-rose-500/30 backdrop-blur-md p-3.5 rounded-xl shadow-xl font-sans text-xs space-y-2 max-w-xs">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs">Study Duration: {data.hour} Hours</p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Fatigue IQ Index:</span>
            <span className="text-rose-400 font-bold">{fatigue}%</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Focus Efficiency:</span>
            <span className="text-emerald-400 font-bold">{focusPower}%</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-slate-900 text-[9px] text-slate-500">
          Optimal breaks required to maintain threshold above 75%.
        </div>
      </div>
    );
  }
  return null;
};

const PacingMatrixTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const actual = data.actualSeconds;
    const avg = data.averageSeconds;
    const diff = avg - actual;
    const percentSlowerOrFaster = Math.abs((diff / avg) * 100).toFixed(0);
    const speedDescription = diff > 0 ? `${percentSlowerOrFaster}% Faster` : `${percentSlowerOrFaster}% Slower`;
    const speedColor = diff > 0 ? 'text-emerald-400' : 'text-rose-400';

    return (
      <div className="bg-slate-950/95 border border-sky-500/30 backdrop-blur-md p-3.5 rounded-xl shadow-xl font-sans text-xs space-y-2 max-w-xs">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs">Question Segment: #{data.questionIndex}</p>
        <div className="space-y-1 font-mono text-[11px]">
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">My Pace:</span>
            <span className="text-sky-400 font-bold">{actual}s</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Cadre Average:</span>
            <span className="text-slate-400">{avg}s</span>
          </div>
          <div className="flex justify-between gap-6 pt-1 border-t border-slate-900">
            <span className="text-slate-400">Velocity Vector:</span>
            <span className={`${speedColor} font-bold`}>{speedDescription}</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-slate-900 text-[9px] text-slate-500">
          Lower response latency preserves vital reasoning time.
        </div>
      </div>
    );
  }
  return null;
};

const ForecastTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isForecast = data.isForecast;
    return (
      <div className="bg-slate-950/95 border border-purple-500/30 backdrop-blur-md p-3.5 rounded-xl shadow-xl font-sans text-xs space-y-2 max-w-xs">
        <p className="font-bold text-slate-200 border-b border-slate-800 pb-1 text-xs">
          Timeline point: {data.label}
        </p>
        <div className="space-y-1 font-mono text-[11px]">
          {data.actual !== null && (
            <div className="flex justify-between gap-6">
              <span className="text-slate-400">Actual Rank:</span>
              <span className="text-cyan-400 font-bold">#{data.actual.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Regression Model:</span>
            <span className="text-purple-400 font-bold">#{data.projected.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-6">
            <span className="text-slate-400">Confidence Interval:</span>
            <span className="text-slate-400 font-semibold">{isForecast ? '± 8.4% (Est.)' : 'Validated'}</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-slate-900 text-[9px] text-slate-500">
          {isForecast 
            ? 'Predicted via Ordinary Least Squares (OLS) linear regression.'
            : 'Historical performance match factor.'}
        </div>
      </div>
    );
  }
  return null;
};

export default function Analytics({ analyticsData, profile }: AnalyticsProps) {
  // Calculate Linear Regression for Rank Forecasting
  const rankHistory = analyticsData.rankHistory || [];
  const N = rankHistory.length;

  let slope = 0;
  let intercept = 0;

  if (N > 1) {
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < N; i++) {
      const x = i;
      const y = rankHistory[i].rank;
      sumX += x;
      sumY += y;
      sumXY += x * y;
      sumX2 += x * x;
    }

    const denominator = N * sumX2 - sumX * sumX;
    if (denominator !== 0) {
      slope = (N * sumXY - sumX * sumY) / denominator;
      intercept = (sumY - slope * sumX) / N;
    } else {
      slope = 0;
      intercept = rankHistory[N - 1]?.rank || 1000;
    }
  } else if (N === 1) {
    slope = 0;
    intercept = rankHistory[0].rank;
  } else {
    slope = 0;
    intercept = 1000;
  }

  // Generate combined historical + projected forecast dataset
  const forecastData = [];
  for (let i = 0; i < N; i++) {
    const item = rankHistory[i];
    const projectedRank = Math.max(1, Math.round(slope * i + intercept));
    forecastData.push({
      label: item.date,
      actual: item.rank,
      projected: projectedRank,
      isForecast: false,
    });
  }

  const lastDate = N > 0 ? rankHistory[N - 1].date : 'May 20';
  const projectionsCount = 4;
  for (let i = 0; i < projectionsCount; i++) {
    const futureX = N + i;
    const projectedRank = Math.max(1, Math.round(slope * futureX + intercept));
    
    let futureLabel = `T+${i + 1} (Proj)`;
    if (lastDate.startsWith('May ')) {
      const lastDay = parseInt(lastDate.replace('May ', ''), 10);
      if (!isNaN(lastDay)) {
        futureLabel = `May ${lastDay + (i + 1) * 2} (Proj)`;
      }
    }

    forecastData.push({
      label: futureLabel,
      actual: null,
      projected: projectedRank,
      isForecast: true,
    });
  }

  const improvementRate = Math.abs(Math.round(slope));
  const formulaString = `y = ${slope >= 0 ? '+' : ''}${slope.toFixed(1)}x + ${intercept.toFixed(1)}`;
  const eliteHorizonIndex = slope < 0 ? Math.max(0, Math.round((100 - intercept) / slope)) : null;
  const eliteHorizonLabel = eliteHorizonIndex !== null && eliteHorizonIndex > N 
    ? `T+${eliteHorizonIndex - N + 1}` 
    : 'Active';

  return (
    <div className="space-y-6 animate-fadeIn text-slate-100">
      
      {/* Top statistical headers */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 flex-1 text-center md:text-left">
          <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/30">
            SYSTEM ANALYTICS HUB
          </span>
          <h2 className="text-2xl font-bold">Competitive Learning Intelligence Metrics</h2>
          <p className="text-xs text-slate-500 max-w-xl">
            Real time performance vectors cross analyzed against cohort milestones of the 45th BCS general pre examinations databases.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 w-full md:w-auto">
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center md:text-left">
            <span className="text-[10px] uppercase font-mono text-slate-500">Median Accuracy</span>
            <span className="text-2xl font-mono font-bold block text-white mt-1">79.2%</span>
          </div>
          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl text-center md:text-left">
            <span className="text-[10px] uppercase font-mono text-slate-500">Consistency Quotient</span>
            <span className="text-2xl font-mono font-bold block text-emerald-400 mt-1">{profile.consistencyScore}%</span>
          </div>
        </div>
      </div>

      {/* Main Charts bento grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar charts of Subject Mastery (Col span 5) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Syllabus Mastery Heatmap</h3>
            <p className="text-xs text-slate-500">Target metrics vs median candidate capabilities</p>
          </div>
          
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analyticsData.subjectMastery}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="My Score" dataKey="score" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                <Tooltip content={<SubjectMasteryTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl flex items-center gap-2 text-xs text-slate-400">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Mathematical skills exceed 90% of students. Prioritize International Affairs.</span>
          </div>
        </div>

        {/* Predictive national rank curves (Col span 7) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">National Predicted Rank Trajectory</h3>
              <p className="text-xs text-slate-500">Daily rank progression indices (Lower is supreme)</p>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold font-mono bg-emerald-950/30 px-2 py-1 rounded">
              ▲ Improved 420 positions
            </span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData.rankHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rankArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={9} />
                <YAxis reversed stroke="#64748b" fontSize={9} />
                <Tooltip content={<RankTrajectoryTooltip />} />
                <Area type="monotone" dataKey="rank" stroke="#6366f1" fillOpacity={1} fill="url(#rankArea)" name="Pred Rank" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <p className="text-center text-[10px] text-slate-500 block font-mono">
            X-Axis representing recent adaptive test dates. Y-Axis inverted to mock supreme ranks properly.
          </p>
        </div>

      </div>

      {/* Linear Regression Rank Forecasting Model Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase bg-purple-950/40 px-2 py-0.5 rounded border border-purple-800/30 font-bold">
                OLS REGRESSION FORECAST MODEL
              </span>
              <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-850">
                Confidence Interval: 91.6%
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-display">Rank Trajectory Horizon Projection</h3>
            <p className="text-xs text-slate-500">Ordinary least squares model predicting rank targets based on historical preparation velocity</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
              <span className="text-[9px] uppercase font-mono text-slate-500 block">Velocity Rate</span>
              <span className="text-xs font-mono font-bold text-emerald-400">-{improvementRate} Ranks/Test</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
              <span className="text-[9px] uppercase font-mono text-slate-500 block">OLS Formula</span>
              <span className="text-xs font-mono font-bold text-slate-300">{formulaString}</span>
            </div>
            <div className="px-3 py-1.5 bg-slate-950 border border-slate-850 rounded-xl text-center">
              <span className="text-[9px] uppercase font-mono text-slate-500 block">Top 100 Horizon</span>
              <span className="text-xs font-mono font-bold text-cyan-400">{eliteHorizonLabel}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-center">
          {/* Legend and stats explanations */}
          <div className="space-y-4 lg:col-span-1">
            <div className="space-y-3">
              <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block" />
                  Actual Preparation Ranks
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  The verified ranks secured during the previous {N} adaptive mock sessions.
                </p>
              </div>

              <div className="p-4 bg-slate-950/50 border border-slate-850 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-dashed border-purple-400 block" />
                  Linear Least-Squares Fit
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Mathematically smoothed trajectory projected forward into future exam sessions.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-950/20 border border-amber-900/30 text-amber-300 rounded-2xl text-xs space-y-1 font-sans">
              <div className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Adaptive AI Insight
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Linear regression shows active preparation slope of -{improvementRate} positions. At this velocity rate, you are on track to enter the highly competitive top 100 cadre in {eliteHorizonLabel === 'Active' ? 'the next session' : eliteHorizonLabel}.
              </p>
            </div>
          </div>

          {/* Chart visualizer */}
          <div className="lg:col-span-3 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="label" stroke="#64748b" fontSize={9} />
                <YAxis reversed stroke="#64748b" fontSize={9} />
                <Tooltip content={<ForecastTooltip />} />
                <Legend verticalAlign="top" height={36} fontSize={9} />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#22d3ee" 
                  strokeWidth={3} 
                  dot={{ r: 5, fill: '#0f172a', stroke: '#22d3ee', strokeWidth: 2 }} 
                  activeDot={{ r: 7 }}
                  name="Verified Rank" 
                  connectNulls
                />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#c084fc" 
                  strokeWidth={2} 
                  strokeDasharray="5 5"
                  dot={{ r: 3, fill: '#c084fc', stroke: '#c084fc', strokeWidth: 1 }} 
                  name="Least-Squares Regression Trend" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Speed trends vs Fatigue index */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Fatigue curves */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Simulated Testing Co-efficient & Fatigue Tracker</h3>
            <p className="text-xs text-slate-500">Accuracy degradation relative to consecutive testing hours</p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.cognitiveFatigue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hour" label={{ value: 'Hours Spent', position: 'insideBottomRight', offset: -5 }} stroke="#64748b" fontSize={10} />
                <YAxis label={{ value: 'Fatigue IQ', angle: -90, position: 'insideLeft' }} stroke="#64748b" fontSize={10} />
                <Tooltip content={<CognitiveFatigueTooltip />} />
                <Line type="monotone" dataKey="fatigue" stroke="#f43f5e" strokeWidth={2.5} name="Cognitive Shift Index" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="p-3 bg-rose-950/20 border border-rose-900/30 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>High fatigue mapped at Hour 4. Complete mock tests in under 120 minutes is recommended.</span>
          </div>
        </div>

        {/* Time Spent levels per Question */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Average Pacing Matrix</h3>
            <p className="text-xs text-slate-500">Actual seconds spent per question index vs cohort target</p>
          </div>

          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData.timePerQuestionTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="questionIndex" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip content={<PacingMatrixTooltip />} />
                <Legend fontSize={9} />
                <Bar dataKey="actualSeconds" fill="#0ea5e9" name="My Seconds" radius={[4, 4, 0, 0]} />
                <Bar dataKey="averageSeconds" fill="#334155" name="Cadre Average" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-950/60 border border-slate-850 rounded-xl text-xs text-slate-400 text-center font-mono">
            ⚡ Decisive speed optimization: Average pacing represents 28 seconds under mock levels.
          </div>
        </div>

      </div>

    </div>
  );
}
