import { Injectable } from '@nestjs/common';
import { UserRepositoryImpl } from '@infrastructure/repositories/user.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegisterUseCase {
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async execute(email: string, password: string, name: string) {
    console.log('🟢 [UseCase] Iniciando registro para:', email);
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      console.log('🔴 [UseCase] Email já existe');
      throw new Error('Email já cadastrado');
    }

    console.log('🟢 [UseCase] Email disponível, hasheando senha...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🟢 [UseCase] Senha hasheada, chamando repositório...');

    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
      name,
    });

    console.log('✅ [UseCase] Usuário criado com sucesso:', user.id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    };
  }
}
