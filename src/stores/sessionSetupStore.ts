import { create } from 'zustand';
import type { SessionTags } from '../types/record';

interface SessionSetupState {
  prefillTags: SessionTags | null;
}

interface SessionSetupActions {
  setPrefillTags: (tags: SessionTags | null) => void;
  clearPrefillTags: () => void;
}

export const useSessionSetupStore = create<SessionSetupState & SessionSetupActions>()(
  (set) => ({
    prefillTags: null,

    setPrefillTags: (tags) => {
      set({ prefillTags: tags });
    },

    clearPrefillTags: () => {
      set({ prefillTags: null });
    },
  })
);

export const selectPrefillTags = (state: SessionSetupState & SessionSetupActions) => state.prefillTags;
