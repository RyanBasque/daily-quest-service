import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ProgressType } from '@domain/entities/progress.entity';

export type ProgressDocument = Progress & Document;

@Schema({ timestamps: true, collection: 'progress' })
export class Progress {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, enum: ProgressType, type: String })
  type: ProgressType;

  @Prop({ required: true })
  year: number;

  @Prop()
  weekNumber?: number;

  @Prop()
  monthNumber?: number;

  @Prop()
  date?: Date;

  @Prop({ required: true, min: 0, max: 100 })
  progressPercentage: number;

  @Prop({ required: true, min: 0 })
  totalTasks: number;

  @Prop({ required: true, min: 0 })
  completedTasks: number;
}

export const ProgressSchema = SchemaFactory.createForClass(Progress);

// Compound indexes for uniqueness based on type
ProgressSchema.index({ userId: 1, type: 1, year: 1 }, { unique: true, partialFilterExpression: { type: 'ANNUAL' } });
ProgressSchema.index({ userId: 1, type: 1, year: 1, weekNumber: 1 }, { unique: true, partialFilterExpression: { type: 'WEEKLY' } });
ProgressSchema.index({ userId: 1, type: 1, year: 1, monthNumber: 1 }, { unique: true, partialFilterExpression: { type: 'MONTHLY' } });
ProgressSchema.index({ userId: 1, type: 1, date: 1 }, { unique: true, partialFilterExpression: { type: 'DAILY' } });
