export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  browserNotifications: boolean;
}

// Accessibility settings
export interface AccessibilitySettings {
  visualOnly: boolean;        // Disable all sounds
  soundVolume: number;        // 0-1 volume level
  adhdFriendlyMode: boolean;  // Explicit transitions, visible timeline, minimal choices
  highContrastMode: boolean;  // WCAG AA+ contrast
}

export interface AppSettings {
  notifications: NotificationSettings;
  defaultTemplateId: string;
  theme: 'light' | 'dark' | 'system';
  accessibility: AccessibilitySettings;
}

export const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  visualOnly: false,
  soundVolume: 1,
  adhdFriendlyMode: false,
  highContrastMode: false,
};

export const DEFAULT_SETTINGS: AppSettings = {
  notifications: {
    enabled: true,
    sound: true,
    browserNotifications: true,
  },
  defaultTemplateId: 'standard-90',
  theme: 'system',
  accessibility: DEFAULT_ACCESSIBILITY,
};
