import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class CreateAnnualProgressDto {
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
}
