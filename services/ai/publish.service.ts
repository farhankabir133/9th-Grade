import { supabaseAdmin } from "../../config/supabase";

export interface PublishResult {
  questionId: string;
  published: boolean;
  reviewQueueId?: string;
}

export class PublishService {
  static async publishQuestion(
    question: any,
    options?: {
      modelUsed?: string;
      taskType?: string;
      generationLogId?: string;
      sourceDocumentIds?: string[];
    }
  ): Promise<PublishResult> {
    const { data: questionRow, error: questionError } = await supabaseAdmin()
      .from("question_bank")
      .upsert({
        id: question.id || `q-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        subject: question.subject,
        topic: question.topic,
        difficulty: question.difficulty,
        question_text: question.text,
        options: question.options,
        correct_index: question.correctIndex,
        explanation_bn: question.explanations?.bn || "",
        explanation_en: question.explanations?.en || "",
        source_document_ids: options?.sourceDocumentIds || [],
        generated_by: options?.modelUsed || "unknown",
        review_status: "pending",
        usage_count: 0,
        report_count: 0,
      })
      .select("id")
      .single();

    if (questionError || !questionRow) {
      console.error("[PublishService] Failed to publish question:", questionError);
      return { questionId: question.id || "unknown", published: false };
    }

    const { data: reviewRow, error: reviewError } = await supabaseAdmin()
      .from("review_queue")
      .insert({
        question_bank_id: questionRow.id,
        status: "queued",
      })
      .select("id")
      .single();

    if (reviewError) {
      console.error("[PublishService] Failed to create review queue entry:", reviewError);
    }

    return {
      questionId: questionRow.id,
      published: true,
      reviewQueueId: reviewRow?.id,
    };
  }

  static async logGeneration(params: {
    taskType: string;
    modelUsed: string;
    promptTokens?: number;
    completionTokens?: number;
    latencyMs: number;
    passedValidation: boolean;
    retryCount: number;
    costUsd?: number;
  }): Promise<void> {
    await supabaseAdmin().from("generation_logs").insert({
      task_type: params.taskType,
      model_used: params.modelUsed,
      prompt_tokens: params.promptTokens || 0,
      completion_tokens: params.completionTokens || 0,
      latency_ms: params.latencyMs,
      passed_validation: params.passedValidation,
      retry_count: params.retryCount,
      cost_usd: params.costUsd || 0,
    });
  }
}
