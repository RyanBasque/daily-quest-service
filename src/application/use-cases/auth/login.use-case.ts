import { Injectable } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { UserRepositoryImpl } from '@infrastructure/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class LoginUseCase {
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async execute(email: string, password: string): Promise<{ user: User } | null> {
    // Validação dos parâmetros
    if (!email || !password) {
      return null;
    }

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      return null;
    }

    // Validação da senha do usuário no banco
    if (!user.password) {
      console.error('Usuário sem senha no banco:', user.email);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return { user };
  }
}
