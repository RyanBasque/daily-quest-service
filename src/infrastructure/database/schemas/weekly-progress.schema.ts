import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WeeklyProgressDocument = HydratedDocument<WeeklyProgressSchema>;

@Schema({ 
  timestamps: true,
  collection: 'weekly_progress'
})
export class WeeklyProgressSchema {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, min: 1, max: 53 })
  weekNumber: number;

  @Prop({ required: true, min: 0, max: 100 })
  progressPercentage: number;

  @Prop({ required: true, min: 0 })
  totalTasks: number;

  @Prop({ required: true, min: 0 })
  completedTasks: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const WeeklyProgressSchemaFactory = SchemaFactory.createForClass(WeeklyProgressSchema);

// Create unique index for userId + year + weekNumber combination
WeeklyProgressSchemaFactory.index({ userId: 1, year: 1, weekNumber: 1 }, { unique: true });
