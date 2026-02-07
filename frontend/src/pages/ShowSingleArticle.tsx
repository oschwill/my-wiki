import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Row, Col, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/functionHelper';
import { fetchFromApi } from '../utils/fetchData';

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

const ShowSingleArticle: React.FC = () => {
  const { articleId } = useParams();
  const articleRef = useRef<HTMLDivElement>(null);

  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [authorProfileUrl, setAuthorProfileUrl] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const { user: loggedInUser } = useAuth();

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
  }, [article]);

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
              <Button variant="outline-warning" size="sm">
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
            <div
              dangerouslySetInnerHTML={{ __html: article.content }}
              className="article-content"
            />
          </Card.Body>
        </Card>
      </div>

      {/* ================= COMMENTS ================= */}
      {article.allowCommentsection && (
        <>
          <h5 className="mb-3">
            Kommentare <Badge bg="secondary">3</Badge>
          </h5>

          {/* MOCK COMMENTS */}
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <strong>Lisa Weber</strong>
              <span className="text-muted small ms-2">vor 2 Stunden</span>
              <p className="mb-0 mt-1">Sehr guter Artikel! 👍</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label>Kommentar schreiben</Form.Label>
                {loggedInUser ? (
                  <Form.Control as="textarea" rows={3} placeholder="Dein Kommentar..." />
                ) : (
                  <p>
                    <strong>(Registrieren sie sich, um Kommentare zu verfassen)</strong>
                  </p>
                )}
              </Form.Group>
              {loggedInUser && (
                <Button size="sm" variant="primary">
                  Kommentar absenden
                </Button>
              )}
            </Card.Body>
          </Card>
        </>
      )}
      <ShareArticleModal
        show={showShareModal}
        handleClose={() => setShowShareModal(false)}
        articleTitle={article.title}
        articleUrl={window.location.href}
      />
    </Container>
  );
};

export default ShowSingleArticle;
