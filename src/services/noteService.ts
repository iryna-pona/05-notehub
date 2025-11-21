import axios from "axios";
import type { Note, NoteTag } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

export interface FetchNotesParams {
  search?: string;
  tag?: string;
  page?: number;
  perPage?: number;
  sortBy?: "created" | "updated";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CreateNoteParams {
  title: string;
  content: string;
  tag: NoteTag;
}

export default async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  if (!token) {
    throw new Error("Invalid token");
  }

  const response = await axios.get<FetchNotesResponse>(`${BASE_URL}/notes`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function createNote(data: CreateNoteParams): Promise<Note> {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const response = await axios.post<Note>(`${BASE_URL}/notes`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;

  const response = await axios.delete<Note>(`${BASE_URL}/notes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}
