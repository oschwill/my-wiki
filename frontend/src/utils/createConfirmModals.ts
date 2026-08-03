import { ConfirmModalConfig } from '../components/modal/ConfirmModalRenderer';

interface CreateConfirmModalsProps {
  showSaveConfirm: boolean;
  setShowSaveConfirm: (value: boolean) => void;

  showResetConfirm: boolean;
  setShowResetConfirm: (value: boolean) => void;

  showDeleteCommentConfirm: boolean;
  setShowDeleteCommentConfirm: (value: boolean) => void;

  showAddCommentConfirm: boolean;
  setShowAddCommentConfirm: (value: boolean) => void;

  handleForeignSave: () => void;
  handleReset: () => void;
  handleDeleteComment: () => void;
  confirmAddComment: () => void;
}

export const createConfirmModals = ({
  showSaveConfirm,
  setShowSaveConfirm,
  showResetConfirm,
  setShowResetConfirm,
  showDeleteCommentConfirm,
  setShowDeleteCommentConfirm,
  showAddCommentConfirm,
  setShowAddCommentConfirm,
  handleForeignSave,
  handleReset,
  handleDeleteComment,
  confirmAddComment,
}: CreateConfirmModalsProps): ConfirmModalConfig[] => [
  {
    show: showSaveConfirm,
    onClose: () => setShowSaveConfirm(false),
    title: 'Artikel speichern',
    body: 'Möchtest du diesen Artikel wirklich speichern?',
    confirmText: 'Speichern',
    confirmVariant: 'success',
    onConfirm: handleForeignSave,
  },
  {
    show: showResetConfirm,
    onClose: () => setShowResetConfirm(false),
    title: 'Formular zurücksetzen',
    body: 'Möchtest du alle Eingaben wirklich verwerfen?',
    confirmText: 'Zurücksetzen',
    confirmVariant: 'warning',
    onConfirm: handleReset,
  },
  {
    show: showDeleteCommentConfirm,
    onClose: () => setShowDeleteCommentConfirm(false),
    title: 'Kommentar löschen',
    body: 'Möchtest du diesen Kommentar wirklich löschen?',
    confirmText: 'Löschen',
    confirmVariant: 'danger',
    onConfirm: handleDeleteComment,
  },
  {
    show: showAddCommentConfirm,
    onClose: () => setShowAddCommentConfirm(false),
    title: 'Kommentar erstellen',
    body: 'Möchtest du diesen Kommentar wirklich erstellen?',
    confirmText: 'Erstellen',
    confirmVariant: 'success',
    onConfirm: confirmAddComment,
  },
];
