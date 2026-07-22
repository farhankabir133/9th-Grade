import { supabaseAdmin, supabaseAsUser } from "../config/supabase";
import { UserProfileModel } from "../models/user.model";

export class UserRepo {
  static async getProfile(userId: string, accessToken?: string): Promise<UserProfileModel | null> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    const { data, error } = await client
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !data) return null;
    return {
      name: data.name,
      phone: data.phone || "",
      examType: data.exam_type,
      targetYear: data.target_year,
      streak: data.streak,
      xp: data.xp,
      level: data.level,
      learningStyle: data.learning_style || "visual",
      readinessScore: data.readiness_score,
      predictedRank: data.predicted_rank,
      totalStudents: data.total_students,
      passingProbability: data.passing_probability,
      consistencyScore: data.consistency_score,
      district: data.district,
      archetype: data.archetype,
    };
  }

  static async setProfile(userId: string, profile: UserProfileModel, accessToken?: string): Promise<void> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    const { error } = await client.from("profiles").upsert({
      id: userId,
      name: profile.name,
      phone: profile.phone,
      exam_type: profile.examType,
      target_year: profile.targetYear,
      streak: profile.streak,
      xp: profile.xp,
      level: profile.level,
      learning_style: profile.learningStyle,
      readiness_score: profile.readinessScore,
      predicted_rank: profile.predictedRank,
      total_students: profile.totalStudents,
      passing_probability: profile.passingProbability,
      consistency_score: profile.consistencyScore,
      district: profile.district,
      archetype: profile.archetype,
    });

    if (error) throw new Error(`Failed to set profile: ${error.message}`);
  }

  static async updateProfile(userId: string, partial: Partial<UserProfileModel>, accessToken?: string): Promise<void> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    const updateData: Record<string, any> = {};
    if (partial.name !== undefined) updateData.name = partial.name;
    if (partial.phone !== undefined) updateData.phone = partial.phone;
    if (partial.examType !== undefined) updateData.exam_type = partial.examType;
    if (partial.targetYear !== undefined) updateData.target_year = partial.targetYear;
    if (partial.streak !== undefined) updateData.streak = partial.streak;
    if (partial.xp !== undefined) updateData.xp = partial.xp;
    if (partial.level !== undefined) updateData.level = partial.level;
    if (partial.learningStyle !== undefined) updateData.learning_style = partial.learningStyle;
    if (partial.readinessScore !== undefined) updateData.readiness_score = partial.readinessScore;
    if (partial.predictedRank !== undefined) updateData.predicted_rank = partial.predictedRank;
    if (partial.totalStudents !== undefined) updateData.total_students = partial.totalStudents;
    if (partial.passingProbability !== undefined) updateData.passing_probability = partial.passingProbability;
    if (partial.consistencyScore !== undefined) updateData.consistency_score = partial.consistencyScore;
    if (partial.district !== undefined) updateData.district = partial.district;
    if (partial.archetype !== undefined) updateData.archetype = partial.archetype;

    const { error } = await client
      .from("profiles")
      .update(updateData)
      .eq("id", userId);

    if (error) throw new Error(`Failed to update profile: ${error.message}`);
  }
}
