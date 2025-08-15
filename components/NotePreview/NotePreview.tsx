'use client';

import css from './NotePreview.module.css';
import { useRouter } from 'next/navigation';
import { Note } from '@/types/note';

interface NotePreviewProps {
  note: Note;
}

export default function NotePreview({ note }: NotePreviewProps) {
  const router = useRouter();

  return (
    <div className={css.container}>
      <button className={css.backBtn} onClick={() => router.back()}>
        ← Back
      </button>

      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
          <span className={css.tag}>{note.tag}</span>
        </div>

        <p className={css.content}>{note.content}</p>

        <div className={css.date}>
          {new Date(note.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
}
