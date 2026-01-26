import type { FocusRecord } from '../types';
import { startOfDay, formatDateISO } from './time';

/**
 * Calculate total focus time from records (in minutes)
 */
export function calculateTotalFocusTime(records: FocusRecord[]): number {
  return records.reduce((total, record) => {
    const durations = record.actualDurations;
    return total +
      (durations['ramp-up'] || 0) +
      (durations['peak'] || 0) +
      (durations['downshift'] || 0) +
      (durations['recovery'] || 0);
  }, 0);
}

/**
 * Calculate total focus time for a single record (in minutes)
 */
export function calculateRecordDuration(record: FocusRecord): number {
  const durations = record.actualDurations;
  return (
    (durations['ramp-up'] || 0) +
    (durations['peak'] || 0) +
    (durations['downshift'] || 0) +
    (durations['recovery'] || 0)
  );
}

/**
 * Count completed cycles
 */
export function countCompletedCycles(records: FocusRecord[]): number {
  return records.filter(r => r.completed).length;
}

/**
 * Calculate recovery compliance rate (percentage of cycles with full recovery)
 */
export function calculateRecoveryCompliance(records: FocusRecord[]): number {
  const completedRecords = records.filter(r => r.completed);
  if (completedRecords.length === 0) return 0;

  const withFullRecovery = completedRecords.filter(record => {
    const plannedRecovery = record.plannedDurations['recovery'];
    const actualRecovery = record.actualDurations['recovery'] || 0;
    return actualRecovery >= plannedRecovery * 0.9; // 90% threshold
  });

  return (withFullRecovery.length / completedRecords.length) * 100;
}

/**
 * Calculate current streak (consecutive days with at least one completed cycle)
 */
export function calculateStreak(records: FocusRecord[]): number {
  const completedRecords = records.filter(r => r.completed);
  if (completedRecords.length === 0) return 0;

  // Get unique days with completed cycles
  const daysWithCycles = new Set(
    completedRecords.map(r => formatDateISO(new Date(r.createdAt)))
  );

  let streak = 0;
  const today = new Date();
  let currentDate = startOfDay(today);

  // Check if today has a cycle, if not start from yesterday
  if (!daysWithCycles.has(formatDateISO(currentDate))) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Count consecutive days backwards
  while (daysWithCycles.has(formatDateISO(currentDate))) {
    streak++;
    currentDate.setDate(currentDate.getDate() - 1);
  }

  return streak;
}

/**
 * Get records for a specific date range
 */
export function getRecordsInRange(
  records: FocusRecord[],
  startDate: Date,
  endDate: Date
): FocusRecord[] {
  const start = startOfDay(startDate).getTime();
  const end = startOfDay(endDate).getTime() + 24 * 60 * 60 * 1000 - 1;

  return records.filter(record => {
    const recordDate = new Date(record.createdAt).getTime();
    return recordDate >= start && recordDate <= end;
  });
}

/**
 * Get records grouped by date
 */
export function groupRecordsByDate(
  records: FocusRecord[]
): Map<string, FocusRecord[]> {
  const grouped = new Map<string, FocusRecord[]>();

  records.forEach(record => {
    const dateKey = formatDateISO(new Date(record.createdAt));
    const existing = grouped.get(dateKey) || [];
    grouped.set(dateKey, [...existing, record]);
  });

  return grouped;
}

/**
 * Calculate daily focus time (in minutes) for chart data
 */
export function getDailyFocusTime(
  records: FocusRecord[],
  days: number = 7
): Array<{ date: string; focusTime: number; cycles: number }> {
  const result: Array<{ date: string; focusTime: number; cycles: number }> = [];
  const today = new Date();
  const grouped = groupRecordsByDate(records);

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = formatDateISO(date);
    const dayRecords = grouped.get(dateKey) || [];

    result.push({
      date: dateKey,
      focusTime: calculateTotalFocusTime(dayRecords),
      cycles: dayRecords.filter(r => r.completed).length,
    });
  }

  return result;
}

/**
 * Calculate task type distribution
 */
