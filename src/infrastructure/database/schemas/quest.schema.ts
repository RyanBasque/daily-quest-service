import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { QuestStatus, QuestType, QuestStep as QuestStepEntity } from '@domain/entities/quest.entity';

export type QuestDocument = Quest & Document;

@Schema()
export class QuestStep {
  @Prop({ required: true })
  title: string;

  @Prop({ default: false })
  completed: boolean;
}

const QuestStepSchema = SchemaFactory.createForClass(QuestStep);

@Schema({ timestamps: true, collection: 'quests' })
export class Quest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: QuestType, type: String })
  type: QuestType;

  @Prop({ required: true, enum: QuestStatus, default: QuestStatus.TODO, type: String })
  status: QuestStatus;

  @Prop()
  dueDate?: Date;

  @Prop({ type: [QuestStepSchema], default: [] })
  steps?: QuestStep[];
}

export const QuestSchema = SchemaFactory.createForClass(Quest);
