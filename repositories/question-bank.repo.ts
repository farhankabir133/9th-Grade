import { supabaseAdmin, supabaseAsUser } from "../config/supabase";

export interface QuestionBankItem {
  id: string;
  subject: string;
  topic: string;
  difficulty: string;
  question_text: string;
  options: string[];
  correct_index: number;
  explanations: {
    bn: string;
    en: string;
    wrongOptions: string[];
  };
  concept: string;
  cognitive_dimension: string;
  uniqueness_score: number;
  difficulty_score: number;
  concept_depth_score: number;
  syllabus_relevance_score: number;
  distractor_quality_score: number;
  overall_quality_score: number;
  recruitment_relevance: string;
  is_fallback: boolean;
  exam_type: string;
  generated_by: string;
  review_status: string;
  usage_count: number;
  report_count: number;
}

export interface QuestionBankFilters {
  subject?: string;
  topic?: string;
  difficulty?: string;
  examType?: string;
  reviewStatus?: string;
  limit?: number;
  offset?: number;
}

export class QuestionBankRepo {
  static async getQuestions(filters: QuestionBankFilters, accessToken?: string): Promise<QuestionBankItem[]> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin;

    let query = client
      .from("question_bank")
      .select("*")
      .order("created_at", { ascending: false });

    if (filters.subject) {
      query = query.eq("subject", filters.subject);
    }
    if (filters.topic) {
      query = query.eq("topic", filters.topic);
    }
    if (filters.difficulty) {
      query = query.eq("difficulty", filters.difficulty);
    }
    if (filters.examType) {
      query = query.eq("exam_type", filters.examType);
    }
    if (filters.reviewStatus) {
      query = query.eq("review_status", filters.reviewStatus);
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const { data, error } = await query.range(offset, offset + limit - 1);

    if (error || !data) {
      return [];
    }

    return data.map((row: any) => ({
      id: row.id,
      subject: row.subject,
      topic: row.topic,
      difficulty: row.difficulty,
      question_text: row.question_text,
      options: row.options || [],
      correct_index: row.correct_index,
      explanations: row.explanations || { bn: "", en: "", wrongOptions: [] },
      concept: row.concept,
      cognitive_dimension: row.cognitive_dimension,
      uniqueness_score: row.uniqueness_score,
      difficulty_score: row.difficulty_score,
      concept_depth_score: row.concept_depth_score,
      syllabus_relevance_score: row.syllabus_relevance_score,
      distractor_quality_score: row.distractor_quality_score,
      overall_quality_score: row.overall_quality_score,
      recruitment_relevance: row.recruitment_relevance,
      is_fallback: row.is_fallback,
      exam_type: row.exam_type,
      generated_by: row.generated_by,
      review_status: row.review_status,
      usage_count: row.usage_count,
      report_count: row.report_count,
    }));
  }

  static async getQuestionById(id: string, accessToken?: string): Promise<QuestionBankItem | null> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin;

    const { data, error } = await client
      .from("question_bank")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      subject: data.subject,
      topic: data.topic,
      difficulty: data.difficulty,
      question_text: data.question_text,
      options: data.options || [],
      correct_index: data.correct_index,
      explanations: data.explanations || { bn: "", en: "", wrongOptions: [] },
      concept: data.concept,
      cognitive_dimension: data.cognitive_dimension,
      uniqueness_score: data.uniqueness_score,
      difficulty_score: data.difficulty_score,
      concept_depth_score: data.concept_depth_score,
      syllabus_relevance_score: data.syllabus_relevance_score,
      distractor_quality_score: data.distractor_quality_score,
      overall_quality_score: data.overall_quality_score,
      recruitment_relevance: data.recruitment_relevance,
      is_fallback: data.is_fallback,
      exam_type: data.exam_type,
      generated_by: data.generated_by,
      review_status: data.review_status,
      usage_count: data.usage_count,
      report_count: data.report_count,
    };
  }
}
