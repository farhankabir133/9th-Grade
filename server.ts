import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

// Suppress benign Firestore gRPC idle stream cancellation messages from triggering false positive error trackers
const originalConsoleError = console.error;
console.error = function (...args) {
  const isBenignFirestoreError = args.some(arg => {
    if (typeof arg === 'string') {
      return arg.includes('@firebase/firestore') || 
             arg.includes('Disconnecting idle stream') || 
             arg.includes('Timed out waiting for new targets') ||
             arg.includes('CANCELLED');
    }
    if (arg && typeof arg === 'object' && (arg as any).message) {
      return (arg as any).message.includes('Disconnecting idle stream') ||
             (arg as any).message.includes('Timed out waiting for new targets');
    }
    return false;
  });

  if (isBenignFirestoreError) {
    return;
  }
  originalConsoleError.apply(console, args);
};

const originalConsoleWarn = console.warn;
console.warn = function (...args) {
  const isBenignFirestoreWarn = args.some(arg => {
    if (typeof arg === 'string') {
      return arg.includes('@firebase/firestore') || 
             arg.includes('Disconnecting idle stream') || 
             arg.includes('Timed out waiting for new targets') ||
             arg.includes('CANCELLED');
    }
    return false;
  });

  if (isBenignFirestoreWarn) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Import Modular Routers from api controller directories
import authRouter from "./api/auth";
import usersRouter from "./api/users";
import aiRouter from "./api/ai";
import memoryRouter from "./api/memory";
import analyticsRouter from "./api/analytics";
import circularsRouter from "./api/circulars";
import leaderboardRouter from "./api/leaderboard";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // === API ROUTER MOUNTS ===
  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/memory", memoryRouter);
  app.use("/api/analytics", analyticsRouter);
  app.use("/api/circulars", circularsRouter);
  app.use("/api/leaderboard", leaderboardRouter);

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    const HAS_GEMINI = !!process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY";
    res.json({ status: "ok", geminiConfigured: HAS_GEMINI });
  });

  // Backward-compatible rank simulation endpoint
  app.get("/api/rank-simulation", (req, res) => {
    const activeUsers = Math.floor(Math.random() * 2500) + 8400;
    const peakRankPredictedToday = Math.floor(Math.random() * 50) + 1;
    res.json({
      activeUsers,
      peakRankPredictedToday,
      timestamp: new Date().toISOString()
    });
  });

  // === VITE MIDDLEWARE SETUP ===
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve index.html for any SPA routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[9Th Grade AI Engine] Server live on port ${PORT}`);
  });
}

startServer();
