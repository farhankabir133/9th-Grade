import { supabaseAdmin, supabaseAsUser } from "../config/supabase";
import { CircularModel } from "../models/circular.model";

export class CircularRepo {
  static async getAllCirculars(accessToken?: string): Promise<CircularModel[]> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    try {
      const { data, error } = await client
        .from("circulars")
        .select("*")
        .order("deadline", { ascending: true });

      if (error || !data) return [];
      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        organization: row.organization,
        vacancyCount: row.vacancy_count,
        deadline: row.deadline,
        admitCardDate: row.admit_card_date,
        countdownDays: row.countdown_days,
        link: row.link,
        syllabusOverview: row.syllabus_overview,
      }));
    } catch (err: any) {
      console.warn("[CircularRepo] getAllCirculars failed, returning empty list fallback:", err.message);
      return [];
    }
  }

  static async getCircularById(id: string, accessToken?: string): Promise<CircularModel | null> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    try {
      const { data, error } = await client
        .from("circulars")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) return null;
      return {
        id: data.id,
        title: data.title,
        organization: data.organization,
        vacancyCount: data.vacancy_count,
        deadline: data.deadline,
        admitCardDate: data.admit_card_date,
        countdownDays: data.countdown_days,
        link: data.link,
        syllabusOverview: data.syllabus_overview,
      };
    } catch (err: any) {
      console.warn(`[CircularRepo] getCircularById failed for id ${id}, returning null fallback:`, err.message);
      return null;
    }
  }

  static async saveCircular(data: CircularModel, accessToken?: string): Promise<void> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    try {
      const { error } = await client.from("circulars").upsert({
        id: data.id,
        title: data.title,
        organization: data.organization,
        vacancy_count: data.vacancyCount,
        deadline: data.deadline,
        admit_card_date: data.admitCardDate,
        countdown_days: data.countdownDays,
        link: data.link,
        syllabus_overview: data.syllabusOverview,
      });

      if (error) throw new Error(`Failed to save circular: ${error.message}`);
    } catch (err: any) {
      console.warn(`[CircularRepo] saveCircular failed for id ${data.id}:`, err.message);
    }
  }
}
