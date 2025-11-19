import { createPortal } from "react-dom";
import { useEffect, type MouseEvent } from "react";
import type { Note } from "../types/note";
import css from "./Modal.module.css";

interface ModalProps {
  note: Note;
  onClose: () => void;
}

export default function Modal({ note, onClose }: ModalProps) {
  const { title, overview, release_date, vote_average, poster_path } = note;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className={css.modal}>{/* */}</div>
    </div>,
    document.body
  );
}
