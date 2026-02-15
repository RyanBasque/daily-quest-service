import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WeeklyProgress } from '@domain/entities/weekly-progress.entity';
import { WeeklyProgressRepositoryInterface } from '@domain/repositories/weekly-progress.repository.interface';
import {
  WeeklyProgressSchema,
  WeeklyProgressDocument,
} from '../database/schemas/weekly-progress.schema';

@Injectable()
export class WeeklyProgressRepository implements WeeklyProgressRepositoryInterface {
  constructor(
    @InjectModel(WeeklyProgressSchema.name)
    private weeklyProgressModel: Model<WeeklyProgressDocument>,
  ) {}

  async findByUserIdYearAndWeek(
    userId: string,
    year: number,
    weekNumber: number,
  ): Promise<WeeklyProgress | null> {
    const doc = await this.weeklyProgressModel.findOne({ userId, year, weekNumber }).exec();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findAllByUserIdAndYear(userId: string, year: number): Promise<WeeklyProgress[]> {
    const docs = await this.weeklyProgressModel
      .find({ userId, year })
      .sort({ weekNumber: 1 })
      .exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async findAllByUserId(userId: string): Promise<WeeklyProgress[]> {
    const docs = await this.weeklyProgressModel
      .find({ userId })
      .sort({ year: -1, weekNumber: -1 })
      .exec();
    return docs.map((doc) => this.mapToEntity(doc));
  }

  async create(progress: WeeklyProgress): Promise<WeeklyProgress> {
    const created = new this.weeklyProgressModel(progress);
    const saved = await created.save();
    return this.mapToEntity(saved);
  }

  async update(id: string, progress: Partial<WeeklyProgress>): Promise<WeeklyProgress | null> {
    const updated = await this.weeklyProgressModel
      .findByIdAndUpdate(id, progress, { new: true })
      .exec();
    if (!updated) return null;
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.weeklyProgressModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private mapToEntity(doc: WeeklyProgressDocument): WeeklyProgress {
    return new WeeklyProgress({
      id: doc._id.toString(),
      userId: doc.userId,
      year: doc.year,
      weekNumber: doc.weekNumber,
      progressPercentage: doc.progressPercentage,
      totalTasks: doc.totalTasks,
      completedTasks: doc.completedTasks,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