export function getTaskTypeDistribution(
  records: FocusRecord[]
): Array<{ taskType: string; count: number; focusTime: number }> {
  const distribution = new Map<string, { count: number; focusTime: number }>();

  records.forEach(record => {
    const taskType = record.tags.taskType;
    const existing = distribution.get(taskType) || { count: 0, focusTime: 0 };
    distribution.set(taskType, {
      count: existing.count + 1,
      focusTime: existing.focusTime + calculateRecordDuration(record),
    });
  });

  return Array.from(distribution.entries())
    .map(([taskType, data]) => ({ taskType, ...data }))
    .sort((a, b) => b.focusTime - a.focusTime);
}

/**
 * Calculate average energy level
 */
export function calculateAverageEnergy(records: FocusRecord[]): number {
  const recordsWithEnergy = records.filter(r => r.selfReport?.energyLevel);
  if (recordsWithEnergy.length === 0) return 0;

  const total = recordsWithEnergy.reduce(
    (sum, r) => sum + (r.selfReport?.energyLevel || 0),
    0
  );

  return total / recordsWithEnergy.length;
}

/**
 * Find best time of day for focus (by hour)
 */
export function getBestTimeOfDay(
  records: FocusRecord[]
): { hour: number; averageEnergy: number } | null {
  const completedRecords = records.filter(r => r.completed && r.selfReport?.energyLevel);
  if (completedRecords.length === 0) return null;

  const hourlyData = new Map<number, { totalEnergy: number; count: number }>();

  completedRecords.forEach(record => {
    const hour = new Date(record.createdAt).getHours();
    const energy = record.selfReport?.energyLevel || 0;
    const existing = hourlyData.get(hour) || { totalEnergy: 0, count: 0 };
    hourlyData.set(hour, {
      totalEnergy: existing.totalEnergy + energy,
      count: existing.count + 1,
    });
  });

  let bestHour = 0;
  let bestAverage = 0;

  hourlyData.forEach((data, hour) => {
    const average = data.totalEnergy / data.count;
    if (average > bestAverage) {
      bestAverage = average;
      bestHour = hour;
    }
  });

  return { hour: bestHour, averageEnergy: bestAverage };
}

/**
 * Find most productive template
 */
export function getMostProductiveTemplate(
  records: FocusRecord[]
): { templateId: string; templateName: string; completionRate: number } | null {
  const completedRecords = records.filter(r => r.completed);
  if (completedRecords.length === 0) return null;

  const templateStats = new Map<string, { name: string; completed: number; total: number }>();

  records.forEach(record => {
    const existing = templateStats.get(record.templateId) || {
      name: record.templateName,
      completed: 0,
      total: 0,
    };
    templateStats.set(record.templateId, {
      name: record.templateName,
      completed: existing.completed + (record.completed ? 1 : 0),
      total: existing.total + 1,
    });
  });

  let bestTemplate: { templateId: string; templateName: string; completionRate: number } | null = null;
  let bestRate = 0;

  templateStats.forEach((stats, templateId) => {
    if (stats.total >= 3) { // Minimum 3 sessions for meaningful data
      const rate = stats.completed / stats.total;
      if (rate > bestRate) {
        bestRate = rate;
        bestTemplate = {
          templateId,
          templateName: stats.name,
          completionRate: rate * 100,
        };
      }
    }
  });

  return bestTemplate;
}

/**
 * Calculate effective focus time (peak time from completed cycles)
 */
export function calculateEffectiveFocusTime(records: FocusRecord[]): number {
  return records.reduce((total, record) => {
    return total + (record.actualDurations['peak'] || 0);
  }, 0);
}

/**
 * Calculate consistency score (days with cycles / 14 days)
 */
export function calculateConsistencyScore(records: FocusRecord[]): number {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  const recentRecords = records.filter(
    r => r.completed && new Date(r.createdAt) >= twoWeeksAgo
  );

  const daysWithCycles = new Set(
    recentRecords.map(r => formatDateISO(new Date(r.createdAt)))
  ).size;

  return Math.min(100, (daysWithCycles / 14) * 100);
}

/**
 * Calculate non-toxic streak (total focused days, not consecutive)
 */
export function calculateFocusedDaysTotal(records: FocusRecord[]): number {
  const completedRecords = records.filter(r => r.completed);
  const uniqueDays = new Set(
    completedRecords.map(r => formatDateISO(new Date(r.createdAt)))
  );
  return uniqueDays.size;
}

