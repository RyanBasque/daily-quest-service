import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Progress, ProgressDocument } from '@infrastructure/database/schemas/progress.schema';

async function clearAllProgress() {
  const app = await NestFactory.create(AppModule);
  const progressModel = app.get<Model<ProgressDocument>>(getModelToken(Progress.name));

  console.log('Deleting all progress documents...');

  const result = await progressModel.deleteMany({}).exec();

  console.log(`Deleted ${result.deletedCount} progress documents`);
  console.log('All progress has been cleared!');
  console.log('You can now sync progress again by calling POST /progress/sync');

  await app.close();
}

clearAllProgress()
  .then(() => {
    console.log('Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
