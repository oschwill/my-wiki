import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { useTranslation } from '../../hooks/hookHelper';

const MAX_COMMENT_LENGTH = 700; // Max Zeichen
const COMMENT_WARNING = 50;

interface InsertNewCommentProps {
  loggedInUser: any; // kann später genauer getypt werden
  onSubmit: (content: string) => void;
  submitting?: boolean;
}

const InsertNewComment: React.FC<InsertNewCommentProps> = ({
  loggedInUser,
  onSubmit,
  submitting = false,
}) => {
  const [content, setContent] = useState('');
  const { trans } = useTranslation();

  const handleSubmit = () => {
    const trimmed = content.trim();

    if (!trimmed) return;

    if (trimmed.length > MAX_COMMENT_LENGTH) {
      return;
    }

    onSubmit(trimmed);
    setContent('');
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form.Group className="mb-2">
          <Form.Label>{trans('my_wiki.components.insert_new_comment.label')}</Form.Label>
          {loggedInUser ? (
            <>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={MAX_COMMENT_LENGTH}
                placeholder={trans('my_wiki.components.insert_new_comment.placeholder')}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={submitting}
              />
              <div
                className={`text-end small mt-1 ${
                  content.length > MAX_COMMENT_LENGTH - COMMENT_WARNING
                    ? 'text-danger'
                    : 'text-muted'
                }`}
              >
                {trans('my_wiki.components.insert_new_comment.possible_characters', {
                  contentLength: content.length,
                  maxContentLength: MAX_COMMENT_LENGTH,
                })}
              </div>
            </>
          ) : (
            <p>
              <strong>{trans('my_wiki.components.insert_new_comment.not_registered')}</strong>
            </p>
          )}
        </Form.Group>
        {loggedInUser && (
          <Button
            size="sm"
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting || !content.trim()}
          >
            {trans('my_wiki.components.insert_new_comment.button_text')}
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default InsertNewComment;
