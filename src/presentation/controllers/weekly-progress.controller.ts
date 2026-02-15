import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  HttpCode,
  HttpStatus,
  Query
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateWeeklyProgressDto } from '../dtos/create-weekly-progress.dto';
import { GetWeeklyProgressUseCase } from '@application/use-cases/progress/get-weekly-progress.use-case';
import { CreateWeeklyProgressUseCase } from '@application/use-cases/progress/create-weekly-progress.use-case';
import { ListWeeklyProgressUseCase } from '@application/use-cases/progress/list-weekly-progress.use-case';

@Controller('progress/weekly')
@UseGuards(JwtAuthGuard)
export class WeeklyProgressController {
  constructor(
    private readonly getWeeklyProgressUseCase: GetWeeklyProgressUseCase,
    private readonly createWeeklyProgressUseCase: CreateWeeklyProgressUseCase,
    private readonly listWeeklyProgressUseCase: ListWeeklyProgressUseCase,
  ) {}

  @Get()
  async list(@Request() req, @Query('year') year?: string) {
    const userId = req.user.sub;
    const yearNum = year ? parseInt(year, 10) : undefined;
    return await this.listWeeklyProgressUseCase.execute(userId, yearNum);
  }

  @Get(':year/:week')
  async getByYearAndWeek(
    @Request() req, 
    @Param('year') year: string,
    @Param('week') week: string
  ) {
    const userId = req.user.sub;
    const yearNum = parseInt(year, 10);
    const weekNum = parseInt(week, 10);
    return await this.getWeeklyProgressUseCase.execute(userId, yearNum, weekNum);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createDto: CreateWeeklyProgressDto) {
    const userId = req.user.sub;
    return await this.createWeeklyProgressUseCase.execute(userId, {
      userId,
      year: createDto.year,
      weekNumber: createDto.weekNumber,
      progressPercentage: createDto.progressPercentage,
      totalTasks: createDto.totalTasks,
      completedTasks: createDto.completedTasks,
    });
  }
}
