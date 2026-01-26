import { useMemo } from 'react';
import { useRecordsStore } from '../stores/recordsStore';
import {
  calculateTotalFocusTime,
  countCompletedCycles,
  calculateStreak,
  calculateRecoveryCompliance,
  calculateAverageEnergy,
  getDailyFocusTime,
  getTaskTypeDistribution,
  getBestTimeOfDay,
  getMostProductiveTemplate,
  getRecordsInRange,
  calculateEffectiveFocusTime,
  calculateConsistencyScore,
  calculateFocusedDaysTotal,
  getHourlyHeatmapData,
  getRecoveryImpactData,
  getTaskTypeEfficiency,
  getBestRecoveryActivity,
  getFrictionDistribution,
  getMomentumStats,
} from '../utils/statistics';

interface DashboardStats {
  totalFocusTime: number; // minutes
  completedCycles: number;
  currentStreak: number; // days
  recoveryCompliance: number; // percentage
  averageEnergy: number;
  effectiveFocusTime: number; // minutes (peak time only)
  consistencyScore: number; // percentage (0-100)
  focusedDaysTotal: number; // total focused days (non-toxic streak)
}

interface ChartData {
  dailyFocusTime: Array<{ date: string; focusTime: number; cycles: number }>;
  taskTypeDistribution: Array<{ taskType: string; count: number; focusTime: number }>;
  heatmapData: Array<{ dayOfWeek: number; hour: number; count: number; completionRate: number }>;
  recoveryImpact: { fullRecovery: { avgEnergy: number; completionRate: number }; skippedRecovery: { avgEnergy: number; completionRate: number } };
  taskTypeEfficiency: Array<{ taskType: string; avgPeakCompletion: number; avgEnergy: number; count: number }>;
}

interface Insights {
  bestTimeOfDay: { hour: number; averageEnergy: number } | null;
  mostProductiveTemplate: { templateId: string; templateName: string; completionRate: number } | null;
  bestRecoveryActivity: { activity: string; avgNextEnergy: number; nextCompletionRate: number; count: number } | null;
  frictionDistribution: { low: number; medium: number; high: number };
  momentumStats: { triggered: number; accepted: number; acceptRate: number; avgExtraMinutes: number };
}

export function useStatistics() {
  const records = useRecordsStore((state) => state.records);

  const stats = useMemo((): DashboardStats => ({
    totalFocusTime: calculateTotalFocusTime(records),
    completedCycles: countCompletedCycles(records),
    currentStreak: calculateStreak(records),
    recoveryCompliance: calculateRecoveryCompliance(records),
    averageEnergy: calculateAverageEnergy(records),
    effectiveFocusTime: calculateEffectiveFocusTime(records),
    consistencyScore: calculateConsistencyScore(records),
    focusedDaysTotal: calculateFocusedDaysTotal(records),
  }), [records]);

  const chartData = useMemo((): ChartData => ({
    dailyFocusTime: getDailyFocusTime(records, 7),
    taskTypeDistribution: getTaskTypeDistribution(records),
    heatmapData: getHourlyHeatmapData(records),
    recoveryImpact: getRecoveryImpactData(records),
    taskTypeEfficiency: getTaskTypeEfficiency(records),
  }), [records]);

  const insights = useMemo((): Insights => ({
    bestTimeOfDay: getBestTimeOfDay(records),
    mostProductiveTemplate: getMostProductiveTemplate(records),
    bestRecoveryActivity: getBestRecoveryActivity(records),
    frictionDistribution: getFrictionDistribution(records),
    momentumStats: getMomentumStats(records),
  }), [records]);

  return { stats, chartData, insights };
}

export function useRecordsInRange(startDate: Date, endDate: Date) {
  const records = useRecordsStore((state) => state.records);

  return useMemo(
    () => getRecordsInRange(records, startDate, endDate),
    [records, startDate, endDate]
  );
}

export function useWeeklyStats() {
  const records = useRecordsStore((state) => state.records);

  return useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const weekRecords = getRecordsInRange(records, startDate, endDate);

    return {
      totalFocusTime: calculateTotalFocusTime(weekRecords),
      completedCycles: countCompletedCycles(weekRecords),
      averageEnergy: calculateAverageEnergy(weekRecords),
    };
  }, [records]);
}
