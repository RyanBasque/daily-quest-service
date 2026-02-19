import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Quest as QuestSchemaClass, QuestDocument } from '@infrastructure/database/schemas/quest.schema';
import { QuestType } from '@domain/entities/quest.entity';

async function fixDailyQuestsDueDate() {
  const app = await NestFactory.create(AppModule);
  const questModel = app.get<Model<QuestDocument>>(getModelToken(QuestSchemaClass.name));

  console.log('Finding all DAILY quests without dueDate...');

  const dailyQuestsWithoutDueDate = await questModel.find({
    type: QuestType.DAILY,
    dueDate: { $exists: false }
  }).exec();

  console.log(`Found ${dailyQuestsWithoutDueDate.length} DAILY quests without dueDate`);

  for (const quest of dailyQuestsWithoutDueDate) {
    const createdDate = (quest as any).createdAt ? new Date((quest as any).createdAt) : new Date();
    // Normalize to UTC start of day
    const dueDate = new Date(Date.UTC(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate(), 0, 0, 0, 0));
    console.log(`Updating quest ${quest._id}: "${quest.title}" - setting dueDate to ${dueDate.toISOString()}`);

    await questModel.findByIdAndUpdate(quest._id, {
      dueDate,
    });
  }

  console.log('Migration completed!');
  await app.close();
}

fixDailyQuestsDueDate()
  .then(() => {
    console.log('Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
