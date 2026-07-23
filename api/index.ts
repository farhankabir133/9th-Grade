import express from "express";
import path from "path";
import authRouter from "./auth";
import usersRouter from "./users";
import aiRouter from "./ai";
import memoryRouter from "./memory";
import analyticsRouter from "./analytics";
import circularsRouter from "./circulars";
import leaderboardRouter from "./leaderboard";
import adminRouter from "./admin";
import bankRouter from "./bank";
import reviewRouter from "./review";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/ai", aiRouter);
app.use("/api/memory", memoryRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/circulars", circularsRouter);
app.use("/api/leaderboard", leaderboardRouter);
app.use("/api/admin", adminRouter);
app.use("/api/bank", bankRouter);
app.use("/api/review", reviewRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/rank-simulation", (req, res) => {
  const activeUsers = Math.floor(Math.random() * 2500) + 8400;
  const peakRankPredictedToday = Math.floor(Math.random() * 50) + 1;
  res.json({
    activeUsers,
    peakRankPredictedToday,
    timestamp: new Date().toISOString(),
  });
});

const distPath = path.join(process.cwd(), "dist");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

export default app;
