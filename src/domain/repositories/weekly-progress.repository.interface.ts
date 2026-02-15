import { WeeklyProgress } from '../entities/weekly-progress.entity';

export interface WeeklyProgressRepositoryInterface {
  findByUserIdYearAndWeek(
    userId: string,
    year: number,
    weekNumber: number,
  ): Promise<WeeklyProgress | null>;
  findAllByUserIdAndYear(userId: string, year: number): Promise<WeeklyProgress[]>;
  findAllByUserId(userId: string): Promise<WeeklyProgress[]>;
  create(progress: WeeklyProgress): Promise<WeeklyProgress>;
  update(id: string, progress: Partial<WeeklyProgress>): Promise<WeeklyProgress | null>;
  delete(id: string): Promise<boolean>;
}
