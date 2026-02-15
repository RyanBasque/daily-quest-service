import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaFactory } from './schemas/user.schema';
import { AnnualProgressSchema, AnnualProgressSchemaFactory } from './schemas/annual-progress.schema';
import { WeeklyProgressSchema, WeeklyProgressSchemaFactory } from './schemas/weekly-progress.schema';
import { UserRepositoryImpl } from '../repositories/user.repository';
import { AnnualProgressRepository } from '../repositories/annual-progress.repository';
import { WeeklyProgressRepository } from '../repositories/weekly-progress.repository';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log('🔄 [MongoDB] Tentando conectar ao banco de dados...');
        if (uri) {
          console.log(
            '🔗 [MongoDB] URI:',
            uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'),
          ); // Oculta a senha no log
        }
        
        return {
          uri,
          onConnectionCreate: (connection) => {
            connection.on('connected', () => {
              console.log('✅ [MongoDB] Conectado com sucesso!');
            });
            connection.on('error', (error) => {
              console.error('❌ [MongoDB] Erro na conexão:', error.message);
              if (
                error.message.includes('SSL') ||
                error.message.includes('tlsv1 alert internal error') ||
                error.message.includes('whitelisted')
              ) {
                console.error(
                  '💡 [MongoDB] Verifique se o seu IP está na Whitelist do MongoDB Atlas (Network Access).',
                );
              }
            });
            connection.on('disconnected', () => {
              console.log('⚠️  [MongoDB] Desconectado do banco de dados');
            });
            return connection;
          },
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: UserSchema.name, schema: UserSchemaFactory },
      { name: AnnualProgressSchema.name, schema: AnnualProgressSchemaFactory },
      { name: WeeklyProgressSchema.name, schema: WeeklyProgressSchemaFactory },
    ]),
  ],
  providers: [UserRepositoryImpl, AnnualProgressRepository, WeeklyProgressRepository],
  exports: [UserRepositoryImpl, AnnualProgressRepository, WeeklyProgressRepository, MongooseModule],
})
export class DatabaseModule {}
