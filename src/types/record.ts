import type { CycleStage, StageDuration } from './cycle';

export type TaskType = 'deep-work' | 'creative' | 'administrative' | 'learning' | 'meeting' | 'other';

export const TASK_TYPE_LABELS: Record<TaskType, string> = {
  'deep-work': 'Deep Work',
  'creative': 'Creative',
  'administrative': 'Administrative',
  'learning': 'Learning',
  'meeting': 'Meeting',
  'other': 'Other',
};

// Extended SessionTags with pre-session data
export interface SessionTags {
  topic: string;
  taskType: TaskType;
  goal?: string;
  intention?: string; // Required, max 1 sentence
  preSessionEnergy?: 1 | 2 | 3 | 4 | 5;
}

export interface SelfReport {
  energyLevel: 1 | 2 | 3 | 4 | 5;
  distractionCount: number;
  notes?: string;
}

// Early stop tracking
export type EarlyStopReason = 'fatigue' | 'interruption' | 'loss-of-focus' | 'task-done' | 'other';

export const EARLY_STOP_REASON_LABELS: Record<EarlyStopReason, string> = {
  'fatigue': 'Fatigue',
  'interruption': 'Interruption',
  'loss-of-focus': 'Loss of Focus',
  'task-done': 'Task Done',
  'other': 'Other',
};

// Distraction log entry
export interface DistractionLog {
  timestamp: string; // ISO date string
  note?: string;
}

// Stage report for tracking individual stage outcomes
export interface StageReport {
  completed: boolean;
  actualMinutes: number;
  notes?: string;
}

// Recovery outcome tracking
export type RecoveryOutcome = 'full' | 'shortened' | 'skipped';

// Recovery activity types for quality tracking
export type RecoveryActivity = 'walked' | 'drank-water' | 'eyes-off-screen' | 'lay-down' | 'stayed-on-screen';

export const RECOVERY_ACTIVITY_LABELS: Record<RecoveryActivity, { label: string; emoji: string }> = {
  'walked': { label: 'Walked', emoji: '🚶' },
  'drank-water': { label: 'Drank water', emoji: '💧' },
  'eyes-off-screen': { label: 'Eyes off screen', emoji: '👀' },
  'lay-down': { label: 'Lay down', emoji: '😴' },
  'stayed-on-screen': { label: 'Stayed on screen', emoji: '❌' },
};

// Focus Friction Level
export type FrictionLevel = 'low' | 'medium' | 'high';

export const FRICTION_LEVEL_LABELS: Record<FrictionLevel, { label: string; color: string; description: string }> = {
  'low': { label: 'Smooth', color: 'emerald', description: 'Minimal interruptions, great flow' },
  'medium': { label: 'Moderate', color: 'amber', description: 'Some friction, but manageable' },
  'high': { label: 'Challenging', color: 'red', description: 'Significant interruptions' },
};

// Momentum extension tracking
export interface MomentumExtension {
  triggered: boolean;
  accepted: boolean;
  extraMinutes: number;
}

export interface FocusRecord {
  id: string;
  createdAt: string; // ISO date string
  completedAt?: string; // ISO date string

  // Session configuration
  templateId: string;
  templateName: string;
  plannedDurations: StageDuration; // in minutes

  // Actual results
  actualDurations: Partial<StageDuration>; // in minutes, may be partial if ended early
  completed: boolean;
  endedEarly: boolean;
  endedAtStage?: string;

  // Tags
  tags: SessionTags;

  // Self-report (filled after completion)
  selfReport?: SelfReport;

  // Enhanced tracking fields
  earlyStopReason?: EarlyStopReason;
  skippedStages?: CycleStage[];
  distractions?: DistractionLog[];
  recoveryOutcome?: RecoveryOutcome;
  midPeakCheckpoint?: boolean; // Did user reach 30-min checkpoint in peak?
  stageNotes?: Partial<Record<CycleStage, string>>;

  // Momentum extension
  momentumExtension?: MomentumExtension;

  // Recovery quality tracking
  recoveryActivities?: RecoveryActivity[];

  // Focus friction tracking
  frictionLevel?: FrictionLevel;
  pauseCount?: number;
}

// Session notes for learning features
export interface SessionNote {
  id: string;
  recordId: string;
  content: string;
  createdAt: string; // ISO date string
  tags?: string[];
}

export interface RecordFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  taskTypes?: TaskType[];
  topics?: string[];
  completedOnly?: boolean;
}

export type SortField = 'createdAt' | 'topic' | 'taskType' | 'energyLevel' | 'totalDuration';
export type SortDirection = 'asc' | 'desc';

export interface RecordSort {
  field: SortField;
  direction: SortDirection;
}
