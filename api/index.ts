import express from "express";
import { AuthRequest, authMiddleware } from "../server/middleware/auth.middleware";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
