import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { CommentType } from '../../dataTypes/types';
import { formatDate, formatTime } from '../../utils/functionHelper';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/hookHelper';

interface ShowCommentsProps {
  comment: CommentType;
  canDelete: boolean;
  onDelete: (commentId: string) => void;
}

const ShowComments: React.FC<ShowCommentsProps> = ({ comment, canDelete, onDelete }) => {
  const { trans } = useTranslation();
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
              <strong className="text-muted">
                {trans('my_wiki.components.show_comments.deleted_user')}
              </strong>
            )}
            <span className="text-muted small ms-2">
              {trans('my_wiki.components.show_comments.created_at', {
                createDate: formatDate(comment.createdAt),
                createTime: formatTime(comment.createdAt),
              })}
            </span>
          </p>
          {canDelete && (
            <Button
              variant="outline-danger"
              size="sm"
              className="mt-2"
              onClick={() => onDelete(comment._id)}
            >
              {trans('my_wiki.components.show_comments.button_delete_text')}
            </Button>
          )}
        </div>
        <p className="mb-0 mt-1">{comment.content}</p>
      </Card.Body>
    </Card>
  );
};

export default ShowComments;
