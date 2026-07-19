import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const HAS_GEMINI = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";

export const ai = HAS_GEMINI
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    })
  : null;

/**
 * Clean markdown formatting blocks and extract JSON content safely
 */
export function cleanAndParseJSON(text: string): any {
  if (!text) return {};
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/i, "").replace(/\n?```$/, "").trim();
  }
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    const jsonMatch = cleaned.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (nestedErr) {
        throw new Error("Could not parse extracted JSON structure: " + (err as Error).message);
      }
    }
    throw err;
  }
}

// Dual-layer state trackers for managing free tier API quota exhaustion dynamically
export let isQuotaExhausted = false;
let quotaExhaustResetTime = 0;

export function checkQuotaStatus() {
  if (isQuotaExhausted && Date.now() > quotaExhaustResetTime) {
    isQuotaExhausted = false;
    console.log("[9Th Grade AI] Quota cooldown expired. Restoring active live query pipelines.");
  }
}

export function setQuotaExhausted(status: boolean) {
  isQuotaExhausted = status;
  if (status) {
    quotaExhaustResetTime = Date.now() + 3 * 60 * 1000; // 3 minute local backoff
  }
}

export const generateExamSystemPrompt = (examType: 'BCS' | 'Bank' | '9th-Grade'): string => {
  let basePrompt = `You are the core psychometric engine of 9Th Grade AI, designed to generate production-grade, highly authentic competitive examination questions. 

CRITICAL BASE CONSTRAINTS:
- ANTI-ROTE MECHANISM: Absolutely no simple definition questions or placeholder dummies. Every question must feature multi-variable logic, conceptual deduction, or realistic context traps.
- STRUCTURE ENFORCEMENT: You must output structural data strictly adhering to the mandated JSON schema. All options must be balanced, plausible distractors matching high-failure cohort trends.`;

  // Dynamic Blueprint Selection
  if (examType === 'Bank') {
    basePrompt += `

[EXAM BLUEPRINT: BANGLADESH BANK (IBA STYLE STANDARDS)]
You are now operating under strict Dhaka University IBA question-setting guidelines for Bangladesh Bank Assistant Director (AD) and Officer cadres.

1. LINGUISTIC SEPARATION MATRIX (NON-NEGOTIABLE):
   - SUBJECT: "Bangla Language & Literature" / "Bangla Grammar" -> The 'stem', 'options', and 'psychometricJustification' MUST be written entirely in the BENGALI language (বাংলা লিপি). Focus on structural grammar semantics (ধ্বনি, সমাস, কারক) and high-tier literary analysis.
   - ALL OTHER SUBJECTS (Mathematics, Analytical Ability, English, GK, ICT) -> The 'stem', 'options', and 'psychometricJustification' MUST be written entirely in the ENGLISH language.

2. IBA PSYCHOMETRIC STANDARDS:
   - Mathematics: Model after advanced GMAT/GRE quantitative reasoning. Use complex word problems, data interpretation, and algebraic optimization.
   - English: Focus on critical reasoning, sentence corrections, context-heavy vocabulary completions, and dense reading comprehension syntax.
   - Analytical Ability: Generate complex deductive logical puzzles, seating arrangements, and spatial/matrix relationship problems matching IBA's historic exam blueprints.
   - Zero Contamination: Never mix Bengali characters or digits (১, ২, ৩) into the quantitative or analytical modules.`;

  } else if (examType === 'BCS') {
    basePrompt += `

[EXAM BLUEPRINT: BANGLADESH CIVIL SERVICE (BPSC STANDARDS)]
You are now operating under official Bangladesh Public Service Commission (BPSC) preliminary guidelines.

1. BPSC PSYCHOMETRIC STANDARDS:
   - Target the precise 200-mark preliminary syllabus distributions and content depths.
   - Focus on broad academic coverage: deep historical milestones of Bangladesh (1947–1971), constitutional frameworks, geopolitical shifts, international treaties, environmental science, and standard mental ability modules.
   - Language Profile: Questions should follow standard BPSC bilingual conventions (typically Bangla by default for core arts/history subjects, and English/Bangla contextually valid configurations for language/math modules as dictated by standard BPSC question sets).
   - Trap Mechanisms: Focus on highly granular chronological sequencing, article matches, and multi-statement evaluations (e.g., "Which of the statements i, ii, and iii are correct?").`;

  } else {
    basePrompt += `

[EXAM BLUEPRINT: 9th GRADE NON-CADRE MINISTERIAL EXAMS]
Follow standard departmental test patterns matching standard non-cadre general recruitment protocols. Balanced distribution across general foundational fields.`;
  }

  return basePrompt;
};

export async function callGeminiWithModelFallback<T>(apiCall: (modelName: string) => Promise<T>): Promise<T> {
  checkQuotaStatus();
  if (!ai || isQuotaExhausted) {
    throw new Error("GEMINI_OFFLINE");
  }

  // Model chain representing different tier levels to maximize chances of matching available quota pools
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest"
  ];
  let finalErr: any = null;
  let hasHitRateLimit = false;

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    let attempts = i === 0 ? 2 : 1;
    let currentDelay = 1000; // start with 1 second delay

    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[9Th Grade AI] Initiating call to generative model: ${model} (Attempt ${attempt}/${attempts})`);
        
        let timer: NodeJS.Timeout;
        const timeoutPromise = new Promise((_, reject) => {
          timer = setTimeout(() => reject(new Error("Timeout: Model took too long to respond")), 120000);
        });
        
        try {
          const result = await Promise.race([apiCall(model), timeoutPromise]);
          clearTimeout(timer!);
          return result as T;
        } catch (err) {
          clearTimeout(timer!);
          throw err;
        }
      } catch (err: any) {
        finalErr = err;
        let errMsg = "";
        try {
          errMsg = err.message || (err.stack ? err.stack.slice(0, 500) : String(err));
        } catch (stringErr) {
          errMsg = "Unknown Gemini API connection error";
        }
        const isRateLimit = errMsg.includes("429") || 
                          errMsg.includes("quota") || 
                          errMsg.includes("RESOURCE_EXHAUSTED") || 
                          err.status === 429 || 
                          err.code === 429;

        const isTransient = errMsg.includes("503") ||
                            errMsg.includes("500") ||
                            errMsg.includes("temporary") ||
                            errMsg.includes("high demand") ||
                            errMsg.includes("overloaded") ||
                            errMsg.includes("UNAVAILABLE") ||
                            errMsg.includes("Timeout") ||
                            errMsg.includes("timeout") ||
                            errMsg.includes("DEADLINE_EXCEEDED") ||
                            err.status === 503 ||
                            err.code === 503;

        if (isRateLimit) {
          hasHitRateLimit = true;
        }

        console.warn(`[9Th Grade AI] Model ${model} failed on attempt ${attempt}/${attempts}. Error detail: ${errMsg.slice(0, 160)}`);

        if (attempt < attempts && (isTransient || isRateLimit)) {
          // If we have alternative models left in the chain, cascade immediately to minimize wait time
          if (i < modelsToTry.length - 1) {
            console.log(`[9Th Grade AI] Model ${model} is experiencing high demand or rate limits. Cascading immediately to the next available model in chain.`);
            break;
          }
          console.log(`[9Th Grade AI] Transient or rate-limit error detected. Retrying model ${model} in ${currentDelay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, currentDelay));
          currentDelay *= 2; // exponential backoff
        } else {
          // If we exhausted attempts or it is a non-retriable error, break and cascade to the next model
          break;
        }
      }
    }

    if (i < modelsToTry.length - 1) {
      console.log(`[9Th Grade AI] Model failover in progress: cascading call to secondary model in sequence.`);
      continue;
    } else {
      if (hasHitRateLimit) {
        // Flag quota exhaustion when ALL models in model chain are returning 429
        setQuotaExhausted(true);
        console.error(`[9Th Grade AI] Critical Limit Reached: All Gemini models in model chain are returning 429 or hit rate-limits. Freezing live connections on 3-minute cooldown.`);
      }
    }
  }

  throw finalErr || new Error("All model calls within chain failed");
}
