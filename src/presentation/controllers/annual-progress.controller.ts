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
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateAnnualProgressDto } from '../dtos/create-annual-progress.dto';
import { GetAnnualProgressUseCase } from '@application/use-cases/progress/get-annual-progress.use-case';
import { CreateAnnualProgressUseCase } from '@application/use-cases/progress/create-annual-progress.use-case';
import { ListAnnualProgressUseCase } from '@application/use-cases/progress/list-annual-progress.use-case';

@Controller('progress/annual')
@UseGuards(JwtAuthGuard)
export class AnnualProgressController {
  constructor(
    private readonly getAnnualProgressUseCase: GetAnnualProgressUseCase,
    private readonly createAnnualProgressUseCase: CreateAnnualProgressUseCase,
    private readonly listAnnualProgressUseCase: ListAnnualProgressUseCase,
  ) {}

  @Get()
  async list(@Request() req) {
    const userId = req.user.sub;
    return await this.listAnnualProgressUseCase.execute(userId);
  }

  @Get(':year')
  async getByYear(@Request() req, @Param('year') year: string) {
    const userId = req.user.sub;
    const yearNum = parseInt(year, 10);
    return await this.getAnnualProgressUseCase.execute(userId, yearNum);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createDto: CreateAnnualProgressDto) {
    const userId = req.user.sub;
    return await this.createAnnualProgressUseCase.execute(userId, {
      userId,
      year: createDto.year,
      progressPercentage: createDto.progressPercentage,
      totalTasks: createDto.totalTasks,
      completedTasks: createDto.completedTasks,
    });
  }
}
