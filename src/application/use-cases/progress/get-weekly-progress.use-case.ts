import { Injectable } from '@nestjs/common';
import { WeeklyProgress } from '@domain/entities/weekly-progress.entity';
import { WeeklyProgressRepository } from '@infrastructure/repositories/weekly-progress.repository';

@Injectable()
export class GetWeeklyProgressUseCase {
  constructor(private readonly repository: WeeklyProgressRepository) {}

  async execute(userId: string, year: number, weekNumber: number): Promise<WeeklyProgress | null> {
    return await this.repository.findByUserIdYearAndWeek(userId, year, weekNumber);
  }
}
