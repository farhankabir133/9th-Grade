export class XpService {
  /**
   * Calculates Level mathematically from XP.
   * e.g., Level 1 requires 0 XP, Level 2 requires 1000 XP, Level 3 requires 2000 XP, etc.
   */
  static getLevel(xp: number): number {
    if (xp <= 0) return 1;
    return Math.floor(xp / 1000) + 1;
  }

  /**
   * Applies XP gain and computes new milestone levels.
   */
  static awardXp(currentXp: number, amount: number): {
    newXp: number;
    newLevel: number;
    leveledUp: boolean;
  } {
    const oldLevel = this.getLevel(currentXp);
    const newXp = currentXp + amount;
    const newLevel = this.getLevel(newXp);

    return {
      newXp,
      newLevel,
      leveledUp: newLevel > oldLevel
    };
  }
}
