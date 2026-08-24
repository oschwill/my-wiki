import React, { useState } from 'react';
import { Button, Card, Form, Spinner } from 'react-bootstrap';
import { fetchFromApi } from '../../utils/fetchData';
import { useToast } from '../../context/ToastContext';
import { useTranslation } from '../../hooks/hookHelper';
import ConfirmModal from '../modal/ConfirmModal';

interface ProfileMessageBoxProps {
  userName: string;
  recipientId: string;
  firstName: string;
}

const MAX_PROFILE_MESSAGE_LENGTH = 750;
const PROFILE_MESSAGE_WARNING = 50;

const ProfileMessageBox: React.FC<ProfileMessageBoxProps> = ({
  userName,
  recipientId,
  firstName,
}) => {
  const { trans } = useTranslation();
  const showToast = useToast();

  const [message, setMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleOpenConfirmModal = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      showToast(trans('my_wiki.user_profile.message_box.empty_message'), 'warning');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleCloseConfirmModal = () => {
    if (sendingMessage) {
      return;
    }

    setShowConfirmModal(false);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setShowConfirmModal(false);

      showToast(trans('my_wiki.user_profile.message_box.empty_message'), 'warning');

      return;
    }

    if (trimmedMessage.length > MAX_PROFILE_MESSAGE_LENGTH) {
      return;
    }

    setSendingMessage(true);

    try {
      const res = await fetchFromApi('/api/v1/user/send-message', 'POST', {
        recipientId,
        message: trimmedMessage,
      });

      if (res.success) {
        showToast(
          trans('my_wiki.user_profile.message_box.send_success', {
            userName,
          }),
          'success',
        );

        setMessage('');
        setShowConfirmModal(false);
      } else {
        showToast(
          res.error?.code
            ? trans(`my_wiki.user_profile.errors.${res.error.code}`)
            : trans('my_wiki.user_profile.message_box.send_failed'),
          'error',
        );
      }
    } catch (error) {
      console.error('Error sending profile message:', error);

      showToast(trans('my_wiki.user_profile.message_box.send_failed'), 'error');
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <>
      <Card className="shadow-sm mt-4">
        <Card.Body>
          <Form.Group className="mb-2">
            <Form.Label>
              {trans('my_wiki.user_profile.message_box.label', {
                firstName,
              })}
            </Form.Label>

            <Form.Control
              as="textarea"
              rows={4}
              maxLength={MAX_PROFILE_MESSAGE_LENGTH}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={trans('my_wiki.user_profile.message_box.placeholder')}
              disabled={sendingMessage}
            />

            <div
              className={`text-end small mt-1 ${
                message.length > MAX_PROFILE_MESSAGE_LENGTH - PROFILE_MESSAGE_WARNING
                  ? 'text-danger'
                  : 'text-muted'
              }`}
            >
              {trans('my_wiki.user_profile.message_box.possible_characters', {
                contentLength: message.length,
                maxContentLength: MAX_PROFILE_MESSAGE_LENGTH,
              })}
            </div>
          </Form.Group>

          <Button
            size="sm"
            variant="primary"
            onClick={handleOpenConfirmModal}
            disabled={sendingMessage || !message.trim()}
          >
            {trans('my_wiki.user_profile.message_box.button')}
          </Button>
        </Card.Body>
      </Card>

      <ConfirmModal
        show={showConfirmModal}
        onClose={handleCloseConfirmModal}
        title={trans('my_wiki.user_profile.message_box.confirm.title')}
        body={
          <>
            <p>
              {trans('my_wiki.user_profile.message_box.confirm.text', {
                userName,
              })}
            </p>

            <div className="border rounded bg-light p-3">
              <div className="text-break" style={{ whiteSpace: 'pre-line' }}>
                {message.trim()}
              </div>
            </div>
          </>
        }
        confirmText={trans('my_wiki.user_profile.message_box.confirm.confirm_text')}
        cancelText={trans('my_wiki.user_profile.message_box.confirm.cancel_text')}
        confirmVariant="primary"
        onConfirm={handleSendMessage}
      />

      {sendingMessage && (
        <div className="text-center mt-2">
          <Spinner size="sm" animation="border" />
        </div>
      )}
    </>
  );
};

export default ProfileMessageBox;
