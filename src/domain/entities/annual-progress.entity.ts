import { IsString, IsNotEmpty, IsNumber, IsDate, IsOptional, Min, Max } from 'class-validator';

export class AnnualProgress {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  userId: string;

  @IsNumber()
  @Min(2000)
  @Max(2100)
  @IsNotEmpty({ message: 'Ano é obrigatório' })
  year: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsNotEmpty({ message: 'Porcentagem de progresso é obrigatória' })
  progressPercentage: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Total de tarefas é obrigatório' })
  totalTasks: number;

  @IsNumber()
  @Min(0)
  @IsNotEmpty({ message: 'Tarefas completadas é obrigatório' })
  completedTasks: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;

  @IsDate()
  @IsOptional()
  updatedAt?: Date;

  constructor(partial?: Partial<AnnualProgress>) {
    if (partial) {
      Object.assign(this, partial);
    }
  }
}
