import { adminDb } from "../config/firebase-admin";
import { UserAnalyticsModel } from "../models/analytics.model";

export class AnalyticsRepo {
  static async getAnalytics(userId: string): Promise<UserAnalyticsModel | null> {
    const docRef = adminDb.collection("analytics").doc(userId);
    const snap = await docRef.get();
    if (snap.exists) {
      return snap.data() as UserAnalyticsModel;
    }
    return null;
  }

  static async setAnalytics(userId: string, data: UserAnalyticsModel): Promise<void> {
    const docRef = adminDb.collection("analytics").doc(userId);
    await docRef.set(data);
  }

  static async updateAnalytics(userId: string, data: Partial<UserAnalyticsModel>): Promise<void> {
    const docRef = adminDb.collection("analytics").doc(userId);
    await docRef.update(data);
  }
}


