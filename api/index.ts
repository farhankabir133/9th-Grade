import express from "express";
import authRouter from "./auth";
import circularsRouter from "./circulars";

const app = express();

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/circulars", circularsRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
