import { useEffect, useState } from 'react';
import { Container, Nav, Row, Col, ListGroup, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { fetchFromApi } from '../utils/fetchData';
import { Area, CategoryFromApi } from '../dataTypes/types';
import ShowArticleList from '../components/articles/ShowArticleList';
import ListHeaderToolbar from '../components/ui/ListHeaderToolbar';

const WikiBrowser: React.FC = () => {
  const { language } = useLanguage();
  const { areaSlug } = useParams();
  let navigate = useNavigate();

  const [activeArea, setActiveArea] = useState<Area | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [categories, setCategories] = useState<CategoryFromApi[]>([]);
  const [activeCategory, setActiveCategory] = useState<CategoryFromApi | null>(null);
  const [isAreasLoading, setIsAreasLoading] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isArticlesLoading, setIsArticlesLoading] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // default: grid

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
            setActiveCategory(response.data[0]);
          }
          setIsCategoriesLoading(false);
        }
      } catch (error) {
        console.warn('Category fetch failed', error);
      }
    };

    fetchCategories();
  }, [activeArea, language]);

  useEffect(() => {
    if (!language) return;

    const fetchAreas = async () => {
      setIsAreasLoading(true);

      const response = await fetchFromApi(
        `/api/v1/content/public/areas?locale=${language.locale}`,
        'GET',
      );

      if (response.success) {
        setAreas(response.data as Area[]);
      }

      setIsAreasLoading(false);
    };

    fetchAreas();
  }, [language]);

  useEffect(() => {
    if (!areas.length) return;

    if (areaSlug) {
      const foundArea = areas.find((a) => a.queryPath === areaSlug);

      if (foundArea) {
        setActiveArea(foundArea);
      } else {
        console.warn('Area slug nicht gefunden:', areaSlug);
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
          `/api/v1/content/public/articles/${activeCategory._id}?locale=${language.locale}`,
          'GET',
        );

        if (response.success) {
          setArticles(response.data);
        }
        setIsArticlesLoading(false);
      } catch (err) {
        console.error('Fetching articles failed', err);
        setIsArticlesLoading(false);
      }
    };

    fetchArticles();
  }, [activeCategory, language]);

  return (
    <Container fluid className="mt-4">
      {/* ===== AREA TABS ===== */}
      <h5>Fachgebiete</h5>
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
                  setActiveCategory(null);
                  setArticles([]);
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
                title={`Artikel — ${activeArea?.title}${activeCategory ? ` / ${activeCategory.title}` : ''}`}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
              />
              {articles && articles.length === 0 ? (
                <p>Keine Artikel vorhanden</p>
              ) : (
                <ShowArticleList
                  articles={articles}
                  viewMode={viewMode}
                  activeAreaQueryPath={activeArea?.queryPath || ''}
                />
              )}
            </>
          )}
        </Col>
        {/* ==== CATEGORIES ==== */}
        <Col md={3} lg={2}>
          <h5>Kategorien</h5>
          {isCategoriesLoading ? (
            <div className="text-center mt-3">
              <Spinner animation="grow" variant="primary" />
            </div>
          ) : (
            <ListGroup>
              {categories && categories.length === 0 ? (
                <ListGroup.Item disabled>Keine Kategorien vorhanden</ListGroup.Item>
              ) : (
                categories?.map((category) => (
                  <ListGroup.Item
                    key={category._id}
                    action
                    active={category._id === activeCategory?._id}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category.title}
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default WikiBrowser;
