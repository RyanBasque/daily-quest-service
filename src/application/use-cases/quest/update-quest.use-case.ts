import { Injectable, NotFoundException } from '@nestjs/common';
import { Quest } from '@domain/entities/quest.entity';
import { QuestRepository } from '@infrastructure/repositories/quest.repository';

@Injectable()
export class UpdateQuestUseCase {
  constructor(private readonly questRepository: QuestRepository) {}

  async execute(userId: string, questId: string, updates: Partial<Quest>): Promise<Quest> {
    const quest = await this.questRepository.findById(questId);
    
    if (!quest) {
      throw new NotFoundException('Quest not found');
    }

    if (quest.userId !== userId) {
      throw new NotFoundException('Quest not found');
    }

    return this.questRepository.update(questId, updates);
  }
}
