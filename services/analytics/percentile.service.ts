export class PercentileService {
  /**
   * Evaluates competitive percentile alignment based on student's cumulative parameters.
   * Helps output realistic mock distributions for BCS/Admission aspirants in Bangladesh.
   */
  static calculatePercentile(params: {
    accuracy: number; // 0 - 100
    xp: number;
    streak: number;
  }): {
    percentile: number;
    predictedRank: number;
    passingProbability: number;
  } {
    const { accuracy, xp, streak } = params;

    // Base performance estimate mapping accuracy of 0-100 onto raw percentile curve
    let pct = 50 + (accuracy - 60) * 1.5;
    
    // Add minor relative modifiers for study discipline
    if (xp > 5000) pct += 3;
    if (streak > 10) pct += 2;

    // Boundary constraints
    pct = Math.max(5, Math.min(99.9, pct));

    // Convert percentile to expected rank among 450,000 candidates
    const totalCandidates = 450000;
    const predictedRank = Math.max(1, Math.round((1 - pct / 100) * totalCandidates));

    // Predict probability to pass BCS Preliminary stage (usual target around top 2-3% of candidates)
    let prob = accuracy * 1.1;
    if (pct > 95) {
      prob += 10;
    }
    prob = Math.max(10, Math.min(98, prob));

    return {
      percentile: parseFloat(pct.toFixed(2)),
      predictedRank,
      passingProbability: Math.round(prob)
    };
  }
}
