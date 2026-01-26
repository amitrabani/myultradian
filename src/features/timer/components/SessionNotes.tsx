import { useState } from 'react';
import { useNotesStore } from '../../../stores/notesStore';
import { Button } from '../../../components/common/Button';
import type { SessionNote } from '../../../types/record';

interface SessionNotesProps {
  recordId: string;
  readOnly?: boolean;
}

export function SessionNotes({ recordId, readOnly = false }: SessionNotesProps) {
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const notes = useNotesStore((state) => state.getNotesForRecord(recordId));
  const addNote = useNotesStore((state) => state.addNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const deleteNote = useNotesStore((state) => state.deleteNote);

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(recordId, newNote.trim());
      setNewNote('');
    }
  };

  const handleStartEdit = (note: SessionNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingId && editContent.trim()) {
      updateNote(editingId, editContent.trim());
      setEditingId(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleAddNote();
    }
  };

  return (
    <div className="session-notes">
      <div className="session-notes-header">
        <h4 className="session-notes-title">
          <NoteIcon />
          Session Notes
        </h4>
        {notes.length > 0 && (
          <span className="session-notes-count">{notes.length}</span>
        )}
      </div>

      {!readOnly && (
        <div className="session-notes-input">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="What did you learn? Any insights or reflections..."
            rows={3}
          />
          <div className="session-notes-input-footer">
            <span className="session-notes-hint">Cmd/Ctrl + Enter to save</span>
            <Button
              size="sm"
              onClick={handleAddNote}
              disabled={!newNote.trim()}
            >
              Add Note
            </Button>
          </div>
        </div>
      )}

      {notes.length > 0 && (
        <div className="session-notes-list">
          {notes.map((note) => (
            <div key={note.id} className="session-note">
              {editingId === note.id ? (
                <div className="session-note-edit">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    autoFocus
                  />
                  <div className="session-note-edit-actions">
                    <Button size="sm" onClick={handleSaveEdit}>
                      Save
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="session-note-content">{note.content}</p>
                  <div className="session-note-footer">
                    <time className="session-note-time">
                      {formatNoteTime(note.createdAt)}
                    </time>
                    {!readOnly && (
                      <div className="session-note-actions">
                        <button
                          onClick={() => handleStartEdit(note)}
                          className="session-note-action"
                          aria-label="Edit note"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="session-note-action delete"
                          aria-label="Delete note"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {notes.length === 0 && readOnly && (
        <p className="session-notes-empty">No notes for this session.</p>
      )}
    </div>
  );
}

function formatNoteTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function NoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" strokeLinejoin="round" />
      <polyline points="10 9 9 9 8 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
