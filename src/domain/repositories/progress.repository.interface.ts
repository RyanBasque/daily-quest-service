import { Progress, ProgressType } from '@domain/entities/progress.entity';

export interface IProgressRepository {
  create(progress: Progress): Promise<Progress>;
  update(id: string, progress: Partial<Progress>): Promise<Progress>;
  findByUser(userId: string): Promise<Progress[]>;
  findByUserAndType(userId: string, type: ProgressType): Promise<Progress[]>;
  findOne(userId: string, type: ProgressType, year: number, weekNumber?: number, date?: Date): Promise<Progress | null>;
}
