import { Injectable } from '@nestjs/common';
import { AnnualProgress } from '@domain/entities/annual-progress.entity';
import { AnnualProgressRepository } from '@infrastructure/repositories/annual-progress.repository';

@Injectable()
export class ListAnnualProgressUseCase {
  constructor(private readonly repository: AnnualProgressRepository) {}

  async execute(userId: string): Promise<AnnualProgress[]> {
    return await this.repository.findAllByUserId(userId);
  }
}
