import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CycleStage, CycleTemplate, StageDuration } from '../types/cycle';
import { STAGE_ORDER } from '../types/cycle';
import type { DistractionLog, SessionTags, RecoveryActivity, MomentumExtension, FrictionLevel } from '../types/record';
import { STORAGE_KEYS } from '../utils/constants';
import { minutesToMs } from '../utils/time';

export type TimerStatus = 'idle' | 'running' | 'paused' | 'completed';

interface TimerState {
  status: TimerStatus;
  currentTemplate: CycleTemplate | null;
  currentStage: CycleStage | null;
  currentStageIndex: number;

  // Timestamps for drift-corrected timing
  sessionStartTime: number | null;
  stageStartTime: number | null;
  pausedAt: number | null;
  totalPausedMs: number;

  // Actual durations recorded (in minutes)
  actualDurations: Partial<StageDuration>;

  // Session metadata
  sessionTags: SessionTags | null;

  // Enhanced tracking
  distractions: DistractionLog[];
  midPeakCheckpointReached: boolean;
  skippedStages: CycleStage[];
  stageNotes: Partial<Record<CycleStage, string>>;

  // Pause tracking for friction meter
  pauseCount: number;

  // Momentum mode
  momentumExtension: MomentumExtension | null;
  momentumEligible: boolean;

  // Recovery quality
  recoveryActivities: RecoveryActivity[];
}

interface TimerActions {
  // Session lifecycle
  startSession: (template: CycleTemplate, tags: SessionTags) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => { actualDurations: Partial<StageDuration>; endedAtStage: CycleStage | null; completed: boolean };
  skipStage: () => void;
  advanceToNextStage: () => boolean; // returns false if cycle complete

  // Enhanced actions
  logDistraction: (note?: string) => void;
  setMidPeakCheckpoint: () => void;
  markStageSkipped: (stage: CycleStage) => void;
  setStageNote: (stage: CycleStage, note: string) => void;

  // Momentum mode actions
  checkMomentumEligibility: (energy: number) => boolean;
  acceptMomentumExtension: (extraMinutes?: number) => void;
  declineMomentumExtension: () => void;

  // Recovery quality actions
  setRecoveryActivities: (activities: RecoveryActivity[]) => void;

  // Friction calculation
  calculateFrictionLevel: () => FrictionLevel;

  // State selectors
  getElapsedStageMs: () => number;
  getRemainingStageMs: () => number;
  getCurrentStageDurationMs: () => number;
  getProgress: () => number; // 0-1

  // Reset
  reset: () => void;
}

const initialState: TimerState = {
  status: 'idle',
  currentTemplate: null,
  currentStage: null,
  currentStageIndex: -1,
  sessionStartTime: null,
  stageStartTime: null,
  pausedAt: null,
  totalPausedMs: 0,
  actualDurations: {},
  sessionTags: null,
  distractions: [],
  midPeakCheckpointReached: false,
  skippedStages: [],
  stageNotes: {},
  pauseCount: 0,
  momentumExtension: null,
  momentumEligible: false,
  recoveryActivities: [],
};

