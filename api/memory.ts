import { Router } from "express";
import { MemoryRepo } from "../repositories/memory.repo";
import { Sm2Algorithm } from "../services/memory/sm2.algorithm";
import { MemoryScheduleModel, MemoryItemModel } from "../models/memory.model";
import { AuthRequest, authMiddleware } from "../server/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

const DEFAULT_TOPICS = [
  { id: "sm-bcs-1", topic: "চর্যাপদ ও মধ্যযুগ", subject: "Bangla Language & Literature", urgencyScore: 92, retentionProbability: 40, daysSinceLastReview: 14, EF: 1.8, rep: 2, interval: 6 },
  { id: "sm-bcs-2", topic: "Constitutional Amendments of BD", subject: "General Knowledge", urgencyScore: 84, retentionProbability: 55, daysSinceLastReview: 8, EF: 2.1, rep: 3, interval: 12 },
  { id: "sm-bcs-3", topic: "Common Prepositions & Idioms", subject: "English Language & Literature", urgencyScore: 71, retentionProbability: 68, daysSinceLastReview: 5, EF: 2.3, rep: 4, interval: 18 },
  { id: "sm-bcs-4", topic: "ধারা ও অনুক্রম", subject: "Mathematical Reasoning & Mental Ability", urgencyScore: 45, retentionProbability: 88, daysSinceLastReview: 3, EF: 2.5, rep: 5, interval: 24 }
];

function buildMockSchedule(userId: string): MemoryScheduleModel {
  const futureDate = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  };

  const items: MemoryItemModel[] = DEFAULT_TOPICS.map((t, idx) => ({
    id: t.id,
    userId,
    topicId: t.id,
    topic: t.topic,
    subject: t.subject,
    easinessFactor: t.EF,
    intervalDays: t.interval,
    repetitionCount: t.rep,
    nextReviewDate: idx === 0 ? new Date().toISOString() : futureDate(t.interval),
    lastReviewDate: new Date().toISOString()
  }));

  return { userId, items };
}

router.get("/due", async (req: AuthRequest, res) => {
  const userId = req.user?.id || (req.query.userId as string) || "farhan-uid";
  try {
    let schedule = await MemoryRepo.getMemorySchedule(userId, req.accessToken);
    if (!schedule) {
      schedule = buildMockSchedule(userId);
      await MemoryRepo.setMemorySchedule(userId, schedule, req.accessToken);
    }

    const now = new Date();
    const dueItems = schedule.items.map(item => {
      const isDue = new Date(item.nextReviewDate) <= now;

      const diffMs = Math.max(0, now.getTime() - new Date(item.lastReviewDate).getTime());
      const diffDays = diffMs / (1000 * 60 * 60 * 24);
      const retention = Math.round(100 * Math.exp(-diffDays / (item.intervalDays || 1)));
      const urgency = Math.max(0, Math.min(100, Math.round(100 - retention)));

      return {
        id: item.id,
        topic: item.topic,
        subject: item.subject,
        urgencyScore: urgency,
        retentionProbability: Math.max(10, retention),
        daysSinceLastReview: Math.round(diffDays),
        nextScheduledDate: item.nextReviewDate,
        historyLength: item.repetitionCount,
        isDue
      };
    });

    res.json({ userId, schedule: dueItems });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch spaced items", details: err.message });
  }
});

router.post("/submit", async (req: AuthRequest, res) => {
  const userId = req.user?.id || (req.body.userId as string) || "farhan-uid";
  const { topicId, quality } = req.body;

  if (!topicId || quality === undefined || quality < 0 || quality > 5) {
    return res.status(400).json({ error: "Missing or invalid review input parameters" });
  }

  try {
    let schedule = await MemoryRepo.getMemorySchedule(userId, req.accessToken);
    if (!schedule) {
      schedule = buildMockSchedule(userId);
    }

    const itemIdx = schedule.items.findIndex(item => item.id === topicId);
    if (itemIdx === -1) {
      return res.status(404).json({ error: "Topic ID not found in spaced memory list" });
    }

    const currentItem = schedule.items[itemIdx];
    const evaluated = Sm2Algorithm.evaluate(
      {
        easinessFactor: currentItem.easinessFactor,
        intervalDays: currentItem.intervalDays,
        repetitionCount: currentItem.repetitionCount
      },
      quality
    );

    schedule.items[itemIdx] = {
      ...currentItem,
      easinessFactor: evaluated.easinessFactor,
      intervalDays: evaluated.intervalDays,
      repetitionCount: evaluated.repetitionCount,
      nextReviewDate: evaluated.nextReviewDate,
      lastReviewDate: new Date().toISOString()
    };

    await MemoryRepo.setMemorySchedule(userId, schedule, req.accessToken);

    res.json({
      success: true,
      qualityScore: quality,
      updatedItem: {
        id: currentItem.id,
        topic: currentItem.topic,
        nextReviewDate: evaluated.nextReviewDate,
        intervalDays: evaluated.intervalDays,
        easinessFactor: evaluated.easinessFactor,
        repetitionCount: evaluated.repetitionCount
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to recalculate spaced repetition variables", details: err.message });
  }
});

router.get("/roadmap", async (req: AuthRequest, res) => {
  const userId = req.user?.id || (req.query.userId as string) || "farhan-uid";
  try {
    let schedule = await MemoryRepo.getMemorySchedule(userId, req.accessToken);
    if (!schedule) {
      schedule = buildMockSchedule(userId);
      await MemoryRepo.setMemorySchedule(userId, schedule, req.accessToken);
    }

    const timeline = [...schedule.items]
      .sort((a, b) => new Date(a.nextReviewDate).getTime() - new Date(b.nextReviewDate).getTime())
      .map(item => ({
        id: item.id,
        topic: item.topic,
        subject: item.subject,
        nextReviewDate: item.nextReviewDate,
        interval: item.intervalDays,
        easiness: item.easinessFactor
      }));

    res.json({ timeline });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch spaced timeline roadmap", details: err.message });
  }
});

export default router;
