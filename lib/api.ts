import axios from 'axios';
import type { Note } from '@/types/note';

const BASE_URL = 'https://notehub-public.goit.study/api';
const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export interface FetchNoteResponse {
  notes: Note[];
  totalPages: number;
}

interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}

export const fetchNotes = async (
  tag: string = 'All',
  search: string,
  page: number = 1,
  perPage: number = 12
): Promise<FetchNoteResponse> => {
  const params: FetchNotesParams & { tag?: string } = { page, perPage };

  if (tag && tag !== 'All') {
    params.tag = tag;
  }

  if (search?.trim()) {
    params.search = search;
  }
  const response = await instance.get<FetchNoteResponse>(`/notes`, {
    params,
  });
  return response.data;
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: Note['tag'];
}): Promise<Note> => {
  const response = await instance.post<Note>('/notes', noteData);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
};

export const fetchNoteById = async (id: string): Promise<Note | null> => {
  try {
    const response = await instance.get<Note>(`/notes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch note by ID:', error);
    return null;
  }
};
