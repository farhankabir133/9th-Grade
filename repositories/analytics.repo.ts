import { supabaseAdmin, supabaseAsUser } from "../config/supabase";
import { UserAnalyticsModel } from "../models/analytics.model";

export class AnalyticsRepo {
  static async getAnalytics(userId: string, accessToken?: string): Promise<UserAnalyticsModel | null> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin;
    const { data: analytics, error: analyticsError } = await client
      .from("user_analytics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (analyticsError || !analytics) return null;

    const { data: dailyStats, error: statsError } = await client
      .from("daily_stats")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    return {
      userId: analytics.user_id,
      totalXp: analytics.total_xp,
      curLevel: analytics.cur_level,
      cumulativePercentile: analytics.cumulative_percentile,
      cohortRank: analytics.cohort_rank,
      streak: analytics.streak,
      masteryHeatmap: analytics.mastery_heatmap || {},
      dailyStats: (dailyStats || []).map((row: any) => ({
        date: row.date,
        xpEarned: row.xp_earned,
        questionsSolved: row.questions_solved,
        correctAnswers: row.correct_answers,
        timeSpentSeconds: row.time_spent_seconds,
      })),
    };
  }

  static async setAnalytics(userId: string, data: UserAnalyticsModel, accessToken?: string): Promise<void> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin;
    const { error: analyticsError } = await client.from("user_analytics").upsert({
      user_id: userId,
      total_xp: data.totalXp,
      cur_level: data.curLevel,
      cumulative_percentile: data.cumulativePercentile,
      cohort_rank: data.cohortRank,
      streak: data.streak,
      mastery_heatmap: data.masteryHeatmap,
    });

    if (analyticsError) throw new Error(`Failed to set analytics: ${analyticsError.message}`);

    if (data.dailyStats && data.dailyStats.length > 0) {
      const { error: deleteError } = await client
        .from("daily_stats")
        .delete()
        .eq("user_id", userId);

      if (deleteError) throw new Error(`Failed to clear daily stats: ${deleteError.message}`);

      const { error: insertError } = await client.from("daily_stats").insert(
        data.dailyStats.map((stat) => ({
          user_id: userId,
          date: stat.date,
          xp_earned: stat.xpEarned,
          questions_solved: stat.questionsSolved,
          correct_answers: stat.correctAnswers,
          time_spent_seconds: stat.timeSpentSeconds,
        }))
      );

      if (insertError) throw new Error(`Failed to insert daily stats: ${insertError.message}`);
    }
  }

  static async updateAnalytics(userId: string, data: Partial<UserAnalyticsModel>, accessToken?: string): Promise<void> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin;
    const updateData: Record<string, any> = {};
    if (data.totalXp !== undefined) updateData.total_xp = data.totalXp;
    if (data.curLevel !== undefined) updateData.cur_level = data.curLevel;
    if (data.cumulativePercentile !== undefined) updateData.cumulative_percentile = data.cumulativePercentile;
    if (data.cohortRank !== undefined) updateData.cohort_rank = data.cohortRank;
    if (data.streak !== undefined) updateData.streak = data.streak;
    if (data.masteryHeatmap !== undefined) updateData.mastery_heatmap = data.masteryHeatmap;

    const { error } = await client
      .from("user_analytics")
      .update(updateData)
      .eq("user_id", userId);

    if (error) throw new Error(`Failed to update analytics: ${error.message}`);
  }
}
