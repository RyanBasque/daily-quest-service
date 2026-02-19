import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetProgressUseCase } from '@application/use-cases/progress/get-progress.use-case';
import { RecalculateProgressUseCase } from '@application/use-cases/progress/recalculate-progress.use-case';
import { ProgressType } from '@domain/entities/progress.entity';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(
    private readonly getProgressUseCase: GetProgressUseCase,
    private readonly recalculateProgressUseCase: RecalculateProgressUseCase,
  ) {}

  @Post('sync')
  @HttpCode(HttpStatus.OK)
  async sync(@Request() req) {
    const userId = req.user.sub;
    return await this.recalculateProgressUseCase.execute(userId);
  }

  @Get()
  async getProgress(
    @Request() req,
    @Query('type') type: ProgressType,
    @Query('year') year: string,
    @Query('week') week?: string,
    @Query('month') month?: string,
    @Query('date') dateString?: string,
  ) {
    const userId = req.user.sub;

    if (!type || !Object.values(ProgressType).includes(type)) {
      throw new BadRequestException('Invalid or missing progress type');
    }

    const yearNum = parseInt(year);
    if (isNaN(yearNum)) {
      throw new BadRequestException('Invalid year');
    }

    const weekNum = week ? parseInt(week) : undefined;
    const monthNum = month ? parseInt(month) : undefined;
    const date = dateString ? new Date(dateString) : undefined;

    return this.getProgressUseCase.execute(userId, type, yearNum, weekNum, date, monthNum);
  }
}
