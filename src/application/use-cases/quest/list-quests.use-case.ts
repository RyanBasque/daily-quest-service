import { Injectable } from '@nestjs/common';
import { Quest } from '@domain/entities/quest.entity';
import { QuestRepository } from '@infrastructure/repositories/quest.repository';

@Injectable()
export class ListQuestsUseCase {
  constructor(private readonly questRepository: QuestRepository) {}

  async execute(userId: string): Promise<Quest[]> {
    return this.questRepository.findAllByUserId(userId);
  }
}
