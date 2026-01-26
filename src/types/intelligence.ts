import type { TaskType } from './record';

// Cycle pattern analysis from historical data
export interface CyclePattern {
  averagePeakCompletion: number;       // 0-1 ratio of peak time actually used
  suggestedPeakAdjustment?: number;    // Minutes to add/subtract from peak
  consistencyScore: number;             // 0-1 how consistent user is
  effectiveFocusTime: number;           // Total peak time minus pauses in minutes
  averageDistractionRate: number;       // Distractions per hour during peak
  preferredTimeOfDay?: 'morning' | 'afternoon' | 'evening';
  mostProductiveTaskTypes: TaskType[];
}

// Energy-based suggestions for session setup
export interface EnergyBasedSuggestion {
  energyLevel: 1 | 2 | 3 | 4 | 5;
  suggestedPeakMinutes: number;
  suggestedTaskTypes: TaskType[];
  message: string;
}

export const ENERGY_SUGGESTIONS: Record<1 | 2 | 3 | 4 | 5, EnergyBasedSuggestion> = {
  1: {
    energyLevel: 1,
    suggestedPeakMinutes: 20,
    suggestedTaskTypes: ['administrative', 'other'],
    message: 'Very low energy - consider a shorter cycle with lighter tasks',
  },
  2: {
    energyLevel: 2,
    suggestedPeakMinutes: 25,
    suggestedTaskTypes: ['administrative', 'learning'],
    message: 'Low energy - try a focused but shorter session',
  },
  3: {
    energyLevel: 3,
    suggestedPeakMinutes: 35,
    suggestedTaskTypes: ['learning', 'creative', 'administrative'],
    message: 'Medium energy - a balanced cycle works well',
  },
  4: {
    energyLevel: 4,
    suggestedPeakMinutes: 45,
    suggestedTaskTypes: ['deep-work', 'creative', 'learning'],
    message: 'High energy - great time for focused deep work',
  },
  5: {
    energyLevel: 5,
    suggestedPeakMinutes: 55,
    suggestedTaskTypes: ['deep-work', 'creative'],
    message: 'Peak energy - ideal for challenging tasks',
  },
};

// Weekly reflection for long-term progression
export interface WeeklyReflection {
  id: string;
  weekStart: string; // ISO date string of week start (Monday)
  whatHelped: string;
  whatHurt: string;
  createdAt: string; // ISO date string
}

// Pattern thresholds for triggering suggestions
export const INTELLIGENCE_THRESHOLDS = {
  minCyclesForSuggestions: 7,          // Minimum cycles before showing suggestions
  minCyclesForPatterns: 14,            // Minimum for pattern analysis
  consistencyWarningThreshold: 0.5,    // Below this, show consistency tips
  peakCompletionWarningThreshold: 0.7, // Below this, suggest shorter peaks
  topicRepetitionThreshold: 4,         // Sessions with same topic to suggest review
};
