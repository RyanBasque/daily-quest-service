import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { QuestController } from './controllers/quest.controller';
import { ProgressController } from './controllers/progress.controller';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { RecalculateProgressUseCase } from '@application/use-cases/progress/recalculate-progress.use-case';
import { GetProgressUseCase } from '@application/use-cases/progress/get-progress.use-case';
import { CreateQuestUseCase } from '@application/use-cases/quest/create-quest.use-case';
import { ListQuestsUseCase } from '@application/use-cases/quest/list-quests.use-case';
import { UpdateQuestUseCase } from '@application/use-cases/quest/update-quest.use-case';
import { DeleteQuestUseCase } from '@application/use-cases/quest/delete-quest.use-case';
import { DatabaseModule } from '@infrastructure/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '1d',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    UserController,
    HealthController,
    QuestController,
    ProgressController,
  ],
  providers: [
    RecalculateProgressUseCase,
    GetProgressUseCase,
    LoginUseCase,
    RegisterUseCase,
    GetUserByIdUseCase,
    CreateQuestUseCase,
    ListQuestsUseCase,
    UpdateQuestUseCase,
    DeleteQuestUseCase,
  ],
})
export class PresentationModule {}
