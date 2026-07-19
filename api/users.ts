import { Router } from "express";
import { UserRepo } from "../repositories/user.repo";
import { XpService } from "../services/analytics/xp.service";
import { defaultUserProfile } from "../src/types";

const router = Router();

// Endpoint: GET /api/users/me
router.get("/me", async (req, res) => {
  const userId = (req.query.userId as string) || "farhan-uid";
  try {
    let profile = await UserRepo.getProfile(userId);
    if (!profile) {
      // Lazy init profile based on Farhan Kabir default
      profile = {
        ...defaultUserProfile,
        name: "Farhan Kabir"
      };
      await UserRepo.setProfile(userId, profile);
    }
    res.json(profile);
  } catch (err: any) {
    res.status(500).json({ error: "Failed to load user profile", details: err.message });
  }
});

// Endpoint: PATCH /api/users/profile
router.patch("/profile", async (req, res) => {
  const userId = (req.body.userId as string) || "farhan-uid";
  const updates = req.body.updates;
  if (!updates) {
    return res.status(400).json({ error: "No update parameters received" });
  }
  try {
    await UserRepo.updateProfile(userId, updates);
    res.json({ success: true, updated: updates });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to patch profile parameters", details: err.message });
  }
});

// Endpoint: POST /api/users/xp
router.post("/xp", async (req, res) => {
  const userId = (req.body.userId as string) || "farhan-uid";
  const { xpAmount } = req.body;
  if (!xpAmount || typeof xpAmount !== "number") {
    return res.status(400).json({ error: "Invalid alignment parameters" });
  }

  try {
    let profile = await UserRepo.getProfile(userId);
    if (!profile) {
      profile = { ...defaultUserProfile };
    }

    const { newXp, newLevel, leveledUp } = XpService.awardXp(profile.xp, xpAmount);
    
    const updates = { xp: newXp, level: newLevel };
    await UserRepo.updateProfile(userId, updates);

    res.json({
      success: true,
      xpEarned: xpAmount,
      totalXp: newXp,
      level: newLevel,
      leveledUp
    });
  } catch (err: any) {
    res.status(500).json({ error: "Server error during XP distribution", details: err.message });
  }
});

export default router;
