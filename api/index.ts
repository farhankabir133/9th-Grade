import express from "express";
import authRouter from "./auth";

const app = express();

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);

export default app;
