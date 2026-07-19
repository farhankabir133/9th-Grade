export interface CircularModel {
  id: string;
  title: string;
  organization: string;
  vacancyCount: number;
  deadline: string;
  admitCardDate?: string;
  countdownDays: number;
  link: string;
  syllabusOverview: string[];
}
