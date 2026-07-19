import { Router } from "express";
import { AnalyticsRepo } from "../repositories/analytics.repo";
import { UserRepo } from "../repositories/user.repo";
import { PercentileService } from "../services/analytics/percentile.service";
import { UserAnalyticsModel } from "../models/analytics.model";
import { defaultUserProfile } from "../src/types";

const router = Router();

// Constant mock defaults for dashboard representation
const DEFAULT_SUBJECT_MASTERY = [
  { subject: "Bangla Language & Literature", score: 82, color: "#f43f5e" },
  { subject: "English Language & Literature", score: 76, color: "#3b82f6" },
  { subject: "Mathematical Reasoning & Mental Ability", score: 91, color: "#10b981" },
  { subject: "General Knowledge (BD & International)", score: 68, color: "#f59e0b" },
  { subject: "General Science & Computer Literacy", score: 74, color: "#8b5cf6" }
];

const DEFAULT_RANK_HISTORY = [
  { date: "June 12", rank: 412, percentile: 99.10 },
  { date: "June 13", rank: 395, percentile: 99.12 },
  { date: "June 14", rank: 371, percentile: 99.18 },
  { date: "June 15", rank: 350, percentile: 99.22 },
  { date: "June 16", rank: 342, percentile: 99.24 }
];

// Helper to construct mock analytical state
function buildAnalytics(userId: string, xp: number, streak: number): UserAnalyticsModel {
  const mastery: Record<string, number> = {};
  DEFAULT_SUBJECT_MASTERY.forEach(m => {
    mastery[m.subject] = m.score;
  });

  return {
    userId,
    totalXp: xp,
    curLevel: Math.floor(xp / 1000) + 1,
    cumulativePercentile: 99.24,
    cohortRank: 42,
    streak,
    masteryHeatmap: mastery,
    dailyStats: [
      { date: "2026-06-17", xpEarned: 240, questionsSolved: 15, correctAnswers: 12, timeSpentSeconds: 450 }
    ]
  };
}

// Endpoint: GET /api/analytics/dashboard
router.get("/dashboard", async (req, res) => {
  const userId = (req.query.userId as string) || "farhan-uid";
  try {
    let profile = await UserRepo.getProfile(userId);
    if (!profile) {
      profile = { ...defaultUserProfile };
    }

    let stats = await AnalyticsRepo.getAnalytics(userId);
    if (!stats) {
      stats = buildAnalytics(userId, profile.xp, profile.streak);
      await AnalyticsRepo.setAnalytics(userId, stats);
    }

    // Connect to dynamic percentile calculation engine
    const scores = Object.values(stats.masteryHeatmap);
    const avgScore = scores.reduce((sum, s) => sum + s, 0) / (scores.length || 1);
    
    const evaluation = PercentileService.calculatePercentile({
      accuracy: Math.round(avgScore),
      xp: profile.xp,
      streak: profile.streak
    });

    res.json({
      userId,
      xp: profile.xp,
      level: profile.level,
      percentile: evaluation.percentile,
      predictedRank: evaluation.predictedRank,
      passingProbability: evaluation.passingProbability,
      streak: profile.streak,
      subjectMastery: Object.keys(stats.masteryHeatmap).map(sub => {
        const matchingDef = DEFAULT_SUBJECT_MASTERY.find(d => d.subject === sub);
        return {
          subject: sub,
          score: stats!.masteryHeatmap[sub],
          color: matchingDef?.color || "#64748b"
        };
      }),
      rankHistory: DEFAULT_RANK_HISTORY,
      cognitiveFatigue: [
        { hour: 8, fatigue: 15 },
        { hour: 10, fatigue: 20 },
        { hour: 12, fatigue: 45 },
        { hour: 14, fatigue: 60 },
        { hour: 16, fatigue: 40 },
        { hour: 18, fatigue: 10 }
      ],
      timePerQuestionTrend: [
        { questionIndex: 1, actualSeconds: 42, averageSeconds: 36 },
        { questionIndex: 2, actualSeconds: 28, averageSeconds: 34 },
        { questionIndex: 3, actualSeconds: 35, averageSeconds: 35 },
        { questionIndex: 4, actualSeconds: 19, averageSeconds: 32 },
        { questionIndex: 5, actualSeconds: 22, averageSeconds: 31 }
      ],
      guessRateBySubject: [
        { subject: "Bangla", rate: 5 },
        { subject: "English", rate: 8 },
        { subject: "Math", rate: 2 },
        { subject: "General Knowledge", rate: 15 }
      ]
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to evaluate dashboard statistics", details: err.message });
  }
});

// Endpoint: GET /api/analytics/cohort
router.get("/cohort", (req, res) => {
  res.json({
    cohortSize: 450000,
    districtStandings: [
      { district: "Dhaka", averagePercentile: 94.2, topScorersCount: 421 },
      { district: "Chattogram", averagePercentile: 91.8, topScorersCount: 295 },
      { district: "Rajshahi", averagePercentile: 89.5, topScorersCount: 184 },
      { district: "Khulna", averagePercentile: 88.1, topScorersCount: 142 }
    ],
    examTypeStandings: [
      { examType: "BCS", activeAspirants: 320000, competitivenessIndex: 9.8 },
      { examType: "Admission", activeAspirants: 85000, competitivenessIndex: 8.5 }
    ]
  });
});

// Endpoint: POST /api/analytics/event
router.post("/event", async (req, res) => {
  const userId = (req.body.userId as string) || "farhan-uid";
  const { eventType, value, subject } = req.body; // e.g. quiz_completed, accuracy_gain

  try {
    let stats = await AnalyticsRepo.getAnalytics(userId);
    if (!stats) {
      stats = buildAnalytics(userId, 3250, 12);
    }

    if (eventType === "quiz_completed" && subject && value) {
      // Modify subject mastery
      const currentVal = stats.masteryHeatmap[subject] || 60;
      // Weighted adjustment
      stats.masteryHeatmap[subject] = Math.round(currentVal * 0.9 + value * 0.1);
    }

    // append timeline event
    stats.dailyStats.push({
      date: new Date().toISOString().split("T")[0],
      xpEarned: eventType === "quiz_completed" ? 150 : 50,
      questionsSolved: eventType === "quiz_completed" ? 10 : 1,
      correctAnswers: eventType === "quiz_completed" ? 8 : 1,
      timeSpentSeconds: 300
    });

    await AnalyticsRepo.setAnalytics(userId, stats);

    res.json({ success: true, updatedStats: stats });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to ingest event log", details: err.message });
  }
});

export default router;
