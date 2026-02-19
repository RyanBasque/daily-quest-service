import { IsNotEmpty, IsString, IsEnum, IsBoolean, IsDate, IsOptional } from 'class-validator';

export enum QuestType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export enum QuestStatus {
  TODO = 'TODO',
  COMPLETED = 'COMPLETED',
}

export class QuestStep {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsBoolean()
  @IsOptional()
  completed?: boolean = false;
}

export class Quest {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(QuestType)
  @IsNotEmpty()
  type: QuestType;

  @IsEnum(QuestStatus)
  @IsOptional()
  status: QuestStatus = QuestStatus.TODO;

  @IsDate()
  @IsOptional()
  dueDate?: Date;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  @IsOptional()
  steps?: QuestStep[];
}
