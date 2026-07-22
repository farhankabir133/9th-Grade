import { CircularModel } from "../models/circular.model";

export default function handler(req, res) {
  res.status(200).json({ ok: true, model: typeof CircularModel });
}
