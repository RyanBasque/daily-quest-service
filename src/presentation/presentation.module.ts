import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
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
  controllers: [AuthController, UserController, HealthController],
  providers: [LoginUseCase, GetUserByIdUseCase, RegisterUseCase],
})
export class PresentationModule {}
