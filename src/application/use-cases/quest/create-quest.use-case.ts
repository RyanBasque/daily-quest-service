import { Injectable } from '@nestjs/common';
import { Quest, QuestStatus, QuestType } from '@domain/entities/quest.entity';
import { QuestRepository } from '@infrastructure/repositories/quest.repository';

@Injectable()
export class CreateQuestUseCase {
  constructor(private readonly questRepository: QuestRepository) {}

  async execute(userId: string, data: Partial<Quest>): Promise<Quest> {
    const quest = new Quest();
    quest.userId = userId;
    quest.title = data.title;
    quest.description = data.description;
    quest.type = data.type;
    quest.status = data.status || QuestStatus.TODO;

    // For DAILY quests, automatically set dueDate to today if not provided
    if (data.type === QuestType.DAILY && !data.dueDate) {
      const now = new Date();
      // Normalize to start of day in UTC to avoid timezone issues
      quest.dueDate = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
    } else {
      quest.dueDate = data.dueDate ? new Date(data.dueDate) : undefined;
    }

    quest.steps = data.steps || [];

    return this.questRepository.create(quest);
  }
}
