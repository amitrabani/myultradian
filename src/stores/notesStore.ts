import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SessionNote } from '../types/record';
import { STORAGE_KEYS } from '../utils/constants';

interface NotesState {
  notes: SessionNote[];
}

interface NotesActions {
  addNote: (recordId: string, content: string, tags?: string[]) => string;
  updateNote: (id: string, content: string) => void;
  deleteNote: (id: string) => void;
  getNotesForRecord: (recordId: string) => SessionNote[];
  getAllTags: () => string[];
  searchNotes: (query: string) => SessionNote[];
}

function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const useNotesStore = create<NotesState & NotesActions>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (recordId, content, tags) => {
        const id = generateId();
        const newNote: SessionNote = {
          id,
          recordId,
          content,
          createdAt: new Date().toISOString(),
          tags: tags || [],
        };

        set((state) => ({
          notes: [...state.notes, newNote],
        }));

        return id;
      },

      updateNote: (id, content) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, content } : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      getNotesForRecord: (recordId) => {
        const { notes } = get();
        return notes
          .filter((note) => note.recordId === recordId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      },

      getAllTags: () => {
        const { notes } = get();
        const tags = new Set<string>();
        notes.forEach((note) => {
          note.tags?.forEach((tag) => tags.add(tag));
        });
        return Array.from(tags).sort();
      },

      searchNotes: (query) => {
        const { notes } = get();
        const lowerQuery = query.toLowerCase();
        return notes.filter(
          (note) =>
            note.content.toLowerCase().includes(lowerQuery) ||
            note.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      },
    }),
    {
      name: STORAGE_KEYS.NOTES,
    }
  )
);

// Selectors
export const selectNotes = (state: NotesState & NotesActions) => state.notes;
