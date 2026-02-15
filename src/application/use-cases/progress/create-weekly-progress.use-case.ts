import { Injectable } from '@nestjs/common';
import { WeeklyProgress } from '@domain/entities/weekly-progress.entity';
import { WeeklyProgressRepository } from '@infrastructure/repositories/weekly-progress.repository';

@Injectable()
export class CreateWeeklyProgressUseCase {
  constructor(private readonly repository: WeeklyProgressRepository) {}

  async execute(userId: string, data: Omit<WeeklyProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<WeeklyProgress> {
    const progress = new WeeklyProgress({
      userId,
      year: data.year,
      weekNumber: data.weekNumber,
      progressPercentage: data.progressPercentage,
      totalTasks: data.totalTasks,
      completedTasks: data.completedTasks,
    });
    return await this.repository.create(progress);
  }
}
