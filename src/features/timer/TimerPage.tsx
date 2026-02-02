import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTimerStore } from '../../stores/timerStore';
import { useRecordsStore } from '../../stores/recordsStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { useStageCompletion } from '../../hooks/useTimer';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { notifyStageChange, notifyCycleComplete } from '../../services/notification';
import { playStageTransition, playCompletionSound, initializeAudio } from '../../services/audio';
import type { CycleTemplate } from '../../types/cycle';
import type { SessionTags, SelfReport, EarlyStopReason, FrictionLevel, RecoveryActivity, MomentumExtension, DistractionLog } from '../../types/record';

import {
  TimerDisplay,
  StageIndicator,
  TimerControls,
  SessionSetup,
  SelfReportModal,
  MomentumModal,
  RecoveryCheckIn,
} from './components';

export function TimerPage() {
  const navigate = useNavigate();
  const [showSelfReport, setShowSelfReport] = useState(false);
  const [pendingRecordId, setPendingRecordId] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [showMomentumModal, setShowMomentumModal] = useState(false);
  const [showRecoveryCheckIn, setShowRecoveryCheckIn] = useState(false);
  const [earlyStopReason, setEarlyStopReason] = useState<EarlyStopReason | undefined>(undefined);

  // Track session data for record creation
  const sessionDataRef = useRef<{
    distractions: DistractionLog[];
    skippedStages: string[];
    stageNotes: Record<string, string>;
    pauseCount: number;
    midPeakCheckpoint: boolean;
    momentumExtension: MomentumExtension | null;
    recoveryActivities: RecoveryActivity[];
    frictionLevel: FrictionLevel;
  } | null>(null);

  const status = useTimerStore((state) => state.status);
  const currentTemplate = useTimerStore((state) => state.currentTemplate);
  const sessionTags = useTimerStore((state) => state.sessionTags);
  const startSession = useTimerStore((state) => state.startSession);
  const pauseSession = useTimerStore((state) => state.pauseSession);
  const resumeSession = useTimerStore((state) => state.resumeSession);
  const endSession = useTimerStore((state) => state.endSession);
  const advanceToNextStage = useTimerStore((state) => state.advanceToNextStage);
  const checkMomentumEligibility = useTimerStore((state) => state.checkMomentumEligibility);
  const calculateFrictionLevel = useTimerStore((state) => state.calculateFrictionLevel);
  const distractions = useTimerStore((state) => state.distractions);
  const skippedStages = useTimerStore((state) => state.skippedStages);
  const stageNotes = useTimerStore((state) => state.stageNotes);
  const pauseCount = useTimerStore((state) => state.pauseCount);
  const midPeakCheckpointReached = useTimerStore((state) => state.midPeakCheckpointReached);
  const momentumExtension = useTimerStore((state) => state.momentumExtension);
  const recoveryActivities = useTimerStore((state) => state.recoveryActivities);

  const createRecordFromSession = useRecordsStore((state) => state.createRecordFromSession);
  const addSelfReport = useRecordsStore((state) => state.addSelfReport);

  const notifications = useSettingsStore((state) => state.notifications);

  // Handle stage completion
  const handleStageComplete = useCallback(() => {
    const prevStage = useTimerStore.getState().currentStage;
    const hasNextStage = advanceToNextStage();

    if (notifications.sound) {
      if (hasNextStage) {
        playStageTransition();
      } else {
        playCompletionSound();
      }
    }

    if (notifications.browserNotifications) {
      const newStage = useTimerStore.getState().currentStage;
      if (newStage) {
        notifyStageChange(newStage);
      } else {
        notifyCycleComplete();
      }
    }

    // Check for momentum eligibility when leaving peak stage
    if (prevStage === 'peak' && hasNextStage) {
      const preEnergy = sessionTags?.preSessionEnergy || 3;
      const isEligible = checkMomentumEligibility(preEnergy);
      if (isEligible) {
        setShowMomentumModal(true);
      }
    }

    // Navigate to dashboard when cycle completes
    if (!hasNextStage && prevStage === 'recovery') {
      // Will be handled by the completed status effect
    }
  }, [advanceToNextStage, notifications.sound, notifications.browserNotifications, sessionTags, checkMomentumEligibility]);

  useStageCompletion(handleStageComplete);

  // Handle session start
  const handleStart = useCallback(
    (template: CycleTemplate, tags: SessionTags) => {
      initializeAudio();
      startSession(template, tags);
    },
    [startSession]
  );

  // Handle session end
  const handleEnd = useCallback(async () => {
    if (!currentTemplate || !sessionTags) return;


    // Capture session data before ending
    const frictionLevel = calculateFrictionLevel();
    sessionDataRef.current = {
      distractions: [...distractions],
      skippedStages: [...skippedStages],
      stageNotes: { ...stageNotes },
      pauseCount,
      midPeakCheckpoint: midPeakCheckpointReached,
      momentumExtension,
      recoveryActivities: [...recoveryActivities],
      frictionLevel,
    };

    const { actualDurations, endedAtStage, completed } = endSession();

    const recordId = await createRecordFromSession({

      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      plannedDurations: currentTemplate.durations,
      actualDurations,
      tags: sessionTags,
      completed,
      endedAtStage,
      // Enhanced tracking
      distractions: sessionDataRef.current.distractions,
      skippedStages: sessionDataRef.current.skippedStages as import('../../types/cycle').CycleStage[],
      stageNotes: sessionDataRef.current.stageNotes,
      earlyStopReason: !completed ? earlyStopReason : undefined,
      midPeakCheckpoint: sessionDataRef.current.midPeakCheckpoint,
      // Momentum & Friction
      momentumExtension: sessionDataRef.current.momentumExtension || undefined,
      recoveryActivities: sessionDataRef.current.recoveryActivities,
      frictionLevel: sessionDataRef.current.frictionLevel,
      pauseCount: sessionDataRef.current.pauseCount,
    });

    setPendingRecordId(recordId);
    setSessionCompleted(completed);
    setShowSelfReport(true);

    // Navigation will be handled in handleSelfReportSubmit or handleSelfReportClose
  }, [
    currentTemplate,
    sessionTags,
    endSession,
    createRecordFromSession,
    calculateFrictionLevel,
    distractions,
    skippedStages,
    stageNotes,
    pauseCount,
    midPeakCheckpointReached,
    momentumExtension,
    recoveryActivities,
    earlyStopReason,
  ]);

  // Check for completed status
  useEffect(() => {
    if (status === 'completed') {
      // Small delay to ensure any final state updates are processed
      const timer = setTimeout(() => {
        handleEnd();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [status, handleEnd]);

  // Handle self-report submission
  const handleSelfReportSubmit = useCallback(
    (report: SelfReport) => {
      if (pendingRecordId) {
        addSelfReport(pendingRecordId, report);
      }
      setShowSelfReport(false);
      setPendingRecordId(null);
      setSessionCompleted(false);
      navigate('/dashboard');
    },
    [pendingRecordId, addSelfReport, navigate]
  );

  // Handle self-report close (skip)
  const handleSelfReportClose = useCallback(() => {
    setShowSelfReport(false);
    setPendingRecordId(null);
    setSessionCompleted(false);
    setEarlyStopReason(undefined);
    sessionDataRef.current = null;
    navigate('/dashboard');
  }, [navigate]);

  // Handle momentum modal close
  const handleMomentumModalClose = useCallback(() => {
    setShowMomentumModal(false);
  }, []);

  // Handle recovery check-in complete
  const handleRecoveryCheckInComplete = useCallback(() => {
    setShowRecoveryCheckIn(false);
    // Trigger the end session flow
    handleEnd();
  }, [handleEnd]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    {
      onPauseResume: () => {
        if (status === 'running') pauseSession();
        else if (status === 'paused') resumeSession();
      },
      onEndSession: () => {
        if (status === 'running' || status === 'paused') handleEnd();
      },
    },
    status !== 'idle'
  );

  const isTimerActive = status === 'running' || status === 'paused';

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-8rem)]">
      {status === 'idle' ? (
        <SessionSetup onStart={handleStart} />
      ) : (
        <div className="flex flex-col items-center w-full max-w-md">
          {/* Top Navigation removed - promoted to global Layout */}

          {/* Session info */}
          {sessionTags && (
            <div className="text-center mb-6">
              <div className="badge badge-outline badge-sm mb-2 uppercase tracking-wide text-xs">
                {sessionTags.taskType.replace('-', ' ')}
              </div>
              <h2 className="text-2xl font-bold text-base-content">
                {sessionTags.topic}{sessionTags.subTopic ? `: ${sessionTags.subTopic}` : ''}
              </h2>
              {sessionTags.goal && (
                <p className="text-sm text-base-content/60 mt-1">
                  {sessionTags.goal}
                </p>
              )}
            </div>
          )}

          {/* Timer display */}
          <div className="mb-6">
            <TimerDisplay />
          </div>

          {/* Stage indicator */}
          <StageIndicator />

          {/* Controls */}
          <div className="mt-6 w-full flex justify-center">
            {isTimerActive && <TimerControls onEnd={handleEnd} />}
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="mt-6 text-center">
            <span className="text-xs text-base-content/40 font-mono bg-base-200 px-2 py-1 rounded">
              Space to pause
            </span>
          </div>
        </div>
      )}

      {/* Self-report modal */}
      <SelfReportModal
        isOpen={showSelfReport}
        onClose={handleSelfReportClose}
        onSubmit={handleSelfReportSubmit}
        completed={sessionCompleted}
        frictionData={sessionDataRef.current ? {
          level: sessionDataRef.current.frictionLevel,
          pauseCount: sessionDataRef.current.pauseCount,
          distractionCount: sessionDataRef.current.distractions.length,
          skippedStages: sessionDataRef.current.skippedStages.length,
          endedEarly: !sessionCompleted,
        } : undefined}
      />

      {/* Momentum extension modal */}
      <MomentumModal
        isOpen={showMomentumModal}
        onClose={handleMomentumModalClose}
      />

      {/* Recovery check-in - shown as overlay when recovery stage completes */}
      {showRecoveryCheckIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <RecoveryCheckIn onComplete={handleRecoveryCheckInComplete} />
        </div>
      )}
    </div>
  );
}
