import { useEffect, useRef, useState } from 'react';
import { Spinner, Table, Button, Badge, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { fetchFromApi } from '../../utils/fetchData';
import { formatDate } from '../../utils/functionHelper';
import ConfirmModal from '../modal/ConfirmModal';
import { useToast } from '../../context/ToastContext';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/hookHelper';

interface ShowMyArticlesProps {
  userId: string;
  highlightArticleId?: string | null;
  active: boolean;
  onEditArticle: (value: string) => void;
}

const ShowMyArticles: React.FC<ShowMyArticlesProps> = ({
  userId,
  highlightArticleId,
  active,
  onEditArticle,
}) => {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [blinkArticleId, setBlinkArticleId] = useState<string | null>(null);
  const [showDeleteArticle, setShowDeleteArticle] = useState(false);
  const [deleteArticleId, setDeleteArticleId] = useState<string | null>(null);
  const [showPublishOrDraftArticle, setShowPublishOrDraftArticle] = useState(false);
  const [publishArticleId, setPublishArticleId] = useState<string | null>(null);
  const [willPublish, setWillPublish] = useState<boolean>(true);
  const { trans } = useTranslation();

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
        console.warn('Error loading items', err);
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
        showToast(
          trans('my_wiki.components.show_my_articles.delete_article.backend', {
            errorMessage: res.error?.message,
          }) || trans('my_wiki.components.show_my_articles.delete_article.frontend'),
          'error',
        );
      }
    } catch (err) {
      showToast(trans('my_wiki.components.show_my_articles.delete_article.frontend'), 'error');
      console.warn(trans('my_wiki.components.show_my_articles.delete_article.frontend'), err);
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
      }
    } catch (err) {
      showToast(trans('my_wiki.components.show_my_articles.publish_article_error'), 'error');
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

  if (!articles.length) {
    return (
      <Alert variant="info" className="mt-3">
        <Alert.Heading>
          {trans('my_wiki.components.show_my_articles.no_articles.headline')}
        </Alert.Heading>
        <p className="mb-0">{trans('my_wiki.components.show_my_articles.no_articles.text')}</p>
      </Alert>
    );
  }

  return (
    <>
      <Table hover responsive>
        <thead>
          <tr>
            <th>{trans('my_wiki.components.show_my_articles.table.th_area')}</th>
            <th>{trans('my_wiki.components.show_my_articles.table.th_category')}</th>
            <th>{trans('my_wiki.components.show_my_articles.table.th_title')}</th>
            <th>{trans('my_wiki.components.show_my_articles.table.th_status')}</th>
            <th>{trans('my_wiki.components.show_my_articles.table.th_actions')}</th>
            <th>{trans('my_wiki.components.show_my_articles.table.th_creupd_at')}</th>
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
                <td>
                  {isPublished ? (
                    <Link
                      to={`/area/${article.category.area.title}/category/${article.category.title}/article/${article._id}`}
                    >
                      {article.title}
                    </Link>
                  ) : (
                    article.title
                  )}
                </td>
                <td>
                  {isPublished ? (
                    <Badge bg="success">
                      {trans('my_wiki.components.show_my_articles.published')}
                    </Badge>
                  ) : (
                    <OverlayTrigger
                      placement="top"
                      overlay={
                        <Tooltip>{trans('my_wiki.components.show_my_articles.tooltip')}</Tooltip>
                      }
                    >
                      <Badge bg="warning" className="cursor-pointer">
                        {trans('my_wiki.components.show_my_articles.draft')}
                      </Badge>
                    </OverlayTrigger>
                  )}
                </td>
                <td className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => onEditArticle(article._id)}
                  >
                    {trans('my_wiki.components.show_my_articles.button.edit')}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => handleDeleteClick(article._id)}
                  >
                    {trans('my_wiki.components.show_my_articles.button.delete')}
                  </Button>
                  <Button
                    size="sm"
                    variant={isPublished ? 'outline-warning' : 'outline-success'}
                    onClick={() => handlePublishClick(article._id, isPublished)}
                  >
                    {isPublished
                      ? trans('my_wiki.components.show_my_articles.button.unpublish')
                      : trans('my_wiki.components.show_my_articles.button.publish')}
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
        title={trans('my_wiki.components.show_my_articles.deleteArticleModal.title')}
        body={trans('my_wiki.components.show_my_articles.deleteArticleModal.body')}
        confirmText={trans('my_wiki.components.show_my_articles.deleteArticleModal.confirm')}
        confirmVariant="danger"
        onConfirm={handleDeleteArticle}
      />

      {/* PUBLISH / DRAFT ARTICLE MODAL */}
      <ConfirmModal
        show={showPublishOrDraftArticle}
        onClose={() => setShowPublishOrDraftArticle(false)}
        title={
          willPublish
            ? trans('my_wiki.components.show_my_articles.publishArticleModal.title_puplish')
            : trans('my_wiki.components.show_my_articles.publishArticleModal.title_unpuplish')
        }
        body={
          willPublish
            ? trans('my_wiki.components.show_my_articles.publishArticleModal.body_publish')
            : trans('my_wiki.components.show_my_articles.publishArticleModal.body_unpublish')
        }
        confirmText={
          willPublish
            ? trans('my_wiki.components.show_my_articles.publishArticleModal.confirm_publish')
            : trans('my_wiki.components.show_my_articles.publishArticleModal.confirm_unpublish')
        }
        confirmVariant={willPublish ? 'success' : 'warning'}
        onConfirm={handlePublishOrDraftArticle}
      />
    </>
  );
};

export default ShowMyArticles;
