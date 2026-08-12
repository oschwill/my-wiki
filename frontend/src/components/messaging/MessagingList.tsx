import React, { useEffect, useState } from 'react';
import { Alert, ListGroup, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchFromApi } from '../../utils/fetchData';
import { useTranslation } from '../../hooks/hookHelper';

interface Sender {
  _id: string;
  username: string;
  userHash: string;
}

interface Messaging {
  _id: string;
  sender: Sender | null;
  type: string;
  titleKey: string;
  messageKey: string;
  message: string | null;
  messageParams: Record<string, string | number>;
  article: string | null;
  comment: string | null;
  articleUrl: string | null;
  read: boolean;
  createdAt: string;
}

const MessagingList: React.FC = () => {
  const { trans } = useTranslation();

  const [messages, setMessages] = useState<Messaging[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetchFromApi('/api/v1/messaging/my-messages', 'GET', null);

        if (response?.success) {
          setMessages(response.data || []);
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const markAsRead = async (message: Messaging) => {
    if (message.read) {
      return;
    }

    try {
      const response = await fetchFromApi(`/api/v1/messaging/${message._id}/read`, 'PATCH', null);

      if (response?.success) {
        setMessages((currentMessages) =>
          currentMessages.map((currentMessage) =>
            currentMessage._id === message._id ? { ...currentMessage, read: true } : currentMessage,
          ),
        );
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(new Date(date));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <>
        <Alert variant="info">
          <h4>{trans('my_wiki.components.messaging_list.headline')}</h4>
          <p>{trans('my_wiki.components.messaging_list.text')}</p>
        </Alert>
        <Alert variant="light" className="mt-3">
          {trans('my_wiki.components.messaging_list.my_inquiries.no_messages')}
        </Alert>
      </>
    );
  }

  return (
    <ListGroup>
      <Alert variant="info">
        <h4>{trans('my_wiki.components.messaging_list.headline')}</h4>
        <p>{trans('my_wiki.components.messaging_list.text')}</p>
      </Alert>
      {messages.map((message) => (
        <ListGroup.Item
          key={message._id}
          className={`p-0 ${message.read ? '' : 'bg-light fw-semibold'}`}
        >
          <div className="d-flex" style={{ cursor: 'pointer' }} onClick={() => markAsRead(message)}>
            {/* Sender */}
            <div
              className="p-3 border-end"
              style={{
                width: '220px',
                minWidth: '220px',
              }}
            >
              {message.sender ? (
                <>
                  <Link
                    to={`/user/${message.sender.username}/${message.sender.userHash}`}
                    onClick={(event) => event.stopPropagation()}
                    className="text-decoration-none"
                  >
                    {message.sender.username}
                  </Link>

                  <div className="small text-muted mt-1">{formatDate(message.createdAt)}</div>
                </>
              ) : (
                <div>
                  <span>{trans('my_wiki.system.user_sender')}</span>

                  <div className="small text-muted mt-1">{formatDate(message.createdAt)}</div>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-3 flex-grow-1">
              <div className="mb-1">{trans(message.titleKey, message.messageParams)}</div>

              <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                {message.messageKey
                  ? trans(message.messageKey, message.messageParams)
                  : message.message}
              </div>

              {message.type === 'creator_request' && (
                <div className="mt-2">
                  <Link to="/user/me?tab=admin" className="text-decoration-none ms-2">
                    {trans('my_wiki.components.messaging_list.open_member_list')}
                  </Link>
                </div>
              )}

              {message.articleUrl && (
                <div className="mt-2">
                  <Link
                    to={message.articleUrl}
                    onClick={() => markAsRead(message)}
                    className="text-decoration-none"
                  >
                    {trans('my_wiki.components.messaging_list.open_article')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default MessagingList;
