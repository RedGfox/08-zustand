import { fetchNoteById } from '@/lib/api';
import ModalWrapper from './NotePreview.client';
import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query';

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NoteModalPage({ params }: NotePageProps) {
  const { id } = await params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <ModalWrapper noteId={id} />
    </HydrationBoundary>
  );
}
