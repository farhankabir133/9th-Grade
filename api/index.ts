let app: any = null;
let error: any = null;

try {
  const mod = await import("./server-entry.ts");
  app = mod.default;
} catch (e) {
  error = e;
  console.error("[api/index] Failed to create app:", e);
}

export default async (req: any, res: any) => {
  if (error) {
    console.error("[api/index] Returning cached error:", error);
    return res.status(500).json({ error: error.message, stack: error.stack });
  }
  if (!app) {
    return res.status(500).json({ error: "App not initialized" });
  }
  return app(req, res);
};
