import { Router } from "express";
import { supabaseAdmin } from "../config/supabase";
import { AuthRequest, authMiddleware } from "../server/middleware/auth.middleware";
import { requireRole } from "../server/middleware/requireRole";

const router = Router();

router.use(authMiddleware);
router.use(requireRole("reviewer", "admin"));

router.get("/queue", async (req: AuthRequest, res) => {
  try {
    const { data, error } = await supabaseAdmin()
      .from("review_queue")
      .select(`
        id,
        question_bank_id,
        assigned_to,
        status,
        reviewer_notes,
        decision,
        created_at,
        resolved_at,
        question_bank (
          id,
          subject,
          topic,
          difficulty,
          question_text,
          options,
          correct_index,
          explanations,
          generated_by
        )
      `)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[review] Failed to fetch queue:", error);
      return res.status(500).json({ error: "Failed to load review queue", details: error.message });
    }

    const queue = (data || []).map((row: any) => ({
      id: row.id,
      questionBankId: row.question_bank_id,
      assignedTo: row.assigned_to,
      status: row.status,
      reviewerNotes: row.reviewer_notes,
      decision: row.decision,
      createdAt: row.created_at,
      resolvedAt: row.resolved_at,
      question: row.question_bank ? {
        id: row.question_bank.id,
        subject: row.question_bank.subject,
        topic: row.question_bank.topic,
        difficulty: row.question_bank.difficulty,
        text: row.question_bank.question_text,
        options: row.question_bank.options,
        correctIndex: row.question_bank.correct_index,
        explanations: row.question_bank.explanations,
        generatedBy: row.question_bank.generated_by,
      } : null,
    }));

    res.json({ queue, count: queue.length });
  } catch (err: any) {
    console.error("[review] Fatal error fetching queue:", err);
    res.status(500).json({ error: "Failed to load review queue", details: err.message });
  }
});

router.post("/:id/decide", async (req: AuthRequest, res) => {
  const { id } = req.params;
  const { decision, reviewerNotes } = req.body;

  if (!decision || !["approve", "reject", "edit_and_approve"].includes(decision)) {
    return res.status(400).json({ error: "Invalid decision. Must be approve, reject, or edit_and_approve" });
  }

  try {
    const { data: queueItem, error: fetchError } = await supabaseAdmin()
      .from("review_queue")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError || !queueItem) {
      return res.status(404).json({ error: "Review queue item not found" });
    }

    const { error: updateError } = await supabaseAdmin()
      .from("review_queue")
      .update({
        status: "resolved",
        decision,
        reviewer_notes: reviewerNotes || null,
        resolved_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (updateError) {
      console.error("[review] Failed to update queue item:", updateError);
      return res.status(500).json({ error: "Failed to record decision", details: updateError.message });
    }

    if (decision === "approve") {
      const { error: approveError } = await supabaseAdmin()
        .from("question_bank")
        .update({ review_status: "approved" })
        .eq("id", queueItem.question_bank_id);

      if (approveError) {
        console.error("[review] Failed to approve question:", approveError);
      }
    } else if (decision === "reject") {
      const { error: rejectError } = await supabaseAdmin()
        .from("question_bank")
        .update({ review_status: "rejected" })
        .eq("id", queueItem.question_bank_id);

      if (rejectError) {
        console.error("[review] Failed to reject question:", rejectError);
      }
    }

    res.json({
      ok: true,
      queueItemId: id,
      questionBankId: queueItem.question_bank_id,
      decision,
      status: "resolved",
    });
  } catch (err: any) {
    console.error("[review] Fatal error deciding:", err);
    res.status(500).json({ error: "Failed to record decision", details: err.message });
  }
});

export default router;
