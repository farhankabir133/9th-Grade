export type ExamType = 'BCS' | 'BANK_AD' | 'NON_CADRE' | 'PRIMARY';

export interface UserProfile {
  name: string;
  phone: string;
  examType: ExamType;
  targetYear: number;
  streak: number;
  xp: number;
  level: number;
  learningStyle: 'visual' | 'analytical' | 'verbal' | 'interactive';
  readinessScore: number; // 0 to 100
  predictedRank: number;
  totalStudents: number;
  passingProbability: number; // 0 to 100
  consistencyScore: number; // 0 to 100
  district: string;
  archetype: string; // e.g., "Analytical Strategist", "Persistent Reviewer"
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  subject: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  concept?: string;
  cognitiveDimension?: string;
  uniquenessScore?: number;
  difficultyScore?: number;
  conceptDepthScore?: number;
  syllabusRelevanceScore?: number;
  distractorQualityScore?: number;
  overallQualityScore?: number;
  recruitmentRelevance?: string;
  explanations?: {
    bn: string;
    en: string;
    wrongOptions: string[];
  };
}

export interface ExamSession {
  examId: string;
  title: string;
  questions: Question[];
  durationMinutes: number;
  results?: {
    score: number;
    totalPossible: number;
    timeSpentSeconds: number;
    accuracy: number;
    percentile: number;
    weakTopics: string[];
    guessDetections: number;
    confidenceLevel: 'High' | 'Low' | 'Mixed';
  };
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  bilingual?: {
    bn: string;
    en: string;
  };
  stepByStep?: string[];
  conceptDecomposition?: string;
}

export interface RevisionSchedule {
  id: string;
  topic: string;
  subject: string;
  urgencyScore: number; // 0 - 100
  retentionProbability: number; // 0 - 100
  daysSinceLastReview: number;
  nextScheduledDate: string;
  historyLength: number;
}

export interface Circular {
  id: string;
  title: string;
  organization: string;
  vacancyCount: number;
  deadline: string;
  admitCardDate?: string;
  countdownDays: number;
  link: string;
  syllabusOverview: string[];
}

export interface AnalyticsData {
  subjectMastery: { subject: string; score: number; score2?: number; color: string }[];
  rankHistory: { date: string; rank: number; percentile: number }[];
  cognitiveFatigue: { hour: number; fatigue: number }[];
  timePerQuestionTrend: { questionIndex: number; actualSeconds: number; averageSeconds: number }[];
  guessRateBySubject: { subject: string; rate: number }[];
}

export interface WrittenEvaluation {
  id: string;
  title: string;
  subject: string;
  submissionText: string;
  scores: {
    grammar: number; // 0-10
    coherence: number; // 0-10
    structure: number; // 0-10
    banglaCustom?: number; // 0-10
    overall: number; // 0-100
  };
  feedback: {
    strength: string;
    gap: string;
    grammarFixes: string[];
    modelComparisons: string;
  };
  predictedScore: number;
}

export const defaultUserProfile: UserProfile = {
  name: "Farhan Kabir",
  phone: "01723456789",
  examType: "BCS",
  targetYear: 2026,
  streak: 12,
  xp: 3250,
  level: 4,
  learningStyle: "analytical",
  readinessScore: 78,
  predictedRank: 342,
  totalStudents: 450000,
  passingProbability: 82,
  consistencyScore: 94,
  district: "Dhaka",
  archetype: "Analytical Strategist"
};

