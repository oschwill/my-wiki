import React from 'react';
import { Modal, Button } from 'react-bootstrap';

type ConfirmModalProps = {
  show: boolean;
  onClose: () => void;
  title: string;
  body: React.ReactNode | string;

  confirmText?: string;
  cancelText?: string;

  onConfirm?: () => void;
  confirmVariant?: 'primary' | 'danger' | 'success' | 'warning';

  linkText?: string;
  onLinkClick?: () => void;
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  onClose,
  title,
  body,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  onConfirm,
  confirmVariant = 'primary',
  linkText,
  onLinkClick,
}) => {
  return (
    <Modal show={show} onHide={onClose} backdrop="static" keyboard={false} style={{ zIndex: 1101 }}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{body}</Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          {cancelText}
        </Button>

        {onLinkClick && linkText && (
          <Button variant="info" onClick={onLinkClick}>
            {linkText}
          </Button>
        )}

        {onConfirm && (
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmText}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
