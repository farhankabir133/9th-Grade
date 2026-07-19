import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, TrendingUp, RefreshCw, AlertTriangle, 
  MapPin, Brain, Calendar, Clock, ArrowRight, Zap, Target, BookOpen, 
  MessageSquare, BarChart, Settings, LogOut, FileText, UserCheck, CheckCircle2, User,
  ChevronDown, Menu, X, Activity, Terminal, Eye
} from 'lucide-react';

import { UserProfile, RevisionSchedule, Circular, AnalyticsData, ExamType, defaultUserProfile } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import ExamEngine from './components/ExamEngine';
import AITutor from './components/AITutor';
import Analytics from './components/Analytics';
import MemoryRevision from './components/MemoryRevision';
import WrittenEvaluator from './components/WrittenEvaluator';
import CareerOS from './components/CareerOS';
import ProfileIdentity from './components/ProfileIdentity';
import ServicesDetails from './components/ServicesDetails';
import PipelineDetails from './components/PipelineDetails';
import BentoDetails from './components/BentoDetails';
import TerminalDetails from './components/TerminalDetails';
import VisionDetails from './components/VisionDetails';
import { useAuth } from './lib/AuthContext';
import AuthModal from './components/AuthModal';

export default function App() {
  
  // App Phase States: 'landing' | 'onboarding' | 'app' | 'services' | 'pipeline' | 'bento' | 'terminal' | 'vision'
  const [appPhase, setAppPhase] = useState<'landing' | 'onboarding' | 'app' | 'services' | 'pipeline' | 'bento' | 'terminal' | 'vision'>('landing');
  const [selectedExamType, setSelectedExamType] = useState<ExamType>('BCS');
  
  // Onboarding Setup State Form
  const [onboardName, setOnboardName] = useState<string>('Farhan Kabir');
  const [onboardPhone, setOnboardPhone] = useState<string>('01723456789');
  const [onboardDistrict, setOnboardDistrict] = useState<string>('Dhaka');
  const [onboardGoal, setOnboardGoal] = useState<string>('Get selected in general cadres');
  const [diagnosticScore, setDiagnosticScore] = useState<number | null>(null);
  const [onboardStep, setOnboardStep] = useState<number>(0);

  // Authentication Context Hook Mapping
  const { user, profile: authProfile, signOutUser, updateUserProfile } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Reconciled active user profile
  const profile = authProfile || defaultUserProfile;

  // React to Auth State Changes
  useEffect(() => {
    if (user) {
      if (appPhase === 'landing') {
        setAppPhase('app');
      }
    } else {
      setAppPhase('landing');
    }
  }, [user]);


  // Active section route navigation state
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeTutorTopic, setActiveTutorTopic] = useState<string | undefined>(undefined);
  const [isExamEngineExpanded, setIsExamEngineExpanded] = useState<boolean>(true);
  const [selectedExamMode, setSelectedExamMode] = useState<{ type: 'BCS' | 'Bank' | 'Custom'; role?: string }>({ type: 'BCS' });

  // Spaced Memory database state
  const [revisionItems, setRevisionItems] = useState<RevisionSchedule[]>([
    {
      id: "rev-1",
      topic: "চর্যাপদ সাহিত্য প্রাচীন নিদর্শন",
      subject: "Bangla Literature",
      urgencyScore: 88,
      retentionProbability: 35,
      daysSinceLastReview: 6,
      nextScheduledDate: "Overdue 2 days",
      historyLength: 3
    },
    {
      id: "rev-2",
      topic: "Article 137 Public Service Commission formation",
      subject: "Bangladesh Constitution",
      urgencyScore: 68,
      retentionProbability: 51,
      daysSinceLastReview: 4,
      nextScheduledDate: "Review today",
      historyLength: 2
    },
    {
      id: "rev-3",
      topic: "Simple Interest Equations",
      subject: "Mathematical Reasoning",
      urgencyScore: 35,
      retentionProbability: 82,
      daysSinceLastReview: 1,
      nextScheduledDate: "In 4 Days",
      historyLength: 5
    }
  ]);

  // Upcoming Government Career Circulars and countdown deadlines
  const upcomingCirculars: Circular[] = [
    {
      id: "cir-1",
      title: "46th BCS General Pre-Selection Circular",
      organization: "Bangladesh Public Service Commission (BPSC)",
      vacancyCount: 3105,
      deadline: "June 15, 2026",
      admitCardDate: "August 20, 2026",
      countdownDays: 24,
      link: "https://bpsc.teletalk.com.bd",
      syllabusOverview: [
        "Language & Comp (35 Marks): Phonetics, parts of speech, syntax and spellings.",
        "Bangla Literature Studies (35 Marks): Ancient period manuscripts, medieval poet laureates, and modern masterpieces.",
        "Mathematical and Numerical parameters (30 Marks): Simple interest, sets, algebra, geometry and analytical reasoning tests."
      ]
    },
    {
      id: "cir-2",
      title: "Bangladesh Bank Assistant Director Recruitment 2026",
      organization: "Central Bank of Bangladesh (BB)",
      vacancyCount: 250,
      deadline: "July 20, 2026",
      countdownDays: 22,
      link: "https://erecruitment.bb.org.bd",
      syllabusOverview: [
        "Bangla Essay & Translation (50 Marks): Socio-economic analytical essay, vocabulary matching, translation from English.",
        "English Comprehension & Precision Writing (50 Marks): Precise drafting, business communications and vocabulary.",
        "Quantitative Aptitude & Proofs (50 Marks): Theoretical arithmetic, algebra, mathematical logic, and analytical puzzle solving."
      ]
    }
  ];

  // Recharts high quality datasets for analytical heatmaps and metrics
  const analyticsData: AnalyticsData = {
    subjectMastery: [
      { subject: 'Bangla Lit', score: 82, color: '#38bdf8' },
      { subject: 'Constitution', score: 71, score2: 60, color: '#6366f1' },
      { subject: 'Math Reasoning', score: 91, score2: 70, color: '#34d399' },
      { subject: 'English Lit', score: 65, score2: 65, color: '#f59e0b' },
      { subject: 'General Science', score: 85, score2: 75, color: '#a855f7' }
    ],
    rankHistory: [
      { date: 'May 10', rank: 3670, percentile: 91.2 },
      { date: 'May 12', rank: 2901, percentile: 93.5 },
      { date: 'May 14', rank: 1840, percentile: 95.8 },
      { date: 'May 16', rank: 1420, percentile: 96.9 },
      { date: 'May 18', rank: 890, percentile: 98.1 },
      { date: 'May 20', rank: 342, percentile: 99.2 }
    ],
    cognitiveFatigue: [
      { hour: 1, fatigue: 10 },
      { hour: 2, fatigue: 25 },
      { hour: 3, fatigue: 45 },
      { hour: 4, fatigue: 85 },
      { hour: 5, fatigue: 92 }
    ],
    timePerQuestionTrend: [
      { questionIndex: 1, actualSeconds: 12, averageSeconds: 35 },
      { questionIndex: 2, actualSeconds: 42, averageSeconds: 40 },
      { questionIndex: 3, actualSeconds: 15, averageSeconds: 30 },
      { questionIndex: 4, actualSeconds: 28, averageSeconds: 35 },
      { questionIndex: 5, actualSeconds: 31, averageSeconds: 35 }
    ],
    guessRateBySubject: [
      { subject: 'Bangla Lit', rate: 12 },
      { subject: 'Constitution', rate: 28 },
      { subject: 'Math Reasoning', rate: 5 },
      { subject: 'English Lit', rate: 42 }
    ]
  };

  // Onboarding trigger
  const handleStartOnboarding = (exam: ExamType) => {
    setSelectedExamType(exam);
    setAppPhase('onboarding');
    setOnboardStep(1);
  };

  const handleFinishOnboarding = () => {
    // Sync onboarding details onto global Profile states in Firestore
    updateUserProfile({
      name: onboardName,
      phone: onboardPhone,
      examType: selectedExamType,
      district: onboardDistrict,
      readinessScore: diagnosticScore || 78,
      predictedRank: diagnosticScore ? Math.max(100, 1500 - (diagnosticScore * 12)) : 342,
    });
    setAppPhase('app');
    setActiveTab('dashboard');
  };

  // Simulated diagnostic assessment MCQs on onboarding screen
  const dummyDiagnosticMcq = {
    text: "চর্যাপদ ১৯১৬ সালে হরপ্রসাদ শাস্ত্রী কর্তৃক কোন প্রকাশনী থেকে প্রথম মুদ্রিত গ্রন্থাকারে প্রকাশিত হয়?",
    options: [
      "বঙ্গীয় সাহিত্য পরিষদ",
      "বাংলা একাডেমী",
      "শ্রীরামপুর মিশন প্রেস",
      "কলকাতা বিশ্ববিদ্যালয় প্রেস"
    ],
    correctIndex: 0
  };

  const selectDiagnosticOption = (idx: number) => {
    if (idx === dummyDiagnosticMcq.correctIndex) {
      setDiagnosticScore(85);
    } else {
      setDiagnosticScore(65);
    }
    setOnboardStep(3); // Go to final review step
  };

  const handleTriggerTutor = (subject: string, topic: string) => {
    setActiveTutorTopic(`${subject}: ${topic}`);
    setActiveTab('tutor');
  };

  const handleReviewCompletedInDatabase = (topicId: string, newRetention: number) => {
    // Boost XP on memory recall success in Firestore
    const nextXp = profile.xp + 250;
    const nextLevel = nextXp >= profile.level * 5000 ? profile.level + 1 : profile.level;
    updateUserProfile({
      xp: nextXp,
      level: nextLevel
    });
  };

  return (
    <div className="bg-[#03020b] min-h-screen text-slate-100 selection:bg-cyan-500 selection:text-slate-950 border-none relative overflow-x-hidden">
      
      {/* GLOBAL BACKGROUND GLOW SYSTEM */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[15%] left-[20%] w-[45%] h-[45%] rounded-full bg-indigo-600/5 blur-[130px] mix-blend-screen animate-float-slow" />
        <div className="absolute top-[55%] right-[10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px] mix-blend-screen animate-float-medium" />
      </div>
      
      {/* 1. LANDING LAYER */}
      {appPhase === 'landing' && (
        <LandingPage 
          onStartOnboarding={handleStartOnboarding} 
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onGoToDashboard={() => setAppPhase('app')}
          onViewServices={() => setAppPhase('services')}
          onViewPipeline={() => setAppPhase('pipeline')}
          onViewBento={() => setAppPhase('bento')}
          onViewTerminal={() => setAppPhase('terminal')}
          onViewVision={() => setAppPhase('vision')}
        />
      )}

      {/* 1.5 SERVICES DETAILS LAYER */}
      {appPhase === 'services' && (
        <ServicesDetails 
          onBackToLanding={() => setAppPhase('landing')}
          onEnterApp={() => {
            if (user) {
              setAppPhase('app');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}

      {/* 1.5.1 PIPELINE DETAILS LAYER */}
      {appPhase === 'pipeline' && (
        <PipelineDetails 
          onBackToLanding={() => setAppPhase('landing')}
          onEnterApp={() => {
            if (user) {
              setAppPhase('app');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}

      {/* 1.5.2 BENTO DETAILS LAYER */}
      {appPhase === 'bento' && (
        <BentoDetails 
          onBackToLanding={() => setAppPhase('landing')}
          onEnterApp={() => {
            if (user) {
              setAppPhase('app');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}

      {/* 1.5.3 TERMINAL DETAILS LAYER */}
      {appPhase === 'terminal' && (
        <TerminalDetails 
          onBackToLanding={() => setAppPhase('landing')}
          onEnterApp={() => {
            if (user) {
              setAppPhase('app');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}

      {/* 1.5.4 VISION DETAILS LAYER */}
      {appPhase === 'vision' && (
        <VisionDetails 
          onBackToLanding={() => setAppPhase('landing')}
          onEnterApp={() => {
            if (user) {
              setAppPhase('app');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
        />
      )}

      {/* 2. ONBOARDING SEQUENCE */}
      {appPhase === 'onboarding' && (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950 font-sans">
          
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-400"></div>

          <div className="max-w-md w-full bg-slate-900 rounded-3xl border border-slate-800 p-8 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-2 justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-sm font-bold tracking-wider font-mono">ONBOARDING PREPARATION</span>
              </div>
              <span className="text-xs text-slate-500">Step {onboardStep} of 3</span>
            </div>

            {/* Step 1: User Profile Details */}
            {onboardStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Personalize Learning Identity</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Set up your authentic metadata so that the BPSC simulated cohort ranking maps accurately.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-500 block uppercase font-mono font-bold">Aspirant Name</label>
                    <input 
                      type="text" 
                      value={onboardName}
                      onChange={(e) => setOnboardName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 p-3 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 block uppercase font-mono font-bold">Mobile authentication number</label>
                    <input 
                      type="tel" 
                      value={onboardPhone}
                      onChange={(e) => setOnboardPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 p-3 rounded-xl outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-500 block uppercase font-mono font-bold">District / Division</label>
                    <select 
                      value={onboardDistrict}
                      onChange={(e) => setOnboardDistrict(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-400 p-3 rounded-xl outline-none"
                    >
                      <option value="Dhaka">Dhaka Division</option>
                      <option value="Mymensingh">Mymensingh Division</option>
                      <option value="Chittagong">Chittagong Division</option>
                      <option value="Rajshahi">Rajshahi Division</option>
                      <option value="Sylhet">Sylhet Division</option>
                    </select>
                  </div>
                </div>

                <button 
                  onClick={() => setOnboardStep(2)}
                  className="w-full py-3 bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs uppercase hover:bg-cyan-300 transition-all flex items-center justify-center gap-1"
                >
                  Continue to Diagnostic Assessment <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            )}

            {/* Step 2: Adaptive 1 MCQ Diagnostic */}
            {onboardStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-800/20 font-mono tracking-widest font-bold inline-block">
                    AI READINESS ASSESSMENT TRIAL
                  </span>
                  <h3 className="text-base font-bold text-white">Quick Onboard Validation Question</h3>
                  <p className="text-xs text-slate-400 leading-normal">
                    Answer this sample question to approximate your starting national ranking.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl text-xs font-sans leading-relaxed text-slate-200">
                  {dummyDiagnosticMcq.text}
                </div>

                <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-300">
                  {dummyDiagnosticMcq.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => selectDiagnosticOption(idx)}
                      className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-850 hover:border-cyan-400/50 rounded-xl text-left font-sans"
                    >
                      {idx + 1}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Predictive Result and Dashboard sync */}
            {onboardStep === 3 && (
              <div className="space-y-5 text-center">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl animate-bounce">
                  ✓
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Onboarding Complete</h3>
                  <p className="text-xs text-slate-400">
                    We've approximated your starting preparation health score based on national competitive data.
                  </p>
                </div>

                <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Aggressed Score</span>
                    <span className="text-xl font-mono font-bold text-cyan-400">{diagnosticScore}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-mono">Apprx Rank Bound</span>
                    <span className="text-xl font-mono font-bold text-rose-300">
                      #{diagnosticScore === 85 ? '12,500' : '45,210'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={handleFinishOnboarding}
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-indigo-500 text-slate-950 font-bold rounded-xl text-xs uppercase flex items-center justify-center gap-1 hover:scale-[1.01] transition-transform"
                >
                  Confirm and Launch Dashboard <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </div>
            )}

          </div>

        </div>
      )}

      {/* 3. CORE ADAPTIVE APP AREA */}
      {appPhase === 'app' && (
        <div className="min-h-screen flex flex-col md:flex-row font-sans">
          
          {/* Top Bar for Mobile - Visible only below md */}
          <div className="md:hidden flex justify-between items-center bg-slate-900 border-b border-slate-850 px-6 py-4 sticky top-0 z-50 w-full">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl">
                <Sparkles className="w-4 h-4 text-slate-950" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                  9TH GRADE <span className="text-cyan-400 font-mono text-[10px]">AI</span>
                </span>
                <p className="text-[8px] text-slate-500 leading-none">Learning OS</p>
              </div>
            </div>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white cursor-pointer animate-pulse"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Full-screen Navigation Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="md:hidden fixed inset-x-0 top-[61px] bottom-0 bg-slate-950 z-45 border-t border-slate-850 p-6 flex flex-col justify-between overflow-y-auto"
              >
                <div className="space-y-6">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">NAVIGATION PLATFORM</span>
                  <nav className="space-y-2 font-sans text-sm">
                    {/* AI Dashboard */}
                    <button
                      onClick={() => {
                        setActiveTab('dashboard');
                        setActiveTutorTopic(undefined);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                        activeTab === 'dashboard'
                          ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-600/10 text-cyan-400 border border-cyan-500/15' 
                          : 'text-slate-400 hover:text-slate-200 border border-slate-800/10'
                      }`}
                    >
                      <Brain className="w-4.5 h-4.5 text-cyan-400" />
                      <span>AI Dashboard</span>
                    </button>

                    {/* Collapsible Exam Engine */}
                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setIsExamEngineExpanded(!isExamEngineExpanded);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                          activeTab.startsWith('exam_engine')
                            ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-600/10 text-cyan-450 border border-cyan-500/15'
                            : 'text-slate-400 hover:text-slate-200 border border-slate-800/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Target className="w-4.5 h-4.5 text-emerald-400" />
                          <span>Exam Engine</span>
                        </div>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExamEngineExpanded ? 'transform rotate-180' : ''}`} />
                      </button>

                      {isExamEngineExpanded && (
                        <div className="pl-4 pr-1 py-1.5 bg-slate-900/40 rounded-xl border border-slate-850/50 m-1 flex flex-col gap-1.5">
                          <button
                            onClick={() => {
                              setActiveTab('exam_engine_bcs');
                              setSelectedExamMode({ type: 'BCS' });
                              setIsMobileMenuOpen(false);
                            }}
                            className={`py-2 px-2.5 text-xs rounded-lg transition-all text-left flex items-center gap-2 font-bold ${
                              activeTab === 'exam_engine_bcs'
                                ? 'text-cyan-400 bg-cyan-950/20'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
                            <span>BCS Preliminary</span>
                          </button>

                          <div className="py-1">
                            <div className="px-2.5 py-0.5 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                              Bangladesh Bank
                            </div>
                            <div className="pl-2 py-0.5 border-l border-slate-800 m-1 flex flex-col gap-1">
                              {[
                                { id: 'ad', label: 'Assistant Director (AD)' },
                                { id: 'senior_officer', label: 'Senior Officer' },
                                { id: 'general_officer', label: 'General Officer' },
                                { id: 'officer_cash', label: 'Officer (Cash)' },
                                { id: 'other_9th_grade', label: 'Other 9th Grade Posts' }
                              ].map((role) => (
                                <button
                                  key={role.id}
                                  onClick={() => {
                                    setActiveTab(`exam_engine_bank_${role.id}`);
                                    setSelectedExamMode({ type: 'Bank', role: role.label });
                                    setIsMobileMenuOpen(false);
                                  }}
                                  className={`w-full py-1 px-2 text-xs rounded text-left block truncate transition-all ${
                                    activeTab === `exam_engine_bank_${role.id}`
                                      ? 'text-emerald-400 font-extrabold bg-emerald-950/25 border-l border-emerald-500'
                                      : 'text-slate-400 hover:text-slate-200'
                                  }`}
                                  title={role.label}
                                >
                                  • {role.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveTab('exam_engine_custom');
                              setSelectedExamMode({ type: 'Custom' });
                              setIsMobileMenuOpen(false);
                            }}
                            className={`py-2 px-2.5 text-xs rounded-lg transition-all text-left flex items-center gap-2 font-bold ${
                              activeTab === 'exam_engine_custom'
                                ? 'text-purple-400 bg-purple-950/20'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
                            <span>Custom Exam Builder</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Rest of items */}
                    {[
                      { id: 'tutor', label: 'Conversational Tutor', icon: MessageSquare },
                      { id: 'written', label: 'Written Evaluator', icon: FileText },
                      { id: 'analytics', label: 'Intel Analytics', icon: BarChart },
                      { id: 'revision', label: 'Spaced Memory', icon: RefreshCw },
                      { id: 'career', label: 'Job Registry', icon: Calendar },
                      { id: 'profile', label: 'My Learner Archetype', icon: UserCheck },
                      { id: 'services_details', label: 'Platform Capabilities', icon: Sparkles },
                      { id: 'pipeline_details', label: 'Pipeline Core', icon: Activity },
                      { id: 'bento_details', label: 'Bento Subsystems', icon: Award },
                      { id: 'terminal_details', label: 'Sandbox Terminal', icon: Terminal },
                      { id: 'vision_details', label: 'Future Vision', icon: Eye },
                    ].map((tab) => {
                      const IconComponent = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            if (tab.id !== 'tutor') {
                              setActiveTutorTopic(undefined);
                            }
                            setIsMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                            isActive 
                              ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-600/10 text-cyan-400 border border-cyan-500/15' 
                              : 'text-slate-400 hover:text-slate-200 border border-slate-800/10'
                          }`}
                        >
                          <IconComponent className="w-4 h-4 text-indigo-400" />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-850">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold font-sans">
                      {profile.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <span className="font-semibold block text-slate-200 text-xs">{profile.name}</span>
                      <span className="text-[10px] text-emerald-400 block font-mono">💧 {profile.streak} Days active</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      signOutUser();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-rose-400 hover:text-white rounded-xl bg-rose-950/10 border border-rose-900/20 text-xs transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Log Out (লগআউট)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Left Navigation Workspace Column Bar - DESKTOP ONLY */}
          <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-850 p-6 flex-col justify-between flex-shrink-0">
            <div className="space-y-8">
              
              {/* Logo */}
              <div className="flex items-center gap-2">
                <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-xl">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <span className="text-md font-bold tracking-tight bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent">
                    9TH GRADE <span className="text-cyan-400 font-mono text-xs">AI</span>
                  </span>
                  <p className="text-[9px] text-slate-500 leading-none">Learning OS</p>
                </div>
              </div>

              {/* Navigation buttons */}
              <nav className="space-y-1.5 font-sans text-xs">
                {/* AI Dashboard */}
                <button
                  onClick={() => {
                    setActiveTab('dashboard');
                    setActiveTutorTopic(undefined);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-600/10 text-cyan-400 border border-cyan-500/15' 
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Brain className={`w-4 h-4 ${activeTab === 'dashboard' ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>AI Dashboard</span>
                </button>

                {/* Collapsible Exam Engine */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsExamEngineExpanded(!isExamEngineExpanded);
                      setActiveTab('exam_engine_bcs');
                      setSelectedExamMode({ type: 'BCS' });
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                      activeTab.startsWith('exam_engine')
                        ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-600/10 text-cyan-450 border border-cyan-500/15'
                        : 'text-slate-400 hover:text-slate-200 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-bold">
                      <Target className={`w-4 h-4 ${activeTab.startsWith('exam_engine') ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>Exam Engine</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExamEngineExpanded ? 'transform rotate-180 text-cyan-405' : 'text-slate-500'}`} />
                  </button>

                  {isExamEngineExpanded && (
                    <div className="pl-3 pr-1 py-1 space-y-1 bg-slate-950/40 rounded-xl border border-slate-850/50 m-1 flex flex-col">
                      <button
                        onClick={() => {
                          setActiveTab('exam_engine_bcs');
                          setSelectedExamMode({ type: 'BCS' });
                        }}
                        className={`py-2 px-2.5 text-[10px] rounded-lg transition-all text-left flex items-center gap-2 font-bold ${
                          activeTab === 'exam_engine_bcs'
                            ? 'text-cyan-400 bg-cyan-950/20 font-bold animate-pulse'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                        <span>BCS Preliminary</span>
                      </button>

                      <div className="py-1">
                        <div className="px-2.5 py-1 text-[9px] uppercase font-bold text-slate-550 tracking-wider">
                          Bangladesh Bank
                        </div>
                        <div className="pl-2 py-0.5 border-l border-slate-800 m-1 flex flex-col gap-1">
                          {[
                            { id: 'ad', label: 'Assistant Director (AD)' },
                            { id: 'senior_officer', label: 'Senior Officer' },
                            { id: 'general_officer', label: 'General Officer' },
                            { id: 'officer_cash', label: 'Officer (Cash)' },
                            { id: 'other_9th_grade', label: 'Other 9th Grade Posts' }
                          ].map((role) => (
                            <button
                              key={role.id}
                              onClick={() => {
                                setActiveTab(`exam_engine_bank_${role.id}`);
                                setSelectedExamMode({ type: 'Bank', role: role.label });
                              }}
                              className={`w-full py-1 px-2 text-[10px] rounded text-left block truncate transition-all ${
                                activeTab === `exam_engine_bank_${role.id}`
                                  ? 'text-emerald-400 font-extrabold bg-emerald-950/25 border-l border-emerald-500'
                                  : 'text-slate-400 hover:text-slate-200'
                              }`}
                              title={role.label}
                            >
                              • {role.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab('exam_engine_custom');
                          setSelectedExamMode({ type: 'Custom' });
                        }}
                        className={`py-2 px-2.5 text-[10px] rounded-lg transition-all text-left flex items-center gap-2 font-bold ${
                          activeTab === 'exam_engine_custom'
                            ? 'text-purple-400 bg-purple-950/20 font-bold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <RefreshCw className="w-3 h-3 text-purple-400" />
                        <span>Custom Exam Builder</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Rest of items */}
                {[
                  { id: 'tutor', label: 'Conversational Tutor', icon: MessageSquare },
                  { id: 'written', label: 'Written Evaluator', icon: FileText },
                  { id: 'analytics', label: 'Intel Analytics', icon: BarChart },
                  { id: 'revision', label: 'Spaced Memory', icon: RefreshCw },
                  { id: 'career', label: 'Job Registry', icon: Calendar },
                  { id: 'profile', label: 'My Learner Archetype', icon: UserCheck },
                  { id: 'services_details', label: 'Platform Capabilities', icon: Sparkles },
                  { id: 'pipeline_details', label: 'Pipeline Core', icon: Activity },
                  { id: 'bento_details', label: 'Bento Subsystems', icon: Award },
                  { id: 'terminal_details', label: 'Sandbox Terminal', icon: Terminal },
                  { id: 'vision_details', label: 'Future Vision', icon: Eye },
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        if (tab.id !== 'tutor') {
                          setActiveTutorTopic(undefined);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-colors text-left ${
                        isActive 
                          ? 'bg-gradient-to-r from-cyan-500/10 to-indigo-600/10 text-cyan-400 border border-cyan-500/15' 
                          : 'text-slate-400 hover:text-slate-200 border border-transparent'
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>

            </div>

            {/* Logout / Reset section bottom and indicator */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-xs font-bold font-sans">
                  {profile.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="truncate text-xs">
                  <span className="font-semibold block text-slate-200 truncate">{profile.name}</span>
                  <span className="text-[10px] text-emerald-400 block font-mono">💧 {profile.streak} Days active</span>
                </div>
              </div>

              <button 
                onClick={() => signOutUser()}
                className="w-full flex items-center gap-2 px-3 py-2 text-rose-400 hover:text-white rounded-lg hover:bg-rose-950/20 text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" /> Log Out (লগআউট)
              </button>
            </div>

          </aside>

          {/* Right Main Panel Body section container */}
          <main className="flex-1 bg-slate-950/50 p-6 md:p-8 overflow-y-auto max-w-7xl">
            
            {/* Conditional Sub-panels render block */}
            {activeTab === 'dashboard' && (
              <Dashboard 
                profile={profile} 
                revisionItems={revisionItems}
                upcomingCirculars={upcomingCirculars}
                onNavigate={(tab) => setActiveTab(tab)}
                onQuickPractice={() => {
                  setActiveTab('exam_engine_bcs');
                  setSelectedExamMode({ type: 'BCS' });
                }}
              />
            )}

            {/* MCQ practice engine route */}
            {activeTab.startsWith('exam_engine') && (
              <ExamEngine 
                examType={profile.examType}
                selectedExamMode={selectedExamMode}
                onExamCompleted={(results) => {
                  updateUserProfile({
                    readinessScore: results.accuracy,
                    predictedRank: results.percentile ? Math.max(12, Math.round(profile.predictedRank * (1 - results.accuracy/150))) : profile.predictedRank,
                    passingProbability: Math.min(99, Math.round(results.accuracy * 0.95 + 10))
                  });
                }}
                onTriggerTutor={handleTriggerTutor}
              />
            )}

            {/* Tutor chatbot interface panel */}
            {activeTab === 'tutor' && (
              <AITutor examType={profile.examType} initialTopic={activeTutorTopic} />
            )}

            {/* Written Assessment Evaluator */}
            {activeTab === 'written' && (
              <WrittenEvaluator />
            )}

            {/* Intel analytics charts dashboards */}
            {activeTab === 'analytics' && (
              <Analytics analyticsData={analyticsData} profile={profile} />
            )}

            {/* Memory and Spaced Repetition listings */}
            {activeTab === 'revision' && (
              <MemoryRevision 
                initialItems={revisionItems} 
                onReviewCompleted={handleReviewCompletedInDatabase} 
              />
            )}

            {/* Gov circular countdown tracking calendars */}
            {activeTab === 'career' && (
              <CareerOS circulars={upcomingCirculars} />
            )}

            {/* User profile archetype identity overview */}
            {activeTab === 'profile' && (
              <ProfileIdentity profile={profile} />
            )}

            {/* Interactive Services Console details */}
            {activeTab === 'services_details' && (
              <ServicesDetails isNestedInApp={true} onEnterApp={() => setActiveTab('dashboard')} />
            )}

            {/* AI Processing Pipeline */}
            {activeTab === 'pipeline_details' && (
              <PipelineDetails isNestedInApp={true} onEnterApp={() => setActiveTab('dashboard')} />
            )}

            {/* Cognitive Subsystems */}
            {activeTab === 'bento_details' && (
              <BentoDetails isNestedInApp={true} onEnterApp={() => setActiveTab('dashboard')} />
            )}

            {/* Interactive Terminal */}
            {activeTab === 'terminal_details' && (
              <TerminalDetails isNestedInApp={true} onEnterApp={() => setActiveTab('dashboard')} />
            )}

            {/* Farhan's Learning Vision */}
            {activeTab === 'vision_details' && (
              <VisionDetails isNestedInApp={true} onEnterApp={() => setActiveTab('dashboard')} />
            )}

          </main>

        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => setIsAuthModalOpen(false)} 
      />

    </div>
  );
}
