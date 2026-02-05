import { useEffect, useRef, useState } from 'react';
import { Spinner, Table, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { fetchFromApi } from '../../utils/fetchData';
import { formatDate } from '../../utils/functionHelper';
import ConfirmModal from '../modal/ConfirmModal';
import { useToast } from '../../context/ToastContext';

interface ShowMyArticlesProps {
  userId: string;
  highlightArticleId?: string | null;
  active: boolean;
}

const ShowMyArticles: React.FC<ShowMyArticlesProps> = ({ userId, highlightArticleId, active }) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [blinkArticleId, setBlinkArticleId] = useState<string | null>(null);
  const [showDeleteArticle, setShowDeleteArticle] = useState(false);
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const [showPublishOrDraftArticle, setShowPublishOrDraftArticle] = useState(false);
  const [publishArticleId, setPublishArticleId] = useState<string | null>(null);
  const [willPublish, setWillPublish] = useState<boolean>(true);

  const showToast = useToast();

  const articleRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  useEffect(() => {
    if (!active) return;

    const fetchMyArticles = async () => {
      setLoading(true);
      try {
        const res = await fetchFromApi(`/api/v1/creator/showMyArticles`, 'GET');
        setArticles(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Artikel', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyArticles();
  }, [active, userId]);

  // --- Highlight & Scroll ---
  useEffect(() => {
    if (!articles.length || !highlightArticleId) return;

    const exists = articles.some((a) => a._id === highlightArticleId);
    if (!exists) return;

    setBlinkArticleId(highlightArticleId);

    const el = articleRefs.current[highlightArticleId];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    const timer = setTimeout(() => {
      setBlinkArticleId(null);
    }, 12000);

    return () => clearTimeout(timer);
  }, [highlightArticleId, articles]);

  // --- Delete Article ---
  const handleDeleteClick = (id: string) => {
    setDeleteArticleId(id);
    setShowDeleteArticle(true);
  };

  const handleDeleteArticle = async () => {
    if (!deleteArticleId) return;

    try {
      const res = await fetchFromApi(`/api/v1/creator/deleteArticle/${deleteArticleId}`, 'DELETE');
      if (res.success) {
        setArticles((prev) => prev.filter((a) => a._id !== deleteArticleId));
        showToast(res.message, 'success');
      } else {
        showToast(res.error?.message || 'Fehler beim Löschen des Artikels', 'error');
      }
    } catch (err) {
      showToast('Fehler beim Löschen des Artikels.', 'error');
      console.error('Fehler beim Löschen des Artikels', err);
    } finally {
      setShowDeleteArticle(false);
      setDeleteArticleId(null);
    }
  };

  const handlePublishClick = (id: string, currentStatus: boolean) => {
    setPublishArticleId(id);
    setWillPublish(!currentStatus);
    setShowPublishOrDraftArticle(true);
  };

  const handlePublishOrDraftArticle = async () => {
    if (!publishArticleId) return;

    try {
      const res = await fetchFromApi(
        `/api/v1/creator/publishArticle/${publishArticleId}`,
        'PATCH',
        { publish: willPublish },
      );

      if (res.success) {
        setArticles((prev) =>
          prev.map((a) => (a._id === publishArticleId ? { ...a, published: willPublish } : a)),
        );
        showToast(res.message, 'success');
      } else {
        showToast(res.error?.message, 'error');
        console.error(res.error?.message || 'Fehler beim Veröffentlichen/Zurückziehen', 'error');
      }
    } catch (err) {
      showToast('Fehler beim Veröffentlichen/Zurückziehen', 'error');
      console.error(err);
    } finally {
      setShowPublishOrDraftArticle(false);
      setPublishArticleId(null);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="grow" style={{ width: '4rem', height: '4rem' }} />
      </div>
    );
  }

  return (
    <>
      <Table hover responsive>
        <thead>
          <tr>
            <th>Fachgebiet</th>
            <th>Kategorie</th>
            <th>Titel</th>
            <th>Status</th>
            <th>Aktionen</th>
            <th>Erstellt am / Bearbeitet am</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => {
            const isPublished = article.published;

            return (
              <tr
                key={article._id}
                ref={(el) => (articleRefs.current[article._id] = el)}
                className={article._id === blinkArticleId ? 'article-highlight' : ''}
              >
                <td>{article.category.area.title}</td>
                <td>{article.category.title}</td>
                <td>{article.title}</td>
                <td>
                  {isPublished ? (
                    <Badge bg="success">Veröffentlicht</Badge>
                  ) : (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Dieser Artikel ist noch nicht veröffentlicht</Tooltip>}
                    >
                      <Badge bg="warning" className="cursor-pointer">
                        Entwurf
                      </Badge>
                    </OverlayTrigger>
                  )}
                </td>
                <td className="d-flex gap-2">
                  <Button size="sm" variant="outline-primary">
                    Editieren
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteClick(article._id)}
                  >
                    Löschen
                  </Button>
                  <Button
                    size="sm"
                    variant={isPublished ? 'outline-warning' : 'outline-success'}
                    onClick={() => handlePublishClick(article._id, isPublished)}
                  >
                    {isPublished ? 'Zurückziehen' : 'Veröffentlichen'}
                  </Button>
                </td>
                <td>
                  <span>
                    {formatDate(article.createdAt)} /{' '}
                    {article.updatedAt ? formatDate(article.updatedAt) : '-'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* DELETE ARTICLE MODAL */}
      <ConfirmModal
        show={showDeleteArticle}
        onClose={() => setShowDeleteArticle(false)}
        title="Artikel löschen"
        body="Möchtest du diesen Artikel wirklich löschen?"
        confirmText="Löschen"
        confirmVariant="danger"
        onConfirm={handleDeleteArticle}
      />

      {/* PUBLISH / DRAFT ARTICLE MODAL */}
      <ConfirmModal
        show={showPublishOrDraftArticle}
        onClose={() => setShowPublishOrDraftArticle(false)}
        title={willPublish ? 'Artikel veröffentlichen' : 'Artikel zurückziehen'}
        body={
          willPublish
            ? 'Möchtest du diesen Artikel wirklich veröffentlichen?'
            : 'Möchtest du die Veröffentlichung dieses Artikels zurückziehen?'
        }
        confirmText={willPublish ? 'Veröffentlichen' : 'Zurückziehen'}
        confirmVariant={willPublish ? 'success' : 'warning'}
        onConfirm={handlePublishOrDraftArticle}
      />
    </>
  );
};

export default ShowMyArticles;
