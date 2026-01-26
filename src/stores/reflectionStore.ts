import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WeeklyReflection } from '../types/intelligence';
import { STORAGE_KEYS } from '../utils/constants';

interface ReflectionState {
  reflections: WeeklyReflection[];
  lastPromptDate: string | null;
}

interface ReflectionActions {
  addReflection: (whatHelped: string, whatHurt: string) => string;
  updateReflection: (id: string, updates: Partial<Omit<WeeklyReflection, 'id' | 'createdAt'>>) => void;
  deleteReflection: (id: string) => void;
  getReflectionForWeek: (weekStart: string) => WeeklyReflection | undefined;
  getRecentReflections: (count?: number) => WeeklyReflection[];
  setLastPromptDate: (date: string) => void;
  shouldShowWeeklyPrompt: () => boolean;
}

function generateId(): string {
  return `reflection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export const useReflectionStore = create<ReflectionState & ReflectionActions>()(
  persist(
    (set, get) => ({
      reflections: [],
      lastPromptDate: null,

      addReflection: (whatHelped, whatHurt) => {
        const id = generateId();
        const weekStart = getWeekStart();
        const newReflection: WeeklyReflection = {
          id,
          weekStart,
          whatHelped,
          whatHurt,
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          reflections: [...state.reflections, newReflection],
          lastPromptDate: new Date().toISOString().split('T')[0],
        }));

        return id;
      },

      updateReflection: (id, updates) => {
        set((state) => ({
          reflections: state.reflections.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteReflection: (id) => {
        set((state) => ({
          reflections: state.reflections.filter((r) => r.id !== id),
        }));
      },

      getReflectionForWeek: (weekStart) => {
        const { reflections } = get();
        return reflections.find((r) => r.weekStart === weekStart);
      },

      getRecentReflections: (count = 4) => {
        const { reflections } = get();
        return [...reflections]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, count);
      },

      setLastPromptDate: (date) => {
        set({ lastPromptDate: date });
      },

      shouldShowWeeklyPrompt: () => {
        const { lastPromptDate, reflections } = get();
        const today = new Date();
        const currentWeekStart = getWeekStart(today);

        // Check if we already have a reflection for this week
        const hasThisWeekReflection = reflections.some(
          (r) => r.weekStart === currentWeekStart
        );
        if (hasThisWeekReflection) return false;

        // Check if it's end of week (Friday, Saturday, or Sunday)
        const dayOfWeek = today.getDay();
        const isEndOfWeek = dayOfWeek === 0 || dayOfWeek >= 5;
        if (!isEndOfWeek) return false;

        // Check if we already prompted today
        const todayStr = today.toISOString().split('T')[0];
        if (lastPromptDate === todayStr) return false;

        return true;
      },
    }),
    {
      name: STORAGE_KEYS.REFLECTIONS,
    }
  )
);

// Selectors
export const selectReflections = (state: ReflectionState & ReflectionActions) =>
  state.reflections;

// Utility export
export { getWeekStart };
