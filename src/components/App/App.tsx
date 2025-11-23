import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import fetchNotes, { createNote, deleteNote } from "../../services/noteService";
import type { FetchNotesResponse } from "../../services/noteService";
import NoteList from "../NoteList/NoteList";
import NoteForm from "../NoteForm/NoteForm";
import type { NoteFormValues } from "../NoteForm/NoteForm";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import Pagination from "../Pagination/Pagination";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { useDebounce } from "use-debounce";
import css from "./App.module.css";

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [debouncedSearch] = useDebounce(search, 500);
  const queryClient = useQueryClient();

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  
  const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
    queryKey: ["notes", debouncedSearch, page],
    queryFn: () => fetchNotes({ search: debouncedSearch, page }),
    placeholderData: (prev) => prev,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;
    await deleteNote(id);
    queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
  };


  const handleCreate = async (values: NoteFormValues) => {
    await createNote(values);
    queryClient.invalidateQueries({ queryKey: ["notes"], exact: false });
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={handleSearch} />
        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {data?.notes && <NoteList notes={data.notes} onDelete={handleDelete} />}

      {data?.totalPages && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

