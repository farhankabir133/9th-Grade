import { Router } from "express";
import { supabaseAdmin, supabaseAsUser } from "../config/supabase";
import { AuthRequest, authMiddleware } from "../server/middleware/auth.middleware";
import { UserRepo } from "../repositories/user.repo";
import { defaultUserProfile } from "../src/types";

const router = Router();

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Email, password, and name are required" });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error || !data.user) {
      return res.status(400).json({ error: error?.message || "Failed to create user" });
    }

    const userId = data.user.id;
    const profile = {
      ...defaultUserProfile,
      name,
      phone: data.user.phone ?? "",
    };

    await UserRepo.setProfile(userId, profile);

    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData.session) {
      console.error("[auth/signup] User created but sign-in failed:", signInError);
      return res.json({
        status: "authenticated",
        userId,
        profile,
        accessToken: null,
      });
    }

    res.json({
      status: "authenticated",
      userId,
      profile,
      accessToken: signInData.session.access_token,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Server error during signup", details: err.message });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    res.json({
      status: "authenticated",
      userId: data.user.id,
      accessToken: data.session?.access_token,
      profile: null,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Server error during signin", details: err.message });
  }
});

router.post("/google", async (req, res) => {
  const { idToken } = req.body;
  if (!idToken) {
    return res.status(400).json({ error: "Google ID token is required" });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.signInWithIdToken({
      provider: "google",
      token: idToken,
    });

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid Google token" });
    }

    res.json({
      status: "authenticated",
      userId: data.user.id,
      accessToken: data.session?.access_token,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Server error during Google auth", details: err.message });
  }
});

router.post("/guest", async (req, res) => {
  const { name } = req.body;
  const guestName = name?.trim() || "Guest User";

  try {
    const guestPassword = Math.random().toString(36).slice(2);
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: `guest-${Date.now()}@local.dev`,
      password: guestPassword,
      email_confirm: true,
      user_metadata: { name: guestName, isGuest: true },
    });

    if (error || !data.user) {
      return res.status(400).json({ error: error?.message || "Failed to create guest user" });
    }

    const userId = data.user.id;
    const profile = {
      ...defaultUserProfile,
      name: guestName,
    };

    await UserRepo.setProfile(userId, profile);

    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: data.user.email!,
      password: guestPassword,
    });

    if (signInError || !signInData.session) {
      console.error("[auth/guest] Guest created but sign-in failed:", signInError);
      return res.json({
        status: "authenticated",
        userId,
        profile,
        isGuest: true,
        accessToken: null,
      });
    }

    res.json({
      status: "authenticated",
      userId,
      profile,
      isGuest: true,
      accessToken: signInData.session.access_token,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Server error during guest signup", details: err.message });
  }
});

router.get("/session", authMiddleware, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.json({ authenticated: false });
  }

  res.json({
    authenticated: true,
    userId: req.user.id,
    email: req.user.email,
    role: req.userRole || "student",
    plan: "premium",
    streak: 0,
  });
});

router.post("/logout", authMiddleware, async (req: AuthRequest, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    await supabaseAdmin.auth.admin.signOut(token);
  }

  res.json({ status: "logged_out" });
});

export default router;
