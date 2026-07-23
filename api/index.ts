import express from "express";
import "./auth";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
