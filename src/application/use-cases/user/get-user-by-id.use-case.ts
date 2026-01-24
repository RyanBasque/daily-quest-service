import { Injectable } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { UserRepositoryImpl } from '@infrastructure/repositories/user.repository';

@Injectable()
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: UserRepositoryImpl) {}

  async execute(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }
}
