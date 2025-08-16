import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FormValues } from '@/types/note';

const initialDraft: FormValues = {
  title: '',
  content: '',
  tag: 'Todo',
};

interface NoteStore {
  draft: FormValues;
  setDraft: (draft: Partial<FormValues>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    set => ({
      draft: initialDraft,
      setDraft: note => set(state => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'note-draft',
    }
  )
);
