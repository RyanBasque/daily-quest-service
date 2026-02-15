import { Injectable } from '@nestjs/common';
import { AnnualProgress } from '@domain/entities/annual-progress.entity';
import { AnnualProgressRepository } from '@infrastructure/repositories/annual-progress.repository';

@Injectable()
export class CreateAnnualProgressUseCase {
  constructor(private readonly repository: AnnualProgressRepository) {}

  async execute(userId: string, data: Omit<AnnualProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<AnnualProgress> {
    const progress = new AnnualProgress({
      userId,
      year: data.year,
      progressPercentage: data.progressPercentage,
      totalTasks: data.totalTasks,
      completedTasks: data.completedTasks,
    });
    return await this.repository.create(progress);
  }
}
