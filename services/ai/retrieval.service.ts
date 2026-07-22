import { supabaseAdmin } from "../../config/supabase";

export interface SourceDocument {
  id: string;
  exam_type: string;
  subject: string;
  topic?: string;
  source_type: string;
  content: string;
  embedding?: number[];
}

export interface RetrievalResult {
  document: SourceDocument;
  score: number;
}

export class RetrievalService {
  static async retrieve(
    query: string,
    options?: {
      examType?: string;
      subject?: string;
      topic?: string;
      limit?: number;
    }
  ): Promise<RetrievalResult[]> {
    const limit = options?.limit || 5;

    let queryBuilder = supabaseAdmin()
      .from("source_documents")
      .select("*");

    if (options?.examType) {
      queryBuilder = queryBuilder.eq("exam_type", options.examType);
    }
    if (options?.subject) {
      queryBuilder = queryBuilder.eq("subject", options.subject);
    }
    if (options?.topic) {
      queryBuilder = queryBuilder.eq("topic", options.topic);
    }

    const { data: documents, error } = await queryBuilder.limit(50);

    if (error || !documents || documents.length === 0) {
      return [];
    }

    const scored = documents.map((doc) => {
      const score = this.computeTextSimilarity(query, doc.content);
      return { document: doc as SourceDocument, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }

  private static computeTextSimilarity(query: string, content: string): number {
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 3);
    const contentLower = content.toLowerCase();
    let matchCount = 0;
    for (const term of queryTerms) {
      if (contentLower.includes(term)) {
        matchCount++;
      }
    }
    if (queryTerms.length === 0) return 0;
    return matchCount / queryTerms.length;
  }

  static async retrieveForQuestionGeneration(
    subject: string,
    topic: string,
    examType: string,
    limit = 3
  ): Promise<RetrievalResult[]> {
    const query = `${subject} ${topic} ${examType}`;
    return this.retrieve(query, {
      examType,
      subject,
      topic,
      limit,
    });
  }
}
