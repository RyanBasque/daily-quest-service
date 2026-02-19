import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '../database/schemas/progress.schema';
import { Progress as ProgressEntity, ProgressType } from '@domain/entities/progress.entity';
import { IProgressRepository } from '@domain/repositories/progress.repository.interface';

@Injectable()
export class ProgressRepository implements IProgressRepository {
  constructor(
    @InjectModel(Progress.name)
    private readonly progressModel: Model<ProgressDocument>,
  ) {}

  async create(progress: ProgressEntity): Promise<ProgressEntity> {
    const createdProgress = new this.progressModel(progress);
    const saved = await createdProgress.save();
    return this.mapToEntity(saved);
  }

  async update(id: string, progress: Partial<ProgressEntity>): Promise<ProgressEntity> {
    const updated = await this.progressModel
      .findByIdAndUpdate(id, progress, { new: true })
      .exec();
    return this.mapToEntity(updated);
  }

  async findByUser(userId: string): Promise<ProgressEntity[]> {
    const progressList = await this.progressModel.find({ userId }).exec();
    return progressList.map(this.mapToEntity);
  }

  async findByUserAndType(userId: string, type: ProgressType): Promise<ProgressEntity[]> {
    const progressList = await this.progressModel.find({ userId, type }).exec();
    return progressList.map(this.mapToEntity);
  }

  async findOne(
    userId: string,
    type: ProgressType,
    year: number,
    weekNumber?: number,
    date?: Date,
    monthNumber?: number,
  ): Promise<ProgressEntity | null> {
    const query: any = { userId, type, year };

    if (type === ProgressType.WEEKLY && weekNumber) {
      query.weekNumber = weekNumber;
    }

    if (type === ProgressType.MONTHLY && monthNumber) {
      query.monthNumber = monthNumber;
    }

    if (type === ProgressType.DAILY && date) {
      // Normalize date to UTC start of day to avoid timezone issues
      const inputDate = date instanceof Date ? date : new Date(date);
      const startOfDay = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate(), 0, 0, 0, 0));
      const endOfDay = new Date(Date.UTC(inputDate.getUTCFullYear(), inputDate.getUTCMonth(), inputDate.getUTCDate(), 23, 59, 59, 999));
      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    const found = await this.progressModel.findOne(query).exec();

    return found ? this.mapToEntity(found) : null;
  }

  private mapToEntity(doc: ProgressDocument): ProgressEntity {
    return new ProgressEntity({
      id: doc._id.toString(),
      userId: doc.userId,
      type: doc.type as ProgressType,
      year: doc.year,
      weekNumber: doc.weekNumber,
      monthNumber: doc.monthNumber,
      date: doc.date,
      progressPercentage: doc.progressPercentage,
      totalTasks: doc.totalTasks,
      completedTasks: doc.completedTasks,
      createdAt: (doc as any).createdAt,
      updatedAt: (doc as any).updatedAt,
    });
  }
}
