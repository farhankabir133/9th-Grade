import express from "express";
import { UserRepo } from "../repositories/user.repo";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
