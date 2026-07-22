import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../../config/supabase";

export type AppRole = "student" | "reviewer" | "admin";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
  userRole?: AppRole;
  accessToken?: string;
}

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    if (!token) {
      return res.status(401).json({ error: "Empty authorization token" });
    }

    const { data, error } = await supabaseAdmin().auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email ?? undefined,
    };
    req.accessToken = token;

    const { data: roleData } = await supabaseAdmin()
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .single();

    req.userRole = (roleData?.role as AppRole) || "student";

    next();
  } catch (err: any) {
    return res.status(401).json({ error: "Authentication failed", details: err.message });
  }
}
