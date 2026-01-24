import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GetUserByIdUseCase } from '@application/use-cases/user/get-user-by-id.use-case';

@Controller('users')
export class UserController {
  constructor(private readonly getUserByIdUseCase: GetUserByIdUseCase) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req) {
    const user = await this.getUserByIdUseCase.execute(req.user.sub);

    if (!user) {
      return {
        id: req.user.sub,
        email: req.user.email,
      };
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
