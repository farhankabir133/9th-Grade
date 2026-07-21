import dotenv from "dotenv";
import OpenAI from "openai";
dotenv.config();

const HAS_GROQ = !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== "MY_GROQ_API_KEY";

export const groqClient = HAS_GROQ
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1",
    })
  : null;

export const OPEN_MODEL_PRIMARY = process.env.OPEN_MODEL_PRIMARY || "llama-3.3-70b-versatile";
export const OPEN_MODEL_FALLBACK = process.env.OPEN_MODEL_FALLBACK || "qwen-2.5-72b-instruct";

export const GROQ_MODEL_CHAIN = [OPEN_MODEL_PRIMARY, OPEN_MODEL_FALLBACK];
