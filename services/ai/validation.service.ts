import { supabaseAdmin } from "../../config/supabase";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export class ValidationService {
  static validateQuestionSchema(q: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!q || typeof q !== "object") {
      return { valid: false, errors: ["Question is null or not an object"], warnings };
    }

    if (!q.text || typeof q.text !== "string" || q.text.trim().length < 10) {
      errors.push("Question text must be a non-empty string with at least 10 characters");
    }

    if (!Array.isArray(q.options) || q.options.length !== 4) {
      errors.push("Question must have exactly 4 options");
    }

    if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex > 3) {
      errors.push("correctIndex must be a number between 0 and 3");
    }

    if (!q.subject || typeof q.subject !== "string") {
      warnings.push("Missing subject field");
    }

    if (!q.topic || typeof q.topic !== "string") {
      warnings.push("Missing topic field");
    }

    if (!q.difficulty || !["Easy", "Medium", "Hard"].includes(q.difficulty)) {
      warnings.push("Difficulty should be Easy, Medium, or Hard");
    }

    if (!q.explanations || typeof q.explanations !== "object") {
      warnings.push("Missing explanations object");
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  static validateMathQuestion(q: any): ValidationResult {
    const result = this.validateQuestionSchema(q);
    if (!result.valid) return result;

    const text = q.text || "";
    const options = q.options || [];
    const correctIndex = q.correctIndex;

    if (correctIndex === undefined || correctIndex === null) {
      result.errors.push("Math question missing correctIndex");
      result.valid = false;
      return result;
    }

    const numbers = text.match(/\d+(?:\.\d+)?/g) || [];
    if (numbers.length < 2) {
      result.warnings.push("Math question appears to have fewer than 2 numbers");
    }

    const correctAnswer = options[correctIndex];
    if (!correctAnswer || typeof correctAnswer !== "string") {
      result.errors.push("Correct option is missing or invalid");
      result.valid = false;
    }

    return result;
  }

  static async checkDuplicateQuestion(
    questionText: string,
    subject: string,
    topic: string
  ): Promise<boolean> {
    const normalizedText = questionText.replace(/\s+/g, "").toLowerCase();

    const { data, error } = await supabaseAdmin
      .from("question_bank")
      .select("id, question_text")
      .eq("subject", subject)
      .limit(100);

    if (error || !data) return false;

    for (const row of data) {
      const rowText = (row.question_text || "").replace(/\s+/g, "").toLowerCase();
      if (rowText === normalizedText) {
        return true;
      }
      const similarity = this.computeSimilarity(normalizedText, rowText);
      if (similarity > 0.85) {
        return true;
      }
    }

    return false;
  }

  private static computeSimilarity(a: string, b: string): number {
    const wordsA = new Set(a.split(""));
    const wordsB = new Set(b.split(""));
    const intersection = [...wordsA].filter((x) => wordsB.has(x));
    const union = new Set([...wordsA, ...wordsB]);
    return union.size === 0 ? 0 : intersection.length / union.size;
  }
}
