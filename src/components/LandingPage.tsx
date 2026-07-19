import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Award, ArrowRight, Brain, AlertTriangle, 
  RefreshCw, TrendingUp, Compass, Users, MapPin, 
  BookOpen, Star, HelpCircle, CheckCircle2, Shield, Lock, 
  ChevronDown, ChevronUp, Check, Activity, Globe, FileText, ExternalLink,
  Cpu, Database, Layers, CheckSquare, RefreshCcw, Terminal,
  Clock, Play, RotateCcw, Flame, Zap, ArrowLeft, Send, Menu, X
} from 'lucide-react';
import { ExamType, Question } from '../types';

interface LandingPageProps {
  onStartOnboarding: (selectedExam: ExamType) => void;
  user: any;
  onOpenAuth: () => void;
  onGoToDashboard: () => void;
  onViewServices?: () => void;
  onViewPipeline?: () => void;
  onViewBento?: () => void;
  onViewTerminal?: () => void;
  onViewVision?: () => void;
}

// 1. HELPER COMPONENTS: Dynamic rolling count animation (React 19 compatible)
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    const duration = 500; // ms
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Easing function for smooth cinematic deceleration
      const easeOutQuad = (t: number) => t * (2 - t);
      const current = Math.floor(start + easeOutQuad(progress) * (end - start));
      setDisplayValue(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <span className="font-mono tabular-nums">{prefix}{displayValue.toLocaleString()}{suffix}</span>;
};

// Typewriter Heading Component
const TypewriterHeading = () => {
  const line1 = "Stop Studying Blindly❌";
  const line2 = "Let AI OS Engineer Your Performance 👍";

  const sentence1 = Array.from(line1);
  const sentence2 = Array.from(line2);

  const container1 = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const container2 = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 1.2,
      },
    },
  };

  const child = {
    hidden: { opacity: 0, display: "none" },
    visible: { 
      opacity: 1, 
      display: "inline",
      transition: {
        duration: 0.01,
      }
    },
  };

  return (
    <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight font-display">
      <motion.span
        variants={container1}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="inline-block"
      >
        {sentence1.map((char, index) => (
          <motion.span key={index} variants={child}>
            {char}
          </motion.span>
        ))}
      </motion.span>
      <br />
      <motion.span
        variants={container2}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="inline-block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400"
      >
        {sentence2.map((char, index) => (
          <motion.span key={index} variants={child}>
            {char}
          </motion.span>
        ))}
        {/* Blinking Cursor */}
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="inline-block w-[3px] h-[1.15em] bg-indigo-400 ml-1 align-middle"
        />
      </motion.span>
    </h2>
  );
};

