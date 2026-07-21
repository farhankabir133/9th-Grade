import { adminDb } from "../config/firebase-admin";
import { MemoryScheduleModel } from "../models/memory.model";

export class MemoryRepo {
  static async getMemorySchedule(userId: string): Promise<MemoryScheduleModel | null> {
    const docRef = adminDb.collection("memory").doc(userId);
    const snap = await docRef.get();
    if (snap.exists) {
      return snap.data() as MemoryScheduleModel;
    }
    return null;
  }

  static async setMemorySchedule(userId: string, data: MemoryScheduleModel): Promise<void> {
    const docRef = adminDb.collection("memory").doc(userId);
    await docRef.set(data);
  }
}


