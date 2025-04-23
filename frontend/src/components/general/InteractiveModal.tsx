import { MouseEventHandler } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface InteractiveModalProps {
  showModal: boolean;
  handleCloseModal: () => void;
  handlePasswordReset: MouseEventHandler<HTMLButtonElement>;
  title: string;
  cancelTitle: string;
  triggerTitle: string;
  children: React.ReactNode;
}

const InteractiveModal: React.FC<InteractiveModalProps> = ({
  showModal,
  handleCloseModal,
  handlePasswordReset,
  title,
  cancelTitle,
  triggerTitle,
  children,
}) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          {cancelTitle}
        </Button>
        <Button variant="primary" onClick={handlePasswordReset}>
          {triggerTitle}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InteractiveModal;
