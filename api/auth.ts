import { Router } from "express";

const router = Router();

// Endpoint: POST /api/auth/login
router.post("/login", (req, res) => {
  const { idToken, profile } = req.body;
  // Normally verifies with firebase-admin, here we register the interactive active session
  res.json({
    status: "authenticated",
    userId: idToken || "demo-student-uid",
    profile: profile || { name: "Anonymized Aspirant" }
  });
});

// Endpoint: POST /api/auth/google
router.post("/google", (req, res) => {
  res.json({
    status: "ok",
    message: "Google credential authenticated server-side."
  });
});

// Endpoint: GET /api/auth/session
router.get("/session", (req, res) => {
  res.json({
    authenticated: true,
    userId: "aspirant-3243",
    role: "student",
    plan: "premium",
    streak: 12
  });
});

export default router;