/**
 * Get hourly focus heatmap data
 */
export function getHourlyHeatmapData(
  records: FocusRecord[]
): Array<{ dayOfWeek: number; hour: number; count: number; completionRate: number }> {
  const data: Array<{ dayOfWeek: number; hour: number; count: number; completionRate: number }> = [];

  // Initialize all slots
  for (let day = 0; day < 7; day++) {
    for (let hour = 0; hour < 24; hour++) {
      data.push({ dayOfWeek: day, hour, count: 0, completionRate: 0 });
    }
  }

  // Group records by day and hour
  const groups = new Map<string, { total: number; completed: number }>();

  records.forEach(record => {
    const date = new Date(record.createdAt);
    const dayOfWeek = date.getDay(); // 0 = Sunday
    const hour = date.getHours();
    const key = `${dayOfWeek}-${hour}`;

    const existing = groups.get(key) || { total: 0, completed: 0 };
    groups.set(key, {
      total: existing.total + 1,
      completed: existing.completed + (record.completed ? 1 : 0),
    });
  });

  // Update data with counts
  data.forEach(slot => {
    const key = `${slot.dayOfWeek}-${slot.hour}`;
    const group = groups.get(key);
    if (group) {
      slot.count = group.total;
      slot.completionRate = group.total > 0 ? (group.completed / group.total) * 100 : 0;
    }
  });

  return data;
}

/**
 * Get recovery impact data (comparing next-cycle performance based on recovery)
 */
export function getRecoveryImpactData(
  records: FocusRecord[]
): { fullRecovery: { avgEnergy: number; completionRate: number }; skippedRecovery: { avgEnergy: number; completionRate: number } } {
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const afterFull: { energy: number; completed: boolean }[] = [];
  const afterSkipped: { energy: number; completed: boolean }[] = [];

  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const current = sortedRecords[i];
    const next = sortedRecords[i + 1];

    // Check if they're on the same day or consecutive
    const currentDate = new Date(current.createdAt);
    const nextDate = new Date(next.createdAt);
    const hoursDiff = (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 4) { // Within 4 hours, likely same session
      const recoveryRatio = current.plannedDurations['recovery'] > 0
        ? (current.actualDurations['recovery'] || 0) / current.plannedDurations['recovery']
        : 0;

      const nextEnergy = next.selfReport?.energyLevel || 3;
      const isFullRecovery = recoveryRatio >= 0.9;

      if (isFullRecovery) {
        afterFull.push({ energy: nextEnergy, completed: next.completed });
      } else if (recoveryRatio < 0.5) {
        afterSkipped.push({ energy: nextEnergy, completed: next.completed });
      }
    }
  }

  const calcStats = (arr: typeof afterFull) => {
    if (arr.length === 0) return { avgEnergy: 0, completionRate: 0 };
    const avgEnergy = arr.reduce((sum, r) => sum + r.energy, 0) / arr.length;
    const completionRate = (arr.filter(r => r.completed).length / arr.length) * 100;
    return { avgEnergy, completionRate };
  };

  return {
    fullRecovery: calcStats(afterFull),
    skippedRecovery: calcStats(afterSkipped),
  };
}

/**
 * Get task type efficiency data
 */
export function getTaskTypeEfficiency(
  records: FocusRecord[]
): Array<{ taskType: string; avgPeakCompletion: number; avgEnergy: number; count: number }> {
  const taskTypeStats = new Map<string, { peakCompletions: number[]; energyLevels: number[]; count: number }>();

  records.forEach(record => {
    const taskType = record.tags.taskType;
    const existing = taskTypeStats.get(taskType) || { peakCompletions: [], energyLevels: [], count: 0 };

    // Calculate peak completion ratio
    const plannedPeak = record.plannedDurations['peak'];
    const actualPeak = record.actualDurations['peak'] || 0;
    const peakCompletion = plannedPeak > 0 ? (actualPeak / plannedPeak) * 100 : 0;

    existing.peakCompletions.push(peakCompletion);
    if (record.selfReport?.energyLevel) {
      existing.energyLevels.push(record.selfReport.energyLevel);
    }
    existing.count++;

    taskTypeStats.set(taskType, existing);
  });

  return Array.from(taskTypeStats.entries())
    .map(([taskType, stats]) => ({
      taskType,
      avgPeakCompletion: stats.peakCompletions.reduce((a, b) => a + b, 0) / stats.peakCompletions.length,
      avgEnergy: stats.energyLevels.length > 0
        ? stats.energyLevels.reduce((a, b) => a + b, 0) / stats.energyLevels.length
        : 0,
      count: stats.count,
    }))
    .filter(t => t.count >= 2)
    .sort((a, b) => b.avgPeakCompletion - a.avgPeakCompletion);
}

