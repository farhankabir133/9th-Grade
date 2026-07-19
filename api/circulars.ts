import { Router } from "express";
import { CircularRepo } from "../repositories/circular.repo";
import { CircularModel } from "../models/circular.model";

const router = Router();

const INITIAL_CIRCULARS: CircularModel[] = [
  {
    id: "circ-bcs-46",
    title: "46th BCS Written Examination Schedule Announcement",
    organization: "Bangladesh Public Service Commission (BPSC)",
    vacancyCount: 3140,
    deadline: "2026-08-30",
    admitCardDate: "2026-07-15",
    countdownDays: 45,
    link: "https://bpsc.gov.bd",
    syllabusOverview: [
      "Bangla Language & Literature (Written) - 200 Marks",
      "English Language & Literature (Written) - 200 Marks",
      "Mathematical Reasoning & Mental Ability - 100 Marks",
      "Bangladesh Affairs - 200 Marks",
      "International Affairs - 100 Marks"
    ]
  },
  {
    id: "circ-palli-2026",
    title: "Senior Officer Recruitment 2026 - Palli Sanchay Bank",
    organization: "Bankers' Selection Committee (BSC)",
    vacancyCount: 412,
    deadline: "2026-07-28",
    countdownDays: 14,
    link: "https://ereb.bb.org.bd",
    syllabusOverview: [
      "Bangla (Language & Applied Grammar) - 20 Marks",
      "English (Comprehension & Syntax Correction) - 20 Marks",
      "Mathematics (Quantitative Aptitude) - 20 Marks",
      "General Knowledge & ICT Core Concepts - 20 Marks"
    ]
  },
  {
    id: "circ-pubali-2026",
    title: "Junior Officer General Posting Circular",
    organization: "Pubali Bank PLC",
    vacancyCount: 650,
    deadline: "2026-07-10",
    countdownDays: 7,
    link: "https://pubalibangla.com",
    syllabusOverview: [
      "Analytical Ability & Critical Logic - 30 Marks",
      "Business English & Vocabulary Match - 30 Marks",
      "Banking Awareness & General Knowledge - 20 Marks"
    ]
  }
];

// Lazy-load database with raw documents if collection is completely fresh
async function seedCirculars() {
  try {
    const existing = await CircularRepo.getAllCirculars();
    if (existing.length === 0) {
      console.log("[9Th Grade AI] Seeding initial central circular index documents to Firestore...");
      for (const circ of INITIAL_CIRCULARS) {
        await CircularRepo.saveCircular(circ);
      }
    }
  } catch (err: any) {
    console.error("[9Th Grade AI] Failed to check/seed circulars data:", err.message);
  }
}

// Ensure seeding triggers
seedCirculars();

// Endpoint: GET /api/circulars
router.get("/", async (req, res) => {
  try {
    let circulars = await CircularRepo.getAllCirculars();
    if (circulars.length === 0) {
      circulars = INITIAL_CIRCULARS;
    }

    // Dynamic count downs
    const now = new Date();
    const evaluated = circulars.map((c) => {
      const targetDate = new Date(c.deadline);
      const diffMs = targetDate.getTime() - now.getTime();
      const diffDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      return {
        ...c,
        countdownDays: diffDays
      };
    });

    res.json(evaluated);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load active circular index", details: err.message });
  }
});

// Endpoint: GET /api/circulars/latest
router.get("/latest", async (req, res) => {
  try {
    let circulars = await CircularRepo.getAllCirculars();
    if (circulars.length === 0) {
      circulars = INITIAL_CIRCULARS;
    }
    
    // Sort and returns the newest listing
    res.json(circulars.slice(0, 2));
  } catch (err: any) {
    res.status(500).json({ error: "Failed to compile latest circular feeds", details: err.message });
  }
});

// Endpoint: GET /api/circulars/:id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const job = await CircularRepo.getCircularById(id);
    if (!job) {
      return res.status(404).json({ error: `Circular search failed. No record matching index: ${id}` });
    }
    res.json(job);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to fetch circular details", details: err.message });
  }
});

// Endpoint: POST /api/circulars/ingest
router.post("/ingest", async (req, res) => {
  const { id, title, organization, vacancyCount, deadline, link, syllabusOverview } = req.body;
  if (!id || !title || !organization || !deadline) {
    return res.status(400).json({ error: "Required parameters are incomplete for ingestion pipeline" });
  }

  const payload: CircularModel = {
    id,
    title,
    organization,
    vacancyCount: vacancyCount || 0,
    deadline,
    countdownDays: 30, // calculated later
    link: link || "#",
    syllabusOverview: syllabusOverview || []
  };

  try {
    await CircularRepo.saveCircular(payload);
    res.json({ success: true, ingested: payload });
  } catch (err: any) {
    res.status(500).json({ error: "Internal ingestion transaction failed", details: err.message });
  }
});

export default router;
