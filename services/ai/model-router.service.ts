import { groqClient, GROQ_MODEL_CHAIN } from "../../config/groq";
import { ai, callGeminiWithModelFallback } from "../../config/gemini";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions/completions";

export type TaskType =
  | "english_mcq"
  | "math_mcq"
  | "bangla_mcq"
  | "general_science"
  | "bangladesh_gk"
  | "written_eval"
  | "tutor_chat";

const GEMINI_TASK_TYPES: TaskType[] = [
  "bangla_mcq",
  "general_science",
  "bangladesh_gk",
  "written_eval",
  "tutor_chat",
];

const GROQ_TASK_TYPES: TaskType[] = ["english_mcq", "math_mcq"];

export function resolveTaskType(
  subject?: string,
  topic?: string,
  examType?: string
): TaskType {
  const s = (subject || "").toLowerCase();
  const t = (topic || "").toLowerCase();
  const e = (examType || "").toLowerCase();

  if (s.includes("english") || s.includes("language & literature") && !s.includes("bangla")) {
    return "english_mcq";
  }
  if (
    s.includes("math") ||
    s.includes("quantitative") ||
    s.includes("mental ability") ||
    t.includes("math") ||
    t.includes("arithmetic") ||
    t.includes("algebra") ||
    t.includes("geometry")
  ) {
    return "math_mcq";
  }
  if (s.includes("bangla") || s.includes("bengali") || s.includes("bangladesh affairs")) {
    return "bangla_mcq";
  }
  if (s.includes("science") || s.includes("ict") || s.includes("computer")) {
    return "general_science";
  }
  if (s.includes("bangladesh") || s.includes("international") || s.includes("geopolitics")) {
    return "bangladesh_gk";
  }
  if (e === "bank") {
    return "english_mcq";
  }
  return "bangla_mcq";
}

export function isGeminiTask(taskType: TaskType): boolean {
  return GEMINI_TASK_TYPES.includes(taskType);
}

export function isGroqTask(taskType: TaskType): boolean {
  return GROQ_TASK_TYPES.includes(taskType);
}

export interface ModelCallRequest {
  taskType: TaskType;
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  responseFormat?: "json" | "text";
}

export async function callModelWithRouter<T>(req: ModelCallRequest): Promise<T> {
  const { taskType, prompt, systemInstruction, temperature = 0.7, responseFormat = "json" } = req;

  if (isGeminiTask(taskType)) {
    if (!ai) {
      throw new Error("GEMINI_OFFLINE");
    }
    return callGeminiWithModelFallback((model) =>
      ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: responseFormat === "json" ? "application/json" : undefined,
          temperature,
        },
      })
    ).then((r: any) => {
      if (responseFormat === "json") {
        try {
          return JSON.parse(r.text || "{}") as T;
        } catch {
          return r.text as unknown as T;
        }
      }
      return r.text as unknown as T;
    });
  }

  if (isGroqTask(taskType)) {
    if (!groqClient) {
      throw new Error("GROQ_OFFLINE");
    }

    let lastErr: any = null;
    for (const model of GROQ_MODEL_CHAIN) {
      try {
        const completion = await groqClient.chat.completions.create({
          model,
          messages: [
            ...(systemInstruction ? [{ role: "system" as const, content: systemInstruction }] : []),
            { role: "user" as const, content: prompt },
          ] as any[],
          temperature,
          response_format: responseFormat === "json" ? { type: "json_object" } : undefined,
        });
        const content = completion.choices[0]?.message?.content || "";
        if (responseFormat === "json") {
          try {
            return JSON.parse(content) as T;
          } catch {
            return content as unknown as T;
          }
        }
        return content as unknown as T;
      } catch (err: any) {
        lastErr = err;
        console.warn(`[ModelRouter] Groq model ${model} failed:`, err.message);
      }
    }
    throw lastErr || new Error("All Groq models failed");
  }

  throw new Error(`Unknown task type: ${taskType}`);
}
