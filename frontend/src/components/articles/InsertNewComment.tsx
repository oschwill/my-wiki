import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { CommentType } from '../../dataTypes/types';

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

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent('');
  };

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Form.Group className="mb-2">
          <Form.Label>Kommentar schreiben</Form.Label>
          {loggedInUser ? (
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Dein Kommentar..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={submitting}
            />
          ) : (
            <p>
              <strong>(Registrieren Sie sich, um Kommentare zu verfassen)</strong>
            </p>
          )}
        </Form.Group>
        {loggedInUser && (
          <Button size="sm" variant="primary" onClick={handleSubmit} disabled={submitting}>
            Kommentar absenden
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default InsertNewComment;
