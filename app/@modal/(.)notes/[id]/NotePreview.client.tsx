'use client';

import { useRouter } from 'next/navigation';
import NotePreview from '@/components/NotePreview/NotePreview';
import { Modal } from '@/components/Modal/Modal';
import { useQuery } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';

interface ModalWrapperProps {
  noteId: string;
}

export default function ModalWrapper({ noteId }: ModalWrapperProps) {
  const router = useRouter();

  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
    refetchOnMount: false,
  });

  const handleClose = () => {
    router.back();
  };

  if (isLoading) return <Modal onClose={handleClose}>Loading...</Modal>;
  if (isError || !note)
    return <Modal onClose={handleClose}>Error loading note</Modal>;

  return (
    <Modal onClose={handleClose}>
      <NotePreview note={note} />
    </Modal>
  );
}
