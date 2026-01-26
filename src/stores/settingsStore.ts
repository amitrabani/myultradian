import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AppSettings, NotificationSettings, AccessibilitySettings } from '../types/settings';
import { DEFAULT_SETTINGS, DEFAULT_ACCESSIBILITY } from '../types/settings';
import { STORAGE_KEYS } from '../utils/constants';

interface SettingsState extends AppSettings {}

interface SettingsActions {
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  setDefaultTemplate: (templateId: string) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      updateNotifications: (settings) => {
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        }));
      },

      updateAccessibility: (settings) => {
        set((state) => ({
          accessibility: { ...state.accessibility, ...settings },
        }));
      },

      setDefaultTemplate: (templateId) => {
        set({ defaultTemplateId: templateId });
      },

      setTheme: (theme) => {
        set({ theme });
      },

      resetToDefaults: () => {
        set(DEFAULT_SETTINGS);
      },
    }),
    {
      name: STORAGE_KEYS.SETTINGS,
      // Merge function to handle new accessibility field for existing users
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<SettingsState>;
        return {
          ...currentState,
          ...persisted,
          accessibility: {
            ...DEFAULT_ACCESSIBILITY,
            ...persisted.accessibility,
          },
        };
      },
    }
  )
);

// Selectors
export const selectNotifications = (state: SettingsState & SettingsActions) => state.notifications;
export const selectDefaultTemplateId = (state: SettingsState & SettingsActions) => state.defaultTemplateId;
export const selectTheme = (state: SettingsState & SettingsActions) => state.theme;
export const selectAccessibility = (state: SettingsState & SettingsActions) => state.accessibility;
