import { Injectable } from '@nestjs/common';
import { QuestRepository } from '@infrastructure/repositories/quest.repository';
import { ProgressRepository } from '@infrastructure/repositories/progress.repository';
import { Progress, ProgressType } from '@domain/entities/progress.entity';
import { QuestStatus, QuestType } from '@domain/entities/quest.entity';
import { getISOWeek, getYear, isSameISOWeek, getISOWeekYear, isSameDay, getMonth } from 'date-fns';

@Injectable()
export class RecalculateProgressUseCase {
  constructor(
    private readonly questRepository: QuestRepository,
    private readonly progressRepository: ProgressRepository,
  ) {}

  async execute(userId: string) {
    const now = new Date();
    // Normalize to start of day in UTC to avoid timezone issues
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));

    const currentISOYear = getISOWeekYear(today);
    const currentWeek = getISOWeek(today);
    const currentMonth = getMonth(today) + 1; // getMonth returns 0-11, we need 1-12
    const currentCalendarYear = getYear(today);

    const allQuests = await this.questRepository.findAllByUserId(userId);

    // --- Weekly Progress ---
    const weeklyQuests = allQuests.filter((quest) => {
      // Only include Weekly quests
      if (quest.type !== QuestType.WEEKLY) return false;

      if (quest.dueDate) {
        return isSameISOWeek(quest.dueDate, today);
      }
      if (quest.createdAt) {
        return isSameISOWeek(quest.createdAt, today);
      }
      return false;
    });

    const weeklyTotal = weeklyQuests.length;
    const weeklyCompleted = weeklyQuests.filter(q => q.status === QuestStatus.COMPLETED).length;
    const weeklyPercentage = weeklyTotal > 0 ? Math.round((weeklyCompleted / weeklyTotal) * 100) : 0;

    const weekly = await this.upsertProgress(userId, ProgressType.WEEKLY, currentISOYear, weeklyTotal, weeklyCompleted, weeklyPercentage, currentWeek, undefined, undefined);

    // --- Monthly Progress ---
    const monthlyQuests = allQuests.filter((quest) => {
      // Only include Monthly quests
      if (quest.type !== QuestType.MONTHLY) return false;

      if (quest.dueDate) {
        const questMonth = getMonth(quest.dueDate) + 1;
        const questYear = getYear(quest.dueDate);
        return questMonth === currentMonth && questYear === currentCalendarYear;
      }
      if (quest.createdAt) {
        const questMonth = getMonth(quest.createdAt) + 1;
        const questYear = getYear(quest.createdAt);
        return questMonth === currentMonth && questYear === currentCalendarYear;
      }
      return false;
    });

    const monthlyTotal = monthlyQuests.length;
    const monthlyCompleted = monthlyQuests.filter(q => q.status === QuestStatus.COMPLETED).length;
    const monthlyPercentage = monthlyTotal > 0 ? Math.round((monthlyCompleted / monthlyTotal) * 100) : 0;

    const monthly = await this.upsertProgress(userId, ProgressType.MONTHLY, currentCalendarYear, monthlyTotal, monthlyCompleted, monthlyPercentage, undefined, undefined, currentMonth);

    // --- Annual Progress ---
    const annualQuests = allQuests.filter((quest) => {
      // Only include Annual quests
      if (quest.type !== QuestType.ANNUAL) return false;

      if (quest.dueDate) {
         return getYear(quest.dueDate) === currentCalendarYear;
      }
      if (quest.createdAt) {
         return getYear(quest.createdAt) === currentCalendarYear;
      }
      return false;
    });

    const annualTotal = annualQuests.length;
    const annualCompleted = annualQuests.filter(q => q.status === QuestStatus.COMPLETED).length;
    const annualPercentage = annualTotal > 0 ? Math.round((annualCompleted / annualTotal) * 100) : 0;

    const annual = await this.upsertProgress(userId, ProgressType.ANNUAL, currentCalendarYear, annualTotal, annualCompleted, annualPercentage, undefined, undefined, undefined);

    const dailyQuests = allQuests.filter((quest) => {
      // Only include Daily quests
      if (quest.type !== QuestType.DAILY) return false;

      // If quest has dueDate, use it; otherwise use createdAt
      const checkDate = quest.dueDate || quest.createdAt;
      if (!checkDate) return false;

      const dateToCheck = checkDate instanceof Date ? checkDate : new Date(checkDate);
      return isSameDay(dateToCheck, today);
    });

    const dailyTotal = dailyQuests.length;
    const dailyCompleted = dailyQuests.filter(q => q.status === QuestStatus.COMPLETED).length;
    const dailyPercentage = dailyTotal > 0 ? Math.round((dailyCompleted / dailyTotal) * 100) : 0;

    const daily = await this.upsertProgress(userId, ProgressType.DAILY, currentCalendarYear, dailyTotal, dailyCompleted, dailyPercentage, undefined, today, undefined);

    return {
        weekly,
        monthly,
        annual,
        daily
    };
  }

  private async upsertProgress(
    userId: string,
    type: ProgressType,
    year: number,
    totalTasks: number,
    completedTasks: number,
    progressPercentage: number,
    weekNumber?: number,
    date?: Date,
    monthNumber?: number,
  ) {
    const existing = await this.progressRepository.findOne(userId, type, year, weekNumber, date, monthNumber);

    if (existing && existing.id) {
       return await this.progressRepository.update(existing.id, {
          totalTasks,
          completedTasks,
          progressPercentage,
          updatedAt: new Date()
       });
    } else {
       return await this.progressRepository.create(new Progress({
          userId,
          type,
          year,
          weekNumber,
          date,
          monthNumber,
          totalTasks,
          completedTasks,
          progressPercentage,
          updatedAt: new Date(),
          createdAt: new Date()
       }));
    }
  }
}
