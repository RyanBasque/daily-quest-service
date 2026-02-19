import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quest } from '@domain/entities/quest.entity';
import { QuestRepositoryInterface } from '@domain/repositories/quest.repository.interface';
import { QuestDocument, Quest as QuestSchemaClass } from '../database/schemas/quest.schema';

@Injectable()
export class QuestRepository implements QuestRepositoryInterface {
  constructor(
    @InjectModel(QuestSchemaClass.name)
    private questModel: Model<QuestDocument>,
  ) {}

  async create(quest: Quest): Promise<Quest> {
    const createdQuest = new this.questModel(quest);
    const saved = await createdQuest.save();
    return this.mapToEntity(saved);
  }

  async findById(id: string): Promise<Quest | null> {
    const doc = await this.questModel.findById(id).exec();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findAllByUserId(userId: string): Promise<Quest[]> {
    const docs = await this.questModel.find({ userId }).exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async update(id: string, quest: Partial<Quest>): Promise<Quest | null> {
    const updated = await this.questModel
      .findByIdAndUpdate(id, quest, { new: true })
      .exec();
    if (!updated) return null;
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.questModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  private mapToEntity(doc: QuestDocument): Quest {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      title: doc.title,
      description: doc.description,
      type: doc.type,
      status: doc.status,
      dueDate: doc.dueDate,
      steps: doc.steps || [],
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
    };
  }
}