export const useTimerStore = create<TimerState & TimerActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      startSession: (template: CycleTemplate, tags: SessionTags) => {
        const now = Date.now();
        set({
          status: 'running',
          currentTemplate: template,
          currentStage: STAGE_ORDER[0],
          currentStageIndex: 0,
          sessionStartTime: now,
          stageStartTime: now,
          pausedAt: null,
          totalPausedMs: 0,
          actualDurations: {},
          sessionTags: tags,
          distractions: [],
          midPeakCheckpointReached: false,
          skippedStages: [],
          stageNotes: {},
          pauseCount: 0,
          momentumExtension: null,
          momentumEligible: false,
          recoveryActivities: [],
        });
      },

      pauseSession: () => {
        const { status } = get();
        if (status !== 'running') return;

        set((prev) => ({
          status: 'paused',
          pausedAt: Date.now(),
          pauseCount: prev.pauseCount + 1,
        }));
      },

      resumeSession: () => {
        const { status, pausedAt, totalPausedMs } = get();
        if (status !== 'paused' || pausedAt === null) return;

        const pauseDuration = Date.now() - pausedAt;
        set({
          status: 'running',
          pausedAt: null,
          totalPausedMs: totalPausedMs + pauseDuration,
        });
      },

      endSession: () => {
        const { currentStage, actualDurations, status } = get();
        const state = get();

        // Record time for current stage if running
        let finalDurations = { ...actualDurations };
        if (currentStage && state.stageStartTime) {
          const elapsedMs = state.getElapsedStageMs();
          const elapsedMinutes = elapsedMs / 60000;
          finalDurations[currentStage] = (finalDurations[currentStage] || 0) + elapsedMinutes;
        }

        const completed = status === 'completed';
        const endedAtStage = currentStage;

        set(initialState);

        return {
          actualDurations: finalDurations,
          endedAtStage,
          completed,
        };
      },

      skipStage: () => {
        const state = get();
        if (state.status !== 'running' && state.status !== 'paused') return;

        // Record actual time for current stage
        if (state.currentStage && state.stageStartTime) {
          const elapsedMs = state.getElapsedStageMs();
          const elapsedMinutes = elapsedMs / 60000;

          set(prev => ({
            actualDurations: {
              ...prev.actualDurations,
              [state.currentStage!]: (prev.actualDurations[state.currentStage!] || 0) + elapsedMinutes,
            },
          }));
        }

        // Advance to next stage
        state.advanceToNextStage();
      },

      logDistraction: (note?: string) => {
        set(prev => ({
          distractions: [
            ...prev.distractions,
            { timestamp: new Date().toISOString(), note },
          ],
        }));
      },

      setMidPeakCheckpoint: () => {
        set({ midPeakCheckpointReached: true });
      },

      markStageSkipped: (stage: CycleStage) => {
        set(prev => ({
          skippedStages: prev.skippedStages.includes(stage)
            ? prev.skippedStages
            : [...prev.skippedStages, stage],
        }));
      },

      setStageNote: (stage: CycleStage, note: string) => {
        set(prev => ({
          stageNotes: {
            ...prev.stageNotes,
            [stage]: note,
          },
        }));
      },

      // Momentum Mode: Check if user is eligible for extension
      // Criteria: No pauses, Peak completed, Energy >= 4
      checkMomentumEligibility: (energy: number): boolean => {
        const { pauseCount, currentStage, skippedStages, actualDurations, currentTemplate } = get();

        // Check conditions
        const noPauses = pauseCount === 0;
        const peakCompleted = currentStage === 'downshift' ||
          (actualDurations['peak'] !== undefined &&
           currentTemplate !== null &&
           actualDurations['peak'] >= currentTemplate.durations['peak'] * 0.9);
        const highEnergy = energy >= 4;
        const noSkippedPeak = !skippedStages.includes('peak');

        const eligible = noPauses && peakCompleted && highEnergy && noSkippedPeak;

        set({ momentumEligible: eligible });
        return eligible;
      },

      acceptMomentumExtension: (extraMinutes = 10) => {
        set({
          momentumExtension: {
            triggered: true,
            accepted: true,
            extraMinutes,
          },
          momentumEligible: false,
        });

        // Extend the current stage duration by going back to peak
        const { currentTemplate } = get();
        if (currentTemplate) {
          const now = Date.now();
          set({
            currentStage: 'peak',
            currentStageIndex: 1, // Peak is index 1
            stageStartTime: now,
            pausedAt: null,
            totalPausedMs: 0,
          });
        }
      },

      declineMomentumExtension: () => {
        set({
          momentumExtension: {
            triggered: true,
            accepted: false,
            extraMinutes: 0,
          },
          momentumEligible: false,
        });
      },

      setRecoveryActivities: (activities: RecoveryActivity[]) => {
        set({ recoveryActivities: activities });
      },

      calculateFrictionLevel: (): FrictionLevel => {
        const { pauseCount, skippedStages, distractions, status } = get();

        // Calculate friction score
        let frictionScore = 0;

        // Pauses add friction
        frictionScore += pauseCount * 2;

        // Skipped stages add significant friction
        frictionScore += skippedStages.length * 3;

        // Distractions add friction
        frictionScore += distractions.length;

        // Early exit adds friction (if not completed)
        if (status !== 'completed') {
          frictionScore += 2;
        }

        // Determine level
        if (frictionScore <= 2) return 'low';
        if (frictionScore <= 5) return 'medium';
        return 'high';
      },

      advanceToNextStage: () => {
        const { currentStageIndex, actualDurations, currentStage, stageStartTime } = get();

        // Record time for current stage
        let updatedDurations = { ...actualDurations };
        if (currentStage && stageStartTime) {
          const state = get();
          const elapsedMs = state.getElapsedStageMs();
          const elapsedMinutes = elapsedMs / 60000;
          updatedDurations[currentStage] = (updatedDurations[currentStage] || 0) + elapsedMinutes;
        }

        const nextIndex = currentStageIndex + 1;

        if (nextIndex >= STAGE_ORDER.length) {
          // Cycle complete
          set({
            status: 'completed',
            currentStageIndex: STAGE_ORDER.length,
            currentStage: null,
            actualDurations: updatedDurations,
          });
          return false;
        }

        // Move to next stage
        const now = Date.now();
        set({
          status: 'running',
          currentStageIndex: nextIndex,
          currentStage: STAGE_ORDER[nextIndex],
          stageStartTime: now,
          pausedAt: null,
          totalPausedMs: 0,
          actualDurations: updatedDurations,
        });

        return true;
      },

      getElapsedStageMs: () => {
        const { status, stageStartTime, pausedAt, totalPausedMs } = get();

        if (!stageStartTime) return 0;

        if (status === 'paused' && pausedAt) {
          return pausedAt - stageStartTime - totalPausedMs;
        }

        return Date.now() - stageStartTime - totalPausedMs;
      },

      getRemainingStageMs: () => {
        const state = get();
        const totalMs = state.getCurrentStageDurationMs();
        const elapsed = state.getElapsedStageMs();
        return Math.max(0, totalMs - elapsed);
      },

      getCurrentStageDurationMs: () => {
        const { currentTemplate, currentStage } = get();
        if (!currentTemplate || !currentStage) return 0;
        return minutesToMs(currentTemplate.durations[currentStage]);
      },

      getProgress: () => {
        const state = get();
        const totalMs = state.getCurrentStageDurationMs();
        if (totalMs === 0) return 0;
        const elapsed = state.getElapsedStageMs();
        return Math.min(1, elapsed / totalMs);
      },

      reset: () => {
        set(initialState);
      },
    }),
    {
      name: STORAGE_KEYS.TIMER_STATE,
      partialize: (state) => ({
        // Only persist essential state for session recovery
        status: state.status,
        currentTemplate: state.currentTemplate,
        currentStage: state.currentStage,
        currentStageIndex: state.currentStageIndex,
        sessionStartTime: state.sessionStartTime,
        stageStartTime: state.stageStartTime,
        pausedAt: state.pausedAt,
        totalPausedMs: state.totalPausedMs,
        actualDurations: state.actualDurations,
        sessionTags: state.sessionTags,
        distractions: state.distractions,
        midPeakCheckpointReached: state.midPeakCheckpointReached,
        skippedStages: state.skippedStages,
        stageNotes: state.stageNotes,
        pauseCount: state.pauseCount,
        momentumExtension: state.momentumExtension,
        momentumEligible: state.momentumEligible,
        recoveryActivities: state.recoveryActivities,
      }),
    }
  )
);

// Selectors for optimized subscriptions
export const selectStatus = (state: TimerState & TimerActions) => state.status;
export const selectCurrentStage = (state: TimerState & TimerActions) => state.currentStage;
export const selectCurrentTemplate = (state: TimerState & TimerActions) => state.currentTemplate;
export const selectSessionTags = (state: TimerState & TimerActions) => state.sessionTags;
export const selectDistractions = (state: TimerState & TimerActions) => state.distractions;
export const selectMidPeakCheckpoint = (state: TimerState & TimerActions) => state.midPeakCheckpointReached;
export const selectSkippedStages = (state: TimerState & TimerActions) => state.skippedStages;
export const selectStageNotes = (state: TimerState & TimerActions) => state.stageNotes;
export const selectPauseCount = (state: TimerState & TimerActions) => state.pauseCount;
export const selectMomentumEligible = (state: TimerState & TimerActions) => state.momentumEligible;
export const selectMomentumExtension = (state: TimerState & TimerActions) => state.momentumExtension;
export const selectRecoveryActivities = (state: TimerState & TimerActions) => state.recoveryActivities;
