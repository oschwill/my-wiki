import React from 'react';
import { Card } from 'react-bootstrap';
import { CommentType } from '../../dataTypes/types';
import { formatDate } from '../../utils/functionHelper';
import { Link } from 'react-router-dom';

interface ShowCommentsProps {
  comment: CommentType;
}

const ShowComments: React.FC<ShowCommentsProps> = ({ comment }) => {
  return (
    <Card className="mb-3 shadow-sm">
      <Card.Body>
        <Link to={`/user/${comment.user.username}/${comment.user.userHash}`}>
          <strong>{comment.user.username}</strong>
        </Link>
        <span className="text-muted small ms-2">{formatDate(comment.createdAt)}</span>
        <p className="mb-0 mt-1">{comment.content}</p>
      </Card.Body>
    </Card>
  );
};

export default ShowComments;
