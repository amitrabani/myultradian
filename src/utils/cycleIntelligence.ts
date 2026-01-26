import type { FocusRecord, TaskType } from '../types/record';
import type { CyclePattern, EnergyBasedSuggestion } from '../types/intelligence';
import { ENERGY_SUGGESTIONS, INTELLIGENCE_THRESHOLDS } from '../types/intelligence';

/**
 * Analyze patterns from historical focus records
 */
export function analyzeCyclePatterns(records: FocusRecord[]): CyclePattern | null {
  const completedRecords = records.filter((r) => r.completed);

  if (completedRecords.length < INTELLIGENCE_THRESHOLDS.minCyclesForPatterns) {
    return null;
  }

  // Calculate average peak completion
  const peakCompletions = completedRecords.map((r) => {
    const plannedPeak = r.plannedDurations['peak'];
    const actualPeak = r.actualDurations['peak'] || 0;
    return plannedPeak > 0 ? actualPeak / plannedPeak : 0;
  });
  const averagePeakCompletion = peakCompletions.reduce((a, b) => a + b, 0) / peakCompletions.length;

  // Calculate suggested peak adjustment
  let suggestedPeakAdjustment: number | undefined;
  if (averagePeakCompletion < INTELLIGENCE_THRESHOLDS.peakCompletionWarningThreshold) {
    // Suggest shorter peaks
    suggestedPeakAdjustment = -10; // Reduce by 10 minutes
  } else if (averagePeakCompletion > 0.95) {
    // Could handle longer peaks
    suggestedPeakAdjustment = 5; // Increase by 5 minutes
  }

  // Calculate consistency score (days with completed cycles / 14 days)
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  const recentRecords = completedRecords.filter(
    (r) => new Date(r.createdAt) >= twoWeeksAgo
  );
  const daysWithCycles = new Set(
    recentRecords.map((r) => new Date(r.createdAt).toDateString())
  ).size;
  const consistencyScore = Math.min(1, daysWithCycles / 14);

  // Calculate effective focus time (peak time actually used)
  const effectiveFocusTime = completedRecords.reduce((total, r) => {
    return total + (r.actualDurations['peak'] || 0);
  }, 0);

  // Calculate average distraction rate
  const recordsWithDistractions = completedRecords.filter((r) => r.distractions);
  let averageDistractionRate = 0;
  if (recordsWithDistractions.length > 0) {
    const totalDistractions = recordsWithDistractions.reduce(
      (total, r) => total + (r.distractions?.length || 0),
      0
    );
    const totalPeakHours = recordsWithDistractions.reduce(
      (total, r) => total + (r.actualDurations['peak'] || 0) / 60,
      0
    );
    averageDistractionRate = totalPeakHours > 0 ? totalDistractions / totalPeakHours : 0;
  }

  // Find preferred time of day
  const hourCounts: Record<string, number> = { morning: 0, afternoon: 0, evening: 0 };
  completedRecords.forEach((r) => {
    const hour = new Date(r.createdAt).getHours();
    if (hour >= 5 && hour < 12) hourCounts['morning']++;
    else if (hour >= 12 && hour < 17) hourCounts['afternoon']++;
    else hourCounts['evening']++;
  });
  const preferredTimeOfDay = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0]?.[0] as
    | 'morning'
    | 'afternoon'
    | 'evening'
    | undefined;

  // Find most productive task types (by completion rate)
  const taskTypeStats: Record<TaskType, { completed: number; total: number }> = {} as Record<
    TaskType,
    { completed: number; total: number }
  >;
  records.forEach((r) => {
    const taskType = r.tags.taskType;
    if (!taskTypeStats[taskType]) {
      taskTypeStats[taskType] = { completed: 0, total: 0 };
    }
    taskTypeStats[taskType].total++;
    if (r.completed) {
      taskTypeStats[taskType].completed++;
    }
  });
  const mostProductiveTaskTypes = Object.entries(taskTypeStats)
    .filter(([, stats]) => stats.total >= 3 && stats.completed / stats.total >= 0.8)
    .sort((a, b) => b[1].completed / b[1].total - a[1].completed / a[1].total)
    .map(([taskType]) => taskType as TaskType)
    .slice(0, 3);

  return {
    averagePeakCompletion,
    suggestedPeakAdjustment,
    consistencyScore,
    effectiveFocusTime,
    averageDistractionRate,
    preferredTimeOfDay,
    mostProductiveTaskTypes,
  };
}

