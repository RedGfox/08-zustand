'use client';

import css from './NotePage.module.css';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Toaster } from 'react-hot-toast';
import Link from 'next/link';

import { Note } from '@/types/note';
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import { ErrorMessage } from '@/components/ErrorMessage/ErrorMessage';
import { ErrorMessageEmpty } from '@/components/ErrorMessageEmpty/ErrorMessageEmpty';
import NoteList from '@/components/NoteList/NoteList';
// import { Modal } from '@/components/Modal/Modal';
// import { NoteForm } from '@/components/NoteForm/NoteForm';
import { fetchNotes } from '@/lib/api';
import { SearchBox } from '@/components/SearchBox/SearchBox';

interface NotesClientProps {
  tag: string;
  initialData: {
    notes: Note[];
    totalPages: number;
  };
  initialPage: number;
}

export default function NotesClient({
  initialData,
  tag,
  initialPage,
}: NotesClientProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [searchQuery, setSearchQuery] = useState('');
  // const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
    setSearchQuery('');
  }, [tag]);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['notes', tag, searchQuery, currentPage],
    queryFn: () => fetchNotes(tag, searchQuery, currentPage),
    placeholderData: keepPreviousData,
    initialData:
      tag === initialData.notes[0]?.tag &&
      searchQuery === '' &&
      currentPage === initialPage
        ? initialData
        : undefined,
    refetchOnMount: false,
  });

  const totalPages = data?.totalPages ?? 0;

  // const handleCreateNote = () => {
  //   setIsOpenModal(true);
  // };

  // const handleCloseModal = () => setIsOpenModal(false);

  const handleChange = useDebouncedCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 1000);
  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox onChange={handleChange} />
        {isSuccess && totalPages > 1 && (
          <Pagination
            page={currentPage}
            total={totalPages}
            onChange={setCurrentPage}
          />
        )}
        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      <Toaster position="top-right" />
      {isSuccess && data?.notes.length === 0 && <ErrorMessageEmpty />}
      {isSuccess && data.notes.length > 0 && <NoteList notes={data.notes} />}
      {/* {isOpenModal && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )} */}
    </div>
  );
}
