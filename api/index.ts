import express from "express";
import authRouter from "./auth";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
