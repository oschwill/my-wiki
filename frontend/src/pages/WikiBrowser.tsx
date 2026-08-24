import { useEffect, useState } from 'react';

import { Container, Nav, Row, Col, ListGroup, Spinner, Form, Alert } from 'react-bootstrap';

import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';

import { useLanguage } from '../context/LanguageContext';
import { fetchFromApi } from '../utils/fetchData';

import { Area, CategoryFromApi, ArticleListItem, PaginationData } from '../dataTypes/types';

import ShowArticleList from '../components/articles/ShowArticleList';
import ListHeaderToolbar from '../components/ui/ListHeaderToolbar';
import GlobalPagination from '../components/ui/GlobalPagination';

import { useTranslation } from '../hooks/hookHelper';

const WikiBrowser: React.FC = () => {
  const { language } = useLanguage();
  const { areaSlug } = useParams();
  const navigate = useNavigate();

  const [activeArea, setActiveArea] = useState<Area | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [categories, setCategories] = useState<CategoryFromApi[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryFromApi | null>(null);

  const [isAreasLoading, setIsAreasLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isArticlesLoading, setIsArticlesLoading] = useState(false);

  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(12);
  const [pagination, setPagination] = useState<PaginationData | null>(null);

  const { trans } = useTranslation();

  useEffect(() => {
    if (!activeArea || !language) return;

    const fetchCategories = async () => {
      try {
        setIsCategoriesLoading(true);
        const response = await fetchFromApi(
          `/api/v1/content/public/category/${activeArea._id}?locale=${language.locale}`,
          'GET',
        );

        if (response.success) {
          setCategories(response.data as CategoryFromApi[]);

          // erste Kategorie automatisch aktiv setzen
          if (response.data.length > 0) {
            setCurrentPage(1);
            setActiveCategory(response.data[0]);
          } else {
            setActiveCategory(null);
            setArticles([]);
            setPagination(null);
          }
        }
      } catch (error) {
        console.warn('Category fetch failed:', error);
      } finally {
        setIsCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, [activeArea, language]);

  useEffect(() => {
    if (!language) return;

    const fetchAreas = async () => {
      try {
        setIsAreasLoading(true);

        const response = await fetchFromApi(
          `/api/v1/content/public/areas?locale=${language.locale}`,
          'GET',
        );

        if (response.success) {
          setAreas(response.data as Area[]);
        }
      } catch (error) {
        console.warn('Area fetch failed:', error);
      } finally {
        setIsAreasLoading(false);
      }
    };

    fetchAreas();
  }, [language]);

  useEffect(() => {
    if (!areas.length) return;

    if (areaSlug) {
      const foundArea = areas.find((area) => area.queryPath === areaSlug);

      if (foundArea) {
        setActiveArea(foundArea);
      } else {
        console.warn('Area fetch failed:', areaSlug);
        navigate(`/area/${areas[0].queryPath}`, { replace: true });
      }

      return;
    }

    setActiveArea(areas[0]);
    navigate(`/area/${areas[0].queryPath}`, { replace: true });
  }, [areas, areaSlug, navigate]);

  useEffect(() => {
    if (!activeCategory || !language) return;

    const fetchArticles = async () => {
      try {
        setIsArticlesLoading(true);
        const response = await fetchFromApi(
          `/api/v1/content/public/articles/${activeCategory._id}?locale=${language.locale}&page=${currentPage}&limit=${itemsPerPage}`,
          'GET',
        );

        if (response.success) {
          setArticles(response.data.articles);
          setPagination(response.data.pagination);
        }
      } catch (err) {
        console.error('Fetching articles failed', err);
      } finally {
        setIsArticlesLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory, language, currentPage, itemsPerPage]);

  return (
    <Container fluid className="mt-4">
      {/* ===== AREA TABS ===== */}
      <h5>{trans('my_wiki.wiki_browser.headline')}</h5>
      <Nav variant="tabs" activeKey={activeArea?._id} className="mb-3">
        {isAreasLoading ? (
          <div className="p-3">
            <Spinner animation="grow" variant="primary" />
          </div>
        ) : (
          areas.map((area) => (
            <Nav.Item key={area._id}>
              <Nav.Link
                eventKey={area._id}
                active={area._id === activeArea?._id}
                onClick={() => {
                  setCurrentPage(1);
                  setPagination(null);
                  setArticles([]);
                  setActiveCategory(null);
                  setActiveArea(area);
                  navigate(`/area/${area.queryPath}`);
                }}
              >
                {area.title}
              </Nav.Link>
            </Nav.Item>
          ))
        )}
      </Nav>

      {/* ===== CONTENT AREA ===== */}
      <Row>
        {/* ==== ARTICLES ==== */}
        <Col md={9} lg={10}>
          {isArticlesLoading ? (
            <div className="text-center mt-3">
              <Spinner animation="grow" variant="primary" />
            </div>
          ) : (
            <>
              <ListHeaderToolbar
                title={`Artikel — ${activeArea?.title}${
                  activeCategory ? ` / ${activeCategory.title}` : ''
                }`}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />

              <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
                <span className="text-muted small">Artikel pro Seite:</span>

                <Form.Select
                  size="sm"
                  value={itemsPerPage}
                  onChange={(event) => {
                    setItemsPerPage(Number(event.target.value));
                    setCurrentPage(1);
                  }}
                  style={{ width: 'auto' }}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </Form.Select>
              </div>

              {articles && articles.length === 0 ? (
                <Alert variant="info" className="mt-3">
                  {trans('my_wiki.wiki_browser.no_articles')}
                </Alert>
              ) : (
                <>
                  <ShowArticleList
                    articles={articles}
                    viewMode={viewMode}
                    activeAreaQueryPath={activeArea?.queryPath || ''}
                  />

                  {pagination && (
                    <GlobalPagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Col>

        {/* ==== CATEGORIES ==== */}
        <Col md={3} lg={2}>
          <div className="category-sidebar">
            <h5>{trans('my_wiki.wiki_browser.categories')}</h5>
            {isCategoriesLoading ? (
              <div className="text-center mt-3">
                <Spinner animation="grow" variant="primary" />
              </div>
            ) : (
              <ListGroup>
                {categories && categories.length === 0 ? (
                  <ListGroup.Item disabled>
                    {trans('my_wiki.wiki_browser.no_categories')}
                  </ListGroup.Item>
                ) : (
                  categories?.map((category) => (
                    <ListGroup.Item
                      key={category._id}
                      action
                      active={category._id === activeCategory?._id}
                      onClick={() => {
                        setCurrentPage(1);
                        setPagination(null);
                        setArticles([]);
                        setActiveCategory(category);
                      }}
                    >
                      {category.title}
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default WikiBrowser;
