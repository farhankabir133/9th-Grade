import { MemoryItemModel } from "../../models/memory.model";

export class Sm2Algorithm {
  /**
   * Calculates the updated SM-2 repetition parameters.
   * @param item Current memory item state
   * @param quality Quality rating from user review (0-5)
   */
  static evaluate(item: {
    easinessFactor: number;
    intervalDays: number;
    repetitionCount: number;
  }, quality: number): {
    easinessFactor: number;
    intervalDays: number;
    repetitionCount: number;
    nextReviewDate: string;
  } {
    let ef = item.easinessFactor;
    let interval = item.intervalDays;
    let repCount = item.repetitionCount;

    if (quality < 3) {
      repCount = 0;
      interval = 1;
    } else {
      if (repCount === 0) {
        interval = 1;
      } else if (repCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * ef);
      }
      repCount += 1;
    }

    // Easiness factor modifier formula:
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < 1.3) {
      ef = 1.3;
    }

    // Calculate dates
    const date = new Date();
    date.setDate(date.getDate() + interval);

    return {
      easinessFactor: parseFloat(ef.toFixed(3)),
      intervalDays: interval,
      repetitionCount: repCount,
      nextReviewDate: date.toISOString()
    };
  }
}
