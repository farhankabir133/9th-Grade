import { supabaseAdmin, supabaseAsUser } from "../config/supabase";
import { MemoryScheduleModel, MemoryItemModel } from "../models/memory.model";

export class MemoryRepo {
  static async getMemorySchedule(userId: string, accessToken?: string): Promise<MemoryScheduleModel | null> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    const { data: schedule, error: scheduleError } = await client
      .from("memory_schedules")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (scheduleError || !schedule) return null;

    const { data: items, error: itemsError } = await client
      .from("memory_items")
      .select("*")
      .eq("user_id", userId)
      .order("next_review_date", { ascending: true });

    if (itemsError) return null;

    return {
      userId: schedule.user_id,
      items: (items || []).map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        topicId: row.topic_id,
        topic: row.topic,
        subject: row.subject,
        easinessFactor: row.easiness_factor,
        intervalDays: row.interval_days,
        repetitionCount: row.repetition_count,
        nextReviewDate: row.next_review_date,
        lastReviewDate: row.last_review_date,
      })),
    };
  }

  static async setMemorySchedule(userId: string, data: MemoryScheduleModel, accessToken?: string): Promise<void> {
    const client = accessToken ? supabaseAsUser(accessToken) : supabaseAdmin();
    const { error: scheduleError } = await client
      .from("memory_schedules")
      .upsert({
        user_id: userId,
      });

    if (scheduleError) throw new Error(`Failed to set memory schedule: ${scheduleError.message}`);

    const { error: deleteError } = await client
      .from("memory_items")
      .delete()
      .eq("user_id", userId);

    if (deleteError) throw new Error(`Failed to clear memory items: ${deleteError.message}`);

    if (data.items && data.items.length > 0) {
      const { error: insertError } = await client.from("memory_items").insert(
        data.items.map((item) => ({
          id: item.id,
          user_id: userId,
          topic_id: item.topicId,
          topic: item.topic,
          subject: item.subject,
          easiness_factor: item.easinessFactor,
          interval_days: item.intervalDays,
          repetition_count: item.repetitionCount,
          next_review_date: item.nextReviewDate,
          last_review_date: item.lastReviewDate,
        }))
      );

      if (insertError) throw new Error(`Failed to insert memory items: ${insertError.message}`);
    }
  }
}
