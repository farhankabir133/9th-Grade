export interface MemoryItemModel {
  id: string; // usually compound or generated
  userId: string;
  topicId: string;
  topic: string;
  subject: string;
  easinessFactor: number; // SM-2 EF default starts at 2.5
  intervalDays: number; // SM-2 interval in days
  repetitionCount: number; // count of reviews
  nextReviewDate: string; // ISO String representation of review eligibility
  lastReviewDate: string; // ISO String
}
export interface MemoryScheduleModel {
  userId: string;
  items: MemoryItemModel[];
}
