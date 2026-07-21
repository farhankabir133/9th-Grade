import { adminDb } from "../config/firebase-admin";
import { CircularModel } from "../models/circular.model";

export class CircularRepo {
  static async getAllCirculars(): Promise<CircularModel[]> {
    try {
      const colRef = adminDb.collection("circulars");
      const snap = await colRef.get();
      const results: CircularModel[] = [];
      snap.forEach((docSnap) => {
        results.push(docSnap.data() as CircularModel);
      });
      return results;
    } catch (err: any) {
      console.warn("[CircularRepo] getAllCirculars failed, returning empty list fallback:", err.message);
      return [];
    }
  }

  static async getCircularById(id: string): Promise<CircularModel | null> {
    try {
      const docRef = adminDb.collection("circulars").doc(id);
      const snap = await docRef.get();
      if (snap.exists) {
        return snap.data() as CircularModel;
      }
      return null;
    } catch (err: any) {
      console.warn(`[CircularRepo] getCircularById failed for id ${id}, returning null fallback:`, err.message);
      return null;
    }
  }

  static async saveCircular(data: CircularModel): Promise<void> {
    try {
      const docRef = adminDb.collection("circulars").doc(data.id);
      await docRef.set(data);
    } catch (err: any) {
      console.warn(`[CircularRepo] saveCircular failed for id ${data.id}:`, err.message);
    }
  }
}



