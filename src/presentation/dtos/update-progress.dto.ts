import { IsOptional, IsNumber, Min, Max } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  progressPercentage?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  totalTasks?: number;

  @IsNumber()
  @Min(0)
  @IsOptional()
  completedTasks?: number;
}
