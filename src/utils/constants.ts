// Timer update interval in milliseconds
export const TIMER_UPDATE_INTERVAL = 100;

// Local storage keys
export const STORAGE_KEYS = {
  TIMER_STATE: 'ultradian-timer-state',
  RECORDS: 'ultradian-records',
  SETTINGS: 'ultradian-settings',
  NOTES: 'ultradian-notes',
  REFLECTIONS: 'ultradian-reflections',
  CHIPS: 'ultradian-chips',
} as const;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  PAUSE_RESUME: ' ', // Space
  END_SESSION: 'Escape',
  SKIP_STAGE: 'Enter',
} as const;

// Animation durations
export const ANIMATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Chart colors
export const CHART_COLORS = {
  primary: '#10b981',
  secondary: '#6366f1',
  tertiary: '#f59e0b',
  quaternary: '#8b5cf6',
  muted: '#94a3b8',
} as const;

// Default values
export const DEFAULTS = {
  MIN_DISTRACTION_COUNT: 0,
  MAX_DISTRACTION_COUNT: 99,
  MIN_ENERGY_LEVEL: 1,
  MAX_ENERGY_LEVEL: 5,
} as const;
