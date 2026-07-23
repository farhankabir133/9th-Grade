import express from "express";
import { defaultUserProfile } from "../src/types";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
