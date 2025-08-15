import NotesClient from './Notes.client';
import { fetchNotes, FetchNoteResponse } from '@/lib/api';
import { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const { slug = [] } = await params;
  const tag = slug[0] ?? 'All';
  const pageTitle = `Notes-${tag}`;
  const pageDescription = `All notes with tags ${tag}.`;
  const pageUrl = `https://08-zustand-woad-chi.vercel.app/notes/filter/${slug.join('/') || ''}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 800,
          height: 600,
          alt: `Notes tagged with ${tag}`,
        },
      ],
    },
  };
};

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
