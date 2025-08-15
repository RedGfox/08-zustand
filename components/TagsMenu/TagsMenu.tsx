'use client';

import css from './TagsMenu.module.css';
import Link from 'next/link';
import { Note } from '@/types/note';
import { useState } from 'react';

const tags: Note['tag'][] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

export default function TagsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const handleClose = () => setIsOpen(false);

  return (
    <div className={css.menuContainer}>
      <button
        className={css.menuButton}
        onClick={() => setIsOpen(prev => !prev)}
      >
        Notes ▾
      </button>
      {isOpen && (
        <ul className={css.menuList}>
          <li className={css.menuItem}>
            <Link
              href="/notes/filter/All"
              className={css.menuLink}
              onClick={handleClose}
            >
              All notes
            </Link>
          </li>
          {tags.map(tag => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={`/notes/filter/${encodeURIComponent(tag)}`}
                className={css.menuLink}
                onClick={handleClose}
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
