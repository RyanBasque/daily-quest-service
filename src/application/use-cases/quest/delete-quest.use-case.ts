import { Injectable, NotFoundException } from '@nestjs/common';
import { QuestRepository } from '@infrastructure/repositories/quest.repository';

@Injectable()
export class DeleteQuestUseCase {
  constructor(private readonly questRepository: QuestRepository) {}

  async execute(userId: string, questId: string): Promise<void> {
    const quest = await this.questRepository.findById(questId);
    
    if (!quest) {
      throw new NotFoundException('Quest not found');
    }

    if (quest.userId !== userId) {
      throw new NotFoundException('Quest not found'); // Don't reveal existence
    }

    await this.questRepository.delete(questId);
  }
}
