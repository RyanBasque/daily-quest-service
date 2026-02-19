import { IsString, IsNotEmpty, IsEnum, IsOptional, IsDateString, ValidateNested, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { QuestType } from '../../domain/entities/quest.entity';

class CreateQuestStepDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}

export class CreateQuestDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(QuestType)
  @IsNotEmpty()
  type: QuestType;

  @IsString()
  @IsOptional()
  dueDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuestStepDto)
  @IsOptional()
  steps?: CreateQuestStepDto[];
}
