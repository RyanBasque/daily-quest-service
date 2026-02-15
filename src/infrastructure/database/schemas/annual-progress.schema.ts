import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnnualProgressDocument = HydratedDocument<AnnualProgressSchema>;

@Schema({
  timestamps: true,
  collection: 'annual_progress',
})
export class AnnualProgressSchema {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  year: number;

  @Prop({ required: true, min: 0, max: 100 })
  progressPercentage: number;

  @Prop({ required: true, min: 0 })
  totalTasks: number;

  @Prop({ required: true, min: 0 })
  completedTasks: number;

  createdAt?: Date;
  updatedAt?: Date;
}

export const AnnualProgressSchemaFactory = SchemaFactory.createForClass(AnnualProgressSchema);

AnnualProgressSchemaFactory.index({ userId: 1, year: 1 }, { unique: true });
