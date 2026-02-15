import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { AnnualProgressController } from './controllers/annual-progress.controller';
import { WeeklyProgressController } from './controllers/weekly-progress.controller';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { GetAnnualProgressUseCase } from '@application/use-cases/progress/get-annual-progress.use-case';
import { CreateAnnualProgressUseCase } from '@application/use-cases/progress/create-annual-progress.use-case';
import { ListAnnualProgressUseCase } from '@application/use-cases/progress/list-annual-progress.use-case';
import { GetWeeklyProgressUseCase } from '@application/use-cases/progress/get-weekly-progress.use-case';
import { CreateWeeklyProgressUseCase } from '@application/use-cases/progress/create-weekly-progress.use-case';
import { ListWeeklyProgressUseCase } from '@application/use-cases/progress/list-weekly-progress.use-case';
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
  controllers: [AuthController, UserController, HealthController, AnnualProgressController, WeeklyProgressController],
  providers: [
    LoginUseCase, 
    GetUserByIdUseCase, 
    RegisterUseCase,
    GetAnnualProgressUseCase,
    CreateAnnualProgressUseCase,
    ListAnnualProgressUseCase,
    GetWeeklyProgressUseCase,
    CreateWeeklyProgressUseCase,
    ListWeeklyProgressUseCase,
  ],
})
export class PresentationModule {}
