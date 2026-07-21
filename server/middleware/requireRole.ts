import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export type AppRole = "student" | "reviewer" | "admin";

export function requireRole(...allowed: AppRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthenticated" });
    }

    const userRole = (req as any).userRole as AppRole | undefined;
    const effectiveRole = userRole || "student";

    if (!allowed.includes(effectiveRole)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }

    next();
  };
}
