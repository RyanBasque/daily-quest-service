import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException, ConflictException } from '@nestjs/common';
import { LoginDto } from '../dtos/login.dto';
import { RegisterDto } from '../dtos/register.dto';
import { LoginUseCase } from '@application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '@application/use-cases/auth/register.use-case';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    try {
      const user = await this.registerUseCase.execute(
        registerDto.email,
        registerDto.password,
        registerDto.name,
      );

      return {
        message: 'Usuário criado com sucesso',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
        },
      };
    } catch (error) {
      if (error.message === 'Email já cadastrado') {
        throw new ConflictException('Email já cadastrado');
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const result = await this.loginUseCase.execute(loginDto.email, loginDto.password);

    if (!result) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: result.user.id, email: result.user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
      },
    };
  }
}
