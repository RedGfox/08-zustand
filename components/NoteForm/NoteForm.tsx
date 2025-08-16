'use client';

import { useId, useState } from 'react';
import { NoteTag } from '@/types/note';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import toast from 'react-hot-toast';
import css from './NoteForm.module.css';
import { useNoteStore } from '@/lib/store/noteStore';
import { useRouter } from 'next/navigation';
import { Note } from '@/types/note';

interface NotesQueryData {
  notes: Note[];
  totalPages: number;
}

export function NoteForm() {
  const fieldId = useId();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { draft, setDraft, clearDraft } = useNoteStore();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: createNote,
    onSuccess: data => {
      queryClient.setQueryData<NotesQueryData>(
        ['notes', 'All', '', 1],
        oldData => {
          if (!oldData) return oldData;
          return { ...oldData, notes: [data, ...oldData.notes] };
        }
      );
      queryClient.setQueryData<NotesQueryData>(
        ['notes', data.tag, '', 1],
        oldData => {
          if (!oldData) return oldData;
          return { ...oldData, notes: [data, ...oldData.notes] };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['notes'], exact: false });
      toast.success(`Note "${data.title}" created.`);
      clearDraft();
      router.push('/notes/filter/All');
    },
    onError: () => {
      toast.error(`Failed to create note.`);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    mutation.mutate(draft);
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-title`}>Title</label>
        <input
          id={`${fieldId}-title`}
          name="title"
          type="text"
          className={css.input}
          required
          minLength={3}
          maxLength={50}
          value={draft.title}
          onChange={e => setDraft({ ...draft, title: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-content`}>Content</label>
        <textarea
          id={`${fieldId}-content`}
          name="content"
          rows={8}
          className={css.textarea}
          maxLength={500}
          value={draft.content}
          onChange={e => setDraft({ ...draft, content: e.target.value })}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor={`${fieldId}-tag`}>Tag</label>
        <select
          id={`${fieldId}-tag`}
          name="tag"
          className={css.select}
          required
          value={draft.tag}
          onChange={e => setDraft({ ...draft, tag: e.target.value as NoteTag })}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Create note'}
        </button>
        <button
          type="button"
          className={css.cancelButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
