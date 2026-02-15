import { Injectable } from '@nestjs/common';
import { AnnualProgress } from '@domain/entities/annual-progress.entity';
import { AnnualProgressRepository } from '@infrastructure/repositories/annual-progress.repository';

@Injectable()
export class GetAnnualProgressUseCase {
  constructor(private readonly repository: AnnualProgressRepository) {}

  async execute(userId: string, year: number): Promise<AnnualProgress | null> {
    return await this.repository.findByUserIdAndYear(userId, year);
  }
}