/**
 * Get best recovery activity based on next cycle performance
 */
export function getBestRecoveryActivity(
  records: FocusRecord[]
): { activity: string; avgNextEnergy: number; nextCompletionRate: number; count: number } | null {
  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  const activityStats = new Map<string, { nextEnergies: number[]; nextCompleted: boolean[] }>();

  for (let i = 0; i < sortedRecords.length - 1; i++) {
    const current = sortedRecords[i];
    const next = sortedRecords[i + 1];

    // Check if they're within reasonable time (same day)
    const currentDate = new Date(current.createdAt).toDateString();
    const nextDate = new Date(next.createdAt).toDateString();

    if (currentDate === nextDate && current.recoveryActivities && current.recoveryActivities.length > 0) {
      const nextEnergy = next.selfReport?.energyLevel || next.tags.preSessionEnergy || 3;

      current.recoveryActivities.forEach(activity => {
        const existing = activityStats.get(activity) || { nextEnergies: [], nextCompleted: [] };
        existing.nextEnergies.push(nextEnergy);
        existing.nextCompleted.push(next.completed);
        activityStats.set(activity, existing);
      });
    }
  }

  let best: { activity: string; avgNextEnergy: number; nextCompletionRate: number; count: number } | null = null;
  let bestScore = 0;

  activityStats.forEach((stats, activity) => {
    if (stats.nextEnergies.length >= 3) { // Minimum 3 data points
      const avgEnergy = stats.nextEnergies.reduce((a, b) => a + b, 0) / stats.nextEnergies.length;
      const completionRate = stats.nextCompleted.filter(Boolean).length / stats.nextCompleted.length;
      const score = avgEnergy * completionRate;

      if (score > bestScore) {
        bestScore = score;
        best = {
          activity,
          avgNextEnergy: avgEnergy,
          nextCompletionRate: completionRate * 100,
          count: stats.nextEnergies.length,
        };
      }
    }
  });

  return best;
}

/**
 * Get friction level distribution
 */
export function getFrictionDistribution(
  records: FocusRecord[]
): { low: number; medium: number; high: number } {
  const distribution = { low: 0, medium: 0, high: 0 };

  records.forEach(record => {
    if (record.frictionLevel) {
      distribution[record.frictionLevel]++;
    }
  });

  return distribution;
}

/**
 * Calculate average friction level (0 = low, 1 = medium, 2 = high)
 */
export function calculateAverageFriction(records: FocusRecord[]): number {
  const recordsWithFriction = records.filter(r => r.frictionLevel);
  if (recordsWithFriction.length === 0) return 0;

  const frictionValues = { low: 0, medium: 1, high: 2 };
  const total = recordsWithFriction.reduce(
    (sum, r) => sum + frictionValues[r.frictionLevel!],
    0
  );

  return total / recordsWithFriction.length;
}

/**
 * Get momentum extension stats
 */
export function getMomentumStats(
  records: FocusRecord[]
): { triggered: number; accepted: number; acceptRate: number; avgExtraMinutes: number } {
  const withMomentum = records.filter(r => r.momentumExtension?.triggered);
  const accepted = withMomentum.filter(r => r.momentumExtension?.accepted);

  return {
    triggered: withMomentum.length,
    accepted: accepted.length,
    acceptRate: withMomentum.length > 0 ? (accepted.length / withMomentum.length) * 100 : 0,
    avgExtraMinutes: accepted.length > 0
      ? accepted.reduce((sum, r) => sum + (r.momentumExtension?.extraMinutes || 0), 0) / accepted.length
      : 0,
  };
}
