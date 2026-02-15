import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AnnualProgress } from '@domain/entities/annual-progress.entity';
import { AnnualProgressRepositoryInterface } from '@domain/repositories/annual-progress.repository.interface';
import { AnnualProgressSchema, AnnualProgressDocument } from '../database/schemas/annual-progress.schema';

@Injectable()
export class AnnualProgressRepository implements AnnualProgressRepositoryInterface {
  constructor(
    @InjectModel(AnnualProgressSchema.name)
    private annualProgressModel: Model<AnnualProgressDocument>,
  ) {}

  async findByUserIdAndYear(userId: string, year: number): Promise<AnnualProgress | null> {
    const doc = await this.annualProgressModel.findOne({ userId, year }).exec();
    if (!doc) return null;
    return this.mapToEntity(doc);
  }

  async findAllByUserId(userId: string): Promise<AnnualProgress[]> {
    const docs = await this.annualProgressModel.find({ userId }).sort({ year: -1 }).exec();
    return docs.map(doc => this.mapToEntity(doc));
  }

  async create(progress: AnnualProgress): Promise<AnnualProgress> {
    const created = new this.annualProgressModel(progress);
    const saved = await created.save();
    return this.mapToEntity(saved);
  }

  async update(id: string, progress: Partial<AnnualProgress>): Promise<AnnualProgress | null> {
    const updated = await this.annualProgressModel
      .findByIdAndUpdate(id, progress, { new: true })
      .exec();
    if (!updated) return null;
    return this.mapToEntity(updated);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.annualProgressModel.findByIdAndDelete(id).exec();
    return result !== null;
  }

  private mapToEntity(doc: AnnualProgressDocument): AnnualProgress {
    return new AnnualProgress({
      id: doc._id.toString(),
      userId: doc.userId,
      year: doc.year,
      progressPercentage: doc.progressPercentage,
      totalTasks: doc.totalTasks,
      completedTasks: doc.completedTasks,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }
}
