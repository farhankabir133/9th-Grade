import { Router } from "express";
import { QuestionBankRepo } from "../repositories/question-bank.repo";
import { AuthRequest, authMiddleware } from "../server/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/questions", async (req: AuthRequest, res) => {
  const {
    subject,
    topic,
    difficulty,
    examType,
    reviewStatus,
    limit = "50",
    offset = "0",
  } = req.query;

  try {
    const questions = await QuestionBankRepo.getQuestions(
      {
        subject: subject as string | undefined,
        topic: topic as string | undefined,
        difficulty: difficulty as string | undefined,
        examType: examType as string | undefined,
        reviewStatus: reviewStatus as string | undefined,
        limit: parseInt(limit as string, 10),
        offset: parseInt(offset as string, 10),
      },
      req.accessToken
    );

    res.json({ questions, count: questions.length });
  } catch (err: any) {
    console.error("[bank] Failed to fetch questions:", err);
    res.status(500).json({ error: "Failed to load question bank", details: err.message });
  }
});

export default router;
