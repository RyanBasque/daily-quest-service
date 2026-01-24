import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { User } from '@domain/entities/user.entity';
import { UserSchema, UserDocument } from '../database/schemas/user.schema';

@Injectable()
export class UserRepositoryImpl implements IUserRepository {
  constructor(
    @InjectModel(UserSchema.name)
    private userModel: Model<UserDocument>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) return null;

    return new User({
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt || new Date(),
    });
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id).exec();
    if (!user) return null;

    return new User({
      id: user._id.toString(),
      email: user.email,
      password: user.password,
      name: user.name,
      createdAt: user.createdAt || new Date(),
    });
  }

  async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    console.log('🔵 [Repository] Criando usuário:', userData.email);
    const user = new this.userModel(userData);
    console.log('🔵 [Repository] Documento criado, salvando...');
    const savedUser = await user.save();
    console.log('✅ [Repository] Usuário salvo com ID:', savedUser._id.toString());

    return new User({
      id: savedUser._id.toString(),
      email: savedUser.email,
      password: savedUser.password,
      name: savedUser.name,
      createdAt: savedUser.createdAt || new Date(),
    });
  }
}
