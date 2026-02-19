import { Quest } from '../entities/quest.entity';

export interface QuestRepositoryInterface {
  create(quest: Quest): Promise<Quest>;
  findById(id: string): Promise<Quest | null>;
  findAllByUserId(userId: string): Promise<Quest[]>;
  update(id: string, quest: Partial<Quest>): Promise<Quest | null>;
  delete(id: string): Promise<boolean>;
}
