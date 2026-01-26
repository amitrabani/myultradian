import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  FocusRecord,
  RecordFilters,
  RecordSort,
  SelfReport,
  SessionTags,
  DistractionLog,
  EarlyStopReason,
  RecoveryOutcome,
  RecoveryActivity,
  FrictionLevel,
  MomentumExtension,
} from '../types/record';
import type { CycleStage, StageDuration } from '../types/cycle';
import { STORAGE_KEYS } from '../utils/constants';
import { calculateRecordDuration } from '../utils/statistics';

interface RecordsState {
  records: FocusRecord[];
  filters: RecordFilters;
  sort: RecordSort;
}

interface RecordsActions {
  // CRUD
  addRecord: (record: Omit<FocusRecord, 'id'>) => string;
  updateRecord: (id: string, updates: Partial<FocusRecord>) => void;
  deleteRecord: (id: string) => void;
  deleteRecords: (ids: string[]) => void;

  // Duplicate
  duplicateRecord: (id: string) => SessionTags | null;

  // Helpers for creating records
  createRecordFromSession: (params: {
    templateId: string;
    templateName: string;
    plannedDurations: StageDuration;
    actualDurations: Partial<StageDuration>;
    tags: SessionTags;
    completed: boolean;
    endedAtStage?: CycleStage | null;
    // Enhanced tracking
    distractions?: DistractionLog[];
    skippedStages?: CycleStage[];
    stageNotes?: Partial<Record<CycleStage, string>>;
    earlyStopReason?: EarlyStopReason;
    midPeakCheckpoint?: boolean;
    recoveryOutcome?: RecoveryOutcome;
    // Momentum & Friction
    momentumExtension?: MomentumExtension;
    recoveryActivities?: RecoveryActivity[];
    frictionLevel?: FrictionLevel;
    pauseCount?: number;
  }) => string;

  // Self-report
  addSelfReport: (recordId: string, report: SelfReport) => void;

  // Filtering and sorting
  setFilters: (filters: RecordFilters) => void;
  setSort: (sort: RecordSort) => void;
  clearFilters: () => void;

  // Computed
  getFilteredRecords: () => FocusRecord[];
  getUniqueTopics: () => string[];
}

const initialState: RecordsState = {
  records: [],
  filters: {},
  sort: { field: 'createdAt', direction: 'desc' },
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useRecordsStore = create<RecordsState & RecordsActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      addRecord: (record) => {
        const id = generateId();
        const newRecord: FocusRecord = { ...record, id };
        set((state) => ({
          records: [...state.records, newRecord],
        }));
        return id;
      },

      updateRecord: (id, updates) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        }));
      },

      deleteRecord: (id) => {
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        }));
      },

      deleteRecords: (ids) => {
        const idSet = new Set(ids);
        set((state) => ({
          records: state.records.filter((r) => !idSet.has(r.id)),
        }));
      },

      duplicateRecord: (id) => {
        const { records } = get();
        const record = records.find((r) => r.id === id);
        if (!record) return null;

        // Return the tags to pre-fill a new session
        return {
          topic: record.tags.topic,
          taskType: record.tags.taskType,
          goal: record.tags.goal,
          intention: record.tags.intention,
          preSessionEnergy: record.tags.preSessionEnergy,
        };
      },

      createRecordFromSession: (params) => {
        const id = generateId();
        const now = new Date().toISOString();

        const newRecord: FocusRecord = {
          id,
          createdAt: now,
          completedAt: params.completed ? now : undefined,
          templateId: params.templateId,
          templateName: params.templateName,
          plannedDurations: params.plannedDurations,
          actualDurations: params.actualDurations,
          completed: params.completed,
          endedEarly: !params.completed,
          endedAtStage: params.endedAtStage || undefined,
          tags: params.tags,
          // Enhanced tracking
          distractions: params.distractions,
          skippedStages: params.skippedStages,
          stageNotes: params.stageNotes,
          earlyStopReason: params.earlyStopReason,
          midPeakCheckpoint: params.midPeakCheckpoint,
          recoveryOutcome: params.recoveryOutcome,
          // Momentum & Friction
          momentumExtension: params.momentumExtension,
          recoveryActivities: params.recoveryActivities,
          frictionLevel: params.frictionLevel,
          pauseCount: params.pauseCount,
        };

        set((state) => ({
          records: [...state.records, newRecord],
        }));

        return id;
      },

      addSelfReport: (recordId, report) => {
        set((state) => ({
          records: state.records.map((r) =>
            r.id === recordId ? { ...r, selfReport: report } : r
          ),
        }));
      },

      setFilters: (filters) => {
        set({ filters });
      },

      setSort: (sort) => {
        set({ sort });
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      getFilteredRecords: () => {
        const { records, filters, sort } = get();
        let filtered = [...records];

        // Apply filters
        if (filters.dateRange) {
          const start = new Date(filters.dateRange.start).getTime();
          const end = new Date(filters.dateRange.end).getTime() + 24 * 60 * 60 * 1000;
          filtered = filtered.filter((r) => {
            const recordDate = new Date(r.createdAt).getTime();
            return recordDate >= start && recordDate < end;
          });
        }

        if (filters.taskTypes && filters.taskTypes.length > 0) {
          filtered = filtered.filter((r) =>
            filters.taskTypes!.includes(r.tags.taskType)
          );
        }

        if (filters.topics && filters.topics.length > 0) {
          filtered = filtered.filter((r) =>
            filters.topics!.includes(r.tags.topic)
          );
        }

        if (filters.completedOnly) {
          filtered = filtered.filter((r) => r.completed);
        }

        // Apply sorting
        filtered.sort((a, b) => {
          let comparison = 0;

          switch (sort.field) {
            case 'createdAt':
              comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
              break;
            case 'topic':
              comparison = a.tags.topic.localeCompare(b.tags.topic);
              break;
            case 'taskType':
              comparison = a.tags.taskType.localeCompare(b.tags.taskType);
              break;
            case 'energyLevel':
              comparison = (a.selfReport?.energyLevel || 0) - (b.selfReport?.energyLevel || 0);
              break;
            case 'totalDuration':
              comparison = calculateRecordDuration(a) - calculateRecordDuration(b);
              break;
          }

          return sort.direction === 'asc' ? comparison : -comparison;
        });

        return filtered;
      },

      getUniqueTopics: () => {
        const { records } = get();
        const topics = new Set(records.map((r) => r.tags.topic));
        return Array.from(topics).filter(Boolean).sort();
      },
    }),
    {
      name: STORAGE_KEYS.RECORDS,
    }
  )
);

// Selectors
export const selectRecords = (state: RecordsState & RecordsActions) => state.records;
export const selectFilters = (state: RecordsState & RecordsActions) => state.filters;
export const selectSort = (state: RecordsState & RecordsActions) => state.sort;
