import { Router } from "express";
import { UserRepo } from "../repositories/user.repo";
import { XpService } from "../services/analytics/xp.service";
import { defaultUserProfile } from "../src/types";
import { AuthRequest, authMiddleware } from "../server/middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/me", async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  try {
    let profile = await UserRepo.getProfile(userId, req.accessToken);
    if (!profile) {
      profile = {
        ...defaultUserProfile,
        name: req.user?.email?.split("@")[0] || "User",
      };
      await UserRepo.setProfile(userId, profile, req.accessToken);
    }
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load user profile", details: err.message });
  }
});

router.patch("/profile", async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const updates = req.body.updates;
  if (!updates) {
    return res.status(400).json({ error: "No update parameters received" });
  }
  try {
    await UserRepo.updateProfile(userId, updates, req.accessToken);
    res.json({ success: true, updated: updates });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to patch profile parameters", details: err.message });
  }
});

router.post("/xp", async (req: AuthRequest, res) => {
  const userId = req.user!.id;
  const { xpAmount } = req.body;
  if (!xpAmount || typeof xpAmount !== "number") {
    return res.status(400).json({ error: "Invalid alignment parameters" });
  }

  try {
    let profile = await UserRepo.getProfile(userId, req.accessToken);
    if (!profile) {
      profile = { ...defaultUserProfile, name: req.user?.email?.split("@")[0] || "User" };
    }

    const { newXp, newLevel, leveledUp } = XpService.awardXp(profile.xp, xpAmount);

    const updates = { xp: newXp, level: newLevel };
    await UserRepo.updateProfile(userId, updates, req.accessToken);

    res.json({
      success: true,
      xpEarned: xpAmount,
      totalXp: newXp,
      level: newLevel,
      leveledUp,
    });
  } catch (err: any) {
    res.status(500).json({ error: "Server error during XP distribution", details: err.message });
  }
});

export default router;
