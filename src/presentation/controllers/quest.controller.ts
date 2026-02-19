import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CreateQuestDto } from '../dtos/create-quest.dto';
import { UpdateQuestDto } from '../dtos/update-quest.dto';
import { CreateQuestUseCase } from '@application/use-cases/quest/create-quest.use-case';
import { ListQuestsUseCase } from '@application/use-cases/quest/list-quests.use-case';
import { UpdateQuestUseCase } from '@application/use-cases/quest/update-quest.use-case';
import { DeleteQuestUseCase } from '@application/use-cases/quest/delete-quest.use-case';

@Controller('quests')
@UseGuards(JwtAuthGuard)
export class QuestController {
  constructor(
    private readonly createQuestUseCase: CreateQuestUseCase,
    private readonly listQuestsUseCase: ListQuestsUseCase,
    private readonly updateQuestUseCase: UpdateQuestUseCase,
    private readonly deleteQuestUseCase: DeleteQuestUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req, @Body() createDto: CreateQuestDto) {
    const userId = req.user.sub;
    return this.createQuestUseCase.execute(userId, {
      ...createDto,
      dueDate: createDto.dueDate ? new Date(createDto.dueDate) : undefined,
    });
  }

  @Get()
  async list(@Request() req) {
    const userId = req.user.sub;
    return this.listQuestsUseCase.execute(userId);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateQuestDto,
  ) {
    const userId = req.user.sub;
    return this.updateQuestUseCase.execute(userId, id, {
      ...updateDto,
      dueDate: updateDto.dueDate ? new Date(updateDto.dueDate) : undefined,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Request() req, @Param('id') id: string) {
    const userId = req.user.sub;
    await this.deleteQuestUseCase.execute(userId, id);
  }
}
