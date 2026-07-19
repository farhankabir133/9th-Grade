import { ExamType } from "../src/types";

export interface UserProfileModel {
  name: string;
  phone: string;
  examType: ExamType;
  targetYear: number;
  streak: number;
  xp: number;
  level: number;
  learningStyle: 'visual' | 'analytical' | 'verbal' | 'interactive';
  readinessScore: number;
  predictedRank: number;
  totalStudents: number;
  passingProbability: number;
  consistencyScore: number;
  district: string;
  archetype: string;
}
