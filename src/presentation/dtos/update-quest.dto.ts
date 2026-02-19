import { IsString, IsOptional, IsEnum, IsBoolean, IsArray, ValidateNested, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestStatus } from '../../domain/entities/quest.entity';

class UpdateQuestStepDto {
    @IsString()
    @IsOptional()
    _id?: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}

export class UpdateQuestDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(QuestStatus)
  @IsOptional()
  status?: QuestStatus;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateQuestStepDto)
  @IsOptional()
  steps?: UpdateQuestStepDto[];
}
