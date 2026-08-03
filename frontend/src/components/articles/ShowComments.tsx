import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { CommentType } from '../../dataTypes/types';
import { formatDate, formatTime } from '../../utils/functionHelper';
import { Link } from 'react-router-dom';

interface ShowCommentsProps {
  comment: CommentType;
  canDelete: boolean;
  onDelete: (commentId: string) => void;
}

const ShowComments: React.FC<ShowCommentsProps> = ({ comment, canDelete, onDelete }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <p>
            {comment.user ? (
              <Link to={`/user/${comment.user.username}/${comment.user.userHash}`}>
                <strong>{comment.user.username}</strong>
              </Link>
            ) : (
              <strong className="text-muted">Gelöschter Benutzer</strong>
            )}
            <span className="text-muted small ms-2">
              {formatDate(comment.createdAt)} um {formatTime(comment.createdAt)} Uhr
            </span>
          </p>
          {canDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-2"
              onClick={() => onDelete(comment._id)}
            >
              Löschen
            </Button>
          )}
        </div>
        <p className="mb-0 mt-1">{comment.content}</p>
      </Card.Body>
    </Card>
  );
};

export default ShowComments;
