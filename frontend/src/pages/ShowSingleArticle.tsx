import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/functionHelper';
import { fetchFromApi } from '../utils/fetchData';
import { useToast } from '../context/ToastContext';
import { createConfirmModals } from '../utils/createConfirmModals';
import { useTranslation } from '../hooks/hookHelper';

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faClock,
  faEye,
  faShareNodes,
  faFilePdf,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import ShareArticleModal from '../components/modal/ShareArticleModal';
import PrintButton from '../components/ui/PrintButton';
import FullscreenButton from '../components/ui/FullscreenButton';
import InsertNewArticle from '../components/articles/InsertNewArticle';
import ConfirmModal from '../components/modal/ConfirmModal';
import { CommentType } from '../dataTypes/types';
import ShowComments from '../components/articles/ShowComments';
import InsertNewComment from '../components/articles/InsertNewComment';
import ConfirmModalRenderer from '../components/modal/ConfirmModalRenderer';

const ShowSingleArticle: React.FC = () => {
  const { articleId } = useParams();
  const articleRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const showToast = useToast();

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authorProfileUrl, setAuthorProfileUrl] = useState<string | null>(null);
  const [externalUserProfileUrl, setExternalUserProfileUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [foreignEditMode, setForeignEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showDeleteCommentConfirm, setShowDeleteCommentConfirm] = useState(false);
  const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
  const [showAddCommentConfirm, setShowAddCommentConfirm] = useState(false);
  const [pendingCommentContent, setPendingCommentContent] = useState<string | null>(null);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();
  const { trans } = useTranslation();

  const isOwner = loggedInUser && article && loggedInUser.userId === article.createdBy._id;

  const canEdit =
    !!loggedInUser &&
    !!article &&
    loggedInUser.role !== 'visitor' &&
    (isOwner || article.allowEditing);

  useEffect(() => {
    const loadArticle = async () => {
      try {
        let res;
        const viewedKey = `viewed_article_${articleId}`;

        if (!localStorage.getItem(viewedKey)) {
          res = await fetchFromApi(`/api/v1/content/public/article/${articleId}`, 'GET');
          localStorage.setItem(viewedKey, 'true');
        } else {
          res = await fetchFromApi(
            `/api/v1/content/public/article/${articleId}?nocount=true`,
            'GET',
          );
        }

        if (!res.success || !res.data || !res.data.published) {
          setError(true);
          return;
        }
        setArticle(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      loadArticle();
    }
  }, [articleId]);

  useEffect(() => {
    if (!article) return;

    if (article.createdBy?.userHash && article.createdBy?.username) {
      setAuthorProfileUrl(`/user/${article.createdBy.username}/${article.createdBy.userHash}`);
    }
    if (article.upatedBy?.userHash && article.upatedBy?.username) {
      setExternalUserProfileUrl(
        `/user/${article.updatedBy.username}/${article.updatedBy.userHash}`,
      );
    }
  }, [article]);

  const handleForeignSave = async () => {
    if (!article) return;
    setShowSaveConfirm(false);

    const payload = {
      ...article,
      category: typeof article.category === 'object' ? article.category._id : article.category,
      contentTitle: article.title,
    };

    try {
      setSubmitting(true);

      const res = await fetchFromApi(
        `/api/v1/creator/updateArticle/${article._id}?externalUser=true`,
        'PUT',
        payload,
      );

      if (res.success) {
        setForeignEditMode(false);
        showToast(trans('my_wiki.show_single_article.edit_article.save_success'), 'success');

        return;
      }

      showToast(trans('my_wiki.show_single_article.edit_article.save_failed'), 'error');
    } catch (err) {
      console.warn(err);
      showToast(trans('my_wiki.show_single_article.edit_article.save_failed'), 'error');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (!foreignEditMode || !article) return;

    const interval = setInterval(() => {
      if (editorRef.current) {
        editorRef.current.setContent(article.content || '');
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [foreignEditMode]);

  useEffect(() => {
    if (!articleId || !article?._id) return;

    const loadComments = async () => {
      try {
        const res = await fetchFromApi(`/api/v1/content/public/comments/${articleId}`, 'GET');

        setComments(res.success && Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err);
        setComments([]);
      }
    };

    loadComments();
  }, [articleId, article?._id]);

  const handleReset = () => {
    setShowResetConfirm(false);

    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  };

  const confirmAddComment = () => {
    if (!pendingCommentContent) return;

    handleAddComment(pendingCommentContent);

    setShowAddCommentConfirm(false);
    setPendingCommentContent(null);
  };

  const handleAddComment = async (content: string) => {
    if (!articleId || !loggedInUser) return;

    try {
      setSubmittingComment(true);

      const payload = {
        articleId,
        content,
      };

      const res = await fetchFromApi(`/api/v1/creator/createComment`, 'POST', payload);

      if (res.success && res.message) {
        // Neuer Kommentar in die Liste pushen
        setComments((prev) => (prev ? [res.data, ...prev] : [res.data]));
        showToast(
          trans('my_wiki.show_single_article.comment.save_success', {
            backed_message: res.message,
          }),
          'success',
        );
      } else {
        showToast(trans('my_wiki.show_single_article.comment.save_success'), 'error');
      }
    } catch (err) {
      console.warn(err);
      showToast(trans('my_wiki.show_single_article.comment.save_success'), 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  const canDeleteComment = (comment: CommentType) => {
    if (!loggedInUser) return false;

    return loggedInUser.role === 'admin' || comment.user?._id === loggedInUser.userId;
  };

  const requestDeleteComment = (commentId: string) => {
    setSelectedCommentId(commentId);
    setShowDeleteCommentConfirm(true);
  };

  const handleDeleteComment = async () => {
    try {
      const res = await fetchFromApi(
        `/api/v1/creator/deleteComment/${selectedCommentId}`,
        'DELETE',
      );

      if (res.success) {
        setComments((prev) => prev.filter((comment) => comment._id !== selectedCommentId));

        showToast(trans('my_wiki.show_single_article.comment.delete_success'), 'success');
      }
    } catch (err) {
      console.error(err);
      showToast(trans('my_wiki.show_single_article.comment.delete_failed'), 'error');
    }

    setShowDeleteCommentConfirm(false);
  };

  const confirmModals = createConfirmModals({
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
  });

  if (loading) {
    return (
      <Container fluid className="my-5 text-center">
        <Spinner animation="border" />
        <div className="mt-2">{trans('my_wiki.show_single_article.loading_message')}</div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container fluid className="my-5 px-4">
        <Alert variant="warning" className="shadow-sm">
          <h5 className="mb-1">{trans('my_wiki.show_single_article.no_articles')}</h5>
          <p className="mb-0">{trans('my_wiki.show_single_article.no_articles_desc')}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4 px-4">
      {foreignEditMode && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1000 }}
          />
          <div
            className="position-sticky top-0 bg-warning p-3 text-center shadow mb-3"
            style={{ zIndex: 1100 }}
          >
            <strong>{trans('my_wiki.show_single_article.edit_article.edit_modus.headline')}</strong>
            <Button
              size="sm"
              variant="outline-dark"
              className="ms-3"
              onClick={() => setForeignEditMode(false)}
            >
              {trans('my_wiki.show_single_article.edit_article.edit_modus.cancel')}
            </Button>
          </div>
        </>
      )}
      {/* ================= TITLE ================= */}
      <h1 className="mb-1">{article.title}</h1>
      <small className="text-muted">
        {trans('my_wiki.show_single_article.category')} {article.category?.title}
      </small>
      <div ref={articleRef}>
        {/* ================= META BOX ================= */}
        <Card className="mb-3 shadow-sm mt-2">
          <Card.Body>
            <Row className="gy-2 align-items-center">
              <Col md={3}>
                <FontAwesomeIcon icon={faUser} className="me-2 text-secondary" />
                {loggedInUser && authorProfileUrl ? (
                  article.allowShowAuthor ? (
                    <Link to={authorProfileUrl}>
                      <strong>
                        {article.createdBy?.username ||
                          trans('my_wiki.show_single_article.unknown')}
                      </strong>
                    </Link>
                  ) : (
                    <strong>{trans('my_wiki.show_single_article.anonymous')}</strong>
                  )
                ) : article.allowShowAuthor ? (
                  <span>
                    <strong>
                      {article.createdBy?.username || trans('my_wiki.show_single_article.unknown')}
                    </strong>{' '}
                    <small className="text-muted">
                      {' '}
                      {trans('my_wiki.show_single_article.have_to_register')}
                    </small>
                  </span>
                ) : (
                  <span>
                    <strong> {trans('my_wiki.show_single_article.anonymous')}</strong>
                  </span>
                )}
                {article.updatedBy && (
                  <div style={{ fontSize: '0.85rem', color: '#555' }} className="d-flex gap-2">
                    <span>Bearbeitet von:</span>
                    <Link to={externalUserProfileUrl || '#'}>
                      {article.updatedBy.username ||
                        trans('my_wiki.show_single_article.external_user')}
                    </Link>
                  </div>
                )}
              </Col>

              <Col md={3}>
                <FontAwesomeIcon icon={faClock} className="me-2 text-secondary" />
                {trans('my_wiki.show_single_article.created_at')} {formatDate(article.createdAt)}
              </Col>

              <Col md={3}>
                <FontAwesomeIcon icon={faClock} className="me-2 text-secondary" />
                {trans('my_wiki.show_single_article.updated_at')}{' '}
                {article.updatedAt ? formatDate(article.updatedAt) : '-'}
              </Col>

              <Col md={3}>
                <FontAwesomeIcon icon={faEye} className="me-2 text-secondary" />
                {trans('my_wiki.show_single_article.views', {
                  visitors: article.visitors,
                })}
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* ================= ACTION BAR ================= */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="article-action-bar d-flex flex-wrap gap-2">
            {article.allowSharing && (
              <Button variant="outline-primary" size="sm" onClick={() => setShowShareModal(true)}>
                <FontAwesomeIcon icon={faShareNodes} className="me-1" />
                {trans('my_wiki.show_single_article.share')}
              </Button>
            )}

            {article.allowPrinting && <PrintButton article={article} />}

            {article.allowExportToPDF && (
              <Button variant="outline-danger" size="sm" disabled>
                <FontAwesomeIcon icon={faFilePdf} className="me-1" />
                {trans('my_wiki.show_single_article.pdf_export')}
              </Button>
            )}

            {canEdit && (
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => {
                  if (isOwner) {
                    navigate('/insert-article', {
                      state: { editArticleId: article._id },
                    });
                  } else {
                    setForeignEditMode(true);
                  }
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} className="me-1" />
                {trans('my_wiki.show_single_article.edit_article.text')}
              </Button>
            )}
          </div>
          <FullscreenButton targetRef={articleRef} />
        </div>

        {/* ================= CONTENT ================= */}
        <Card className="mb-5 shadow-sm">
          <Card.Body>
            {foreignEditMode ? (
              <div
                style={{
                  position: 'relative',
                  zIndex: 1099,
                  backgroundColor: '#fff',
                  padding: '1%',
                  borderRadius: '6px',
                }}
              >
                <InsertNewArticle
                  content={article.content}
                  mode="edit-foreign"
                  areas={article.category.area}
                  categories={article.category}
                  selectedArea=""
                  selectedCategory=""
                  title={article.title}
                  errors={{
                    area: false,
                    category: false,
                    title: false,
                    content: article.content.length === 0,
                  }}
                  featureFlags={article}
                  loadingCategories={false}
                  submitting={submitting}
                  editorRef={editorRef}
                  onAreaChange={() => {}}
                  onCategoryChange={() => {}}
                  onTitleChange={() => {}}
                  onContentChange={(value) =>
                    setArticle((prev: any) => ({
                      ...prev,
                      content: value,
                    }))
                  }
                  onFlagChange={() => {}}
                  onSaveClick={() => setShowSaveConfirm(true)}
                  onResetClick={() => setShowResetConfirm(true)}
                />
              </div>
            ) : (
              <div
                dangerouslySetInnerHTML={{ __html: article.content }}
                className="article-content"
              />
            )}
          </Card.Body>
        </Card>
      </div>

      {/* ================= COMMENTS ================= */}
      {article.allowCommentsection && (
        <>
          <h5 className="mb-3">
            {trans('my_wiki.show_single_article.comment.headline')}{' '}
            <Badge bg="secondary">{comments.length}</Badge>
          </h5>

          {comments.map((comment) => (
            <ShowComments
              key={comment._id}
              comment={comment}
              canDelete={canDeleteComment(comment)}
              onDelete={requestDeleteComment}
            />
          ))}

          <InsertNewComment
            loggedInUser={loggedInUser}
            onSubmit={(content) => {
              setPendingCommentContent(content);
              setShowAddCommentConfirm(true);
            }}
            submitting={submittingComment}
          />
        </>
      )}
      <ShareArticleModal
        show={showShareModal}
        handleClose={() => setShowShareModal(false)}
        articleTitle={article.title}
        articleUrl={window.location.href}
      />

      <ConfirmModalRenderer modals={confirmModals} />
    </Container>
  );
};

export default ShowSingleArticle;
