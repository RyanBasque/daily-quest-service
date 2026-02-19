import { Injectable } from '@nestjs/common';
import { ProgressRepository } from '@infrastructure/repositories/progress.repository';
import { ProgressType } from '@domain/entities/progress.entity';

@Injectable()
export class GetProgressUseCase {
  constructor(
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: string, type: ProgressType, year: number, weekNumber?: number | undefined, date?: Date, monthNumber?: number | undefined) {
    if (type === ProgressType.WEEKLY && !weekNumber) {
      throw new Error('Week number is required for weekly progress');
    }

    if (type === ProgressType.MONTHLY && !monthNumber) {
      throw new Error('Month number is required for monthly progress');
    }

    const progress = await this.progressRepository.findOne(userId, type, year, weekNumber, date, monthNumber);

    if (!progress) {
      return {
        userId,
        type,
        year,
        weekNumber: weekNumber || undefined,
        monthNumber: monthNumber || undefined,
        date: date || undefined,
        progressPercentage: 0,
        totalTasks: 0,
        completedTasks: 0,
      };
    }

    return progress;
  }
}
