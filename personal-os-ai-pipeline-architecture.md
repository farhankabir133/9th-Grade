# Personal OS — Open-Source AI Pipeline & Data Architecture
### A production-grade design for a free, low-cost, high-quality exam-prep platform

---

## 0. Design Principles

Everything below follows four rules, because your constraint isn't "what's technically best," it's "what's best per taka spent, without sacrificing trust":

1. **Never trust a raw LLM output for a fact.** Ground every generation in retrieved, verified source material (RAG). The model's job is to *phrase and vary* questions, not to *invent* facts about BCS syllabi, Bengali grammar, or history.
2. **Generate once, serve many times.** Caching is your single biggest cost lever — more impactful than model choice.
3. **Route by task, not one-size-fits-all.** Cheap/local models for high-volume, low-risk tasks (English MCQs, math). Stronger models only where the Bangla/knowledge gap actually bites.
4. **Humans stay in the loop for anything scored.** A wrong answer key on a BCS mock exam is a trust-destroying bug, not a cosmetic one.

---

## 1. Updated System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Client (React 18, Vite)                       │
└───────────────┬─────────────────────────────────┬────────────────────┘
                 │ Firebase SDK                    │ REST /api
                 ▼                                 ▼
     ┌───────────────────────┐         ┌────────────────────────────────┐
     │  Firestore (live data) │         │        Express.js Server        │
     │  users/ examHistory/   │         │  - /api/ai/*  (generation)      │
     │  flashcards/ ...       │         │  - /api/review/* (QA queue)     │
     └───────────────────────┘         │  - /api/bank/* (cached content)  │
                                        └───────────────┬──────────────────┘
                                                         │
                          ┌──────────────────────────────┼───────────────────────────────┐
                          ▼                              ▼                               ▼
              ┌───────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────┐
              │   Retrieval Layer      │     │   Model Router           │     │  Generation Cache    │
              │  (Vector DB + BM25)    │     │  - Task classifier       │     │  (Firestore/Redis)   │
              │  Verified question     │────▶│  - Open model (Groq/     │────▶│  question_bank/       │
              │  bank + syllabus docs  │     │    Together/local)       │     │  generation_logs/     │
              └───────────────────────┘     │  - Gemini fallback        │     └─────────────────────┘
                                             └─────────────────────────┘
                                                         │
                                                         ▼
                                             ┌─────────────────────────┐
                                             │   Validation Pipeline    │
                                             │  - Schema check          │
                                             │  - Duplicate check       │
                                             │  - Confidence scoring    │
                                             └───────────┬─────────────┘
                                                          ▼
                                             ┌─────────────────────────┐
                                             │  Human Review Queue      │
                                             │  (expert / moderator UI) │
                                             └───────────┬─────────────┘
                                                          ▼
                                             ┌─────────────────────────┐
                                             │  Published Question Bank │
                                             │  (what users actually    │
                                             │   see, cached & reused)  │
                                             └─────────────────────────┘
```

The key structural change from your current design: **generation is decoupled from serving.** Today (implied by the doc) a user request likely triggers a live Gemini call. In this design, a user almost always gets a question **served from the published bank**; live generation only runs to *replenish* the bank in the background, or for the (rarer) fully adaptive single-question case.

---

## 2. Model Routing Strategy

Not all question types need the same model. Route by risk/language-sensitivity, not by a blanket policy.

| Task | Risk if wrong | Bangla-heavy? | Recommended model tier |
|---|---|---|---|
| English grammar/vocab MCQs | Medium | No | Open model (Qwen3-8B/14B via Groq or Together — cheap, fast) |
| Math & Mental Ability | High (objective, easy to verify) | No | Open model, **with a code-executed answer-checker** (see §4.3) |
| Bangla grammar/literature | High | Yes | Closed model (Gemini) — open models measurably underperform here |
| General Science | Medium | Mixed | Open model for definitions; Gemini for nuanced/Bangladesh-specific facts |
| Bangladesh history/GK/current affairs | Very high | Yes | Gemini, **and always RAG-grounded**, never from raw model memory |
| Written essay evaluation | High (subjective) | Yes | Gemini (stronger instruction-following for multi-criterion rubrics) |
| AI Tutor chat | Medium | Mixed | Open model default, escalate to Gemini on complex/Bangla-heavy turns |

```typescript
// server/lib/modelRouter.ts
type TaskType =
  | "english_mcq" | "math_mcq" | "bangla_mcq"
  | "general_science" | "bangladesh_gk" | "written_eval" | "tutor_chat";

const ROUTING_TABLE: Record<TaskType, { primary: ModelConfig; fallback: ModelConfig }> = {
  english_mcq:     { primary: OPEN_QWEN3_14B,  fallback: GEMINI_FLASH },
  math_mcq:        { primary: OPEN_QWEN3_14B,  fallback: GEMINI_FLASH },
  bangla_mcq:       { primary: GEMINI_FLASH,    fallback: OPEN_DEEPSEEK_V4 },
  general_science: { primary: OPEN_QWEN3_14B,  fallback: GEMINI_FLASH },
  bangladesh_gk:    { primary: GEMINI_FLASH,    fallback: GEMINI_FLASH }, // no open fallback — too risky
  written_eval:     { primary: GEMINI_FLASH,    fallback: GEMINI_PRO },
  tutor_chat:       { primary: OPEN_QWEN3_8B,   fallback: GEMINI_FLASH },
};

export function routeTask(task: TaskType): ModelConfig {
  return ROUTING_TABLE[task].primary;
}
```

This gives you the cost savings of open models where they're safe, and keeps Gemini's stronger Bangla/knowledge performance exactly where it matters most.

**Hosting recommendation for the open-model leg:** don't self-host initially. Use a pay-per-token inference provider (Groq, Together AI, Fireworks, or SiliconFlow) running Qwen3/Qwen3.5 or DeepSeek-V4-Flash. Self-hosting only becomes economical once you're past several million tokens/month — not where you'll start.

---

## 3. Data Architecture (RAG Knowledge Base)

This is the part that matters more than model choice for question *accuracy*.

### 3.1 Source corpus to build first
- Digitized past BCS/Bank/Varsity admission question papers (many are publicly available as PDFs) — OCR and structure them.
- Official syllabus documents per exam type.
- A small, curated Bangla grammar rulebook (this is worth paying a human editor for once — it becomes a permanent asset).
- Bangladesh-specific GK/current-affairs source: a maintained, dated fact sheet you update monthly (don't let the model "know" current affairs from training data — always retrieve).

### 3.2 New Firestore/Vector collections

```json
// sourceDocuments (Collection) — the ground truth
{
  "id": "string",
  "examType": "BCS | Bank | Varsity",
  "subject": "string",
  "topic": "string",
  "sourceType": "past_question | syllabus | rulebook | gk_factsheet",
  "content": "string",
  "verifiedBy": "string (editor id)",
  "verifiedAt": "timestamp",
  "embeddingId": "string"  // pointer to vector store record
}

// questionBank (Collection) — published, servable content
{
  "id": "string",
  "examType": "string",
  "subject": "string",
  "topic": "string",
  "difficulty": "easy | medium | hard",
  "question": "string",
  "options": ["string"],
  "correctIndex": "number",
  "explanationBn": "string",
  "explanationEn": "string",
  "sourceDocumentIds": ["string"],   // traceability back to §3.2 sourceDocuments
  "generatedBy": "model name + version",
  "reviewStatus": "pending | approved | rejected | flagged",
  "reviewedBy": "string | null",
  "confidenceScore": "number (0-1, from validation pipeline)",
  "usageCount": "number",
  "reportCount": "number",
  "createdAt": "timestamp"
}

// generationLogs (Collection) — cost/quality observability
{
  "id": "string",
  "taskType": "string",
  "modelUsed": "string",
  "promptTokens": "number",
  "completionTokens": "number",
  "latencyMs": "number",
  "passedValidation": "boolean",
  "retryCount": "number",
  "costUsd": "number",
  "createdAt": "timestamp"
}

// reviewQueue (Collection) — human-in-the-loop
{
  "id": "string",
  "questionBankId": "string",
  "assignedTo": "string | null",
  "status": "queued | in_review | resolved",
  "reviewerNotes": "string",
  "decision": "approve | reject | edit_and_approve",
  "editedFields": "object | null",
  "createdAt": "timestamp"
}
```

### 3.3 Vector store choice
You don't need a heavyweight vector DB at your current scale. Practical options, cheapest first:
- **Firestore + a lightweight in-memory/edge vector search** (e.g. store embeddings as arrays, brute-force cosine similarity server-side) — fine up to tens of thousands of documents.
- **pgvector on a free/cheap Postgres tier** (Supabase, Neon) if you outgrow that.
- Avoid paying for Pinecone/Weaviate until your source corpus is large enough (100k+ chunks) to need approximate nearest-neighbor search at speed.

Use a free open embedding model (e.g. `bge-m3` or `multilingual-e5-large`, both handle Bangla reasonably) via the same inference provider you use for open-model generation, rather than paying for embeddings separately.

---

## 4. Backend Question Generation Pipeline (detailed)

### 4.1 Flow
1. **Trigger** — either (a) a scheduled background job replenishing the bank for a subject/topic that's running low, or (b) a live adaptive-question request for a specific user.
2. **Retrieve** — pull top-k relevant chunks from `sourceDocuments` via vector similarity + keyword (BM25) hybrid search.
3. **Route** — pick model per §2.
4. **Construct prompt** — inject retrieved context, exam-specific formatting rules, and a strict JSON schema instruction.
5. **Generate** — call model via your existing `callWithRetry` wrapper (keep it — it's solid).
6. **Validate** — schema check, duplicate check (embedding similarity against existing bank), and for math specifically, **re-derive the answer programmatically** rather than trusting the model's stated correct option.
7. **Score confidence** — combine: did it cite source content, does the answer verify independently, is it a near-duplicate.
8. **Route to review or auto-publish** — low-risk/high-confidence items (e.g. simple math with verified answer) can auto-publish; everything Bangla/GK-related goes to human review first.
9. **Cache in `questionBank`.**

### 4.2 Prompt template (batch generator, RAG-grounded)

```
SYSTEM:
You are generating {examType} exam questions for Bangladeshi competitive
exam candidates. You MUST base every question strictly on the CONTEXT
provided below. Do not introduce facts, dates, or rules not present in
the context. If the context is insufficient to write a high-quality
question, return an empty array instead of guessing.

Output ONLY valid JSON matching this schema, no prose, no markdown fences:
{
  "questions": [
    {
      "question": "string",
      "options": ["string","string","string","string"],
      "correctIndex": 0,
      "explanationBn": "string",
      "explanationEn": "string",
      "sourceRefs": ["string"]   // ids of context chunks actually used
    }
  ]
}

CONTEXT:
{{retrieved_chunks}}

REQUEST:
Generate {{count}} {{difficulty}} questions for subject={{subject}},
topic={{topic}}, exam={{examType}}. Follow authentic {{examType}}
question patterns and distractor style.
```

Grounding in retrieved context plus requiring `sourceRefs` gives you two things at once: fewer hallucinations, and a built-in traceability field a human reviewer can use to check the claim against the source in seconds.

### 4.3 Math answer verification (cheap, high-value safeguard)
For math/quantitative questions, don't trust the model's `correctIndex`. Run a small verification step:
- Extract the arithmetic/algebraic expression from the question if structured enough.
- Use a sandboxed calculation (e.g. `mathjs` server-side) to recompute the answer.
- If it disagrees with the model's stated answer, auto-flag for review rather than auto-publish.

This single check removes one of the most damaging and most common LLM failure modes (numeric errors) for close to zero cost.

### 4.4 Duplicate detection
Before publishing, embed the new question and compare cosine similarity against existing `questionBank` entries in the same subject/topic. Above a threshold (e.g. 0.92), reject as duplicate. This keeps your bank diverse without needing constant regeneration.

---

## 5. Human Review Workflow

Doesn't need to be elaborate — a simple internal moderation view is enough at launch:

- Reviewer sees: question, options, AI's stated explanation, the source chunk it cited, and a confidence score.
- Actions: Approve / Edit & Approve / Reject.
- Track `reviewedBy` and timestamps for accountability, and to build a quality dataset over time (which you could eventually use to fine-tune a small open model on your own approved content — a strong longer-term cost play).
- Start with yourself + a handful of volunteer subject-matter people (retired BCS cadres, university students who've cleared preliminary rounds are a realistic recruiting pool for a free/mission-driven project).

Add a lightweight **"Report an issue"** button visible to end users on every question — this becomes a second review signal after launch and builds public trust, which matters a lot for a free platform competing against paid incumbents.

---

## 6. What Makes This "Top-Notch" vs. a Generic AI Quiz App

The competitive exam-prep market (in Bangladesh and generally) is full of static question-bank apps. Your differentiation should lean into things a static app structurally can't do:

1. **True adaptive difficulty** — implement a simple Item Response Theory (IRT) or Elo-style rating per topic per user, not just "harder if last answer correct." This is a well-understood technique and gives genuinely personalized difficulty curves.
2. **Weak-area-targeted generation** — feed `subjectStrengths` (already in your schema) into the retrieval/generation trigger so the bank actively grows more content in a user's weak topics rather than generating uniformly.
3. **Grounded AI Tutor** — have `AITutor.tsx` retrieve from the same `sourceDocuments` corpus before answering, so tutoring answers are traceable to real syllabus content, not free-floating model knowledge. This is a meaningful trust differentiator for a Bangla-language educational tool.
4. **Explainability by default** — every question ships with a bilingual explanation and a source reference, not just a correct answer. Competitors rarely do this well.
5. **Cost transparency as a feature** — since you're free and open-source, consider publishing basic usage/cost dashboards or at least your review process publicly. For a mission-driven education tool, trust *is* the product.
6. **Offline-friendly flashcard sync** — your Leitner-based `MemoryRevision.tsx` is already a strong differentiator; make sure spaced-repetition scheduling works well even on intermittent mobile connections, since that's the real usage environment for much of your audience.

---

## 7. Cost & Ops Guardrails

- Log every generation call in `generationLogs` with token counts and cost — you cannot manage what you don't measure.
- Set a hard daily/monthly spend cap per model tier; alert (not just log) when you're at 80%.
- Because generation is decoupled from serving (§1), your *serving* cost is nearly free (Firestore reads) regardless of traffic — only bank *replenishment* costs LLM tokens, and that's a controllable, schedulable job, not something that scales linearly with users.
- Revisit the model routing table quarterly — the open vs. closed model gap for Bangla is narrowing over time; what needs Gemini today may not in a year.

---

## 8. Suggested Build Order

1. Stand up `sourceDocuments` + basic vector search — this unblocks everything else and is pure quality upside regardless of model choice.
2. Wire the model router with just two entries to start (Gemini for Bangla/GK, one open model for English/Math) — don't over-engineer the table on day one.
3. Add the validation pipeline (schema + math re-check + duplicate check) before you add human review UI — automated checks catch the most common failures cheapest.
4. Build the minimal review queue UI.
5. Only then invest in adaptive difficulty (§6.1) — it's a UX differentiator, not a correctness requirement, so it can come after the trust-critical pieces are solid.
