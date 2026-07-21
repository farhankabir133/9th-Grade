import { adminDb } from "../config/firebase-admin";
import { UserProfileModel } from "../models/user.model";

export class UserRepo {
  static async getProfile(userId: string): Promise<UserProfileModel | null> {
    const docRef = adminDb.collection("users").doc(userId);
    const snap = await docRef.get();
    if (snap.exists) {
      return snap.data() as UserProfileModel;
    }
    return null;
  }

  static async setProfile(userId: string, profile: UserProfileModel): Promise<void> {
    const docRef = adminDb.collection("users").doc(userId);
    await docRef.set(profile);
  }

  static async updateProfile(userId: string, partial: Partial<UserProfileModel>): Promise<void> {
    const docRef = adminDb.collection("users").doc(userId);
    await docRef.update(partial);
  }
}


