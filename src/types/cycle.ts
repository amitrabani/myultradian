export type CycleStage = 'ramp-up' | 'peak' | 'downshift' | 'recovery';

export interface StageDuration {
  'ramp-up': number;
  'peak': number;
  'downshift': number;
  'recovery': number;
}

export interface CycleTemplate {
  id: string;
  name: string;
  durations: StageDuration; // in minutes
  description?: string;
}

export const DEFAULT_TEMPLATES: CycleTemplate[] = [
  {
    id: 'standard-90',
    name: 'Standard 90-min',
    durations: {
      'ramp-up': 15,
      'peak': 45,
      'downshift': 15,
      'recovery': 20,
    },
    description: 'Classic ultradian rhythm cycle',
  },
  {
    id: 'short-60',
    name: 'Short 60-min',
    durations: {
      'ramp-up': 10,
      'peak': 30,
      'downshift': 10,
      'recovery': 15,
    },
    description: 'Condensed cycle for shorter focus periods',
  },
  {
    id: 'deep-120',
    name: 'Deep Work 120-min',
    durations: {
      'ramp-up': 20,
      'peak': 60,
      'downshift': 20,
      'recovery': 25,
    },
    description: 'Extended cycle for deep work sessions',
  },
];

export const STAGE_ORDER: CycleStage[] = ['ramp-up', 'peak', 'downshift', 'recovery'];

export const STAGE_LABELS: Record<CycleStage, string> = {
  'ramp-up': 'Ramp Up',
  'peak': 'Peak Focus',
  'downshift': 'Downshift',
  'recovery': 'Recovery',
};

export const STAGE_DESCRIPTIONS: Record<CycleStage, string> = {
  'ramp-up': '**0–10m: The Scaffolding**\n\nAction: Perform a "Picture Walk."\nGoal: Scan headings and diagrams to create a mental map before diving in.',
  'peak': '**10–70m: The Deep Build**\n\nAction: Practice Retrieval and Interleaving.\nGoal: Avoid "illusions of competence." If stuck, move on to bypass the Einstellung Effect.',
  'downshift': '**70–90m: The Glue**\n\nAction: Use the Feynman Technique.\nGoal: Summarize what you learned in one simple sentence to solidify the "chunk."',
  'recovery': '**90–110m: The Diffuse Mode**\n\nAction: Total sensory reset. No screens, no input.\nGoal: Let your background processor consolidate memories while you walk or rest.',
};

export const STAGE_TOOLTIPS: Record<CycleStage, string> = {
  'ramp-up': 'Ease into focus. Clear distractions and set intentions.',
  'peak': 'Deep work zone. Maximum concentration on your task.',
  'downshift': 'Begin winding down. Wrap up current work.',
  'recovery': 'Rest and recharge. Step away from focused work.',
};

export const STAGE_COLORS: Record<CycleStage, string> = {
  'ramp-up': '#f59e0b',    // amber
  'peak': '#10b981',       // emerald
  'downshift': '#6366f1',  // indigo
  'recovery': '#8b5cf6',   // violet
};

// Stage-specific content and rules for enhanced UX
export interface StageContent {
  suggestedActions: string[];
  warningLabel?: string;
  checkpointMinutes?: number;
  blockTaskSwitching?: boolean;
  questions?: string[];
}

export const STAGE_CONTENT: Record<CycleStage, StageContent> = {
  'ramp-up': {
    suggestedActions: ['Clear distractions', 'Set your intention', 'Review your plan'],
    warningLabel: 'Avoid starting heavy coding tasks',
  },
  'peak': {
    suggestedActions: [],
    checkpointMinutes: 30,
    blockTaskSwitching: true,
  },
  'downshift': {
    suggestedActions: ['Summarize progress', 'Write TODOs', 'Cleanup only'],
    warningLabel: 'Do NOT start new hard things',
    questions: ['What concept became clearer?', 'What still feels fuzzy?'],
  },
  'recovery': {
    suggestedActions: ['Take a walk', 'Drink water', 'Eyes off screen', 'Light stretching'],
  },
};

// Stage icons for accessibility (paired with colors)
export const STAGE_ICONS: Record<CycleStage, string> = {
  'ramp-up': 'sunrise',      // warming up
  'peak': 'zap',             // high energy
  'downshift': 'sunset',     // winding down
  'recovery': 'moon',        // rest
};
