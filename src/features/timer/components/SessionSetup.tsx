import { useState, useEffect, useMemo } from 'react';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { EnergySlider } from '../../../components/common/RadixSlider';
import { Modal } from '../../../components/common/Modal';
import { DEFAULT_TEMPLATES, type CycleTemplate } from '../../../types/cycle';
import { TASK_TYPE_LABELS, type TaskType, type SessionTags } from '../../../types/record';
import { formatMinutes } from '../../../utils/time';
import { useSessionSetupStore } from '../../../stores/sessionSetupStore';
import { useEnergySuggestion } from '../../../hooks/useCycleIntelligence';
import { useRecordsStore } from '../../../stores/recordsStore';
import { useAuthStore } from '../../../stores/authStore';
import { useChipsStore } from '../../../stores/chipsStore';


interface SessionSetupProps {
  onStart: (template: CycleTemplate, tags: SessionTags) => void;
}

export function SessionSetup({ onStart }: SessionSetupProps) {
  const [isSetupStarted, setIsSetupStarted] = useState(false);
  const [setupStep, setSetupStep] = useState(1); // 1: Category, 2: Specifics
  const [selectedTemplateId, setSelectedTemplateId] = useState(DEFAULT_TEMPLATES[0].id);
  const [topic, setTopic] = useState('');
  const [subTopic, setSubTopic] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('deep-work');
  const [goal, setGoal] = useState('');
  const [preSessionEnergy, setPreSessionEnergy] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNewChipModal, setShowNewChipModal] = useState(false);
  const [newChipName, setNewChipName] = useState('');
  const [showSubTopicInput, setShowSubTopicInput] = useState(false);

  const prefillTags = useSessionSetupStore((state) => state.prefillTags);
  const clearPrefillTags = useSessionSetupStore((state) => state.clearPrefillTags);
  const user = useAuthStore((state) => state.user);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const { chips, addChip } = useChipsStore();
  const records = useRecordsStore((state) => state.records);

  // Pre-fill form from duplicated record
  useEffect(() => {
    if (prefillTags) {
      setTopic(prefillTags.topic);
      if (prefillTags.subTopic) setSubTopic(prefillTags.subTopic);
      setTaskType(prefillTags.taskType);
      if (prefillTags.goal) setGoal(prefillTags.goal);
      if (prefillTags.preSessionEnergy) setPreSessionEnergy(prefillTags.preSessionEnergy);
      setIsSetupStarted(true);
      setSetupStep(2);
      clearPrefillTags();
    }
  }, [prefillTags, clearPrefillTags]);

  const selectedTemplate = DEFAULT_TEMPLATES.find((t) => t.id === selectedTemplateId)!;

  const { suggestion, suggestedPeakMinutes } = useEnergySuggestion(
    preSessionEnergy,
    selectedTemplate.durations['peak']
  );

  const suggestedTemplate = DEFAULT_TEMPLATES.reduce((best, template) => {
    const bestDiff = Math.abs(best.durations['peak'] - suggestedPeakMinutes);
    const currentDiff = Math.abs(template.durations['peak'] - suggestedPeakMinutes);
    return currentDiff < bestDiff ? template : best;
  }, DEFAULT_TEMPLATES[0]);

  const showSuggestion = suggestedTemplate.id !== selectedTemplateId &&
    Math.abs(suggestedTemplate.durations['peak'] - selectedTemplate.durations['peak']) >= 10;

  const totalDuration =
    selectedTemplate.durations['ramp-up'] +
    selectedTemplate.durations['peak'] +
    selectedTemplate.durations['downshift'] +
    selectedTemplate.durations['recovery'];

  const handleStart = () => {
    if (!topic.trim()) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    onStart(selectedTemplate, {
      topic: topic.trim(),
      subTopic: subTopic.trim() || undefined,
      taskType,
      goal: goal.trim() || undefined,
      preSessionEnergy,
    });
  };

  const handleAddChip = async () => {
    if (!newChipName.trim()) return;
    await addChip(newChipName.trim());
    setTopic(newChipName.trim());
    setNewChipName('');
    setShowNewChipModal(false);
    setSetupStep(2);
  };

  const cyclesToday = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return records.filter((rec) => rec.completed && rec.createdAt.split('T')[0] === today).length;
  }, [records]);

  // Initial View
  if (!isSetupStarted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 min-h-[50vh]">
        <button
          onClick={() => setIsSetupStarted(true)}
          className="group relative flex flex-col items-center justify-center transition-all hover:scale-105"
        >
          <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping opacity-30 pointer-events-none" />
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-primary via-primary to-secondary flex items-center justify-center shadow-2xl shadow-primary/50 relative overflow-hidden group-hover:shadow-primary/70 transition-shadow">
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="text-4xl md:text-5xl font-bold text-primary-content tracking-wider uppercase">
              Start
            </span>
          </div>
          <div className="mt-8 text-center">
            <p className="text-xl text-base-content/70 font-medium tracking-wide">
              Ready to focus?
            </p>
            {cyclesToday > 0 && (
              <p className="text-sm text-base-content/40 mt-2 font-medium">
                ({cyclesToday} {cyclesToday === 1 ? 'cycle' : 'cycles'} done today)
              </p>
            )}
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-200">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-base-content mb-2">
          {setupStep === 1 ? 'What are we doing?' : 'Any specifics?'}
        </h1>
        <div className="flex justify-center gap-1 mt-4">
          <div className={`h-1.5 w-12 rounded-full transition-colors ${setupStep >= 1 ? 'bg-primary' : 'bg-base-300'}`} />
          <div className={`h-1.5 w-12 rounded-full transition-colors ${setupStep >= 2 ? 'bg-primary' : 'bg-base-300'}`} />
        </div>
      </div>

      <div className="card bg-base-100 border border-base-300 shadow-xl p-6 w-full relative overflow-visible">
        {setupStep === 1 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setTopic(chip);
                    setSetupStep(2);
                  }}
                  className={`btn btn-md capitalize ${topic === chip ? 'btn-primary' : 'btn-outline border-base-300'}`}
                >
                  {chip}
                </button>
              ))}
              <button
                onClick={() => setShowNewChipModal(true)}
                className="btn btn-md btn-dashed border-2 flex items-center gap-2 hover:border-primary hover:text-primary transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                Add New
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary badge-lg gap-2 pr-1">
                {topic}
                <button onClick={() => setSetupStep(1)} className="hover:bg-primary-focus rounded-full p-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
                </button>
              </span>
            </div>

            <div className="form-control w-full">
              {!showSubTopicInput ? (
                <button
                  onClick={() => setShowSubTopicInput(true)}
                  className="flex items-center gap-2 text-base-content/40 hover:text-primary transition-colors text-sm font-medium"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                  Tag your task
                </button>
              ) : (
                <>
                  <label className="label">
                    <span className="label-text font-medium text-base-content/60">Tag your task</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Learning linear algebra"
                    className="input input-bordered input-lg w-full focus:input-primary transition-all"
                    value={subTopic}
                    onChange={(e) => setSubTopic(e.target.value)}
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <button
                className="btn btn-primary btn-lg w-full shadow-lg shadow-primary/20"
                onClick={handleStart}
              >
                Start Focus Session
              </button>
              <button
                className="btn btn-ghost btn-sm text-base-content/40"
                onClick={() => setSetupStep(1)}
              >
                Go Back
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 w-full flex justify-between items-center px-2">
        <button
          onClick={() => setShowAdvanced(true)}
          className="btn btn-ghost btn-xs gap-2 text-base-content/40 hover:text-primary transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
          Advanced Options
        </button>
        <div className="text-[10px] uppercase tracking-widest text-base-content/30 font-bold">
          {selectedTemplate.name} • {formatMinutes(totalDuration)}
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showNewChipModal} onClose={() => setShowNewChipModal(false)} title="Add New Category">
        <div className="space-y-4 pt-2">
          <Input
            label="Category Name"
            placeholder="e.g. Learning, Deep Work..."
            value={newChipName}
            onChange={(e) => setNewChipName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && handleAddChip()}
          />
          <div className="flex gap-2 justify-end">
            <button className="btn btn-ghost" onClick={() => setShowNewChipModal(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleAddChip} disabled={!newChipName.trim()}>Add Category</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAdvanced} onClose={() => setShowAdvanced(false)} title="Session Options" size="lg">
        <div className="space-y-5">
          <Select
            label="Cycle Template"
            options={DEFAULT_TEMPLATES.map(t => ({ value: t.id, label: t.name }))}
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Task Type"
              options={Object.entries(TASK_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
              value={taskType}
              onChange={(e) => setTaskType(e.target.value as TaskType)}
            />
            <div className="form-control w-full">
              <label className="label"><span className="label-text">Duration</span></label>
              <div className="px-1 py-2 text-base-content/70 text-sm">
                {formatMinutes(totalDuration)} ({formatMinutes(selectedTemplate.durations['peak'])} focus)
              </div>
            </div>
          </div>
          <div className="divider my-0 opacity-50"></div>
          <Input label="Session Goal (optional)" placeholder="Specific outcome" value={goal} onChange={(e) => setGoal(e.target.value)} />
          <EnergySlider value={preSessionEnergy} onValueChange={setPreSessionEnergy} label="Current Energy Level" />

          {showSuggestion && suggestion && (
            <div className="alert alert-info shadow-md border-none bg-info/10 text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div className="flex-1">
                <p className="text-sm font-medium">{suggestion.message}</p>
                <p className="text-xs mt-0.5 opacity-80">Suggested: <strong>{suggestedTemplate.name}</strong></p>
              </div>
              <button className="btn btn-xs btn-info text-info-content" onClick={() => setSelectedTemplateId(suggestedTemplate.id)}>Apply</button>
            </div>
          )}
          <div className="modal-action">
            <button className="btn btn-primary" onClick={() => setShowAdvanced(false)}>Done</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} title="Sign in to Start" size="md">
        <div className="text-center py-6">
          <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <h3 className="text-xl font-bold mb-2">Sign in Required</h3>
          <p className="text-base-content/60 mb-8">Please sign in with Google to save your focus sessions and track your progress.</p>
          <button className="btn btn-primary btn-block gap-2" onClick={async () => { await signInWithGoogle(); setShowAuthModal(false); }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>
        </div>
      </Modal>

      <div className="mt-12 w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-[11px] text-base-content/30 leading-relaxed">
        <div className="flex gap-2 items-start"><span className="text-primary/40 font-bold">•</span><p><span className="font-semibold text-base-content/50">1–3 cycles daily:</span> Peak focus is a finite resource. Don't overspend it.</p></div>
        <div className="flex gap-2 items-start"><span className="text-primary/40 font-bold">•</span><p><span className="font-semibold text-base-content/50">Stop early if needed:</span> Drowsiness is your brain asking for recovery. Don't push through.</p></div>
      </div>
    </div>
  );
}
