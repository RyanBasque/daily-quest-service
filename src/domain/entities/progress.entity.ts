import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional, Min, Max, IsDate } from 'class-validator';

export enum ProgressType {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
}

export class Progress {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(ProgressType)
  @IsNotEmpty()
  type: ProgressType;

  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(53)
  weekNumber?: number;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(12)
  monthNumber?: number;

  @IsDate()
  @IsOptional()
  date?: Date; // For daily progress

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty()
  progressPercentage: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  totalTasks: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  completedTasks: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  constructor(partial?: Partial<Progress>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
