import NotesClient from './Notes.client';
import { fetchNotes, FetchNoteResponse } from '@/lib/api';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function NotesPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const tag = slug[0] ?? 'All';
  const initialSSearch = '';
  const initialPage = 1;

  const initialData: FetchNoteResponse = await fetchNotes(
    tag,
    initialSSearch,
    initialPage
  );

  return (
    <NotesClient
      tag={tag}
      initialData={initialData}
      initialPage={initialPage}
    />
  );
}
