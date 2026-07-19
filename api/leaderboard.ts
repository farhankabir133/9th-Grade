import { Router } from "express";

const router = Router();

const LOBBY = [
  { rank: 1, name: "Tanvir Ahmed", xp: 12450, level: 13, streak: 45, examTarget: "BCS", district: "Chattogram" },
  { rank: 2, name: "Sadia Rahman", xp: 9800, level: 10, streak: 31, examTarget: "Admission", district: "Dhaka" },
  { rank: 3, name: "Farhan Kabir", xp: 8250, level: 9, streak: 24, examTarget: "BCS", district: "Dhaka" },
  { rank: 4, name: "Anika Tabassum", xp: 7500, level: 8, streak: 18, examTarget: "Admission", district: "Rajshahi" },
  { rank: 5, name: "Rafiqul Islam", xp: 6200, level: 7, streak: 15, examTarget: "BCS", district: "Khulna" }
];

// Endpoint: GET /api/leaderboard/global
router.get("/global", (req, res) => {
  res.json({
    updatedAt: new Date().toISOString(),
    leaderboard: LOBBY
  });
});

// Endpoint: GET /api/leaderboard/district
router.get("/district", (req, res) => {
  const district = (req.query.district as string) || "Dhaka";
  const filtered = LOBBY.filter((cand) => cand.district.toLowerCase() === district.toLowerCase());
  
  res.json({
    districtName: district,
    leaderboard: filtered.length > 0 ? filtered : LOBBY
  });
});

// Endpoint: GET /api/leaderboard/exam
router.get("/exam", (req, res) => {
  const exam = (req.query.exam as string) || "BCS";
  const filtered = LOBBY.filter((cand) => cand.examTarget.toLowerCase() === exam.toLowerCase());

  res.json({
    examType: exam,
    leaderboard: filtered.length > 0 ? filtered : LOBBY
  });
});

export default router;
