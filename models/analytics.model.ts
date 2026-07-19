export interface DailyStat {
  date: string;
  xpEarned: number;
  questionsSolved: number;
  correctAnswers: number;
  timeSpentSeconds: number;
}

export interface UserAnalyticsModel {
  userId: string;
  totalXp: number;
  curLevel: number;
  cumulativePercentile: number;
  cohortRank: number;
  streak: number;
  masteryHeatmap: Record<string, number>; // key: subject, value: score/progress percentage
  dailyStats: DailyStat[];
}
