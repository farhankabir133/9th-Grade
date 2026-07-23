import express from "express";
import { supabaseAdmin } from "../config/supabase";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