/**
 * Check if user has enough cycles to show suggestions
 */
export function shouldShowSuggestions(records: FocusRecord[]): boolean {
  const completedCount = records.filter((r) => r.completed).length;
  return completedCount >= INTELLIGENCE_THRESHOLDS.minCyclesForSuggestions;
}

/**
 * Get suggested peak duration based on patterns and current energy
 */
export function getSuggestedPeakDuration(
  patterns: CyclePattern | null,
  currentEnergy: 1 | 2 | 3 | 4 | 5,
  defaultPeakMinutes: number
): number {
  const energySuggested = ENERGY_SUGGESTIONS[currentEnergy].suggestedPeakMinutes;

  // If no patterns available, blend energy suggestion with default
  // Give more weight to energy (60%) so it actually influences the suggestion
  if (!patterns) {
    return Math.round(energySuggested * 0.6 + defaultPeakMinutes * 0.4);
  }

  // With patterns, start from energy-based suggestion
  let suggested = energySuggested;

  // Adjust based on historical patterns
  if (patterns.suggestedPeakAdjustment) {
    suggested += patterns.suggestedPeakAdjustment;
  }

  // Ensure within reasonable bounds
  return Math.max(15, Math.min(90, suggested));
}

/**
 * Get energy-based suggestion for session setup
 */
export function getEnergyBasedSuggestion(energy: 1 | 2 | 3 | 4 | 5): EnergyBasedSuggestion {
  return ENERGY_SUGGESTIONS[energy];
}

/**
 * Get topics that have been repeated enough times to suggest a review cycle
 */
export function getRepeatedTopics(records: FocusRecord[]): string[] {
  const topicCounts: Record<string, number> = {};
  records.forEach((r) => {
    const topic = r.tags.topic.toLowerCase();
    topicCounts[topic] = (topicCounts[topic] || 0) + 1;
  });

  return Object.entries(topicCounts)
    .filter(([, count]) => count >= INTELLIGENCE_THRESHOLDS.topicRepetitionThreshold)
    .map(([topic]) => topic);
}

/**
 * Generate personalized insights based on patterns
 */
export function generateInsights(patterns: CyclePattern): string[] {
  const insights: string[] = [];

  // Peak completion insight
  if (patterns.averagePeakCompletion < 0.7) {
    insights.push(
      'You often end peak focus early. Consider shorter cycles to build consistency.'
    );
  } else if (patterns.averagePeakCompletion > 0.95) {
    insights.push(
      "You're completing your peak phases consistently. You might benefit from longer cycles."
    );
  }

  // Consistency insight
  if (patterns.consistencyScore < INTELLIGENCE_THRESHOLDS.consistencyWarningThreshold) {
    insights.push(
      'Try to do at least one focus cycle daily to build a sustainable habit.'
    );
  } else if (patterns.consistencyScore > 0.8) {
    insights.push(
      "Great consistency! You're building a strong focus practice."
    );
  }

  // Time of day insight
  if (patterns.preferredTimeOfDay) {
    const timeLabel = {
      morning: 'morning (5am-12pm)',
      afternoon: 'afternoon (12pm-5pm)',
      evening: 'evening (5pm onwards)',
    }[patterns.preferredTimeOfDay];
    insights.push(
      `You tend to focus best in the ${timeLabel}. Schedule important work then.`
    );
  }

  // Distraction insight
  if (patterns.averageDistractionRate > 3) {
    insights.push(
      'High distraction rate detected. Consider removing phone from your workspace.'
    );
  } else if (patterns.averageDistractionRate < 0.5) {
    insights.push(
      'Excellent focus! Your distraction rate is very low.'
    );
  }

  // Task type insight
  if (patterns.mostProductiveTaskTypes.length > 0) {
    const taskTypes = patterns.mostProductiveTaskTypes.join(', ');
    insights.push(
      `You perform best with ${taskTypes} tasks during focus cycles.`
    );
  }

  return insights.slice(0, 3); // Return top 3 insights
}
