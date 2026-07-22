import { Router } from "express";
import { supabaseAdmin, supabaseAsUser } from "../config/supabase";
import { callModelWithRouter, resolveTaskType, isGeminiTask, isGroqTask } from "../services/ai/model-router.service";
import { RetrievalService } from "../services/ai/retrieval.service";
import { ValidationService } from "../services/ai/validation.service";
import { PublishService } from "../services/ai/publish.service";
import { getProceduralQuestionsForSubject } from "../utils/procedurals";
import { AuthRequest, authMiddleware } from "../server/middleware/auth.middleware";
import { requireRole } from "../server/middleware/requireRole";

const router = Router();

const REPLENISH_SECRET = process.env.REPLENISH_SECRET || "";
const MINIMUM_STOCK_THRESHOLD = parseInt(process.env.MINIMUM_STOCK_THRESHOLD || "30", 10);

function requireSharedSecret(req: any, res: any, next: any) {
  const secret = req.headers["x-replenish-secret"];
  if (!secret || secret !== REPLENISH_SECRET) {
    return res.status(401).json({ error: "Invalid or missing replenish secret" });
  }
  next();
}

async function runReplenishment(req: AuthRequest, res: any) {
  const startTime = Date.now();
  let totalGenerated = 0;
  let totalPublished = 0;
  let totalSkipped = 0;
  const deficits: any[] = [];
  const errors: string[] = [];

  try {
    const { examTypes } = req.body;
    const targetExamTypes = Array.isArray(examTypes) && examTypes.length > 0
      ? examTypes
      : ["BCS", "Bank", "9th-Grade"];

    const subjects = [
      "Bangla Language & Literature",
      "English Language & Literature",
      "Mathematical Reasoning & Mental Ability",
      "General Knowledge (BD & International)",
      "General Science & Computer Literacy",
    ];

    const topics: Record<string, string[]> = {
      "Bangla Language & Literature": ["Charyapad", "Medieval Literature", "Modern Literature", "Grammar"],
      "English Language & Literature": ["Grammar", "Vocabulary", "Comprehension", "Literature"],
      "Mathematical Reasoning & Mental Ability": ["Algebra", "Geometry", "Arithmetic", "Data Interpretation"],
      "General Knowledge (BD & International)": ["Bangladesh Affairs", "International Affairs", "Current Affairs", "Geography"],
      "General Science & Computer Literacy": ["Physics", "Chemistry", "Biology", "ICT"],
    };

    const difficulties = ["Easy", "Medium", "Hard"];

    const { data: stockData, error: stockError } = await supabaseAdmin()
      .from("question_bank")
      .select("exam_type, subject, topic, difficulty", { count: "exact", head: false });

    if (stockError) {
      console.error("[admin/replenish] Failed to fetch stock counts:", stockError);
      return res.status(500).json({ error: "Failed to analyze question bank stock", details: stockError.message });
    }

    const stockMap = new Map<string, number>();
    for (const row of stockData || []) {
      const key = `${row.exam_type}::${row.subject}::${row.topic || "General"}::${row.difficulty}`;
      stockMap.set(key, (stockMap.get(key) || 0) + 1);
    }

    const deficitsList: Array<{ examType: string; subject: string; topic: string; difficulty: string; needed: number }> = [];

    for (const examType of targetExamTypes) {
      for (const subject of subjects) {
        const topicList = topics[subject] || ["General"];
        for (const topic of topicList) {
          for (const difficulty of difficulties) {
            const key = `${examType}::${subject}::${topic}::${difficulty}`;
            const current = stockMap.get(key) || 0;
            const needed = Math.max(0, MINIMUM_STOCK_THRESHOLD - current);

            if (needed > 0) {
              deficitsList.push({ examType, subject, topic, difficulty, needed });
            }
          }
        }
      }
    }

    console.log(`[admin/replenish] Found ${deficitsList.length} deficits below threshold of ${MINIMUM_STOCK_THRESHOLD}`);

    for (const deficit of deficitsList) {
      const { examType, subject, topic, difficulty, needed } = deficit;

      try {
        const taskType = resolveTaskType(subject, topic, examType);

        let generated: any[] = [];
        let modelUsed = "unknown";

        if (isGeminiTask(taskType)) {
          const result = await callModelWithRouter<any>({
            taskType,
            prompt: `Generate ${needed} multiple choice questions for ${examType} exam. Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}. Output JSON: {questions: [{text, options: [A,B,C,D], correctIndex, subject, topic, difficulty, explanations: {bn, en, wrongOptions: [A,B,C]}}]}`,
            systemInstruction: "You are a world-class question setter. Output valid JSON only.",
            temperature: 0.8,
          });
          generated = result.questions || [];
          modelUsed = "gemini";
        } else if (isGroqTask(taskType)) {
          const result = await callModelWithRouter<any>({
            taskType,
            prompt: `Generate ${needed} multiple choice questions for ${examType} exam. Subject: ${subject}, Topic: ${topic}, Difficulty: ${difficulty}. Output JSON: {questions: [{text, options: [A,B,C,D], correctIndex, subject, topic, difficulty, explanations: {bn, en, wrongOptions: [A,B,C]}}]}`,
            systemInstruction: "You are a world-class question setter. Output valid JSON only.",
            temperature: 0.8,
          });
          generated = result.questions || [];
          modelUsed = "groq";
        }

        if (generated.length === 0) {
          const procedural = getProceduralQuestionsForSubject(subject, needed, topic, difficulty, Math.floor(Math.random() * 1000));
          generated = procedural.map((q: any) => ({ ...q, isFallback: true }));
          modelUsed = "procedural";
          totalSkipped++;
        }

        let accepted = 0;
        for (const q of generated) {
          const schemaValidation = ValidationService.validateQuestionSchema(q);
          if (!schemaValidation.valid) {
            console.warn(`[admin/replenish] Schema validation failed for ${subject}/${topic}:`, schemaValidation.errors);
            continue;
          }

          const isDuplicate = await ValidationService.checkDuplicateQuestion(q.text, subject, topic);
          if (isDuplicate) {
            console.warn(`[admin/replenish] Duplicate detected, skipping:`, q.text.slice(0, 60));
            continue;
          }

          try {
            await PublishService.publishQuestion(q, {
              modelUsed,
              taskType: "replenish",
            });
            accepted++;
            totalGenerated++;
          } catch (publishErr) {
            console.error(`[admin/replenish] Publish failed for ${subject}/${topic}:`, publishErr);
            errors.push(`Publish failed: ${publishErr}`);
          }
        }

        totalPublished += accepted;
        deficits.push({
          examType,
          subject,
          topic,
          difficulty,
          requested: needed,
          generated: accepted,
          modelUsed,
        });
      } catch (genErr: any) {
        console.error(`[admin/replenish] Generation failed for ${subject}/${topic}:`, genErr);
        errors.push(`Generation failed for ${subject}/${topic}: ${genErr.message}`);
      }
    }

    const latencyMs = Date.now() - startTime;

    await PublishService.logGeneration({
      taskType: "replenish",
      modelUsed: "mixed",
      latencyMs,
      passedValidation: totalGenerated > 0,
      retryCount: 0,
      costUsd: 0,
    });

    return res.json({
      ok: true,
      threshold: MINIMUM_STOCK_THRESHOLD,
      deficitsAnalyzed: deficitsList.length,
      totalGenerated,
      totalPublished,
      totalSkipped,
      deficits,
      errors: errors.length > 0 ? errors : undefined,
      latencyMs,
    });
  } catch (err: any) {
    console.error("[admin/replenish] Fatal error:", err);
    return res.status(500).json({ error: "Replenishment failed", details: err.message });
  }
}

router.post("/replenish", authMiddleware, requireRole("admin"), async (req: AuthRequest, res) => {
  return runReplenishment(req, res);
});

router.post("/replenish", requireSharedSecret, async (req: AuthRequest, res) => {
  return runReplenishment(req, res);
});

export default router;