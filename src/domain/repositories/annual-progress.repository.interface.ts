import { AnnualProgress } from '../entities/annual-progress.entity';

export interface AnnualProgressRepositoryInterface {
  findByUserIdAndYear(userId: string, year: number): Promise<AnnualProgress | null>;
  findAllByUserId(userId: string): Promise<AnnualProgress[]>;
  create(progress: AnnualProgress): Promise<AnnualProgress>;
  update(id: string, progress: Partial<AnnualProgress>): Promise<AnnualProgress | null>;
  delete(id: string): Promise<boolean>;
}