// 2. MAIN COMPONENT
export default function LandingPage({ 
  onStartOnboarding, 
  user, 
  onOpenAuth, 
  onGoToDashboard, 
  onViewServices,
  onViewPipeline,
  onViewBento,
  onViewTerminal,
  onViewVision
}: LandingPageProps) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamType>('BCS');
  const [expectedScore, setExpectedScore] = useState<number>(65);
  const [estimatedRank, setEstimatedRank] = useState<number>(3200);
  const [estimatedLowerRank, setEstimatedLowerRank] = useState<number>(4500);
  const [scoreProbability, setScoreProbability] = useState<number>(55);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInContainer, setIsMouseInContainer] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [selectedWorkflowStep, setSelectedWorkflowStep] = useState<number>(1);
  const pipelineSectionRef = useRef<HTMLElement | null>(null);
  const [isPipelineInView, setIsPipelineInView] = useState<boolean>(false);
  const userInteractedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [pipelineAutoPlay, setPipelineAutoPlay] = useState<boolean>(true);

  // Intersection Observer for pipeline section to auto-play only when in view
  useEffect(() => {
    const el = pipelineSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPipelineInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
    };
  }, []);

  // Auto-advance loop for workflow step
  useEffect(() => {
    if (!isPipelineInView || !pipelineAutoPlay) return;

    const interval = setInterval(() => {
      setSelectedWorkflowStep((prev) => (prev % 4) + 1);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPipelineInView, pipelineAutoPlay]);

  // Clean up interaction timeout on unmount
  useEffect(() => {
    return () => {
      if (userInteractedTimeoutRef.current) {
        clearTimeout(userInteractedTimeoutRef.current);
      }
    };
  }, []);

  // Handler for manual step selection that pauses auto-advance temporarily
  const handleManualStepSelect = (step: number) => {
    setSelectedWorkflowStep(step);
    setPipelineAutoPlay(false);

    if (userInteractedTimeoutRef.current) {
      clearTimeout(userInteractedTimeoutRef.current);
    }

    userInteractedTimeoutRef.current = setTimeout(() => {
      setPipelineAutoPlay(true);
    }, 10000);
  };

  // Cinematic Live Simulated Telemetry States
  const [telemetryRankMin, setTelemetryRankMin] = useState(135);
  const [telemetryRankMax, setTelemetryRankMax] = useState(255);
  const [telemetryRetention, setTelemetryRetention] = useState(84.6);
  const [telemetryStatus, setTelemetryStatus] = useState<string>("OPTIMIZED");
  const [telemetrySubsystem, setTelemetrySubsystem] = useState<string>("STABLE");
  const [telemetryActivityCount, setTelemetryActivityCount] = useState(4);
  const [telemetryThroughput, setTelemetryThroughput] = useState(99.4);

  // Live Simulation loop
  useEffect(() => {
    const simInterval = setInterval(() => {
      setTelemetryRankMin(prev => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const next = prev + delta;
        return next > 100 && next < 150 ? next : prev;
      });
      setTelemetryRankMax(prev => {
        const delta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const next = prev + delta;
        return next > 220 && next < 275 ? next : prev;
      });

      setTelemetryRetention(prev => {
        const delta = Number((Math.random() * 0.4 - 0.18).toFixed(2));
        const next = Number((prev + delta).toFixed(2));
        return next > 80.0 && next < 92.0 ? next : prev;
      });

      setTelemetryThroughput(prev => {
        const delta = Number((Math.random() * 0.2 - 0.1).toFixed(1));
        const next = Number((prev + delta).toFixed(1));
        return next > 95.0 && next < 100.0 ? next : prev;
      });

      const statuses = ["OPTIMIZED", "DECAY_GUARD", "RE-INDEXING", "STABLE", "SYNCED"];
      setTelemetryStatus(prev => {
        const currIdx = statuses.indexOf(prev);
        const nextIdx = (currIdx + 1) % statuses.length;
        return Math.random() > 0.7 ? statuses[nextIdx] : prev;
      });

      const subsystems = ["STABLE", "ACTIVE", "CALIBRATING", "IDLE"];
      setTelemetrySubsystem(prev => {
        const currIdx = subsystems.indexOf(prev);
        const nextIdx = (currIdx + 1) % subsystems.length;
        return Math.random() > 0.8 ? subsystems[nextIdx] : prev;
      });
    }, 2500);

    return () => clearInterval(simInterval);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().replace("GMT", "UTC"));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
      const sections = ['pipeline', 'workspace', 'terminal', 'services', 'vision'];
      const current = sections.find(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 140 && rect.bottom >= 140;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Trial MCQ Terminal State
  const [terminalStep, setTerminalStep] = useState<'question' | 'answered'>('question');
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [shakeTrigger, setShakeTrigger] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'explanation' | 'metrics' | 'distractors'>('explanation');
  const [stressMode, setStressMode] = useState<boolean>(false);
  const [autoAdvanceSeconds, setAutoAdvanceSeconds] = useState<number | null>(null);
  const autoAdvanceIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedHeroNode, setSelectedHeroNode] = useState<'client' | 'psychometric' | 'gemini'>('client');

  // Bangladesh Civil Service & Bank AD Personal OS state
  const [examMode, setExamMode] = useState<'BCS' | 'BANK_AD'>('BCS');
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState<'terminal' | 'mistake_ledger' | 'diagnostic' | 'flashcards'>('terminal');
  
  // Timer and Pace Trackers
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [decisionDelay, setDecisionDelay] = useState<number | null>(null);

  // Spaced Repetition Ledger ("ভুল খাতা")
  const [mistakesList, setMistakesList] = useState<Question[]>(() => {
    try {
      const saved = localStorage.getItem("rf_mistake_ledger");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: "MISTAKE-01",
        text: "চর্যাপদের তিব্বতি অনুবাদ কে আবিষ্কার করেন এবং তা কোন শতকে রচিত বলে মনে করা হয়?",
        options: ["প্রবোধচন্দ্র বাগচী, একাদশ শতক", "হরপ্রসাদ শাস্ত্রী, দশম শতক", "সুনীতিকুমার চট্টোপাধ্যায়, দ্বাদশ শতক", "মুহম্মদ শহীদুল্লাহ, অষ্টম শতক"],
        correctIndex: 0,
        subject: "Bangla Language & Literature",
        topic: "চর্যাপদ (Charyapada)",
        difficulty: "Hard",
        concept: "তিব্বতি অনুবাদ ও কালক্রম",
        explanations: {
          bn: "ড. প্রবোধচন্দ্র বাগচী চর্যাপদের তিব্বতি অনুবাদ আবিষ্কার করেন। ড. সুনীতিকুমার চট্টোপাধ্যায়ের মতে চর্যাপদ দশম থেকে দ্বাদশ শতকের (৯৫০-১২০০ খ্রি.) রচনা।",
          en: "Dr. Prabodh Chandra Bagchi discovered the Tibetan translation of Charyapada. Dr. Suniti Kumar Chatterji concluded it was composed between the 10th and 12th centuries.",
          wrongOptions: [
            "হরপ্রসাদ শাস্ত্রী নেপালের রাজদরবার থেকে মূল তালপাতার পুথি আবিষ্কার করেন, তিব্বতি অনুবাদ নয়।",
            "সুনীতিকুমার চট্টোপাধ্যায় মূলত ওডিবিএল (ODBL) গ্রন্থের মাধ্যমে চর্যাপদের ভাষারূপ প্রমাণ করেন।",
            "ড. মুহম্মদ শহীদুল্লাহর মতে চর্যাপদের রচনাকাল আরও প্রাচীন (৬৫০ খ্রি.) যা ড. সুনীতিকুমার থেকে ভিন্ন।"
          ]
        },
        uniquenessScore: 98,
        conceptDepthScore: 94,
        syllabusRelevanceScore: 99,
        distractorQualityScore: 95,
        difficultyScore: 88,
        overallQualityScore: 94
      },
      {
        id: "MISTAKE-02",
        text: "If the radius of a circle is increased by 20%, by what percentage does its area increase?",
        options: ["40%", "44%", "20%", "36%"],
        correctIndex: 1,
        subject: "Mathematical Reasoning",
        topic: "Geometry & Area",
        difficulty: "Medium",
        concept: "Successive Percentage Increase",
        explanations: {
          bn: "ক্ষেত্রফল বৃদ্ধির শর্টকাট সূত্র: x + y + (xy/100) = ২০ + ২০ + (৪০০/১০০) = ৪৪%। বৃত্তের ক্ষেত্রফল ব্যাসার্ধের বর্গের সাথে সমানুপাতিক হওয়ায় এটি সাকসেসিভ হার হিসেবে কাজ করে।",
          en: "The area of a circle depends on the square of the radius. Thus, the percentage increase follows the successive compounding formula: x + y + (xy/100) = 20 + 20 + (400/100) = 44%.",
          wrongOptions: [
            "40% is the simple arithmetic sum of the increase, neglecting the compounding effect of squaring.",
            "20% represents only the linear increase in radius itself, not the area change.",
            "36% is the successive increase formula for a 16.6% linear increase."
          ]
        },
        uniquenessScore: 92,
        conceptDepthScore: 90,
        syllabusRelevanceScore: 98,
        distractorQualityScore: 92,
        difficultyScore: 70,
        overallQualityScore: 91
      },
      {
        id: "MISTAKE-03",
        text: "সংবিধানের কত নং অনুচ্ছেদ অনুযায়ী রাষ্ট্রপতি যেকোনো অধ্যাদেশ (Ordinance) জারি করতে পারেন এবং তা কখন রহিত হয়?",
        options: ["৯৩ নং অনুচ্ছেদ, সংসদ পুনরায় বসার ৩০ দিন পর", "৯৩ নং অনুচ্ছেদ, সংসদ পুনরায় বসার প্রথম বৈঠকেই রহিত", "৯৭ নং অনুচ্ছেদ, সংসদ পুনরায় বসার ৯০ দিন পর", "৭৭ নং অনুচ্ছেদ, রাষ্ট্রপতি নিজের ইচ্ছানুযায়ী যেকোনো সময়"],
        correctIndex: 1,
        subject: "Bangladesh Affairs",
        topic: "সংবিধানের অনুচ্ছেদ (Constitution)",
        difficulty: "Hard",
        concept: "অধ্যাদেশ প্রণয়ন ক্ষমতা",
        explanations: {
          bn: "সংবিধানের ৯৩ নং অনুচ্ছেদ অনুযায়ী রাষ্ট্রপতি অধ্যাদেশ জারি করতে পারেন। সংসদ পুনরায় বসার পর প্রথম বৈঠকেই এটি উপস্থাপিত হতে হবে এবং অনুমোদন না পেলে সরাসরি বাতিল হবে।",
          en: "Under Article 93, the President can promulgate ordinances. It must be laid before Parliament at its first meeting after recess and will cease to have effect unless approved.",
          wrongOptions: [
            "৩০ দিন সময়সীমা ভুল; এটি সরাসরি প্রথম বৈঠকেই রহিত হয়ে যায় যদি অনুমোদন না পায়।",
            "৯৭ অনুচ্ছেদ রাষ্ট্রপতির সাময়িক অনুপস্থিতিতে দায়িত্বভার সম্পর্কিত।",
            "৭৭ অনুচ্ছেদ মূলত ন্যায়পাল (Ombudsman) নিয়োগ সংক্রান্ত।"
          ]
        },
        uniquenessScore: 97,
        conceptDepthScore: 96,
        syllabusRelevanceScore: 99,
        distractorQualityScore: 94,
        difficultyScore: 85,
        overallQualityScore: 96
      }
    ];
  });

  // Precision Diagnostic Scores mapping
  const [diagnosticScores, setDiagnosticScores] = useState<{ [key: string]: { correct: number; total: number; topicName: string } }>(() => {
    try {
      const saved = localStorage.getItem("rf_diagnostic_scores");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      "সংবিধানের অনুচ্ছেদ (৩০-৪৭)": { correct: 3, total: 8, topicName: "সংবিধানের অনুচ্ছেদ (৩০-৪৭)" },
      "চর্যাপদ (Charyapada)": { correct: 2, total: 6, topicName: "বাংলা সাহিত্য - প্রাচীন যুগ (চর্যাপদ)" },
      "Geometry & Area": { correct: 5, total: 9, topicName: "গাণিতিক যুক্তি - ক্ষেত্রফল ও পরিমিতি" },
      "Permutations & Combinations": { correct: 2, total: 7, topicName: "উচ্চতর গণিত - পারমুটেশন ও কম্বিনেশন" },
      "Computer & ICT": { correct: 9, total: 10, topicName: "কম্পিউটার ও আইসিটি - মেমোরি ও লজিক গেট" },
      "Romantic Period (English)": { correct: 5, total: 8, topicName: "English Literature - Romantic Period" }
    };
  });

  // Re-Test Mode in Mistakes ledger
  const [reTestActive, setReTestActive] = useState<boolean>(false);
  const [reTestIndex, setReTestIndex] = useState<number>(0);
  const [reTestSelectedAnswer, setReTestSelectedAnswer] = useState<number | null>(null);
  const [reTestStep, setReTestStep] = useState<'question' | 'answered'>('question');

  // AI Tutor Integration state
  const [isAskingTutor, setIsAskingTutor] = useState<boolean>(false);
  const [tutorResponse, setTutorResponse] = useState<any | null>(null);
  const [tutorInputMessage, setTutorInputMessage] = useState<string>("");
  const [tutorLoading, setTutorLoading] = useState<boolean>(false);
  const [tutorHistory, setTutorHistory] = useState<any[]>([]);

  // Flashcards state
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [cardFlipped, setCardFlipped] = useState<boolean>(false);

  // Interactive Validation pipeline state
  const [pipelineState, setPipelineState] = useState<number>(0);
  const [pipelineMessages, setPipelineMessages] = useState<string[]>([
    "Scanning incoming MCQ cluster...",
    "Running token deduplication checker...",
    "Validating concept cognitive difficulty depth...",
    "Distractor plausibility score calculation...",
    "Assembling final high-yield test node..."
  ]);

  // Accordion active states
  const [activeService, setActiveService] = useState<number | null>(0);
  const [hoveredFooterLink, setHoveredFooterLink] = useState<string | null>(null);

  // Spaced Memory Decay decay factors
  const [decayThreshold, setDecayThreshold] = useState<number>(70);

  // Run auto pipeline animation simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setPipelineState((prev) => (prev + 1) % 5);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Recalculate mock rank projections based on interactive slider
  useEffect(() => {
    let lower = 45000;
    let upper = 60000;
    let prob = 12;

    if (expectedScore > 85) {
      lower = 12;
      upper = 250;
      prob = 98;
    } else if (expectedScore > 75) {
      lower = 251;
      upper = 1200;
      prob = 89;
    } else if (expectedScore > 65) {
      lower = 1201;
      upper = 4500;
      prob = 74;
    } else if (expectedScore > 50) {
      lower = 4501;
      upper = 18000;
      prob = 48;
    } else if (expectedScore > 40) {
      lower = 18001;
      upper = 35000;
      prob = 22;
    }

    setEstimatedRank(lower);
    setEstimatedLowerRank(upper);
    setScoreProbability(prob);
  }, [expectedScore]);

  // Sample classical BPSC/IBA level question
  const initialSampleQuestion: Question = {
    id: "RF-Q109",
    text: "সংবিধানের কোন অনুচ্ছেদ অনুযায়ী বাংলাদেশ সরকারি কর্ম কমিশন (BPSC) গঠিত হয় এবং এর সদস্য মেয়াদ কত বছর?",
    options: [
      "১৩৭ নং অনুচ্ছেদ, ৫ বছর অথবা বয়স ৬৫ বছর পূর্ণ হওয়া পর্যন্ত",
      "১৪০ নং অনুচ্ছেদ, ৪ বছর অথবা বয়স ৬২ বছর পূর্ণ হওয়া পর্যন্ত",
      "১৩৫ নং অনুচ্ছেদ, ৫ বছর অথবা বয়স ৬০ বছর পূর্ণ হওয়া পর্যন্ত",
      "১৩৮ নং অনুচ্ছেদ, ৬ বছর অথবা বয়স ৬৫ বছর পূর্ণ হওয়া পর্যন্ত"
    ],
    correctIndex: 0,
    subject: "Bangladesh Affairs",
    topic: "Constitution of Bangladesh",
    difficulty: "Medium",
    concept: "Constitutional Commissions",
    cognitiveDimension: "applied knowledge",
    uniquenessScore: 94,
    difficultyScore: 78,
    conceptDepthScore: 88,
    syllabusRelevanceScore: 99,
    distractorQualityScore: 92,
    overallQualityScore: 90,
    recruitmentRelevance: "Testing structural knowledge of Chapter II of Part IX of the Constitution of Bangladesh, a recurring high-yield focus area in BPSC Preliminary exams.",
    explanations: {
      bn: "সংবিধানের ১৩৭ অনুচ্ছেদ অনুযায়ী কমিশন গঠিত হয় এবং কর্ম কমিশনের চেয়ারম্যান ও অন্যান্য সদস্যদের মেয়াদ দায়িত্ব গ্রহণের তারিখ হতে ৫ বছর অথবা বয়স ৬৫ বছর পূর্ণ হওয়া পর্যন্ত। এটি অত্র বিভাগের অত্যন্ত গুরুত্বপূর্ণ সাংবিধানিক জ্ঞান।",
      en: "The Commission is established under Article 137 of the Constitution of Bangladesh. The Chairman and members of the Commission hold office for a term of 5 years or until they attain the age of 65 years, whichever is earlier.",
      wrongOptions: [
        "১৪০ নং অনুচ্ছেদ মূলত কর্ম কমিশনের কার্যাবলী বর্ণনা করে, গঠন নয়।",
        "১৩৫ নং অনুচ্ছেদ অসামরিক সরকারি কর্মচারীদের বরখাস্তকরণ সংক্রান্ত আইনি সুরক্ষা নিয়ে কথা বলে।",
        "১৩৮ নং অনুচ্ছেদ কমিশনের সদস্য নিয়োগের সাথে সম্পর্কিত, মেয়াদের সম্পূর্ণ স্পেসিফিকেশন এতে নেই।"
      ]
    }
  };

  const [sampleQuestion, setSampleQuestion] = useState<Question>(initialSampleQuestion);
  const [isGeneratingTerminalQuestion, setIsGeneratingTerminalQuestion] = useState<boolean>(false);
  const [terminalGenerationError, setTerminalGenerationError] = useState<string>('');

  const handleCancelAutoAdvance = () => {
    setAutoAdvanceSeconds(null);
  };

  useEffect(() => {
    if (autoAdvanceSeconds === null) return;
    if (autoAdvanceSeconds <= 0) {
      setAutoAdvanceSeconds(null);
      fetchNextAIQuestion();
      return;
    }
    const timer = setTimeout(() => {
      setAutoAdvanceSeconds((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearTimeout(timer);
  }, [autoAdvanceSeconds]);

  // Real-time ticking stopwatch for Stress Simulation Mode
  useEffect(() => {
    if (terminalStep !== 'question' || activeWorkspaceTab !== 'terminal' || isGeneratingTerminalQuestion) {
      return;
    }
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [terminalStep, activeWorkspaceTab, isGeneratingTerminalQuestion]);

  // Reset timer on question change
  useEffect(() => {
    setElapsedSeconds(0);
    setDecisionDelay(null);
    setIsAskingTutor(false);
    setTutorResponse(null);
    setTutorHistory([]);
  }, [sampleQuestion]);

  const fetchNextAIQuestion = async (specificSubject?: string) => {
    setAutoAdvanceSeconds(null);
    setIsGeneratingTerminalQuestion(true);
    setTerminalGenerationError('');
    try {
      const bpscSubjects = [
        "Bangladesh Affairs",
        "International Affairs",
        "Mathematical Reasoning",
        "Mental Ability",
        "Bangla Language & Literature",
        "English Language & Literature",
        "General Science",
        "Computer & ICT",
        "Geography, Environment & Disaster Management",
        "Ethics, Values & Good Governance"
      ];
      
      const bankSubjects = [
        "Mathematical Reasoning", // Quantitative Math
        "English Language & Literature", // Verbal and grammar
        "Computer & ICT", // IT and electronic banking
        "International Affairs" // GK
      ];

      const activeSubjectList = examMode === 'BANK_AD' ? bankSubjects : bpscSubjects;
      const randomSubject = specificSubject || activeSubjectList[Math.floor(Math.random() * activeSubjectList.length)];
      
      const response = await fetch('/api/ai/adaptive-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: randomSubject,
          topic: examMode === 'BANK_AD' ? "IBA high speed analytical quantitative and english" : "Syllabus high yield topics",
          difficulty: examMode === 'BANK_AD' ? "Hard" : "Medium",
          examType: examMode === 'BANK_AD' ? "Bank" : "BCS",
          questionLanguage: examMode === 'BANK_AD' ? "English" : "Bangla"
        })
      });

      if (!response.ok) {
        throw new Error(`Failed with status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.text && data.options) {
        const formattedQ: Question = {
          id: data.id || "RF-Q" + Math.floor(Math.random() * 1000),
          text: data.text,
          options: data.options,
          correctIndex: typeof data.correctIndex === 'number' ? data.correctIndex : 0,
          subject: data.subject || randomSubject,
          topic: data.topic || "Core Concept",
          difficulty: data.difficulty || (examMode === 'BANK_AD' ? "Hard" : "Medium"),
          concept: data.concept || "Interactive Evaluation",
          cognitiveDimension: data.cognitiveDimension || "applied knowledge",
          uniquenessScore: data.uniquenessScore || 95,
          difficultyScore: data.difficultyScore || (examMode === 'BANK_AD' ? 88 : 75),
          conceptDepthScore: data.conceptDepthScore || 85,
          syllabusRelevanceScore: data.syllabusRelevanceScore || 98,
          distractorQualityScore: data.distractorQualityScore || 90,
          overallQualityScore: data.overallQualityScore || 92,
          recruitmentRelevance: data.recruitmentRelevance || "Dynamic AI assessment testing cross-disciplinary cognitive capabilities.",
          explanations: data.explanations || {
            bn: "সভ্য সমাজ ও পরীক্ষার প্রয়োজনে সঠিক উত্তরের ব্যাখ্যা এআই দ্বারা রিয়েল-টাইমে জেনারেট করা হয়েছে।",
            en: "Explanations generated in real-time by cognitive AI systems.",
            wrongOptions: data.explanations?.wrongOptions || ["Option analysis is computed based on historical BPSC patterns."]
          }
        };
        setSampleQuestion(formattedQ);
        setTerminalStep('question');
        setSelectedAnswer(null);
      } else {
        throw new Error("Invalid question format received from API.");
      }
    } catch (err: any) {
      console.error("Error generating terminal question:", err);
      setTerminalGenerationError("AI Engine overloaded. Restoring backup high-yield node.");
      
      const localFallbacks: Question[] = [
        {
          id: "RF-Q201",
          text: "বাঙালী জাতির মুক্তির সনদ 'ছয় দফা' আনুষ্ঠানিকভাবে কবে এবং কোথায় ঘোষণা করা হয়েছিল?",
          options: [
            "৫ ফেব্রুয়ারি ১৯৬৬, লাহোরে",
            "২৩ মার্চ ১৯৬৬, লাহোরে",
            "১৩ ফেব্রুয়ারি ১৯৬৬, করাচীতে",
            "১৮ মার্চ ১৯৬৬, ঢাকায়"
          ],
          correctIndex: 1,
          subject: "Bangladesh Affairs",
          topic: "সংविधानের অনুচ্ছেদ (Constitution)",
          difficulty: "Medium",
          concept: "Six-Point Movement",
          cognitiveDimension: "factual recall",
          uniquenessScore: 92,
          difficultyScore: 70,
          conceptDepthScore: 80,
          syllabusRelevanceScore: 100,
          distractorQualityScore: 95,
          overallQualityScore: 89,
          recruitmentRelevance: "High-yield historical event milestone in BCS preliminary exam.",
          explanations: {
            bn: "বঙ্গবন্ধু শেখ মুজিবুর রহমান ১৯৬৬ সালের ৫-৬ ফেব্রুয়ারি লাহোরে অনুষ্ঠিত বিরোধী দলসমূহের এক সম্মেলনে প্রথম ছয় দফা উপস্থাপন করেন, তবে এটি আনুষ্ঠানিকভাবে ২৩ মার্চ ১৯৬৬ সালে লাহোরেই ঘোষণা করা হয়।",
            en: "The Six-Point Movement was first presented on Feb 5-6, 1966 in Lahore, but was officially announced and declared on March 23, 1966 in Lahore.",
            wrongOptions: [
              "৫ ফেব্রুয়ারি লাহোরে প্রথম উত্থাপন করা হয়েছিল, কিন্তু আনুষ্ঠানিকভাবে ঘোষণা করা হয়নি।",
              "১৩ ফেব্রুয়ারি করাচীতে কোনো আনুষ্ঠানিক ঘোষণা বা উত্থাপন হয়নি।",
              "১৮ মার্চ ১৯৬৬ সালে আওয়ামী লীগের ওয়ার্কিং কমিটিতে এটি অনুমোদিত হয়।"
            ]
          }
        },
        {
          id: "RF-Q202",
          text: "What is the correct English translation of the sentence: 'সে আসার পর আমি প্রস্থান করলাম'?",
          options: [
            "I departed after he came.",
            "I departed after he had come.",
            "I had departed before he came.",
            "I departed before he came."
          ],
          correctIndex: 1,
          subject: "English Language & Literature",
          topic: "Romantic Period (English)",
          difficulty: "Medium",
          concept: "Past Perfect Tense Sequence",
          cognitiveDimension: "applied knowledge",
          uniquenessScore: 88,
          difficultyScore: 65,
          conceptDepthScore: 75,
          syllabusRelevanceScore: 98,
          distractorQualityScore: 85,
          overallQualityScore: 82,
          recruitmentRelevance: "Standard grammatical sequence mapping, extremely recurring in IBA and BCS grammar sections.",
          explanations: {
            bn: "Past Perfect টেন্সে 'after'-এর পূর্ববর্তী অংশ Past Indefinite এবং পরবর্তী অংশ Past Perfect হয়। অতএব 'I departed after he had come' সঠিক।",
            en: "In past perfect sentence construction involving 'after', the independent clause is in the past simple and the 'after' clause is in the past perfect. Hence: 'I departed after he had come'.",
            wrongOptions: [
              "he came ভুল সিকোয়েন্স প্রকাশ করে কারণ আসার কাজটি পূর্বে সংঘটিত হয়েছে।",
              "I had departed before he came বিপরীত অর্থ বহন করে।",
              "ভুল টেন্স সিকোয়েন্স।"
            ]
          }
        },
        {
          id: "RF-Q203",
          text: "A shopkeeper sells an item at a 15% discount but still makes a 20% profit. If the cost price of the item is BDT 340, what is the marked price?",
          options: [
            "BDT 450",
            "BDT 480",
            "BDT 500",
            "BDT 420"
          ],
          correctIndex: 1,
          subject: "Mathematical Reasoning",
          topic: "Geometry & Area",
          difficulty: "Hard",
          concept: "Discount and Markup Calculations",
          cognitiveDimension: "analytical synthesis",
          uniquenessScore: 95,
          difficultyScore: 85,
          conceptDepthScore: 90,
          syllabusRelevanceScore: 99,
          distractorQualityScore: 90,
          overallQualityScore: 92,
          recruitmentRelevance: "Tests advanced business math formulas frequently seen in IBA bank exams and BPSC mathematical prelims.",
          explanations: {
            bn: "ক্রয়মূল্য ৩৪০ টাকা। ২০% লাভে বিক্রয়মূল্য = ৩৪০ * ১.২ = ৪০৮ টাকা। এই বিক্রয়মূল্যটি আবার লিখিত মূল্যের উপর ১৫% ছাড় দেওয়ার পর পাওয়া গেছে। সুতরাং, লিখিত মূল্য = ৪০৮ / ০.৮৫ = ৪৮০ টাকা।",
            en: "CP = 340. Profit of 20% means SP = 340 * 1.2 = 408 BDT. Since SP is after a 15% discount on Marked Price (MP), 0.85 * MP = 408 => MP = 408 / 0.85 = 480 BDT.",
            wrongOptions: [
              "BDT 450 calculates a flat markup without considering correct profit margins on cost price.",
              "BDT 500 would result in a higher profit ratio of over 25%.",
              "BDT 420 is too low to sustain a 15% discount."
            ]
          }
        }
      ];
      const randomFallback = localFallbacks[Math.floor(Math.random() * localFallbacks.length)];
      setSampleQuestion(randomFallback);
      setTerminalStep('question');
      setSelectedAnswer(null);
    } finally {
      setIsGeneratingTerminalQuestion(false);
    }
  };

  const handleDemoAnswerSubmit = (index: number) => {
    setSelectedAnswer(index);
    setDecisionDelay(elapsedSeconds);
    const isCorrect = index === sampleQuestion.correctIndex;

    // 1. Dynamic Diagnostic Score Tracking
    const matchedKey = Object.keys(diagnosticScores).find(
      key => (sampleQuestion.topic || "").toLowerCase().includes(key.toLowerCase()) || 
             (sampleQuestion.subject || "").toLowerCase().includes(key.toLowerCase())
    ) || "সংবিধানের অনুচ্ছেদ (৩০-৪৭)"; // fallback

    setDiagnosticScores(prev => {
      const existing = prev[matchedKey] || { correct: 0, total: 0, topicName: sampleQuestion.topic || "সাধারণ বিষয়াবলী" };
      const updated = {
        ...prev,
        [matchedKey]: {
          ...existing,
          correct: existing.correct + (isCorrect ? 1 : 0),
          total: existing.total + 1
        }
      };
      localStorage.setItem("rf_diagnostic_scores", JSON.stringify(updated));
      return updated;
    });

    if (isCorrect) {
      setTerminalStep('answered');
    } else {
      // 2. Add to "ভুল খাতা" (Interactive Personal Mistake Ledger)
      setMistakesList(prev => {
        if (prev.some(q => q.id === sampleQuestion.id || q.text === sampleQuestion.text)) {
          return prev;
        }
        const updated = [sampleQuestion, ...prev];
        localStorage.setItem("rf_mistake_ledger", JSON.stringify(updated));
        return updated;
      });

      // Trigger container shake micro-interaction
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 300);
      setTerminalStep('answered');
    }
    setAutoAdvanceSeconds(5);
  };

  // AI Tutor prompt formulation
  const handleAskAITutor = async () => {
    if (tutorLoading) return;
    setTutorLoading(true);
    setIsAskingTutor(true);
    setTutorResponse(null);
    try {
      const userMessage = `I am preparing for the BPSC/Bank AD competitive exams in Bangladesh. 
For this question: "${sampleQuestion.text}"
Options:
1. ${sampleQuestion.options[0]}
2. ${sampleQuestion.options[1]}
3. ${sampleQuestion.options[2]}
4. ${sampleQuestion.options[3]}
The correct answer is Option ${sampleQuestion.correctIndex + 1} ("${sampleQuestion.options[sampleQuestion.correctIndex]}").
I answered Option ${selectedAnswer !== null ? selectedAnswer + 1 : 'none'}.

Please explain this in detail. Make sure to provide:
1. A shortcut trick or memory mnemonic (মনে রাখার শর্টকাট উপায় বা টেকনিক) in bilingual Bangla/English.
2. A detailed step-by-step written solution (লিখিত পরীক্ষার স্ট্যান্ডার্ড উত্তর) that breaks down the math, grammar, or general knowledge background.
Keep your response professional and fully bilingual.`;

      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      const data = await response.json();
      setTutorResponse(data.reply || data.explanation || "No explanation returned by AI server.");
    } catch (err) {
      console.error(err);
      setTutorResponse("AI server currently unreachable. Defaulting to local cache.");
    } finally {
      setTutorLoading(false);
    }
  };

  const handleTutorFollowUp = async () => {
    if (!tutorInputMessage.trim() || tutorLoading) return;
    const userMsgText = tutorInputMessage.trim();
    setTutorInputMessage("");
    setTutorHistory(prev => [...prev, { sender: 'user', text: userMsgText }]);
    setTutorLoading(true);
    try {
      const response = await fetch('/api/ai/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Follow-up query: "${userMsgText}" regarding original question "${sampleQuestion.text}".` })
      });
      const data = await response.json();
      const aiReply = data.reply || data.explanation || "No reply from AI.";
      setTutorHistory(prev => [...prev, { sender: 'ai', text: typeof aiReply === 'string' ? aiReply : (aiReply.bilingual?.bn || aiReply.text || JSON.stringify(aiReply)) }]);
    } catch (err) {
      console.error(err);
      setTutorHistory(prev => [...prev, { sender: 'ai', text: "Sorry, I am unable to connect to the server at this time." }]);
    } finally {
      setTutorLoading(false);
    }
  };

  const handleClearMistakes = () => {
    setMistakesList([]);
    localStorage.removeItem("rf_mistake_ledger");
  };

  const handleReTestAnswerSubmit = (idx: number) => {
    setReTestSelectedAnswer(idx);
    setReTestStep('answered');
  };

  const handleNextReTestQuestion = () => {
    const currentQuestion = mistakesList[reTestIndex];
    let updatedMistakes = [...mistakesList];
    
    if (reTestSelectedAnswer === currentQuestion.correctIndex) {
      updatedMistakes = mistakesList.filter((_, i) => i !== reTestIndex);
      setMistakesList(updatedMistakes);
      localStorage.setItem("rf_mistake_ledger", JSON.stringify(updatedMistakes));
    }

    if (updatedMistakes.length === 0) {
      setReTestActive(false);
      setReTestIndex(0);
    } else {
      const nextIndex = reTestSelectedAnswer === currentQuestion.correctIndex
        ? (reTestIndex >= updatedMistakes.length ? 0 : reTestIndex)
        : (reTestIndex + 1) % updatedMistakes.length;
      
      setReTestIndex(nextIndex);
      setReTestSelectedAnswer(null);
      setReTestStep('question');
    }
  };

  const flashcardsData = [
    {
      q: "কপ-২৯ (COP29) জলবায়ু সম্মেলন ২০২৪ কোথায় অনুষ্ঠিত হয়?",
      a: "আজারবাইজানের বাকু (Baku) শহরে। এটি আন্তর্জাতিক পরিবেশনীতি চ্যাপ্টারের অধীনে BCS-এর জন্য চরম হাই-ইয়েল্ড তথ্য!",
      mnemonic: "মনে রাখার লিঙ্ক: 'কপ-২৯ আজারবাইজান'—পরিবেশ আজ ব্যাকুল (বাকু)!"
    },
    {
      q: "অংক শর্টকাট: ২০% সরল সুদে কোনো আসল কত বছরে সুদে-আসলে ৩ গুণ হবে?",
      a: "১০ বছর।\n\nশর্টকাট সূত্র: বছর = (গুণ - ১) / সুদের হার * ১০০\n= (৩ - ১) / ২০ * ১০০ = ২ / ২০ * ১০০ = ১০ বছর।",
      mnemonic: "টেকনিক: সরল সুদের ৩ গুণ থেকে ১ বাদ দিয়ে ২ পাবেন, একে সুদের হার ২০ দিয়ে ভাগ করে ১০০ দিয়ে গুণ করলেই উত্তর শেষ!"
    },
    {
      q: "চর্যাপদের আধুনিক সংস্করণটি হরপ্রসাদ শাস্ত্রী কোথা থেকে কত সালে উদ্ধার করেন?",
      a: "১৯০৭ সালে নেপালের রাজদরবারের রয়েল লাইব্রেরি থেকে পুথিটি উদ্ধার করেন এবং ১৯১৬ সালে বঙ্গীয় সাহিত্য পরিষদ থেকে প্রকাশিত হয়।",
      mnemonic: "মনে রাখার সাল: ১৯০৭ সালে উদ্ধার, ১৯১৬ সালে প্রকাশ (মাঝে ব্যবধান ৯ বছর)।"
    }
  ];

  const services = [
    {
      id: "01",
      title: "Psychometric Question Engineering Panel",
      desc: "Our validation engine enforces strict multi-level checking of concept uniqueness, cognitive dimension, and distractor quality. We avoid duplicate schemas and template repetition—only rigorous, assessment-ready questions designed to stretch your reasoning capacity.",
      details: "Aligns questions exactly with the cognitive difficulty scaling expected by BPSC and IBA moderators."
    },
    {
      id: "02",
      title: "Spaced-Revision Memory Decay Forecast",
      desc: "Raw memorization fades within 48 hours. 9Th Grade AI tracks individual response history to calculate your personal retention decay curve. It strategically flags core concepts for review precisely when your probability of recall drops below 70%.",
      details: "Eliminates cognitive overload by prioritizing active-recall revisions over endless generic lectures."
    },
    {
      id: "03",
      title: "Interactive Live Rank Simulator",
      desc: "Cross-references your current mock analytics with historical data from 200,000+ candidates nationwide. Get an objective, live projection of your passing probability, percentile rank, and expected cohort positioning instantly.",
      details: "Uses predictive data modeling rather than optimistic, flat scoring metrics to give you a genuine view of the competition."
    },
    {
      id: "04",
      title: "Bilingual Generative Tutor & Evaluation",
      desc: "Stuck on a challenging mathematical formula, verbal analogy, or structural grammar question? Engage the context-aware AI Tutor. Upload files, prompt specific breakdowns, and get tailored analytical solutions in both Bengali and English.",
      details: "Includes our advanced written answer evaluator to score and provide structural suggestions for comprehensive written exams."
    }
  ];

  const syllabusMetrics = {
    BCS: [
      { subject: "Bangladesh Affairs", weight: 30, color: "from-indigo-500 to-indigo-600" },
      { subject: "International Affairs", weight: 20, color: "from-blue-500 to-blue-600" },
      { subject: "Mathematical Reasoning", weight: 30, color: "from-emerald-500 to-emerald-600" },
      { subject: "Bangla Literature", weight: 35, color: "from-violet-500 to-violet-600" },
      { subject: "English Language & Lit", weight: 35, color: "from-cyan-500 to-cyan-600" }
    ],
    BANK_AD: [
      { subject: "Quantitative Aptitude", weight: 30, color: "from-emerald-500 to-emerald-600" },
      { subject: "Analytical & Critical Logic", weight: 25, color: "from-indigo-500 to-indigo-600" },
      { subject: "Business English & Vocabulary", weight: 25, color: "from-cyan-500 to-cyan-600" },
      { subject: "ICT Core Concepts & Banking", weight: 20, color: "from-amber-500 to-amber-600" }
    ],
    NON_CADRE: [
      { subject: "General Knowledge & Science", weight: 30, color: "from-blue-500 to-blue-600" },
      { subject: "Bangla Grammar & Lit", weight: 25, color: "from-violet-500 to-violet-600" },
      { subject: "English Grammar & Writing", weight: 25, color: "from-cyan-500 to-cyan-600" },
      { subject: "Arithmetic & Mental Ability", weight: 20, color: "from-emerald-500 to-emerald-600" }
    ],
    PRIMARY: [
      { subject: "Bangla Language", weight: 25, color: "from-violet-500 to-violet-600" },
      { subject: "English Language", weight: 25, color: "from-cyan-500 to-cyan-600" },
      { subject: "Elementary Mathematics", weight: 25, color: "from-emerald-500 to-emerald-600" },
      { subject: "General Knowledge", weight: 25, color: "from-indigo-500 to-indigo-600" }
    ]
  };

  const navLinks = [
    { label: "Pipeline", href: "#pipeline" },
    { label: "Bento Core", href: "#bento" },
    { label: "Mock Terminal", href: "#terminal" },
    { label: "Services", href: "#services" },
    { label: "Vision", href: "#vision" }
  ];

  return (
    <div 
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }}
      onMouseEnter={() => setIsMouseInContainer(true)}
      onMouseLeave={() => setIsMouseInContainer(false)}
      className="min-h-screen bg-[#03020b] text-neutral-100 font-sans selection:bg-cyan-500 selection:text-slate-950 pb-16 overflow-x-hidden relative"
    >
      
      {/* BACKGROUND VIBRANT GLOW SYSTEM & GRID */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep space cosmic backdrop layer */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,10,48,0.45),rgba(3,2,11,0.3))] mix-blend-screen" />
        
        {/* Animated Aurora 1: Cyber Cyan flow */}
        <div className="absolute -top-[5%] left-[5%] w-[55%] h-[45%] rounded-full bg-cyan-500/12 blur-[130px] mix-blend-screen animate-float-slow" />
        
        {/* Animated Aurora 2: Majestic Violet Purple Core */}
        <div className="absolute top-[25%] right-[10%] w-[50%] h-[50%] rounded-full bg-violet-600/15 blur-[150px] mix-blend-screen animate-float-medium" />
        
        {/* Animated Aurora 3: Motivated Fuchsia Pulse */}
        <div className="absolute top-[55%] left-[8%] w-[45%] h-[45%] rounded-full bg-fuchsia-600/10 blur-[130px] mix-blend-screen animate-pulse-slow" />
        
        {/* Animated Aurora 4: Success Emerald/Teal Horizon */}
        <div className="absolute bottom-[5%] right-[12%] w-[40%] h-[40%] rounded-full bg-emerald-500/10 blur-[140px] mix-blend-screen animate-float-slow" />

        {/* Laser-sharp glowing grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_80%,transparent_100%)]" />
      </div>
      
      {/* MOUSE TRACKING GLOW SPOTLIGHT */}
      {isMouseInContainer && (
        <div 
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-cyan-500/6 to-indigo-500/6 blur-[110px] rounded-full z-10 transition-opacity duration-300 mix-blend-screen"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
          }}
        />
      )}

      {/* 1. TOP DYNAMIC STATUS BAR */}
      <div className="border-b border-white/5 bg-[#03020b]/30 backdrop-blur-md py-2 px-6 text-xs font-mono relative z-50">
        <div className="max-w-7xl mx-auto flex justify-center items-center gap-2 text-neutral-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-500"></span>
          </span>
          <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mr-1">LIVE SYSTEM TIME:</span>
          {currentTime && (
            <span className="text-neutral-200 font-mono tracking-tight bg-white/5 px-2.5 py-0.5 rounded border border-white/5">{currentTime}</span>
          )}
        </div>
      </div>

      {/* 2. STICKY/FLOATING GLOBAL NAVIGATION */}
      <nav className={`fixed left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'top-4 w-[calc(100%-2rem)] max-w-5xl bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl shadow-black/90 py-2.5 px-6' 
          : 'top-12 w-full max-w-7xl bg-[#050505]/40 backdrop-blur-md border-b border-white/5 py-3.5 px-6'
      }`}>
        <div className="flex justify-between items-center">
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-cyan-500 rounded-xl shadow-lg shadow-indigo-500/10">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-widest font-mono text-white flex items-center gap-1.5 leading-none">
                9TH GRADE <span className="text-[8px] bg-indigo-500/15 text-indigo-300 px-1 py-0.5 rounded border border-indigo-500/30 font-bold uppercase tracking-widest font-mono">AI OS</span>
              </span>
              <span className="text-[8px] font-mono text-neutral-500 uppercase tracking-widest leading-none mt-1">Farhan's OS v3.5</span>
            </div>
          </div>

          {/* Nav with Shared Layout Pill Indicator - DESKTOP ONLY */}
          <div className="hidden md:flex items-center gap-1 bg-black/40 border border-white/5 rounded-full p-1 relative">
            {navLinks.map((link) => {
              let handler: (() => void) | undefined = undefined;
              if (link.label === "Pipeline") handler = onViewPipeline;
              else if (link.label === "Bento Core") handler = onViewBento;
              else if (link.label === "Mock Terminal") handler = onViewTerminal;
              else if (link.label === "Services") handler = onViewServices;
              else if (link.label === "Vision") handler = onViewVision;

              const isLinkActive = (link.label === "Pipeline" && activeSection === "pipeline") ||
                                   (link.label === "Bento Core" && activeSection === "workspace") ||
                                   (link.label === "Mock Terminal" && activeSection === "terminal") ||
                                   (link.label === "Services" && activeSection === "services") ||
                                   (link.label === "Vision" && activeSection === "vision");

              return handler ? (
                <button
                  key={link.label}
                  onClick={handler}
                  onMouseEnter={() => setHoveredNav(link.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`relative z-10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 cursor-pointer bg-transparent border-none focus:outline-none ${
                    isLinkActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {(hoveredNav === link.label || isLinkActive) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isLinkActive ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-white/5 border border-white/10'
                      }`}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredNav(link.label)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className={`relative z-10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-colors duration-200 ${
                    isLinkActive ? 'text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {(hoveredNav === link.label || isLinkActive) && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isLinkActive ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-white/5 border border-white/10'
                      }`}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </div>

          {/* Desktop Right Buttons & Mobile Toggle */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              {user ? (
                <button 
                  onClick={onGoToDashboard}
                  className="px-4.5 py-2 bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer font-mono shadow-md hover:shadow-lg hover:shadow-white/10"
                >
                  Enter OS Dashboard
                </button>
              ) : (
                <button 
                  onClick={onOpenAuth}
                  className="px-4.5 py-2 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-200 border border-white/10 hover:border-white/20 font-semibold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer font-mono"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Mobile Burger Toggle Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="flex md:hidden items-center justify-center p-2 rounded-full bg-neutral-900 border border-white/5 hover:border-white/10 text-neutral-300 hover:text-white transition-colors cursor-pointer"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu with Slide-down Animation */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/5 mt-4 -mx-6 px-6 py-4 space-y-4 rounded-b-2xl"
            >
              <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
                {navLinks.map((link) => {
                  let handler: (() => void) | undefined = undefined;
                  if (link.label === "Pipeline") handler = onViewPipeline;
                  else if (link.label === "Bento Core") handler = onViewBento;
                  else if (link.label === "Mock Terminal") handler = onViewTerminal;
                  else if (link.label === "Services") handler = onViewServices;
                  else if (link.label === "Vision") handler = onViewVision;

                  return handler ? (
                    <button
                      key={link.label}
                      onClick={() => {
                        setIsMobileNavOpen(false);
                        handler();
                      }}
                      className="w-full text-left py-2.5 text-neutral-400 hover:text-white border-b border-white/5 text-xs font-mono uppercase tracking-widest cursor-pointer bg-transparent"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <a
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileNavOpen(false)}
                      className="w-full text-left py-2.5 text-neutral-400 hover:text-white border-b border-white/5 block"
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>

              <div className="pt-2">
                {user ? (
                  <button 
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      onGoToDashboard();
                    }}
                    className="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl text-center cursor-pointer font-mono"
                  >
                    Enter OS Dashboard
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setIsMobileNavOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-white/10 text-center font-semibold text-xs uppercase tracking-wider rounded-xl cursor-pointer font-mono"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. DYNAMIC CINEMATIC HERO (MISSION CONTROL) */}
      <header className="max-w-7xl mx-auto px-6 pt-36 md:pt-44 pb-20 text-left relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <span className="inline-flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-indigo-400 uppercase bg-indigo-950/30 px-3.5 py-1.5 rounded-full border border-indigo-900/40">
              <Activity className="w-3.5 h-3.5 animate-pulse text-indigo-400" /> DIRECTIVE 01: COGNITIVE OPTIMIZATION
            </span>
            
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05] font-display">
              <div className="overflow-hidden block">
                <motion.span 
                  initial={{ y: "100%" }} 
                  animate={{ y: 0 }} 
                  transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                  className="block"
                >
                  CURRENT MISSION:
                </motion.span>
              </div>
              <div className="overflow-hidden block text-neutral-400">
                <motion.span 
                  initial={{ y: "100%" }} 
                  animate={{ y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                  className="block"
                >
                  BECOME A FIRST CLASS
                </motion.span>
              </div>
              <div className="overflow-hidden block">
                <motion.span 
                  initial={{ y: "100%" }} 
                  animate={{ y: 0 }} 
                  transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400"
                >
                  GAZETTED OFFICER.
                </motion.span>
              </div>
            </h1>

            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-neutral-400 text-base md:text-lg font-normal leading-relaxed max-w-2xl"
            >
              The first intelligent Personal Operating System built specifically for competitive examination prep in Bangladesh. Track retention decay, optimize recall weightings, and predict your national percentile ranking.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-2"
            >
              <button 
                onClick={() => {
                  if (!user) {
                    onOpenAuth();
                  } else {
                    onStartOnboarding(selectedExam);
                  }
                }}
                className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-full transition-all shadow-xl shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                {user ? 'Initiate AI Diagnosis' : 'Access Secure Assessment'}
                <ArrowRight className="w-4 h-4 text-white" />
              </button>
              <a 
                href="#bento"
                className="px-6 py-3.5 bg-neutral-900/80 hover:bg-neutral-800 border border-white/5 hover:border-white/10 text-neutral-300 font-semibold text-xs uppercase tracking-wider rounded-full transition-all text-center flex items-center justify-center gap-2 font-mono"
              >
                Explore Workspace OS
              </a>
            </motion.div>
          </div>

          {/* Right Column: High-Fidelity OS Live Control Panel */}
          <div className="lg:col-span-6">
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-neutral-950/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl shadow-black/80 space-y-6"
            >
              {/* Decorative terminal header */}
              <div className="flex justify-between items-center pb-4 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80 animate-pulse shadow-sm shadow-indigo-500/50" />
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500/80 animate-pulse" />
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500/80" />
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest font-bold ml-2">MISSION_CONTROL.sh</span>
                </div>
                <span className="text-[9px] font-mono bg-indigo-500/10 text-indigo-300 px-2.5 py-1 border border-indigo-500/20 rounded-full uppercase font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-ping" /> LIVE SYSTEM TELEMETRY
                </span>
              </div>

              {/* Minimal OS Target Track Selector inside Mission Control */}
              <div className="p-1 bg-[#090909] border border-white/5 rounded-xl flex gap-1">
                {(['BCS', 'BANK_AD', 'NON_CADRE', 'PRIMARY'] as ExamType[]).map((exam) => (
                  <button
                    key={exam}
                    type="button"
                    onClick={() => setSelectedExam(exam)}
                    className={`flex-1 py-2 text-[9px] sm:text-[10px] font-bold rounded-lg transition-all cursor-pointer font-mono uppercase relative ${
                      selectedExam === exam 
                        ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' 
                        : 'text-neutral-500 hover:text-neutral-300 border border-transparent'
                    }`}
                  >
                    {selectedExam === exam && (
                      <motion.div 
                        layoutId="activeHeroTabIndicator"
                        className="absolute inset-0 bg-indigo-500/5 rounded-lg -z-10 border border-indigo-500/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {exam === 'BCS' ? 'BCS PRELIM' : exam === 'BANK_AD' ? 'BB AD' : exam === 'NON_CADRE' ? 'NON-CADRE' : 'PRIMARY'}
                  </button>
                ))}
              </div>

              {/* Status block grid with framer-motion layout animations */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* 1. ACTIVE TARGET CARD */}
                <motion.div 
                  layout
                  className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-4 rounded-2xl text-left relative overflow-hidden group hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">Active Track Target</span>
                  <motion.span 
                    key={selectedExam}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs sm:text-sm text-neutral-100 font-bold font-sans mt-1.5 block tracking-tight"
                  >
                    {selectedExam === 'BCS' && '46th BCS Preliminary'}
                    {selectedExam === 'BANK_AD' && 'BB Assistant Director'}
                    {selectedExam === 'NON_CADRE' && 'Non-Cadre Track (Grade 9)'}
                    {selectedExam === 'PRIMARY' && 'Primary Teacher Prep'}
                  </motion.span>
                  <span className="text-[8px] font-mono text-indigo-400 mt-2 block uppercase bg-indigo-950/20 border border-indigo-900/30 px-1.5 py-0.5 rounded w-max">
                    {selectedExam === 'BCS' && '142 days remaining'}
                    {selectedExam === 'BANK_AD' && '58 days remaining'}
                    {selectedExam === 'NON_CADRE' && '184 days remaining'}
                    {selectedExam === 'PRIMARY' && '96 days remaining'}
                  </span>
                </motion.div>

                {/* 2. PREDICTED RANK PROJECTION */}
                <motion.div 
                  layout
                  className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-4 rounded-2xl text-left relative overflow-hidden group hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 blur-xl pointer-events-none rounded-full" />
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">Predicted Rank Placement</span>
                  <div className="mt-1.5 flex items-baseline gap-1.5">
                    <motion.span 
                      key={`rank-min-${selectedExam}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-base sm:text-lg text-indigo-400 font-bold font-mono tracking-tight"
                    >
                      #{selectedExam === 'BCS' ? telemetryRankMin : selectedExam === 'BANK_AD' ? Math.max(12, Math.floor(telemetryRankMin / 3.5)) : selectedExam === 'NON_CADRE' ? Math.floor(telemetryRankMin * 2.2) : Math.floor(telemetryRankMin * 1.8)}
                    </motion.span>
                    <span className="text-[9px] font-mono text-neutral-600 font-normal">to</span>
                    <motion.span 
                      key={`rank-max-${selectedExam}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm sm:text-base text-neutral-300 font-bold font-mono tracking-tight"
                    >
                      #{selectedExam === 'BCS' ? telemetryRankMax : selectedExam === 'BANK_AD' ? Math.max(30, Math.floor(telemetryRankMax / 3.2)) : selectedExam === 'NON_CADRE' ? Math.floor(telemetryRankMax * 2.1) : Math.floor(telemetryRankMax * 1.6)}
                    </motion.span>
                    <motion.span 
                      key={`rank-delta-${selectedExam}`}
                      initial={{ opacity: 0, x: 5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-emerald-400 font-mono font-semibold ml-auto"
                    >
                      {selectedExam === 'BCS' ? '▲ 14' : selectedExam === 'BANK_AD' ? '▲ 8' : selectedExam === 'NON_CADRE' ? '▲ 22' : '▲ 18'}
                    </motion.span>
                  </div>
                  <div className="w-full flex items-center justify-between mt-2.5">
                    <span className="text-[8px] font-mono text-neutral-500 uppercase">NATIONAL PERCENTILE</span>
                    <span className="text-[8px] font-mono text-emerald-400 bg-emerald-950/20 px-1 rounded border border-emerald-900/30">TOP 0.8%</span>
                  </div>
                </motion.div>

                {/* 3. COGNITIVE RETENTION QUOTIENT */}
                <motion.div 
                  layout
                  className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-4 rounded-2xl text-left relative overflow-hidden group hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all col-span-2 sm:col-span-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-xl pointer-events-none rounded-full" />
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">Retention Quotient</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <motion.span 
                      key={`retention-${selectedExam}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-lg sm:text-xl text-white font-bold font-mono tracking-tight"
                    >
                      {selectedExam === 'BCS' ? telemetryRetention : selectedExam === 'BANK_AD' ? Number((telemetryRetention + 3.8).toFixed(2)) : selectedExam === 'NON_CADRE' ? Number((telemetryRetention - 5.2).toFixed(2)) : Number((telemetryRetention - 2.1).toFixed(2))}%
                    </motion.span>
                    <motion.span 
                      key={`retention-status-${selectedExam}`}
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider"
                    >
                      {selectedExam === 'BCS' ? (telemetryRetention > 85.0 ? 'OPTIMIZED' : 'DECAY_GUARD') : selectedExam === 'BANK_AD' ? (telemetryRetention + 3.8 > 88.5 ? 'CRITICAL_MAX' : 'SYNCING') : selectedExam === 'NON_CADRE' ? (telemetryRetention - 5.2 > 78.0 ? 'STABLE' : 'CALIBRATING') : (telemetryRetention - 2.1 > 82.0 ? 'STEADY' : 'RE-INDEXING')}
                    </motion.span>
                  </div>
                  <div className="w-full bg-neutral-900/60 h-1.5 rounded-full mt-3 overflow-hidden border border-white/5 relative">
                    <motion.div 
                      key={`retention-bar-${selectedExam}`}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${selectedExam === 'BCS' ? telemetryRetention : selectedExam === 'BANK_AD' ? telemetryRetention + 3.8 : selectedExam === 'NON_CADRE' ? telemetryRetention - 5.2 : telemetryRetention - 2.1}%` }} 
                      transition={{ duration: 1.2, ease: "easeOut" }} 
                    />
                  </div>
                  <span className="text-[8px] font-mono text-neutral-500 mt-2 block uppercase">EBBINGHAUS DECAY SHIELD ACTIVE</span>
                </motion.div>

                {/* 4. MISSION STATUS */}
                <motion.div 
                  layout
                  className="bg-white/[0.02] backdrop-blur-md border border-white/5 p-4 rounded-2xl text-left relative overflow-hidden group hover:bg-white/[0.04] hover:border-indigo-500/20 transition-all col-span-2 sm:col-span-1"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
                  <span className="text-[9px] font-mono text-neutral-500 uppercase tracking-wider block font-bold">Mission Directive Status</span>
                  <div className="flex items-center justify-between mt-1.5">
                    <motion.span 
                      key={`status-${selectedExam}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs sm:text-sm text-indigo-300 font-mono font-bold tracking-wider"
                    >
                      {selectedExam === 'BCS' ? telemetryStatus : selectedExam === 'BANK_AD' ? 'CRITICAL_PATH' : selectedExam === 'NON_CADRE' ? (telemetryStatus === 'OPTIMIZED' ? 'INDEXED' : telemetryStatus) : telemetryStatus}
                    </motion.span>
                    <span className="text-[8px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-1.5 py-0.5 rounded font-bold uppercase">
                      {telemetrySubsystem}
                    </span>
                  </div>
                  <div className="w-full flex items-center justify-between mt-3 text-[10px] font-mono">
                    <span className="text-neutral-500 text-[8px] uppercase">THROUGHPUT</span>
                    <motion.span 
                      key={`throughput-${selectedExam}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-emerald-400 font-bold"
                    >
                      {selectedExam === 'BCS' ? telemetryThroughput : selectedExam === 'BANK_AD' ? Number((telemetryThroughput - 0.4).toFixed(1)) : selectedExam === 'NON_CADRE' ? Number((telemetryThroughput - 1.2).toFixed(1)) : Number((telemetryThroughput + 0.3).toFixed(1))}%
                    </motion.span>
                  </div>
                  <div className="w-full bg-neutral-900/60 h-1.5 rounded-full mt-1.5 overflow-hidden border border-white/5">
                    <motion.div 
                      key={`health-bar-${selectedExam}`}
                      className="bg-emerald-500 h-full rounded-full" 
                      initial={{ width: 0 }} 
                      animate={{ width: `${selectedExam === 'BCS' ? telemetryThroughput : selectedExam === 'BANK_AD' ? telemetryThroughput - 0.4 : selectedExam === 'NON_CADRE' ? telemetryThroughput - 1.2 : telemetryThroughput + 0.3}%` }} 
                      transition={{ duration: 1.2, ease: "easeOut" }} 
                    />
                  </div>
                </motion.div>

              </div>

              {/* Interactive nodes layer control */}
              <div className="grid grid-cols-3 gap-3">
                {/* Node 1 */}
                <button
                  type="button"
                  onClick={() => setSelectedHeroNode('client')}
                  className={`p-3 rounded-xl text-center space-y-2 relative transition-all cursor-pointer border ${
                    selectedHeroNode === 'client'
                      ? 'bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-950/50 scale-[1.03]'
                      : 'bg-neutral-900/40 border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center mx-auto border border-indigo-900/30">
                    <Compass className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-neutral-500 uppercase block">Layer 01</span>
                    <span className="text-[10px] text-white font-semibold block">Client Request</span>
                  </div>
                </button>
  
                {/* Node 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedHeroNode('psychometric')}
                  className={`p-3 rounded-xl text-center space-y-2 relative transition-all cursor-pointer border ${
                    selectedHeroNode === 'psychometric'
                      ? 'bg-emerald-950/40 border-emerald-500/40 shadow-lg shadow-emerald-950/50 scale-[1.03]'
                      : 'bg-neutral-900/40 border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-950 flex items-center justify-center mx-auto border border-emerald-900/30">
                    <Shield className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-neutral-500 uppercase block">Layer 02</span>
                    <span className="text-[10px] text-white font-semibold block">Psychometric</span>
                  </div>
                </button>
  
                {/* Node 3 */}
                <button
                  type="button"
                  onClick={() => setSelectedHeroNode('gemini')}
                  className={`p-3 rounded-xl text-center space-y-2 relative transition-all cursor-pointer border ${
                    selectedHeroNode === 'gemini'
                      ? 'bg-purple-950/40 border-purple-500/40 shadow-lg shadow-purple-950/50 scale-[1.03]'
                      : 'bg-neutral-900/40 border-white/5 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-950 flex items-center justify-center mx-auto border border-purple-900/30">
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-neutral-500 uppercase block">Layer 03</span>
                    <span className="text-[10px] text-white font-semibold block">Gemini Flash</span>
                  </div>
                </button>
  
              </div>
  
              {/* Animated SVG Path Connecting Lines with flowing dots */}
              <div className="w-full h-12 relative flex items-center justify-center">
                <svg className="w-full h-full overflow-visible absolute top-0 left-0" viewBox="0 0 400 50">
                  <path id="flow-path-1" d="M 50 15 L 200 15 L 350 15" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                  <path id="flow-path-2" d="M 50 35 C 150 55, 250 -5, 350 35" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
                  
                  {/* Flowing animated pulses */}
                  <motion.circle r="3" fill="#6366f1" style={{ offsetPath: "url(#flow-path-1)", offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
                  <motion.circle r="3" fill="#10b981" style={{ offsetPath: "url(#flow-path-2)", offsetDistance: "0%" }} animate={{ offsetDistance: "100%" }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
                </svg>
                <span className="text-[10px] font-mono text-neutral-500 uppercase z-10 bg-[#03020b]/90 backdrop-blur-md px-3 py-1 border border-white/5 rounded-full">
                  {selectedHeroNode === 'client' && 'Tracing Layer 01...'}
                  {selectedHeroNode === 'psychometric' && 'Optimizing Decay Factors...'}
                  {selectedHeroNode === 'gemini' && 'Grounding Contextual Graph...'}
                </span>
              </div>
  
              {/* Dynamic Log stream readouts based on selected node */}
              <div className="bg-[#080808] border border-white/5 rounded-xl p-4.5 font-mono text-[10px] text-neutral-400 space-y-2.5 text-left">
                {selectedHeroNode === 'client' && (
                  <>
                    <div className="flex justify-between text-indigo-400">
                      <span>[REQ] INCOMING BPSC EXAM PREFERENCE...</span>
                      <span>ACTIVE</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>[CONN] LATENCY MEASUREMENT RUNNING...</span>
                      <span className="text-emerald-400">38MS OK</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>[META] DEVICE VIEWPORT RESOLVED...</span>
                      <span className="text-cyan-400">DESKTOP-HIFI</span>
                    </div>
                  </>
                )}
                {selectedHeroNode === 'psychometric' && (
                  <>
                    <div className="flex justify-between text-emerald-400">
                      <span>[DECAY] EBBINGHAUS RETENTION COEFFICIENT...</span>
                      <span>0.84 EXP</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>[LEDGER] UNRESOLVED ERRORS SEARCHED...</span>
                      <span className="text-amber-400">4 DETECTED</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>[DISTRACTOR] SYNTACTIC BIAS METRIC...</span>
                      <span className="text-emerald-400">BALANCED</span>
                    </div>
                  </>
                )}
                {selectedHeroNode === 'gemini' && (
                  <>
                    <div className="flex justify-between text-purple-400">
                      <span>[MODEL] INITIALIZING @GOOGLE/GENAI SDK...</span>
                      <span>READY</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>[CONTEXT] TEMPERATURE COEFFICIENT FIXED...</span>
                      <span className="text-purple-300">0.2 (ACCURATE)</span>
                    </div>
                    <div className="flex justify-between text-neutral-500">
                      <span>[TOKENS] SYLLABUS DOCUMENT PROMPTS...</span>
                      <span className="text-emerald-400">3,450 OUT</span>
                    </div>
                  </>
                )}
              </div>
  
            </motion.div>
          </div>

        </div>
      </header>

      {/* INFINITE MARQUEE COGNITIVE MODULE TICKER */}
      <div className="w-full border-y border-white/5 bg-neutral-950/20 py-7 overflow-hidden relative z-10 select-none backdrop-blur-md">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#03020b] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#03020b] to-transparent z-10 pointer-events-none" />
        
        <div className="flex gap-8 whitespace-nowrap animate-marquee">
          {[
            "Constitution Section 12", "Ebbinghaus Recall Decay Model", "Standard Deviation Filter", 
            "Permutation & Combination Engine", "IBA Analogy Logic Gate", "Synapse Retention Score", 
            "National Percentile Locator", "Distractor Bias Evaluator", "BCS Cadre Allocation Matrix", 
            "English Literature Epoch Mapper", "Mental Ability Cognitive Speedometer", "Decay Shield Protocol"
          ].concat([
            "Constitution Section 12", "Ebbinghaus Recall Decay Model", "Standard Deviation Filter", 
            "Permutation & Combination Engine", "IBA Analogy Logic Gate", "Synapse Retention Score", 
            "National Percentile Locator", "Distractor Bias Evaluator", "BCS Cadre Allocation Matrix", 
            "English Literature Epoch Mapper", "Mental Ability Cognitive Speedometer", "Decay Shield Protocol"
          ]).map((tag, i) => (
            <div 
              key={i} 
              className="inline-flex items-center gap-2.5 px-4.5 py-2.5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 hover:bg-indigo-950/20 text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-white transition-all duration-300 cursor-default shadow-md shadow-black/5"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              {tag}
            </div>
          ))}
        </div>
      </div>

      {/* 4. THE LIVE SYSTEM PIPELINE SECTION */}
      <section id="pipeline" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-20">
        <div className="border-t border-white/5 pt-12 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold">WORKFLOW MECHANISM</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">Active Psychometric Processing Pipeline</h2>
            </div>
            <p className="text-neutral-500 text-xs md:text-sm max-w-sm font-mono leading-relaxed text-left">
              Our continuous MCQ validation cycle checks each incoming test item against strict statistical evaluation bounds.
            </p>
          </div>
        </div>

        {/* Pipeline horizontal workflow cards with animation depending on active step */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              className={`p-5 rounded-2xl border text-left flex flex-col justify-between h-44 relative overflow-hidden transition-all duration-300 ${
                pipelineState === idx 
                  ? 'bg-neutral-900 border-indigo-500/40 shadow-lg shadow-indigo-500/5' 
                  : 'bg-neutral-950/60 border-white/5 opacity-60'
              }`}
            >
              {pipelineState === idx && (
                <div className="absolute inset-0 bg-indigo-500/5 blur-xl pointer-events-none rounded-full" />
              )}
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-neutral-500">LAYER 0{idx + 1}</span>
                {pipelineState === idx ? (
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
                )}
              </div>

              <div className="space-y-2 relative">
                <p className="text-[11px] md:text-xs font-mono text-neutral-400 leading-normal">{msg}</p>
                <span className={`text-[10px] font-mono block ${pipelineState === idx ? 'text-indigo-400 font-bold' : 'text-neutral-600'}`}>
                  {pipelineState === idx ? "→ EXECUTING AGENT" : "IDLE"}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
        {onViewPipeline && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={onViewPipeline}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 hover:border-white/10 text-indigo-400 hover:text-indigo-300 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Explore Sandbox Visualizer
            </button>
          </div>
        )}
      </section>

      {/* 5. THE INSANE BENTO GRID CORE PANEL */}
      <section id="bento" className="max-w-7xl mx-auto px-6 py-12 scroll-mt-20">
        <div className="border-t border-white/5 pt-12 mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold">OPERATING CORE</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 font-display">System Cognitive Subsystems</h2>
            </div>
            <p className="text-neutral-500 text-xs md:text-sm max-w-sm font-mono leading-relaxed text-left">
              Inspect the four custom engines running synchronously on our servers to compile real-time candidate profiles.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Bento Panel A: Dynamic Blueprint Allocator (Span 7) */}
          <div className="lg:col-span-7 bg-neutral-900/30 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-neutral-500">01 / WEIGHT ENGINE</span>
              <span className="px-2.5 py-1 rounded text-[9px] font-mono bg-indigo-950/80 text-indigo-300 border border-indigo-900/50 uppercase tracking-widest font-bold">Interactive Layout</span>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">Dynamic Blueprint Allocator</h3>
                <p className="text-neutral-400 text-xs md:text-sm mt-2 leading-relaxed">
                  Toggle targeted competitive tracks. Watch how our core engine immediately morphs subject allocations and re-calculates estimated national cut-offs.
                </p>
              </div>

              {/* Selector buttons */}
              <div className="p-1 bg-[#090909] border border-white/5 rounded-xl flex flex-wrap gap-1">
                {(['BCS', 'BANK_AD', 'NON_CADRE', 'PRIMARY'] as ExamType[]).map((exam) => (
                  <button
                    key={exam}
                    onClick={() => setSelectedExam(exam)}
                    className={`flex-1 min-w-[70px] py-2 text-[10px] md:text-xs font-bold rounded-lg transition-all cursor-pointer font-mono uppercase ${
                      selectedExam === exam 
                        ? 'bg-neutral-100 text-neutral-950' 
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                    }`}
                  >
                    {exam === 'BCS' && 'BCS PRELIM'}
                    {exam === 'BANK_AD' && 'BB BANK AD'}
                    {exam === 'NON_CADRE' && 'NON-CADRE'}
                    {exam === 'PRIMARY' && 'PRIMARY TRK'}
                  </button>
                ))}
              </div>

              {/* Layout Morphing subjects grid */}
              <div className="bg-[#080808] border border-white/5 rounded-2xl p-4.5 space-y-3.5 text-left">
                <span className="text-[10px] text-neutral-500 font-mono uppercase tracking-wider block font-bold">ACTIVE ALLOCATIONS:</span>
                
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {syllabusMetrics[selectedExam].map((sub, idx) => (
                      <motion.div
                        key={sub.subject}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        className="space-y-1.5"
                      >
                        <div className="flex justify-between items-center text-[11px] font-mono">
                          <span className="text-neutral-300 font-sans font-medium">{sub.subject}</span>
                          <span className="text-indigo-400 font-bold">
                            <AnimatedCounter value={sub.weight} suffix={selectedExam === 'BCS' ? ' marks' : '%'} />
                          </span>
                        </div>
                        <div className="h-1.5 bg-neutral-950 rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full rounded-full bg-gradient-to-r ${sub.color}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedExam === 'BCS' ? (sub.weight / 200) * 100 : sub.weight}%` }}
                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          </div>

          {/* Bento Panel B: Spaced Memory Decay Sparkline (Span 5) */}
          <div className="lg:col-span-5 bg-neutral-900/30 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 blur-[90px] pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-neutral-500">02 / MEMORY CORE</span>
              <span className="px-2.5 py-1 rounded text-[9px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-900/50 uppercase tracking-widest font-bold">Ebbinghaus Equation</span>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">Spaced Memory Decay Sparkline</h3>
                <p className="text-neutral-400 text-xs md:text-sm mt-2 leading-relaxed">
                  We track forgetting curves on a molecular level. Use the slider to map memory decay thresholds to review alerts.
                </p>
              </div>

              {/* Sparkline curve rendering via SVG */}
              <div className="bg-[#080808] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-neutral-400">Recall Strength threshold:</span>
                  <span className="text-amber-400 font-bold font-mono">
                    {decayThreshold}% Retention
                  </span>
                </div>

                <div className="relative h-28">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100">
                    <defs>
                      <linearGradient id="curve-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                      </linearGradient>
                    </defs>

                    {/* Gradient Fill under curve */}
                    <path d="M 0 10 Q 100 50, 200 80 T 300 95 L 300 100 L 0 100 Z" fill="url(#curve-gradient)" />
                    
                    {/* Decay Curve Path drawing animation on visible */}
                    <motion.path
                      d="M 0 10 Q 100 50, 200 80 T 300 95"
                      fill="none"
                      stroke="url(#line-gradient)"
                      strokeWidth="2.5"
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.8, ease: "easeOut" }}
                    />

                    {/* Draggable/Interactive threshold line */}
                    <line x1="0" y1={100 - decayThreshold} x2="300" y2={100 - decayThreshold} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.8" />
                  </svg>

                  <div className="absolute top-1 right-2 text-[9px] font-mono text-neutral-500 uppercase">Retention index (R)</div>
                </div>

                {/* Threshold slider */}
                <div className="space-y-1">
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={decayThreshold}
                    onChange={(e) => setDecayThreshold(Number(e.target.value))}
                    className="w-full h-1 bg-neutral-900 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-neutral-500">
                    <span>40% (Extreme decay)</span>
                    <span>90% (Freshly studied)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Panel C: Live Rank Simulator (Span 5) */}
          <div className="lg:col-span-5 bg-neutral-900/30 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 blur-[90px] pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-neutral-500">03 / SIMULATOR CORE</span>
              <span className="px-2.5 py-1 rounded text-[9px] font-mono bg-amber-950/80 text-amber-300 border border-amber-900/50 uppercase tracking-widest font-bold">Projections</span>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">Live National Rank Simulator</h3>
                <p className="text-neutral-400 text-xs md:text-sm mt-2 leading-relaxed">
                  Slide your projected mock exam score rate to simulate your potential national ranking and passing likelihood instantly.
                </p>
              </div>

              {/* Slider simulation component */}
              <div className="bg-[#080808] border border-white/5 rounded-2xl p-5 space-y-5 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-neutral-400">Simulated Mark Ratio:</span>
                    <span className="text-indigo-400 font-bold text-sm font-mono">{expectedScore}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="35" 
                    max="95" 
                    value={expectedScore}
                    onChange={(e) => setExpectedScore(Number(e.target.value))}
                    className="w-full accent-indigo-500 bg-neutral-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/5 font-mono text-xs">
                  <div>
                    <span className="text-[9px] text-neutral-500 block uppercase font-bold tracking-wider mb-1">Projected Rank</span>
                    <motion.div 
                      key={estimatedRank}
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-base font-bold text-white font-mono"
                    >
                      <AnimatedCounter value={estimatedRank} /> - <AnimatedCounter value={estimatedLowerRank} />
                    </motion.div>
                  </div>
                  <div>
                    <span className="text-[9px] text-neutral-500 block uppercase font-bold tracking-wider mb-1">Pass Probability</span>
                    <span className={`text-base font-bold font-mono ${scoreProbability > 75 ? 'text-emerald-400' : scoreProbability > 45 ? 'text-amber-400' : 'text-rose-400'}`}>
                      {scoreProbability}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 space-y-2">
                  <span className="text-[8px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">SYSTEM RECOMMENDED ACTION TARGET:</span>
                  <div className="bg-[#0b0b0b] border border-white/5 rounded-xl p-3 flex items-start gap-2.5">
                    <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 mt-0.5">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-mono text-neutral-300 leading-normal font-semibold">
                        {expectedScore > 80 && "MASTER STRATEGY: Maintain active-recall pacing. Focus on outlier distractors in Chapter II Constitution and Bank Math synthesis."}
                        {expectedScore > 70 && expectedScore <= 80 && "ACCELERATED: Boost accuracy in Mathematical Reasoning. Review successive percentage Area calculations and Spaced Repetition Ledger logs."}
                        {expectedScore > 50 && expectedScore <= 70 && "FOUNDATIONAL BURST: Flagged 4 core topic leaks. Prioritize Charyapada ancient translation origins and BPSC commission limits."}
                        {expectedScore <= 50 && "RE-ALIGNED PRIORITY: Score is below passing threshold. Immediately initiate AI Cognitive Diagnosis and review 'ভুল খাতা' mistakes list."}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Bento Panel D: Weekly Elite Cohort Leaderboard (Span 7) */}
          <div className="lg:col-span-7 bg-neutral-900/30 border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden group hover:border-white/10 transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none rounded-full" />
            
            <div className="flex justify-between items-start">
              <span className="text-xs font-mono text-neutral-500">04 / SOCIAL CORE</span>
              <span className="px-2.5 py-1 rounded text-[9px] font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-900/50 uppercase tracking-widest font-bold">Dynamic Cohort</span>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white font-display">Elite District Standings</h3>
                <p className="text-neutral-400 text-xs md:text-sm mt-2 leading-relaxed">
                  Real-time national leaderboard compiled across 64 districts. Track standard-setting accuracy ratios from top medical and engineering schools.
                </p>
              </div>

              {/* Leaderboard panel list */}
              <div className="bg-[#080808] border border-white/5 rounded-2xl p-4.5 space-y-1.5 font-mono text-xs">
                {[
                  { rank: 1, name: 'Sajidul Islam', institution: 'BUET, Electrical Engineering', accuracy: 94.2, district: 'Dhaka' },
                  { rank: 2, name: 'Anika Rahman', institution: 'Dhaka University, Law', accuracy: 91.8, district: 'Mymensingh' },
                  { rank: 3, name: 'Tanzir Ahmed', institution: 'Dhaka Medical College, MBBS', accuracy: 90.5, district: 'Chittagong' },
                  { rank: 4, name: 'Farhan Kabir', institution: 'Dhaka University IBA, BBA', accuracy: 89.1, district: 'Sylhet' },
                ].map((item) => (
                  <div key={item.rank} className="flex items-center justify-between p-2.5 rounded-xl border border-transparent hover:border-white/5 hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-3">
                      <span className={`w-5.5 h-5.5 flex items-center justify-center rounded-full font-bold text-[9px] ${
                        item.rank === 1 ? 'bg-indigo-600 text-white' : 'bg-neutral-800 text-neutral-400'
                      }`}>
                        {item.rank}
                      </span>
                      <div className="text-left font-sans">
                        <span className="text-neutral-200 block text-xs font-semibold">{item.name}</span>
                        <span className="text-[10px] text-neutral-500 block font-mono">{item.institution} • {item.district}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-emerald-400 block font-bold font-mono text-xs">{item.accuracy}%</span>
                      <span className="text-[9px] text-neutral-500 block font-mono">Accuracy</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
        {onViewBento && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={onViewBento}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-white/5 hover:border-white/10 text-cyan-400 hover:text-cyan-300 text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Explore Subsystems Sandbox
            </button>
          </div>
        )}
      </section>

      {/* 6. THE LIVE TRIAL TERMINAL (HACKER MICRO-INTERACTIONS) */}
      <section id="terminal" className="max-w-4xl mx-auto px-6 py-20 scroll-mt-20">
        <div className="text-center space-y-4 mb-10">
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-950/30 px-3 py-1.5 rounded-full border border-indigo-900/40 uppercase tracking-widest">
            9Th Grade AI Digital Brain
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white font-display">আস্পির্যান্টস পার্সোনাল অপারেটিং সিস্টেম</h2>
          <p className="text-neutral-400 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            বিসিএস ও ব্যাংক এডি পরীক্ষার ৪ থেকে ৫ লক্ষ প্রতিযোগীর ভিড়ে নিজেকে এগিয়ে রাখতে আপনার ব্যক্তিগত প্রস্তুতিকে নিয়ন্ত্রণ করুন সম্পূর্ণ ডাটা-ড্রাইভেন উপায়ে।
          </p>
        </div>

        {/* Dual Mode Switcher (PSC Prelim vs Bank AD Speed Run) */}
        <div className="grid grid-cols-2 gap-4 max-w-xl mx-auto mb-8 font-mono text-xs">
          <button
            onClick={() => {
              setExamMode('BCS');
              fetchNextAIQuestion();
            }}
            className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
              examMode === 'BCS'
                ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-400 shadow-lg shadow-emerald-900/10'
                : 'bg-neutral-950/50 border-white/5 text-neutral-400 hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold">PSC / BCS Prelim Mode</span>
              <span className={`w-2.5 h-2.5 rounded-full ${examMode === 'BCS' ? 'bg-emerald-400 animate-pulse' : 'bg-neutral-700'}`} />
            </div>
            <p className="text-[10px] text-neutral-500 font-sans leading-normal">২ ঘণ্টায় ২০০ প্রশ্নের ধীরস্থির কিন্তু নিখুঁত উত্তর দেওয়ার মানসিক ধৈর্য ম্যাপার।</p>
          </button>

          <button
            onClick={() => {
              setExamMode('BANK_AD');
              fetchNextAIQuestion();
            }}
            className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
              examMode === 'BANK_AD'
                ? 'bg-rose-950/30 border-rose-500/50 text-rose-400 shadow-lg shadow-rose-900/10'
                : 'bg-neutral-950/50 border-white/5 text-neutral-400 hover:border-white/10'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold">IBA / Bank AD Speed Run</span>
              <span className={`w-2.5 h-2.5 rounded-full ${examMode === 'BANK_AD' ? 'bg-rose-400 animate-pulse' : 'bg-neutral-700'}`} />
            </div>
            <p className="text-[10px] text-neutral-500 font-sans leading-normal">৬০ মিনিটে ৮০টি অত্যন্ত জটিল ম্যাথ ও অ্যানালিটিক্যাল পাজল স্পিড রানার।</p>
          </button>
        </div>

        {/* Workspace Card Container */}
        <motion.div 
          animate={shakeTrigger ? { x: [0, -10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
          className={`border rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden text-left transition-all duration-500 ${
            stressMode
              ? 'bg-[#0c0808] border-rose-500/30 shadow-[0_0_20px_rgba(239,68,68,0.05)]'
              : examMode === 'BANK_AD' 
                ? 'bg-[#0b0808] border-rose-950/40 shadow-rose-950/5' 
                : 'bg-[#080b09] border-emerald-950/40 shadow-emerald-950/5'
          }`}
        >
          {/* Subtle Ambient Background Glowing Lights */}
          <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl pointer-events-none rounded-full transition-colors duration-500 ${
            examMode === 'BANK_AD' ? 'bg-rose-500/5' : 'bg-emerald-500/5'
          }`} />

          {/* Primary Operating Tabs Bar */}
          <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4 items-center justify-between">
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => {
                  setActiveWorkspaceTab('terminal');
                  setReTestActive(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeWorkspaceTab === 'terminal'
                    ? examMode === 'BANK_AD' ? 'bg-rose-950/40 text-rose-300 border border-rose-900/30' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/30'
                    : 'bg-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>লাইভ কুইজ ককপিট</span>
              </button>

              <button
                onClick={() => {
                  setActiveWorkspaceTab('mistake_ledger');
                  setReTestActive(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all relative cursor-pointer ${
                  activeWorkspaceTab === 'mistake_ledger'
                    ? examMode === 'BANK_AD' ? 'bg-rose-950/40 text-rose-300 border border-rose-900/30' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/30'
                    : 'bg-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>স্মার্ট ভুল খাতা</span>
                {mistakesList.length > 0 && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ml-1 ${
                    examMode === 'BANK_AD' ? 'bg-rose-500 text-black' : 'bg-emerald-500 text-black'
                  }`}>
                    {mistakesList.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => {
                  setActiveWorkspaceTab('diagnostic');
                  setReTestActive(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeWorkspaceTab === 'diagnostic'
                    ? examMode === 'BANK_AD' ? 'bg-rose-950/40 text-rose-300 border border-rose-900/30' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/30'
                    : 'bg-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>দুর্বলতা ম্যাপ</span>
              </button>

              <button
                onClick={() => {
                  setActiveWorkspaceTab('flashcards');
                  setReTestActive(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeWorkspaceTab === 'flashcards'
                    ? examMode === 'BANK_AD' ? 'bg-rose-950/40 text-rose-300 border border-rose-900/30' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-900/30'
                    : 'bg-transparent text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>সাম্প্রতিক ফ্ল্যাশকার্ড</span>
              </button>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px] text-neutral-500 mt-2 sm:mt-0">
              <span className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${examMode === 'BANK_AD' ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`} />
                {examMode === 'BANK_AD' ? 'IBA-AD INTEL ENGINE' : 'BPSC INTEL CORE'}
              </span>
            </div>
          </div>

          {/* TAB CONTENT 1: QUIZ COCKPIT */}
          {activeWorkspaceTab === 'terminal' && (
            <div className="space-y-6">
              
              {/* STRESS MODE TOGGLE BAR */}
              <div className="flex justify-between items-center bg-[#0d0d0d]/80 border border-white/5 rounded-2xl p-4.5">
                <div className="space-y-0.5 text-left">
                  <h4 className="text-xs font-bold text-neutral-200 font-mono">STRESS TEST CORE</h4>
                  <p className="text-[10px] text-neutral-500 font-sans">Simulate cognitive stress, real-time pacing alerts, and dynamic visual pressure feedback.</p>
                </div>
                <button
                  onClick={() => setStressMode(!stressMode)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-[10px] font-bold border transition-all cursor-pointer ${
                    stressMode 
                      ? 'bg-rose-950/40 border-rose-500/40 text-rose-300 shadow-md shadow-rose-950/30 animate-pulse' 
                      : 'bg-[#111] border-white/5 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {stressMode ? '⚠️ ACTIVE STRESS SIM' : '⏱️ ACTIVATE STRESS'}
                </button>
              </div>

              {/* Live Stopwatch HUD & Pace Gauge for pressure simulation */}
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl border font-mono text-xs transition-all duration-300 ${
                stressMode 
                  ? 'bg-rose-950/10 border-rose-500/20 shadow-inner' 
                  : 'bg-black/40 border-white/5'
              }`}>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-neutral-500 block uppercase">STRESS TIMER (স্টপওয়াচ)</span>
                    {stressMode && <span className="text-[9px] text-rose-400 animate-pulse uppercase font-bold">[PRESSURE ON]</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className={`w-4 h-4 ${stressMode ? 'text-rose-400' : examMode === 'BANK_AD' ? 'text-rose-400' : 'text-emerald-400'}`} />
                    <span className="text-sm font-bold text-neutral-200">{elapsedSeconds}s elapsed</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 block uppercase">TARGET PACE SPEED</span>
                  <div className="flex items-center gap-2">
                    <Zap className={`w-4 h-4 ${stressMode ? 'text-rose-400' : examMode === 'BANK_AD' ? 'text-rose-400' : 'text-emerald-400'}`} />
                    <span className="text-xs font-bold text-neutral-300">
                      {stressMode ? '⚠️ SPEED UP: <30s target!' : examMode === 'BANK_AD' ? '⚡ 45s target (IBA limit)' : '⏱️ 36s suggested (PSC limit)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 block uppercase font-bold">COGNITIVE LATENCY GAUGE</span>
                  <div className="mt-1">
                    {stressMode ? (
                      <span className="text-[10px] bg-rose-900/40 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-bold animate-pulse">
                        💓 HEART RATE: {72 + Math.min(elapsedSeconds * 2, 48)} BPM
                      </span>
                    ) : elapsedSeconds <= 20 ? (
                      <span className="text-[10px] bg-emerald-950/50 text-emerald-400 border border-emerald-900/40 px-2 py-0.5 rounded font-bold">⚡ OPTIMAL PACE</span>
                    ) : elapsedSeconds <= 45 ? (
                      <span className="text-[10px] bg-amber-950/50 text-amber-400 border border-amber-900/40 px-2 py-0.5 rounded font-bold">⏱️ NORMAL FLOW</span>
                    ) : (
                      <span className="text-[10px] bg-rose-950/60 text-rose-400 border border-rose-900/40 px-2 py-0.5 rounded font-bold animate-pulse">⚠️ CRITICAL DELAY</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subject switches for the quiz terminal */}
              <div className="flex flex-wrap gap-1.5 items-center">
                <span className="text-[10px] font-mono text-neutral-500 uppercase font-bold mr-1">টপিক ফিল্টার:</span>
                {[
                  { id: 'all', label: 'Random (র্যান্ডম)' },
                  { id: 'Bangladesh Affairs', label: 'Bangladesh Affairs' },
                  { id: 'Mathematical Reasoning', label: 'Math' },
                  { id: 'English Language & Literature', label: 'English' },
                  { id: 'Computer & ICT', label: 'ICT' }
                ].map((subj) => {
                  const isSelected = subj.id === 'all' 
                    ? !['Bangladesh Affairs', 'Mathematical Reasoning', 'English Language & Literature', 'Computer & ICT'].includes(sampleQuestion.subject)
                    : sampleQuestion.subject === subj.id;
                  return (
                    <button
                      key={subj.id}
                      disabled={isGeneratingTerminalQuestion}
                      onClick={() => fetchNextAIQuestion(subj.id === 'all' ? undefined : subj.id)}
                      className={`px-2 py-1 text-[9px] font-mono rounded-md border cursor-pointer transition-all ${
                        isSelected
                          ? examMode === 'BANK_AD'
                            ? 'bg-rose-950/50 border-rose-500/40 text-rose-300 font-bold'
                            : 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 font-bold'
                          : 'bg-neutral-950 border-white/5 text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200'
                      }`}
                    >
                      {subj.label}
                    </button>
                  );
                })}
              </div>

              {terminalGenerationError && (
                <div className="bg-amber-950/30 border border-amber-900/40 p-3 rounded-xl text-[11px] font-mono text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
                  <span>{terminalGenerationError}</span>
                </div>
              )}

              {isGeneratingTerminalQuestion ? (
                <div className="py-16 flex flex-col items-center justify-center space-y-4 font-mono text-xs text-indigo-400">
                  <RefreshCw className="w-8 h-8 animate-spin text-indigo-500" />
                  <div className="space-y-1 text-center">
                    <p className="text-neutral-200 font-bold tracking-widest uppercase animate-pulse">CONNECTING COGNITIVE AI CORE...</p>
                    <p className="text-[10px] text-neutral-500">Synthesizing live psychometric nodes across subject disciplines...</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                        examMode === 'BANK_AD' ? 'bg-rose-950/50 text-rose-400 border border-rose-900/30' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/30'
                      }`}>
                        {sampleQuestion.subject} • {sampleQuestion.topic}
                      </span>
                      <span className="text-[9px] font-mono text-neutral-500">Tier: {sampleQuestion.difficulty}</span>
                    </div>
                    <p className="text-base sm:text-lg font-bold leading-relaxed text-neutral-200 font-sans">
                      {sampleQuestion.text}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {sampleQuestion.options.map((option, idx) => (
                      <button
                        key={idx}
                        disabled={terminalStep !== 'question'}
                        onClick={() => handleDemoAnswerSubmit(idx)}
                        className={`p-4 rounded-xl text-left text-xs sm:text-sm font-medium transition-all duration-300 ${
                          terminalStep === 'question' 
                            ? 'bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-white/5 hover:border-white/20 cursor-pointer' 
                            : idx === sampleQuestion.correctIndex 
                              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 border font-bold' 
                              : selectedAnswer === idx 
                                ? 'bg-rose-950/50 border-rose-500/40 text-rose-300 border' 
                                : 'bg-neutral-950/20 text-neutral-600 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-sans">{idx + 1}. {option}</span>
                          {terminalStep !== 'question' && idx === sampleQuestion.correctIndex && (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Reveal panel when answer submitted */}
              <AnimatePresence>
                {terminalStep === 'answered' && !isGeneratingTerminalQuestion && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden space-y-4"
                  >
                    <div className="pt-6 border-t border-white/5 space-y-4">
                      
                      {/* Sub-tabs inside answered mode */}
                      <div className="flex border-b border-white/5 pb-2 gap-4 text-xs font-mono">
                        <button
                          onClick={() => setActiveTab('explanation')}
                          className={`pb-2 uppercase tracking-wider font-bold transition-all relative cursor-pointer ${
                            activeTab === 'explanation' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          Explanations
                          {activeTab === 'explanation' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTab('metrics')}
                          className={`pb-2 uppercase tracking-wider font-bold transition-all relative cursor-pointer ${
                            activeTab === 'metrics' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          Metric Scores
                          {activeTab === 'metrics' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                          )}
                        </button>
                        <button
                          onClick={() => setActiveTab('distractors')}
                          className={`pb-2 uppercase tracking-wider font-bold transition-all relative cursor-pointer ${
                            activeTab === 'distractors' ? 'text-indigo-400' : 'text-neutral-500 hover:text-neutral-300'
                          }`}
                        >
                          Distractor Check
                          {activeTab === 'distractors' && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
                          )}
                        </button>
                      </div>

                      {/* Explanation Tab Panels */}
                      <div className="bg-black/45 backdrop-blur-md p-5 rounded-2xl border border-white/5 text-xs text-neutral-300 leading-relaxed font-mono space-y-3">
                        {activeTab === 'explanation' && (
                          <div className="space-y-3 text-left">
                            <div className="space-y-1">
                              <span className="text-[10px] text-neutral-500 uppercase font-bold block">Bengali Explanation</span>
                              <p className="font-sans text-neutral-200 text-sm leading-relaxed">{sampleQuestion.explanations?.bn}</p>
                            </div>
                            <div className="space-y-1 pt-2 border-t border-white/5">
                              <span className="text-[10px] text-neutral-500 uppercase font-bold block">English Synthesis</span>
                              <p className="font-sans text-neutral-400 text-sm leading-relaxed">{sampleQuestion.explanations?.en}</p>
                            </div>
                          </div>
                        )}

                        {activeTab === 'metrics' && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-left font-mono">
                            <div>
                              <span className="text-[10px] text-neutral-500 uppercase block">Cognitive Dim</span>
                              <span className="text-white text-xs block font-bold capitalize mt-0.5">{sampleQuestion.cognitiveDimension}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-neutral-500 uppercase block">Uniqueness Score</span>
                              <span className="text-emerald-400 text-xs block font-bold mt-0.5">{sampleQuestion.uniquenessScore}/100</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-neutral-500 uppercase block">Concept Depth</span>
                              <span className="text-indigo-400 text-xs block font-bold mt-0.5">{sampleQuestion.conceptDepthScore}/100</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-neutral-500 uppercase block">Syllabus Relevance</span>
                              <span className="text-white text-xs block font-bold mt-0.5">{sampleQuestion.syllabusRelevanceScore}%</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-neutral-500 uppercase block">Distractor Score</span>
                              <span className="text-white text-xs block font-bold mt-0.5">{sampleQuestion.distractorQualityScore}/100</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-neutral-500 uppercase block font-bold">RESPONSE DELAY</span>
                              <span className="text-rose-400 text-xs block font-bold mt-0.5">Answered in {decisionDelay}s</span>
                            </div>
                          </div>
                        )}

                        {activeTab === 'distractors' && (
                          <div className="space-y-2.5 text-left">
                            <span className="text-[10px] text-rose-400/90 font-mono uppercase block font-bold tracking-wider">Distractor Plausibility Analysis:</span>
                            <ul className="space-y-2 list-disc pl-4 font-sans text-xs text-neutral-400">
                              {sampleQuestion.explanations?.wrongOptions.map((opt, i) => (
                                <li key={i}>{opt}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Interactive Bilingual AI Tutor Drawer Call */}
                      <div className="p-4 rounded-2xl bg-indigo-950/15 border border-indigo-900/30 text-left space-y-3 font-sans">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold text-indigo-300 font-mono uppercase">9Th Grade Deep AI Tutor (এআই মেন্টর)</span>
                          </div>
                          {!isAskingTutor && (
                            <button
                              onClick={handleAskAITutor}
                              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all flex items-center gap-1 font-mono"
                            >
                              {tutorLoading ? 'Consulting...' : '✨ Ask AI Tutor (ডিটেইলস ও শর্টকাট)'}
                            </button>
                          )}
                        </div>

                        {isAskingTutor && (
                          <div className="pt-2 space-y-3">
                            {tutorLoading && !tutorResponse ? (
                              <div className="flex items-center gap-2.5 text-xs text-neutral-400 font-mono py-2">
                                <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                                <span>Generating Shortcut tricks and Written solution format from Gemini core...</span>
                              </div>
                            ) : (
                              <div className="space-y-4 text-xs">
                                {/* Bilingual Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="bg-[#050505] border border-emerald-950 p-4 rounded-xl space-y-2">
                                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                      💡 Shortcut Tricks / মনে রাখার উপায়
                                    </span>
                                    <p className="text-neutral-200 leading-relaxed font-sans whitespace-pre-wrap">
                                      {tutorResponse?.bilingual?.bn || tutorResponse?.text}
                                    </p>
                                  </div>

                                  <div className="bg-[#050505] border border-blue-950 p-4 rounded-xl space-y-2">
                                    <span className="text-[10px] font-mono text-blue-400 uppercase font-bold flex items-center gap-1.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                      📝 Written Format / লিখিত সমাধান
                                    </span>
                                    <p className="text-neutral-300 leading-relaxed font-sans whitespace-pre-wrap">
                                      {tutorResponse?.bilingual?.en || "Standard math breakdown or contextual chronological facts."}
                                    </p>
                                  </div>
                                </div>

                                {/* Step-by-Step Lists */}
                                {tutorResponse?.stepByStep && (
                                  <div className="bg-black/40 p-3.5 rounded-xl border border-white/5 space-y-1.5">
                                    <span className="text-[9px] font-mono text-neutral-500 block uppercase">CONGNITIVE SOLVING STEPS (পরীক্ষার হলের নিখুঁত সমাধান):</span>
                                    <ol className="list-decimal pl-4 space-y-1 text-neutral-400">
                                      {tutorResponse.stepByStep.map((step: string, i: number) => (
                                        <li key={i}>{step}</li>
                                      ))}
                                    </ol>
                                  </div>
                                )}

                                {/* Follow-up chat inside the same drawer */}
                                <div className="border-t border-white/5 pt-3 space-y-3 font-mono">
                                  <div className="max-h-40 overflow-y-auto space-y-2.5 text-[11px] pr-1">
                                    {tutorHistory.slice(2).map((h, idx) => (
                                      <div key={idx} className={`p-2.5 rounded-xl ${h.sender === 'user' ? 'bg-neutral-950 text-right ml-8 text-neutral-400 border border-white/5' : 'bg-indigo-950/20 text-left mr-8 text-neutral-200 border border-indigo-900/20'}`}>
                                        <span className="text-[8px] text-neutral-500 block uppercase mb-1">{h.sender === 'user' ? 'You' : 'AI Tutor'}</span>
                                        <p className="font-sans leading-relaxed">{h.text}</p>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={tutorInputMessage}
                                      onChange={(e) => setTutorInputMessage(e.target.value)}
                                      placeholder="Ask tutor for formula explanation or historical linkage..."
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleTutorFollowUp();
                                      }}
                                      className="flex-1 bg-black rounded-lg border border-white/10 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-sans"
                                    />
                                    <button
                                      onClick={handleTutorFollowUp}
                                      disabled={tutorLoading}
                                      className="px-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white cursor-pointer transition-all flex items-center justify-center"
                                    >
                                      <Send className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Countdown Footer bar & auto-next controls */}
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                        <div className="flex flex-col gap-1 text-left w-full sm:max-w-md">
                          <p className="text-[11px] font-mono text-neutral-500">
                            {selectedAnswer === sampleQuestion.correctIndex ? (
                              <span className="text-emerald-400 font-bold">▲ CORRECT: PROJECTED NATIONAL COHORT INCREASED BY 320 STEPS</span>
                            ) : (
                              <span className="text-rose-400 font-bold">▼ EXAMINED: WEAKNESS LOGGED IN "ভুল খাতা" AND DIAGNOSTIC MAP</span>
                            )}
                          </p>
                          {autoAdvanceSeconds !== null && (
                            <div className="mt-2 w-full">
                              <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400/90 mb-1.5">
                                <span className="flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                                  Auto-generating next psychometric node in <span className="font-bold text-white bg-indigo-950 px-1.5 py-0.5 rounded border border-indigo-500/20">{autoAdvanceSeconds}s</span>
                                </span>
                                <button 
                                  onClick={handleCancelAutoAdvance}
                                  className="text-[9px] text-neutral-400 hover:text-white underline cursor-pointer"
                                >
                                  Cancel Auto-Advance
                                </button>
                              </div>
                              <div className="h-1 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                                <motion.div 
                                  initial={{ width: "100%" }}
                                  animate={{ width: `${(autoAdvanceSeconds / 5) * 100}%` }}
                                  transition={{ duration: 1, ease: "linear" }}
                                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => fetchNextAIQuestion()}
                          className={`text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer border px-4 py-2.5 rounded-xl transition-all self-end sm:self-auto ${
                            examMode === 'BANK_AD'
                              ? 'bg-rose-950/20 text-rose-400 border-rose-900/30 hover:bg-rose-950/40'
                              : 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30 hover:bg-emerald-950/40'
                          }`}
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Generate Next AI Question
                        </button>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* TAB CONTENT 2: PERSONAL MISTAKE LEDGER (ভুল খাতা) */}
          {activeWorkspaceTab === 'mistake_ledger' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <span>ইন্টারেক্টিভ স্পেসড রিপিটিশন ভুল খাতা</span>
                  </h3>
                  <p className="text-[11px] text-neutral-500 leading-normal">
                    আপনার পূর্বে ভুল করা প্রশ্নের তালিকা। SM-2 রিভিশন শিডিউল এবং একটি কাস্টম রিভিশন কুইজ নিচে সাজানো রয়েছে।
                  </p>
                </div>
                {mistakesList.length > 0 && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setReTestActive(true);
                        setReTestIndex(0);
                        setReTestSelectedAnswer(null);
                        setReTestStep('question');
                      }}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-mono font-bold cursor-pointer transition-all uppercase"
                    >
                      🔁 Run Re-Test (রিভিশন টেস্ট)
                    </button>
                    <button
                      onClick={handleClearMistakes}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-rose-400 rounded-lg text-[10px] font-mono font-bold border border-white/5 cursor-pointer transition-all uppercase"
                    >
                      Clear Vault
                    </button>
                  </div>
                )}
              </div>

              {reTestActive && mistakesList.length > 0 ? (
                /* Re-Test Simulator Inside Mistakes Vault */
                <div className="bg-black/45 backdrop-blur-md border border-indigo-950/50 rounded-2xl p-5 space-y-5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-indigo-400 border-b border-white/5 pb-2.5">
                    <span className="font-bold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                      ACTIVE RE-TEST SESSION (ভুল সংশোধনী পরীক্ষা)
                    </span>
                    <span>Question {reTestIndex + 1} of {mistakesList.length}</span>
                  </div>

                  <div className="space-y-4 text-left">
                    <p className="text-sm font-bold text-neutral-200 font-sans leading-relaxed">
                      {mistakesList[reTestIndex].text}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                      {mistakesList[reTestIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          disabled={reTestStep !== 'question'}
                          onClick={() => handleReTestAnswerSubmit(idx)}
                          className={`p-3.5 rounded-xl text-left text-xs font-semibold transition-all duration-300 ${
                            reTestStep === 'question'
                              ? 'bg-neutral-950 hover:bg-neutral-900 text-neutral-300 border border-white/5 hover:border-white/20 cursor-pointer'
                              : idx === mistakesList[reTestIndex].correctIndex
                                ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300 border font-bold'
                                : reTestSelectedAnswer === idx
                                  ? 'bg-rose-950/50 border-rose-500/40 text-rose-300 border'
                                  : 'bg-neutral-950/20 text-neutral-600 border border-transparent'
                          }`}
                        >
                          {idx + 1}. {option}
                        </button>
                      ))}
                    </div>

                    {reTestStep === 'answered' && (
                      <div className="pt-4 border-t border-white/5 space-y-3 font-mono text-xs">
                        <div className="bg-black/60 p-4 rounded-xl border border-white/5 text-left text-neutral-300 space-y-2">
                          <span className="text-[10px] text-emerald-400 uppercase font-bold block">রিভিশন ফলাফল ও ব্যাখ্যা:</span>
                          <p className="font-sans text-neutral-200">{mistakesList[reTestIndex].explanations?.bn}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] text-neutral-500">
                            {reTestSelectedAnswer === mistakesList[reTestIndex].correctIndex 
                              ? "✅ Correct! This will be archived from mistakes ledger." 
                              : "❌ Still incorrect. Kept in spaced repetition cycle."}
                          </span>
                          <button
                            onClick={handleNextReTestQuestion}
                            className="px-4 py-2 bg-indigo-950 text-indigo-300 border border-indigo-900/40 hover:bg-indigo-950/60 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                          >
                            <span>Next Question</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : mistakesList.length === 0 ? (
                /* Empty Ledger Display */
                <div className="py-12 text-center font-mono space-y-3">
                  <div className="w-12 h-12 bg-neutral-900 rounded-full flex items-center justify-center mx-auto border border-white/5">
                    <Check className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-neutral-200">কোনো ভুল এখনো নথিভুক্ত হয়নি!</p>
                    <p className="text-[10px] text-neutral-500 max-w-xs mx-auto">কুইজ টার্মিনালে কোনো প্রশ্নের উত্তর ভুল দিলে তা স্বয়ংক্রিয়ভাবে এখানে জমা হবে।</p>
                  </div>
                </div>
              ) : (
                /* Mistakes List with SM-2 Spacing countdowns */
                <div className="space-y-3.5 font-sans">
                  {mistakesList.map((mistake, index) => (
                    <div key={mistake.id || index} className="bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all rounded-2xl p-4.5 text-left flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-mono font-bold bg-neutral-900 text-neutral-400 border border-white/10 px-2 py-0.5 rounded">
                            {mistake.subject}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-500">Topic: {mistake.topic}</span>
                        </div>
                        <p className="text-xs sm:text-sm font-semibold text-neutral-200 leading-relaxed">
                          {mistake.text}
                        </p>
                        <p className="text-[10px] text-neutral-500 font-mono">
                          Correct Answer: <span className="text-emerald-400">{mistake.options[mistake.correctIndex]}</span>
                        </p>
                      </div>

                      {/* SM-2 Countdown Intervals simulation */}
                      <div className="font-mono text-right flex md:flex-col items-center md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-white/5 pt-2.5 md:pt-0 gap-2">
                        <div className="text-left md:text-right">
                          <span className="text-[9px] text-neutral-500 uppercase block font-bold">SM-2 Spaced Revisions</span>
                          <span className="text-[10px] text-indigo-400 block font-bold mt-0.5">
                            {index === 0 ? "Review in 2 Days" : index === 1 ? "Review in 5 Days" : "Review in 12 Days"}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setReTestActive(true);
                            setReTestIndex(index);
                            setReTestSelectedAnswer(null);
                            setReTestStep('question');
                          }}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-white/5 hover:border-white/10 text-neutral-300 rounded-lg text-[9px] font-bold uppercase transition-all cursor-pointer"
                        >
                          Test Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 3: PRECISION TOPIC DIAGNOSTIC MAPS */}
          {activeWorkspaceTab === 'diagnostic' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4 text-left space-y-1">
                <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>সিলেবাস ও টপিক-ভিত্তিক নিখুঁত দুর্বলতা বিশ্লেষণ</span>
                </h3>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  কুইজ টার্মিনালের আপনার উত্তর থেকে লাইভ ডাটা জেনারেট হচ্ছে। ৬০% এর নিচের টপিকগুলোকে লাল চিহ্নিত করে কাস্টম সাজেশন দেওয়া হয়েছে।
                </p>
              </div>

              {/* Topic Accuracy Progress Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(diagnosticScores).map(([key, val]) => {
                  const data = val as { correct: number; total: number; topicName: string };
                  const accuracy = Math.round((data.correct / data.total) * 100) || 0;
                  const isWeak = accuracy < 60;
                  return (
                    <div key={key} className="bg-white/[0.01] hover:bg-white/[0.03] backdrop-blur-sm border border-white/5 hover:border-white/10 transition-all p-4 rounded-2xl space-y-2.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-300 block leading-normal">{data.topicName}</span>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          isWeak ? 'bg-rose-950/40 text-rose-400 border border-rose-900/30' : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                        }`}>
                          {accuracy}% ({data.correct}/{data.total})
                        </span>
                      </div>

                      {/* Accuracy bar */}
                      <div className="h-1.5 w-full bg-neutral-950 rounded-full overflow-hidden border border-white/5">
                        <div 
                          className={`h-full transition-all duration-500 ${
                            isWeak ? 'bg-gradient-to-r from-rose-600 to-rose-400' : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                          }`}
                          style={{ width: `${accuracy}%` }}
                        />
                      </div>

                      {/* Feedback lines */}
                      <p className="text-[10px] font-mono text-neutral-500">
                        {isWeak 
                          ? `⚠️ Critical weakness detected. Prioritize active recall.` 
                          : `✨ Satisfactory accuracy. Keep up the retention cycle.`}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* AI Directed Study Guidance based on scores */}
              <div className="bg-indigo-950/15 border border-indigo-900/30 p-4.5 rounded-2xl text-left space-y-2.5 font-sans text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="font-mono font-bold text-indigo-300 uppercase tracking-wider block">BPSC / IBA Directed Daily Focus Directions:</span>
                </div>
                <div className="space-y-1.5 text-neutral-300 leading-relaxed">
                  <p>১. আপনার **সংবিধানের অনুচ্ছেদ (৩০-৪৭)** এবং **লাভ-ক্ষতি** চ্যাপ্টারে দক্ষতা সন্তোষজনক নয়। আজকেই এআই মেন্টরের সাথে সংযুক্ত হয়ে এই অংশগুলোর লিখিত ফরমেট নোট করুন।</p>
                  <p>২. আইবিএ ব্যাংক এডি পরীক্ষার জন্য **Geometry & Area** সেকশনের সাকসেসিভ বৃদ্ধির শর্টকাট সূত্রগুলো আরও বেশি চর্চা করতে হবে।</p>
                  <p>৩. **ICT লজিক গেট** সেকশনে আপনার ৯০% সন্তোষজনক স্কোর রয়েছে। দৈনিক ১০ মিনিট চর্যাপদ বা ইংরেজি রোমান্টিক পিরিয়ড রিভিশনের জন্য সময় বরাদ্দ করুন।</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: HIGH-YIELD MEMORY FLASHCARDS (রিয়েল-টাইম সাম্প্রতিক) */}
          {activeWorkspaceTab === 'flashcards' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4 text-left space-y-1">
                <h3 className="text-sm font-bold text-neutral-200 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>সাম্প্রতিক ও হাই-ইয়েল্ড স্মৃতি সহায়ক কার্ড</span>
                </h3>
                <p className="text-[11px] text-neutral-500 leading-normal">
                  বিসিএস ও ব্যাংক এডি পরীক্ষার জন্য বিশেষভাবে ফিল্টার করা সাম্প্রতিক ও স্ট্যাটিক জিকে ফ্ল্যাশকার্ড। কার্ডে ক্লিক করে উত্তর দেখুন।
                </p>
              </div>

              {/* 3D Flip Card Container */}
              <div className="max-w-md mx-auto py-4">
                <div 
                  onClick={() => setCardFlipped(!cardFlipped)}
                  className="relative h-60 w-full cursor-pointer group perspective"
                >
                  <motion.div 
                    animate={{ rotateY: cardFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
                    className="w-full h-full duration-500 preserve-3d relative"
                  >
                    {/* Front side of the card */}
                    <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-950 border border-white/10 p-6 flex flex-col justify-between text-left backface-hidden">
                      <div className="flex justify-between items-center text-[9px] font-mono text-indigo-400">
                        <span className="font-bold">GENERAL KNOWLEDGE FLASHCARD</span>
                        <span>Card {currentCardIndex + 1} of {flashcardsData.length}</span>
                      </div>
                      <p className="text-sm sm:text-base font-bold text-neutral-100 leading-relaxed font-sans">
                        {flashcardsData[currentCardIndex].q}
                      </p>
                      <span className="text-[10px] text-neutral-500 font-mono text-center block uppercase mt-2 group-hover:text-neutral-400 transition-colors">
                        🔄 Click to flip and reveal answer / ক্লিক করুন
                      </span>
                    </div>

                    {/* Back side of the card */}
                    <div 
                      className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-indigo-950/50 to-neutral-950 border border-indigo-900/40 p-6 flex flex-col justify-between text-left backface-hidden"
                      style={{ transform: "rotateY(180deg)" }}
                    >
                      <div className="flex justify-between items-center text-[9px] font-mono text-indigo-400">
                        <span className="font-bold text-emerald-400">ANSWER METRIC KEY</span>
                        <span>Card {currentCardIndex + 1} of {flashcardsData.length}</span>
                      </div>
                      <div className="space-y-2 flex-1 flex flex-col justify-center">
                        <p className="text-xs sm:text-sm font-bold text-neutral-200 font-sans leading-relaxed whitespace-pre-wrap">
                          {flashcardsData[currentCardIndex].a}
                        </p>
                        <p className="text-[10px] text-indigo-300 font-sans italic bg-indigo-950/20 p-2 rounded-lg border border-indigo-900/30">
                          {flashcardsData[currentCardIndex].mnemonic}
                        </p>
                      </div>
                      <span className="text-[10px] text-neutral-500 font-mono text-center block uppercase mt-2">
                        🔄 Click to Flip Back
                      </span>
                    </div>
                  </motion.div>
                </div>

                {/* Flip Card navigation */}
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardFlipped(false);
                      setCurrentCardIndex((prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length);
                    }}
                    className="px-3 py-1.5 bg-neutral-950 border border-white/5 hover:border-white/10 text-neutral-400 hover:text-white rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1"
                  >
                    ← Previous
                  </button>
                  <span className="text-[10px] font-mono text-neutral-500">
                    Active retention check
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setCardFlipped(false);
                      setCurrentCardIndex((prev) => (prev + 1) % flashcardsData.length);
                    }}
                    className="px-3 py-1.5 bg-neutral-950 border border-white/5 hover:border-white/10 text-neutral-400 hover:text-white rounded-lg text-xs font-mono font-bold cursor-pointer transition-all flex items-center gap-1"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </section>

      {/* 7. THE INTERACTIVE SERVICES ACCORDION */}
      <section id="services" className="max-w-7xl mx-auto px-6 py-12 text-left scroll-mt-20">
        <div className="border-t border-white/5 pt-16 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold font-mono">SYSTEM SPECIFICATION</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">Deep Architectural Capabilities</h2>
              <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
                9Th Grade AI operates four specific backend engines that guarantee continuous memory stabilization and performance scaling.
              </p>
              {onViewServices && (
                <button
                  onClick={onViewServices}
                  className="mt-2 flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 hover:opacity-90 text-white text-xs font-bold font-mono uppercase tracking-wider transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  Try Interactive Console Simulators
                </button>
              )}
            </div>

            {/* Accordion Component with height and scale transition */}
            <div className="lg:col-span-8 divide-y divide-white/5 border-t border-b border-white/5">
              {services.map((service, idx) => {
                const isOpen = activeService === idx;
                return (
                  <div key={idx} className="py-5.5">
                    <button 
                      onClick={() => setActiveService(isOpen ? null : idx)}
                      className="w-full flex justify-between items-center text-left cursor-pointer group focus:outline-none"
                    >
                      <div className="flex items-center gap-6">
                        <span className="text-xs font-mono text-neutral-500 font-bold">{service.id}</span>
                        <h3 className="text-base sm:text-lg font-bold text-neutral-200 group-hover:text-white transition-colors font-display">{service.title}</h3>
                      </div>
                      <div>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-neutral-400 group-hover:text-white transition-colors" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pl-11 pt-4 pb-2 space-y-4 max-w-2xl text-xs sm:text-sm">
                            <p className="text-neutral-400 leading-relaxed font-sans">{service.desc}</p>
                            <div className="flex items-center gap-2.5 text-xs font-mono text-indigo-400 bg-indigo-950/20 px-3.5 py-2 rounded-lg border border-indigo-900/30 w-fit">
                              <Activity className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0 animate-pulse" />
                              <span className="font-mono">{service.details}</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 8. VERIFIED CADRE FEEDBACK TRUST BLOCK */}
      <section className="max-w-7xl mx-auto px-6 py-16 text-left">
        <div className="border-t border-white/5 pt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest block font-bold">PROVEN OUTCOMES</span>
            <h2 className="text-3xl font-extrabold text-white font-display">Endorsed by Top Cadres</h2>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-sm">
              We monitor Mock metrics and official Preliminary pass scores to keep our evaluation parameters exactly calibrated to national standard bounds.
            </p>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs font-mono text-neutral-400 ml-2">4.9 / 5.0 Cohort Rating</span>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 rounded-2xl bg-neutral-900/10 border border-white/5 space-y-4 text-left relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-neutral-500">45th BCS Prelim</span>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans italic">
                "Traditional programs never explain why correct options are chosen and wrong options rejected. 9Th Grade AI's detailed distractor analysis completely updated my approach."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-indigo-950 flex items-center justify-center border border-indigo-900/30">
                  <span className="text-[10px] font-bold text-indigo-300">SI</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-200 block">Sajidul Islam</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">BUET (EE) • BCS Cadre (Admin)</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/10 border border-white/5 space-y-4 text-left relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="flex justify-between items-start">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[9px] font-mono text-neutral-500">BB AD Exam</span>
              </div>
              <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed font-sans italic">
                "The quantitative aptitude matches the highest DU IBA guidelines. The passing probability indicator is incredibly accurate compared to actual outcomes."
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-cyan-950 flex items-center justify-center border border-cyan-900/30">
                  <span className="text-[10px] font-bold text-cyan-300">FK</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-200 block">Farhan Kabir</span>
                  <span className="text-[9px] font-mono text-neutral-500 block">DU IBA (BBA) • AD Recom.</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* INTERACTIVE 3D COGNITIVE WORKFLOW ENGINE: HOW IT WORKS */}
      <section ref={pipelineSectionRef} className="max-w-7xl mx-auto px-6 py-20 relative z-10 scroll-mt-20">
        <div className="border-t border-white/5 pt-16 mb-12 text-left">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-950/40 border border-indigo-500/15 mb-4 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-indigo-400">CORE SYSTEM ARCHITECTURE</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight font-display tracking-tight max-w-3xl">
            How 9TH GRADE AI-Powered <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-fuchsia-400">
              Mock Test Pipeline Actually Works
            </span>
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-3.5 max-w-2xl leading-relaxed">
            Unveiling the proprietary 4-layer cognitive stack designed to map syllabus matrices, synthesize personalized diagnostics with Gemini, and shield your preparation against active retention decay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* LEFT COLUMN: INTERACTIVE ISOMETRIC 3D STACK LAYER */}
          <div className="lg:col-span-5 flex flex-col justify-center items-center min-h-[450px] bg-white/[0.01] border border-white/5 rounded-3xl p-6 relative overflow-hidden group/stage">
            {/* Ambient Background Grid Behind the Stack */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none [mask-image:radial-gradient(circle_at_center,black_60%,transparent_100%)]" />
            
            <span className="absolute top-4 left-4 font-mono text-[9px] text-neutral-500 tracking-wider uppercase">Interactive 3D Layer Stack</span>
            <span className="absolute bottom-4 text-center font-mono text-[9px] text-neutral-400 uppercase tracking-widest animate-pulse">
              Click a layer to focus architectural details
            </span>

            {/* Isometric 3D Space */}
            <div 
              className="relative w-full max-w-[340px] h-[320px] flex items-center justify-center"
              style={{
                perspective: "1200px",
                transformStyle: "preserve-3d"
              }}
            >
              {[
                { id: 1, title: "Syllabus Ingestion", desc: "Layer 01: Multi-Vector Graph", color: "from-cyan-500/20 to-blue-600/30", borderColor: "border-cyan-500/30", icon: Database, bgGlow: "bg-cyan-500/10" },
                { id: 2, title: "Gemini Synthesis", desc: "Layer 02: Multi-Agent Synthesis", color: "from-indigo-500/20 to-violet-600/30", borderColor: "border-indigo-500/30", icon: Cpu, bgGlow: "bg-indigo-500/10" },
                { id: 3, title: "Memory Evaluation", desc: "Layer 03: SM-2 Spaced Recall", color: "from-fuchsia-500/20 to-pink-600/30", borderColor: "border-fuchsia-500/30", icon: Flame, bgGlow: "bg-fuchsia-500/10" },
                { id: 4, title: "Target Performance", desc: "Layer 04: Continuous Efficacy", color: "from-emerald-500/20 to-teal-600/30", borderColor: "border-emerald-500/30", icon: TrendingUp, bgGlow: "bg-emerald-500/10" }
              ].map((layer, idx) => {
                const isSelected = selectedWorkflowStep === layer.id;
                // Calculate isometric offset values based on loop index
                const offsetZ = idx * 35;
                const translateY = -idx * 40;
                const scale = 1 - (idx * 0.04);
                
                return (
                  <motion.div
                    key={layer.id}
                    onClick={() => handleManualStepSelect(layer.id)}
                    className={`absolute w-full h-[120px] rounded-2xl p-4 border cursor-pointer select-none transition-all duration-500 ${
                      isSelected 
                        ? `${layer.borderColor} bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-indigo-500/10` 
                        : "border-white/5 bg-[#03020b]/80 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                    style={{
                      transformStyle: "preserve-3d",
                      zIndex: isSelected ? 50 : 10 - idx
                    }}
                    animate={{
                      // Dynamically elevate selected layer upwards and forwards in 3D perspective
                      rotateX: 24,
                      rotateY: -18,
                      rotateZ: 8,
                      y: translateY + (isSelected ? -25 : 0),
                      z: offsetZ + (isSelected ? 45 : 0),
                      scale: isSelected ? 1.05 : scale,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 140,
                      damping: 18
                    }}
                  >
                    {/* Glowing Core for Selected Layer */}
                    {isSelected && (
                      <div className={`absolute inset-0 -z-10 rounded-2xl blur-xl ${layer.bgGlow} transition-all duration-500 opacity-80`} />
                    )}

                    <div className="flex justify-between items-start h-full">
                      <div className="space-y-1.5 text-left">
                        <span className={`text-[8px] font-mono font-bold tracking-widest uppercase block ${
                          isSelected ? "text-indigo-400" : "text-neutral-500"
                        }`}>
                          {layer.desc}
                        </span>
                        <h4 className="text-sm font-bold text-white font-display tracking-tight leading-none">
                          {layer.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-mono mt-1">
                          {layer.id === 1 && "Ingesting 140+ syllabus priority tags"}
                          {layer.id === 2 && "Generates 4 unique option distractors"}
                          {layer.id === 3 && "Recalibrates retention decay curves"}
                          {layer.id === 4 && "Elevates score targets directly to 92%+"}
                        </p>
                      </div>

                      <div className={`p-2.5 rounded-xl border ${
                        isSelected 
                          ? `${layer.borderColor} bg-white/5 text-white` 
                          : "border-white/5 bg-neutral-900/60 text-neutral-500"
                      } transition-colors duration-300`}>
                        <layer.icon className="w-4.5 h-4.5" />
                      </div>
                    </div>

                    {/* Left connection dot decoration */}
                    <div className={`absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 rounded-full border bg-neutral-950 ${
                      isSelected ? "border-indigo-400" : "border-white/10"
                    } flex items-center justify-center transition-all duration-300`}>
                      {isSelected && <div className="w-1 h-1 rounded-full bg-indigo-400 animate-pulse" />}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: DYNAMIC TACTICAL DETAILS PANEL */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white/[0.01] border border-white/5 rounded-3xl p-6 relative overflow-hidden">
            {/* Grid Backlight glow according to active step color */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedWorkflowStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className={`absolute right-0 bottom-0 w-80 h-80 rounded-full blur-[100px] pointer-events-none z-0 ${
                  selectedWorkflowStep === 1 ? "bg-cyan-500" :
                  selectedWorkflowStep === 2 ? "bg-indigo-500" :
                  selectedWorkflowStep === 3 ? "bg-fuchsia-500" :
                  "bg-emerald-500"
                }`}
              />
            </AnimatePresence>

            {/* Core Details Content */}
            <div className="relative z-10 space-y-6">
              {/* Top Navigation Row */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-5">
                <div className="flex gap-2.5">
                  {[1, 2, 3, 4].map((stepNum) => (
                    <button
                      key={stepNum}
                      onClick={() => handleManualStepSelect(stepNum)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-300 ${
                        selectedWorkflowStep === stepNum
                          ? "bg-white/10 border border-white/15 text-white"
                          : "bg-transparent border border-transparent text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      0{stepNum}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider font-semibold">
                    {selectedWorkflowStep === 1 && "PIPELINE: ACTIVE DATA FLO"}
                    {selectedWorkflowStep === 2 && "PIPELINE: GEMINI CORE COMPILING"}
                    {selectedWorkflowStep === 3 && "PIPELINE: MEMORY DECAY SHIELDED"}
                    {selectedWorkflowStep === 4 && "PIPELINE: NATIONAL LEVEL PROJECTIONS"}
                  </span>
                </div>
              </div>

              {/* Main Info */}
              <AnimatePresence mode="wait">
                {(() => {
                  // Find current step metrics
                  const stepData = [
                    {
                      id: 1,
                      title: "Adaptive Syllabus Ingestion",
                      subtitle: "Multidimensional Vectorization",
                      desc: "The system ingests the competitive exam syllabus (such as BCS cadre domains, DU, BUET, or IBA historical targets). Flat topic descriptions are broken down into granular conceptual tags and weighted based on frequency and priority matrices.",
                      badge: "01 / INGESTION PHASE",
                      metric: "0.14ms latency",
                      stats: "1,450+ topics categorized",
                      howItWorks: "Converts linear study guides into a high-dimensional concept graph. By analyzing actual historical boards and diagnostic benchmarks, it assigns a core difficulty-weight variable to each concept subnode.",
                      aspirantImpact: "Eliminates cognitive load. You don't waste hours deciding what to study or checking off checklists. The OS tells you exactly which concept nodes have the highest statistical probability of raising your score today."
                    },
                    {
                      id: 2,
                      title: "Gemini Generative Synthesis",
                      subtitle: "High-Fidelity Question Casting",
                      desc: "Bespoke, validated questions are generated server-side in real-time. The engine constructs powerful multi-tiered scenarios with deep distractor bias levels specifically tailored to catch conceptual fallacies.",
                      badge: "02 / SYNTHESIS ENGINE",
                      metric: "1.1s processing time",
                      stats: "Zero-hallucination guard",
                      howItWorks: "Runs real-time multi-agent verification using the Gemini model. Every question generated must pass a 3-layer validation pipeline: curriculum alignment, options clarity, and logical exclusivity.",
                      aspirantImpact: "No more memorized practice answers. You are tested on actual conceptual comprehension under real examiner-level pressure, building high-stress confidence that standard static prep books cannot offer."
                    },
                    {
                      id: 3,
                      title: "Ebbinghaus Spaced Recall",
                      subtitle: "Persistent Memory Maintenance",
                      desc: "The diagnostic active recall system automatically schedules targeted re-tests based on SM-2 spacing parameters. Incorrect answers are filed in the Mistake Ledger to shield against decay.",
                      badge: "03 / COGNITIVE RETENTION",
                      metric: "SM-2 algorithm active",
                      stats: "98.4% retentive stability",
                      howItWorks: "Tracks your precision, response latency, and confidence rating for every question. As soon as your memory recall probability approaches the Ebbinghaus decay threshold, the system re-triggers the concept.",
                      aspirantImpact: "Permanently plugs your learning leaks. Instead of reviewing notes of things you already know, your limited energy is focused exactly on concepts at their highest vulnerability score."
                    },
                    {
                      id: 4,
                      title: "Continuous Retentive Uplift",
                      subtitle: "Guaranteed Performance Alignment",
                      desc: "As the continuous mock diagnostics progress, your national percentile placement and percentile probability are generated dynamically, steering you straight into elite cohort standard alignment.",
                      badge: "04 / PERFORMANCE STANDING",
                      metric: "+54% performance gains",
                      stats: "Top 1% cohort success",
                      howItWorks: "Normalizes your learning trajectory against active competitor percentiles from elite institutions (BUET, DMC, DU, IBA). Your daily score increases are projected onto live target benchmarks.",
                      aspirantImpact: "Dramatically compresses preparation timelines. You achieve in 30 days of high-fidelity adaptive diagnostics what typically takes 6 months of traditional rote practice and static reading."
                    }
                  ][selectedWorkflowStep - 1];

                  return (
                    <motion.div
                      key={stepData.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-5 text-left"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-neutral-400 bg-white/5 border border-white/5 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          {stepData.badge}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight leading-tight">
                          {stepData.title}
                        </h3>
                        <p className="text-xs text-neutral-400 font-mono italic">
                          {stepData.subtitle}
                        </p>
                      </div>

                      <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-sans">
                        {stepData.desc}
                      </p>

                      {/* Split Info Panel */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2.5">
                        {/* Mechanics column */}
                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2 relative overflow-hidden hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                              <Cpu className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[10px] font-bold font-mono text-neutral-300 uppercase tracking-wide">
                              HOW IT ACTUALLY WORKS
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-relaxed">
                            {stepData.howItWorks}
                          </p>
                        </div>

                        {/* Impact column */}
                        <div className="p-4 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2 relative overflow-hidden hover:border-white/10 transition-colors">
                          <div className="flex items-center gap-2">
                            <span className="p-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                              <Zap className="w-3.5 h-3.5" />
                            </span>
                            <span className="text-[10px] font-bold font-mono text-neutral-300 uppercase tracking-wide">
                              THE ULTIMATE STUDY IMPACT
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 leading-relaxed">
                            {stepData.aspirantImpact}
                          </p>
                        </div>
                      </div>

                      {/* Dynamic Simulated Metric Strip */}
                      <div className="border-t border-white/5 pt-4.5 flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="flex items-center gap-1.5 text-neutral-500">
                            Metric Output: <strong className="text-neutral-300 font-bold">{stepData.metric}</strong>
                          </span>
                          <span className="text-neutral-700">|</span>
                          <span className="flex items-center gap-1.5 text-neutral-500">
                            Subsystem: <strong className="text-neutral-300 font-bold">{stepData.stats}</strong>
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 bg-neutral-950/40 border border-white/5 px-2.5 py-1 rounded-lg text-[9px] font-mono text-neutral-400">
                          <span className="text-indigo-400 font-bold uppercase">Ready</span>
                          <span>• Secure Core API</span>
                        </div>
                      </div>

                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Bottom Real-time Telemetry Graph Simulator */}
            <div className="mt-8 border-t border-white/5 pt-5 relative z-10">
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-neutral-500">
                <span className="flex items-center gap-1.5 uppercase font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Live Cognitive Ingestion Feed
                </span>
                <span>Active Target: {selectedExam} Syllabus</span>
              </div>
              
              <div className="bg-black/45 border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-stretch justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <span className="text-neutral-400">Active Concept Processing:</span>
                    <span className="text-cyan-400 font-bold">In-Transit (UTC-2026)</span>
                  </div>
                  <div className="w-full bg-neutral-900 rounded-full h-1.5 overflow-hidden relative">
                    <motion.div 
                      key={selectedWorkflowStep}
                      initial={{ width: "15%" }}
                      animate={{ width: selectedWorkflowStep === 1 ? "35%" : selectedWorkflowStep === 2 ? "65%" : selectedWorkflowStep === 3 ? "85%" : "100%" }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      className="bg-gradient-to-r from-cyan-400 to-indigo-500 h-full rounded-full" 
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500">
                    <span>Tag Vectorizer: [OK]</span>
                    <span>Confidence Limit: {selectedWorkflowStep === 1 ? "91.2%" : selectedWorkflowStep === 2 ? "94.5%" : selectedWorkflowStep === 3 ? "98.1%" : "99.8%"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 md:border-l md:border-white/5 md:pl-5">
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-neutral-500 uppercase block leading-none">THROUGHPUT</span>
                    <span className="text-lg font-bold text-white mt-1 block">
                      {selectedWorkflowStep === 1 ? "99.4" : selectedWorkflowStep === 2 ? "99.1" : selectedWorkflowStep === 3 ? "99.7" : "99.9"}%
                    </span>
                  </div>
                  <span className="text-neutral-700">|</span>
                  <div className="text-left font-mono">
                    <span className="text-[9px] text-neutral-500 uppercase block leading-none">RETENTION RAILS</span>
                    <span className="text-lg font-bold text-indigo-400 mt-1 block">
                      {selectedWorkflowStep === 1 ? "84.2" : selectedWorkflowStep === 2 ? "89.6" : selectedWorkflowStep === 3 ? "92.4" : "98.6"}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 9. THE ULTIMATE CT BLOCK */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090909] border border-white/5 text-center space-y-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent pointer-events-none" />
          
          <div className="space-y-4">
            <TypewriterHeading />
            <p className="text-neutral-400 max-w-lg mx-auto text-xs sm:text-sm leading-relaxed">
              Join thousands of candidates modeling real-time syllabus competencies. Launch your diagnostic assessment now.
            </p>
          </div>

          <div className="max-w-md mx-auto p-5 bg-[#050505] rounded-2xl border border-white/5 text-left space-y-4">
            <span className="text-[10px] text-indigo-400 font-mono font-bold flex items-center gap-1.5 uppercase tracking-wider">
              <Lock className="w-3.5 h-3.5" /> SECURE REGISTRATION CONSOLE
            </span>
            
            {user ? (
              <div className="space-y-3 font-sans">
                <p className="text-xs text-neutral-300 leading-relaxed">
                  You are signed in as <strong className="text-white font-mono">{user.email}</strong>. Press below to trigger your custom onboard diagnostic or resume mock tracking.
                </p>
                <button 
                  onClick={() => onStartOnboarding(selectedExam)}
                  className="w-full py-3 bg-white hover:bg-neutral-200 text-neutral-950 font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  Onboard Diagnostic Engine
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3 font-sans">
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Authenticate your workspace to save mock profiles, retain decay curve analytics, and compare district standings.
                </p>
                <button 
                  onClick={onOpenAuth}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10"
                >
                  Create Secure Credentials
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* 10. SYSTEM FOOTER WITH SHARED UNDERLINE HOVER */}
      <footer className="border-t border-white/5 pt-16 mt-16 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-xs text-neutral-500 text-left font-mono leading-relaxed">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-neutral-300">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-bold tracking-wider text-sm font-sans">9TH GRADE AI OS</span>
          </div>
          <p className="text-neutral-500">
            Next-generation autonomous learning operating system supporting top competitive recruitment examinations in Bangladesh. Developed by elite engineers.
          </p>
        </div>
        <div>
          <h5 className="text-neutral-300 font-semibold uppercase mb-4 tracking-wider">EXAMS</h5>
          <ul className="space-y-2.5">
            {["BCS Preliminary Standard", "Bangladesh Bank AD Systems", "Senior Officer Recruits", "BPSC Non-Cadre Systems"].map((link) => (
              <li key={link}>
                <button
                  onMouseEnter={() => setHoveredFooterLink(link)}
                  onMouseLeave={() => setHoveredFooterLink(null)}
                  className="relative pb-0.5 hover:text-white transition-colors text-left focus:outline-none cursor-pointer"
                >
                  {link}
                  {hoveredFooterLink === link && (
                    <motion.div layoutId="footerUnderline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-indigo-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-neutral-300 font-semibold uppercase mb-4 tracking-wider">CORE ENGINES</h5>
          <ul className="space-y-2.5">
            {["Psychometric Deduplication", "Spaced Forgetting Curves", "Bilingual Written Evaluation", "National Projections Module"].map((link) => (
              <li key={link}>
                <button
                  onMouseEnter={() => setHoveredFooterLink(link)}
                  onMouseLeave={() => setHoveredFooterLink(null)}
                  className="relative pb-0.5 hover:text-white transition-colors text-left focus:outline-none cursor-pointer"
                >
                  {link}
                  {hoveredFooterLink === link && (
                    <motion.div layoutId="footerUnderline" className="absolute bottom-0 left-0 right-0 h-[1px] bg-indigo-500" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h5 className="text-neutral-300 font-semibold uppercase mb-4 tracking-wider">LEGAL AND COMPLIANCE</h5>
          <p className="text-neutral-500">
            Data models represent sandboxed candidate structures. Predicted ranks utilize authentic historical distributions. All rights reserved © 2026.
          </p>
        </div>
      </footer>

    </div>
  );
}
