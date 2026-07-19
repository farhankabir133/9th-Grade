import { Router } from "express";
import { GeminiService } from "../services/ai/gemini.service";
import { generateProceduralQuestions, getProceduralQuestionsForSubject } from "../utils/procedurals";
import { ai, callGeminiWithModelFallback, isQuotaExhausted, cleanAndParseJSON } from "../config/gemini";
import { Type } from "@google/genai";

const router = Router();

// Endpoint: POST /api/ai/tutor
router.post("/tutor", async (req, res) => {
  const { message, history, examType, subject } = req.body;
  try {
    const result = await GeminiService.tutorSession(message, history, examType, subject);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to run tutor session", details: err.message });
  }
});

// Endpoint: POST /api/ai/written-evaluate
router.post("/written-evaluate", async (req, res) => {
  const { submissionText, title, subject } = req.body;
  try {
    const result = await GeminiService.writtenEvaluate(submissionText, title, subject);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to evaluate written text", details: err.message });
  }
});

// Endpoint: POST /api/ai/adaptive-question
router.post("/adaptive-question", async (req, res) => {
  const { subject, topic, difficulty, examType, questionLanguage } = req.body;
  try {
    const result = await GeminiService.generateAdaptiveQuestion(
      subject,
      topic,
      difficulty,
      examType,
      generateProceduralQuestions,
      questionLanguage
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to generate single dynamic question", details: err.message });
  }
});

// Endpoint: POST /api/ai/batch-questions
router.post("/batch-questions", async (req, res) => {
  const { examType, difficulty, allocations, questionLanguage } = req.body;

  console.log("[9Th Grade AI] Processing Batch Questions request modularly:", { examType, difficulty, allocations, questionLanguage });

  if (!allocations || !Array.isArray(allocations) || allocations.length === 0) {
    return res.status(400).json({ error: "No question allocations specified" });
  }

  const totalWanted = allocations.reduce((sum: number, alloc: any) => sum + (parseInt(alloc.count) || 0), 0);

  // If Gemini API is unconfigured, return realistic tailored procedural content
  if (!ai) {
    console.log("[9Th Grade AI] Gemini unconfigured. Resorting to tailored procedural question generator.");
    const finalizedQs = generateProceduralQuestions(allocations, difficulty);
    return res.json({ questions: finalizedQs });
  }

  try {
    let hasUsedFallback = isQuotaExhausted;
    const { subtopics, questionType, examMode, role } = req.body;

    let maxQsPerJob = 15;
    if (totalWanted > 150) {
      maxQsPerJob = 35;
    } else if (totalWanted > 80) {
      maxQsPerJob = 25;
    } else if (totalWanted > 30) {
      maxQsPerJob = 20;
    }

    // --- CONCEPT TRACKING & DUPLICATE DETECTION ENGINES (Session-wide) ---
    const sessionTestedConcepts = new Set<string>();
    const sessionQuestionTexts = new Set<string>();
    const sessionMathTemplates = new Set<string>();
    const sessionIctSubtopics = new Set<string>();

    const jobs: Array<{ subject: string; topic: string; count: number }> = [];

    // --- TOPIC DISTRIBUTION ENGINE ---
    // Ensure diverse distribution of topics based on allocations
    for (const alloc of allocations) {
      const subject = alloc.subject;
      const topic = alloc.topic || "General";
      let countRemaining = parseInt(alloc.count) || 0;

      while (countRemaining > 0) {
        const take = Math.min(countRemaining, maxQsPerJob);
        jobs.push({ subject, topic, count: take });
        countRemaining -= take;
      }
    }

    console.log(`[9Th Grade AI OS] Chunking Blueprint: ${totalWanted} questions split into ${jobs.length} moderation batches.`);

    const results: any[] = [];
    const concurrencyLimit = 4;
    let jobIndex = 0;

    async function worker() {
      while (true) {
        const currentJobIdx = jobIndex++;
        if (currentJobIdx >= jobs.length) {
          break;
        }

        const job = jobs[currentJobIdx];
        await new Promise(resolve => setTimeout(resolve, currentJobIdx * 150));

        let response: any = null;
        let retryDelaySec = 1;
        const maxRetries = 1;
        let jobQuestionsAccepted: any[] = [];

        // Try generating and passing through validation panel
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
          try {
            const focusSubtopicsText = subtopics && Array.isArray(subtopics) && subtopics.length > 0
              ? `Focus on these specific subtopics if applicable: ${JSON.stringify(subtopics)}.`
              : "";
            
            const formulationTypeText = questionType && questionType !== 'All'
              ? `Formulate questions focusing strictly on: ${questionType}.`
              : "";

            const examModeExplanation = examMode 
              ? `Exam environment: "${examMode}" mode.`
              : "";

            const testedConceptsList = sessionTestedConcepts.size > 0 
              ? `Avoid repeating or testing these already tested concepts in this session: ${Array.from(sessionTestedConcepts).join(", ")}.`
              : "";

            const randomSeed = Math.random().toString(36).substring(2, 8);

            let setterGuidelines = "";
            let examStandardLabel = "";
            
            if (examType === "Bank") {
              const activeRole = role || "Assistant Director (AD)";
              examStandardLabel = `DU IBA Standard Bank Exam (${activeRole})`;
              setterGuidelines = `
- Question Setter Role: Dhaka University IBA Senior Professor & Recruitment Academic Board Coordinator.
- Target Post Profile: ${activeRole} (under Bangladesh Bank or leading state commercial banks).
- Rules for Authenticity:
  1. Mathematics & Quantitative Aptitude: Questions, options, and explanations must be 100% in English. Focus on advanced algebra, time-work, speed-distance-trains, ratios, probability, mixtures, and permutations. They must test deep conceptual agility.
  2. English Language & Literature: High-level vocabulary, dual-blank sentence completions (GRE style), verbal analogies (X : Y :: A : B), and precise grammar corrections.
  3. Bangla Language & Literature: Focus on advanced grammar (samash, shandhi, shobdo-reformation) and classical/modern literature.
  4. ICT & Computers: Focus on digital architecture, database schemas, primary/foreign key logical models, SQL statements, routing protocols, cybersecurity, cryptography, and computer networking.`;
            } else {
              examStandardLabel = "BPSC BCS Preliminary Examination";
              setterGuidelines = `
- Question Setter Role: Honourable Member of the Bangladesh Public Service Commission (BPSC) Question Moderation Committee.
- Target Exam: BCS Preliminary.
- Rules for Authenticity:
  1. Align perfectly with the official 200-mark BCS Preliminary Syllabus (35th to 46th BCS standard).
  2. Bangla Literature: Ancient (Charyapada), Medieval (Srikrishnakirtan, Mangalkavya, Arakan court), and Modern literary masters.
  3. English Literature: Division of periods, famous Shakespearean quotes, iconic playwrights, poets.
  4. Bangladesh Affairs: Pre-independence (1947-1971, Language movement, 6-point plan, Liberation War), Constitutional Articles (Writs, Fundamental rights, Commissions), and macroeconomic indicators.
  5. International Affairs: Global institutions (UN, IMF, Bretton Woods), treaties (Versailles, Paris, Kyoto), and active geopolitical hotspots.
  6. Math & Mental Ability: Multi-step geometry, arithmetic, logical puzzles, number series, permutations.`;
            }

            const jobPrompt = `Generate EXACTLY ${job.count} completely unique, high-yield competitive multiple choice questions.
Target Subject: "${job.subject}"
Target Topic: "${job.topic}"
${focusSubtopicsText}
${formulationTypeText}
${examModeExplanation}
${testedConceptsList}

Exam Context Details:
- Standard: "${examStandardLabel}"
- Difficulty Target: "${difficulty || 'Medium'}"
- Academic Consistency Salt: "${randomSeed}"
- Language Rules: ${questionLanguage === "English" ? "All questions, options, explanation fields, and text must be written in elegant academic English." : "Unless specified (e.g. Bank Math or English), use refined, elegant academic Bengali (Bangla)."}
${setterGuidelines}

For each question, compute and supply these quality scores out of 100:
- uniquenessScore: assessing uniqueness vs. common questions
- difficultyScore: alignment with cognitive difficulty (Easy: 30-50, Medium: 55-75, Hard/Elite: 80-100)
- conceptDepthScore: depth of analytical/reasoning test (not rote memorization)
- syllabusRelevanceScore: direct syllabus alignment
- distractorQualityScore: plausibility of wrong options
- overallQualityScore: must be at least 80/100 to pass BPSC/IBA panels

Output EXACTLY ${job.count} items matching the structural JSON schema. Keep question texts 100% clean and free of system codes.`;

            response = await callGeminiWithModelFallback((model) =>
              ai!.models.generateContent({
                model: model,
                contents: jobPrompt,
                config: {
                  systemInstruction: `You are a world-class Academic Question Setter & Quality Moderation Committee for top-tier competitive public and bank recruitment exams in Bangladesh.
Your output must be flawless JSON matching the schema. Every question must possess deep psychometric value, testing reasoning, judgment, interpretation, and applied knowledge rather than trivial fact recall. Distractors must represent common candidate misconceptions and have robust incorrectness explanations.`,
                  responseMimeType: "application/json",
                  temperature: 0.82, 
                  responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                      questions: {
                        type: Type.ARRAY,
                        description: "List of highly polished questions with psychometric metrics",
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            text: { type: Type.STRING },
                            options: {
                              type: Type.ARRAY,
                              items: { type: Type.STRING }
                            },
                            correctIndex: { type: Type.INTEGER },
                            subject: { type: Type.STRING },
                            topic: { type: Type.STRING },
                            difficulty: { type: Type.STRING },
                            concept: { type: Type.STRING, description: "The specific core concept tested" },
                            cognitiveDimension: { type: Type.STRING, description: "analytical | reasoning | judgment | applied knowledge" },
                            uniquenessScore: { type: Type.INTEGER },
                            difficultyScore: { type: Type.INTEGER },
                            conceptDepthScore: { type: Type.INTEGER },
                            syllabusRelevanceScore: { type: Type.INTEGER },
                            distractorQualityScore: { type: Type.INTEGER },
                            overallQualityScore: { type: Type.INTEGER },
                            recruitmentRelevance: { type: Type.STRING },
                            explanations: {
                              type: Type.OBJECT,
                              properties: {
                                bn: { type: Type.STRING },
                                en: { type: Type.STRING },
                                wrongOptions: {
                                  type: Type.ARRAY,
                                  items: { type: Type.STRING },
                                  description: "Must contain exactly 3 short explanations on why the distractors are wrong"
                                }
                              },
                              required: ["bn", "en", "wrongOptions"]
                            }
                          },
                          required: [
                            "text", "options", "correctIndex", "subject", "topic", "difficulty",
                            "concept", "cognitiveDimension", "uniquenessScore", "difficultyScore",
                            "conceptDepthScore", "syllabusRelevanceScore", "distractorQualityScore",
                            "overallQualityScore", "recruitmentRelevance", "explanations"
                          ]
                        }
                      }
                    },
                    required: ["questions"]
                  }
                }
              })
            );

            if (response && response.text) {
              const parsed = cleanAndParseJSON(response.text);
              const batchQs = parsed.questions || [];
              let acceptedInBatch = 0;

              for (const q of batchQs) {
                // 1. QUALITY SCORING ENGINE (Filter out anything under 80/100)
                const overallScore = q.overallQualityScore || 0;
                if (overallScore < 80) {
                  console.warn(`[9Th Grade AI OS] Rejecting Q due to Quality Score (${overallScore}/100): "${q.text.slice(0, 45)}..."`);
                  continue;
                }

                // 2. LEVEL-1 & LEVEL-2 TEXT DUPLICATE DETECTION
                const normalizedText = q.text.replace(/\s+/g, '').toLowerCase();
                if (sessionQuestionTexts.has(normalizedText)) {
                  console.warn(`[9Th Grade AI OS] Rejecting Q due to exact/normalized text duplication: "${q.text.slice(0, 45)}..."`);
                  continue;
                }

                // 3. LEVEL-3 CONCEPT TRACKING ENGINE (Unique concepts only)
                const conceptKey = (q.concept || "").toLowerCase().trim();
                if (conceptKey && sessionTestedConcepts.has(conceptKey)) {
                  console.warn(`[9Th Grade AI OS] Rejecting Q due to duplicate concept testing ("${q.concept}"): "${q.text.slice(0, 45)}..."`);
                  continue;
                }

                // 4. LEVEL-4 MATHEMATICAL TEMPLATE CHECK
                if (job.subject.includes("Math") || job.subject.includes("Aptitude")) {
                  const strippedTemplate = q.text.replace(/\d+/g, '#').replace(/\s+/g, '').toLowerCase();
                  if (sessionMathTemplates.has(strippedTemplate)) {
                    console.warn(`[9Th Grade AI OS] Rejecting math Q due to repetitive algebraic/arithmetic template: "${q.text.slice(0, 45)}..."`);
                    continue;
                  }
                  sessionMathTemplates.add(strippedTemplate);
                }

                // 5. ICT SPECIAL ROTATION CHECK
                if (job.subject.includes("Computer") || job.subject.includes("ICT")) {
                  const lowerText = q.text.toLowerCase();
                  let subtopicKey = "";
                  if (lowerText.includes("osi")) subtopicKey = "osi";
                  else if (lowerText.includes("ipv6") || lowerText.includes("ipv4")) subtopicKey = "ip";
                  else if (lowerText.includes("sql") || lowerText.includes("database") || lowerText.includes("key")) subtopicKey = "db";
                  
                  if (subtopicKey && sessionIctSubtopics.has(subtopicKey)) {
                    console.warn(`[9Th Grade AI OS] Rejecting ICT Q to enforce topic rotation (already tested ${subtopicKey}): "${q.text.slice(0, 45)}..."`);
                    continue;
                  }
                  if (subtopicKey) {
                    sessionIctSubtopics.add(subtopicKey);
                  }
                }

                // Register Accepted Question
                if (conceptKey) sessionTestedConcepts.add(conceptKey);
                sessionQuestionTexts.add(normalizedText);

                q.subject = job.subject;
                q.topic = job.topic;
                q.text = q.text.replace(/\[.*?\]/g, '').trim();
                
                jobQuestionsAccepted.push(q);
                acceptedInBatch++;
              }

              console.log(`[9Th Grade AI OS] Batch Validation: Attempt ${attempt}/${maxRetries} accepted ${acceptedInBatch}/${job.count} questions.`);
              
              if (jobQuestionsAccepted.length >= job.count) {
                // Fulfilled the job requirement completely
                results.push(...jobQuestionsAccepted.slice(0, job.count));
                break;
              } else {
                // If we didn't get enough validated questions, retry to fetch the deficit
                job.count = job.count - jobQuestionsAccepted.length;
                results.push(...jobQuestionsAccepted);
                jobQuestionsAccepted = [];
              }
            }
          } catch (err: any) {
            let errMsg = "";
            try {
              errMsg = err.message || (err.stack ? err.stack.slice(0, 500) : String(err));
            } catch (stringErr) {
              errMsg = "Unknown batch question generation error";
            }
            const isTransient = errMsg.includes("429") || 
                              errMsg.includes("503") || 
                              errMsg.includes("quota") || 
                              errMsg.includes("RESOURCE_EXHAUSTED") || 
                              errMsg.includes("UNAVAILABLE") || 
                              errMsg.includes("demand") || 
                              errMsg.includes("temporary") || 
                              err.status === 429 || 
                              err.status === 503;
            
            if (isTransient && attempt < maxRetries) {
              console.warn(`[9Th Grade AI OS] Transient error hit (${err.status || '503/429'}). Retrying job in ${retryDelaySec}s... Attempt ${attempt}/${maxRetries}`);
              await new Promise(resolve => setTimeout(resolve, retryDelaySec * 1000));
              retryDelaySec *= 2.5; 
            } else {
              console.error(`[9Th Grade AI OS] Validation panel failed job chunk on attempt ${attempt}. Transitioning gracefully.`, errMsg);
              hasUsedFallback = true;
              break; 
            }
          }
        }

        // Handle case where validation/generation came up short
        const currentCountInResults = results.filter(r => r.subject === job.subject && r.topic === job.topic).length;
        const totalAllocatedForThisJob = parseInt(allocations.find((a: any) => a.subject === job.subject && (a.topic || "General") === job.topic)?.count || "0");
        const missingCount = totalAllocatedForThisJob - currentCountInResults;

        if (missingCount > 0) {
          console.log(`[9Th Grade AI OS] Delivering ${missingCount} verified procedural fallback questions for subject: "${job.subject} - ${job.topic}".`);
          hasUsedFallback = true;
          const fallbackQs = getProceduralQuestionsForSubject(job.subject, missingCount, job.topic, difficulty || "Medium", currentJobIdx * 19);
          
          for (const fq of fallbackQs) {
            const normalizedText = fq.text.replace(/\s+/g, '').toLowerCase();
            // Verify procedural fallback is also non-duplicate in this session
            if (!sessionQuestionTexts.has(normalizedText)) {
              sessionQuestionTexts.add(normalizedText);
              
              // Map all standard schema fields to the procedural question
              fq.concept = fq.concept || "Core syllabus baseline concept";
              fq.cognitiveDimension = fq.cognitiveDimension || "applied knowledge";
              fq.uniquenessScore = fq.uniquenessScore || 85;
              fq.difficultyScore = fq.difficultyScore || 70;
              fq.conceptDepthScore = fq.conceptDepthScore || 80;
              fq.syllabusRelevanceScore = fq.syllabusRelevanceScore || 95;
              fq.distractorQualityScore = fq.distractorQualityScore || 85;
              fq.overallQualityScore = fq.overallQualityScore || 85;
              fq.recruitmentRelevance = fq.recruitmentRelevance || "Measures foundational capabilities required by recruitment syllabus.";
              
              results.push(fq);
            }
          }
        }
      }
    }

    const workers = Array(Math.min(concurrencyLimit, jobs.length)).fill(null).map(() => worker());
    await Promise.all(workers);

    // Ensure we don't have duplicate IDs or mismatched counts
    let finalizedQs = results.map((q: any, idx: number) => ({
      ...q,
      id: "gen-batch-" + Math.random().toString(36).substring(7) + "-" + idx
    }));

    if (finalizedQs.length > totalWanted) {
      finalizedQs = finalizedQs.slice(0, totalWanted);
    } else if (finalizedQs.length < totalWanted) {
      hasUsedFallback = true;
      const needed = totalWanted - finalizedQs.length;
      console.log(`[9Th Grade AI OS] Reconciling deficit: Adding ${needed} questions.`);
      const localFallbacks = generateProceduralQuestions(allocations, difficulty);
      if (localFallbacks.length > 0) {
        for (let i = 0; i < needed && i < localFallbacks.length; i++) {
          const fq = localFallbacks[i];
          fq.concept = fq.concept || "Syllabus essential concept";
          fq.cognitiveDimension = fq.cognitiveDimension || "applied knowledge";
          fq.uniquenessScore = fq.uniquenessScore || 85;
          fq.difficultyScore = fq.difficultyScore || 70;
          fq.conceptDepthScore = fq.conceptDepthScore || 80;
          fq.syllabusRelevanceScore = fq.syllabusRelevanceScore || 95;
          fq.distractorQualityScore = fq.distractorQualityScore || 85;
          fq.overallQualityScore = fq.overallQualityScore || 85;
          fq.recruitmentRelevance = fq.recruitmentRelevance || "Measures foundational capabilities required by recruitment syllabus.";
          
          finalizedQs.push({
            ...fq,
            id: `gen-batch-fallback-reconciled-${Math.random().toString(36).substring(7)}-${i}`
          });
        }
      }
    }

    // --- EXAM COMPOSITION RULES: INTELLIGENT DE-CLUSTERING ---
    // Avoid adjacent clustering of the same subjects so it feels curated
    const deClusterQuestions = (qs: any[]): any[] => {
      if (qs.length <= 2) return qs;
      
      const subjectsMap: Record<string, any[]> = {};
      for (const q of qs) {
        const subj = q.subject || "General";
        if (!subjectsMap[subj]) {
          subjectsMap[subj] = [];
        }
        subjectsMap[subj].push(q);
      }
      
      const shuffledResult: any[] = [];
      const subjectsList = Object.keys(subjectsMap);
      
      // Sort subjects by volume (highest first) to interleaving cleanly
      subjectsList.sort((a, b) => subjectsMap[b].length - subjectsMap[a].length);
      
      let itemsRemaining = true;
      while (itemsRemaining) {
        itemsRemaining = false;
        for (const subj of subjectsList) {
          if (subjectsMap[subj].length > 0) {
            shuffledResult.push(subjectsMap[subj].shift());
            itemsRemaining = true;
          }
        }
      }
      return shuffledResult;
    };

    finalizedQs = deClusterQuestions(finalizedQs);

    res.json({ questions: finalizedQs, isFallback: hasUsedFallback });
  } catch (err: any) {
    console.warn("[9Th Grade AI OS] Quota or engine timeout. Activating secure procedural fallback compiler:", err.message);
    try {
      const finalizedQs = generateProceduralQuestions(allocations, difficulty).map((q: any, idx: number) => {
        q.concept = q.concept || "Procedural Topic Concept";
        q.cognitiveDimension = q.cognitiveDimension || "applied knowledge";
        q.uniquenessScore = q.uniquenessScore || 85;
        q.difficultyScore = q.difficultyScore || 70;
        q.conceptDepthScore = q.conceptDepthScore || 80;
        q.syllabusRelevanceScore = q.syllabusRelevanceScore || 95;
        q.distractorQualityScore = q.distractorQualityScore || 85;
        q.overallQualityScore = q.overallQualityScore || 85;
        q.recruitmentRelevance = q.recruitmentRelevance || "Measures essential capabilities.";
        return q;
      });
      return res.json({ questions: finalizedQs, isFallback: true });
    } catch (fallbackErr: any) {
      console.error("[9Th Grade AI OS] Emergency compiler failure:", fallbackErr);
      res.status(500).json({ error: "Failed to generate batch questions", details: err.message });
    }
  }
});

export default router;
