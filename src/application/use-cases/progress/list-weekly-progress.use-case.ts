import { Injectable } from '@nestjs/common';
import { WeeklyProgress } from '@domain/entities/weekly-progress.entity';
import { WeeklyProgressRepository } from '@infrastructure/repositories/weekly-progress.repository';

@Injectable()
export class ListWeeklyProgressUseCase {
  constructor(private readonly repository: WeeklyProgressRepository) {}

  async execute(userId: string, year?: number): Promise<WeeklyProgress[]> {
    if (year) {
      return await this.repository.findAllByUserIdAndYear(userId, year);
    }
    return await this.repository.findAllByUserId(userId);
  }
}
