import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/functionHelper';
import { fetchFromApi } from '../utils/fetchData';
import { useToast } from '../context/ToastContext';

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
  const [comments, setComments] = useState<CommentType[]>([]);
  const [submittingComment, setSubmittingComment] = useState(false);

  const { user: loggedInUser } = useAuth();
  const navigate = useNavigate();

  const isOwner = loggedInUser && article && loggedInUser.userId === article.createdBy._id;

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
        showToast('Der Artikel wurde erfolgrecih beabreitet.', 'success');

        return;
      }

      showToast('Fehler beim editieren des Artikels.', 'error');
    } catch (err) {
      console.warn(err);
      showToast('Fehler beim editieren des Artikels.', 'error');
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
    const loadComments = async () => {
      if (!articleId) return;

      try {
        const res = await fetchFromApi(
          `/api/v2/content/public/comments?articleId=${articleId}`,
          'GET',
        );
        if (res.success && Array.isArray(res.data)) {
          setComments(res.data);
        } else {
          setComments([]);
        }
      } catch (err) {
        console.error(err);
        setComments([]);
      }
    };
    if (articleId && article) {
      loadComments();
    }
  }, [articleId, article]);

  const handleReset = () => {
    setShowResetConfirm(false);

    if (editorRef.current) {
      editorRef.current.setContent('');
    }
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
        showToast(res.message, 'success');
      } else {
        showToast('Kommentar konnte nicht hinzugefügt werden', 'error');
      }
    } catch (err) {
      console.warn(err);
      showToast('Fehler beim Hinzufügen des Kommentars', 'error');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="my-5 text-center">
        <Spinner animation="border" />
        <div className="mt-2">Artikel wird geladen...</div>
      </Container>
    );
  }
  if (error) {
    return (
      <Container fluid className="my-5 px-4">
        <Alert variant="warning" className="shadow-sm">
          <h5 className="mb-1">Artikel nicht verfügbar</h5>
          <p className="mb-0">
            Keine Artikel gefunden oder der Artikel ist nicht mehr veröffentlicht.
          </p>
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
            <strong>✏️ Bearbeitungsmodus aktiv (Fremder Artikel)</strong>
            <Button
              size="sm"
              variant="outline-dark"
              className="ms-3"
              onClick={() => setForeignEditMode(false)}
            >
              Bearbeitung abbrechen
            </Button>
          </div>
        </>
      )}
      {/* ================= TITLE ================= */}
      <h1 className="mb-1">{article.title}</h1>
      <small className="text-muted">Kategorie: {article.category?.title}</small>
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
                      <strong>{article.createdBy?.username || 'Unbekannt'}</strong>
                    </Link>
                  ) : (
                    <strong>Anonym</strong>
                  )
                ) : article.allowShowAuthor ? (
                  <span>
                    <strong>{article.createdBy?.username || 'Unbekannt'}</strong>{' '}
                    <small className="text-muted">(registrieren, um Profil zu sehen)</small>
                  </span>
                ) : (
                  <span>
                    <strong>Anonym</strong>
                  </span>
                )}
                {article.updatedBy && (
                  <div style={{ fontSize: '0.85rem', color: '#555' }} className="d-flex gap-2">
                    <span>Bearbeitet von:</span>
                    <Link to={externalUserProfileUrl || '#'}>
                      {article.updatedBy.username || 'Externer Benutzer'}
                    </Link>
                  </div>
                )}
              </Col>

              <Col md={3}>
                <FontAwesomeIcon icon={faClock} className="me-2 text-secondary" />
                Erstellt: {formatDate(article.createdAt)}
              </Col>

              <Col md={3}>
                <FontAwesomeIcon icon={faClock} className="me-2 text-secondary" />
                Aktualisiert: {article.updatedAt ? formatDate(article.updatedAt) : '-'}
              </Col>

              <Col md={3}>
                <FontAwesomeIcon icon={faEye} className="me-2 text-secondary" />
                {article.visitors} Aufrufe
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
                Teilen
              </Button>
            )}

            {article.allowPrinting && <PrintButton article={article} />}

            {article.allowExportToPDF && (
              <Button variant="outline-danger" size="sm" disabled>
                <FontAwesomeIcon icon={faFilePdf} className="me-1" />
                PDF Export
              </Button>
            )}

            {article.allowEditing && loggedInUser && loggedInUser.role !== 'visitor' && (
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
                Bearbeiten
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
            Kommentare <Badge bg="secondary">{comments.length}</Badge>
          </h5>

          {comments.map((comment) => (
            <ShowComments key={comment._id} comment={comment} />
          ))}

          <InsertNewComment
            loggedInUser={loggedInUser}
            onSubmit={handleAddComment}
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

      <ConfirmModal
        show={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        title="Artikel speichern"
        body="Möchtest du diesen Artikel wirklich speichern?"
        confirmText="Speichern"
        confirmVariant="success"
        onConfirm={handleForeignSave}
      />

      <ConfirmModal
        show={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Formular zurücksetzen"
        body="Möchtest du alle Eingaben wirklich verwerfen?"
        confirmText="Zurücksetzen"
        confirmVariant="warning"
        onConfirm={handleReset}
      />
    </Container>
  );
};

export default ShowSingleArticle;
