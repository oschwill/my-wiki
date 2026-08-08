import { useLoaderData } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Toast } from 'react-bootstrap';
import CustomToolTip from '../components/general/CustomToolTip';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Area, ArticleBackend } from '../dataTypes/types';
import { useLanguage } from '../context/LanguageContext';
import { fetchFromApi } from '../utils/fetchData';
import { iconMap } from '../utils/icons';
import { useTranslation } from '../hooks/hookHelper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const Home: React.FC = () => {
  const location = useLocation();
  const showToast = useToast();
  const { language } = useLanguage();
  const initialData = useLoaderData() as { areas: Area[] };
  const [areas, setAreas] = useState<Area[]>(initialData.areas);
  const [lastArticles, setLastArticles] = useState<ArticleBackend[]>([]);
  const { trans } = useTranslation();

  useEffect(() => {
    if (!language) return;

    const fetchAreas = async () => {
      const response = await fetchFromApi(
        `/api/v1/content/public/areas?locale=${language.locale}`,
        'GET',
      );
      if (response.success) {
        setAreas(response.data as Area[]);
      }
    };

    const fetchLastArticles = async () => {
      const response = await fetchFromApi(
        `/api/v1/content/public/lastarticles?locale=${language.locale}`,
        'GET',
      );
      if (response.success) {
        setLastArticles(response.data as ArticleBackend[]);
      }
    };

    fetchAreas();
    fetchLastArticles();
  }, [language]);

  useEffect(() => {
    if (location.state?.toastMessage) {
      showToast(location.state.toastMessage, location.state.toastVariant || 'info');
      // Optional: location.state löschen (bei Bedarf)
    }
  }, [location.state, showToast]);

  return (
    <Container fluid className="mt-4">
      <section className="areas-section">
        <h2 className="mb-4">{trans('my_wiki.home.area.title')}</h2>

        <div className="areas-slider-wrapper">
          <Swiper
            modules={[Navigation]}
            navigation
            spaceBetween={20}
            slidesPerView={1}
            className="areas-swiper"
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              992: {
                slidesPerView: 4,
              },
              1200: {
                slidesPerView: 5,
              },
            }}
          >
            {areas.map((area) => (
              <SwiperSlide key={area._id}>
                <article className="d-flex h-100">
                  <div className="card h-100 d-flex flex-column w-100">
                    <div className="d-flex justify-content-center border-bottom">
                      <div className="bg-info p-4 rounded-5 m-2">
                        <FontAwesomeIcon
                          icon={iconMap[area.icon]}
                          style={{
                            height: '125px',
                            width: '125px',
                          }}
                        />
                      </div>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{area.title}</h5>

                      <p className="card-text">{area.description}</p>

                      <Link to={`/area/${area.queryPath}`} className="btn btn-primary mt-auto">
                        {trans('my_wiki.home.area.browse')}
                      </Link>
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="mt-5">
        <h2 className="col-12 mb-4"> {trans('my_wiki.home.last_articles')}</h2>
        <article className="d-flex flex-wrap gap-4">
          {lastArticles.map((article) => (
            <div
              key={article._id}
              style={{
                minWidth: '250px',
                flexBasis: 'calc(20% - 1.5rem)',
              }}
            >
              <Toast className="d-flex flex-column h-100">
                <Toast.Header closeButton={false}>
                  <div className="bg-info p-1 rounded-2 me-2">
                    <FontAwesomeIcon icon={iconMap[article.category.area.icon || 'default']} />
                  </div>
                  <strong className="me-auto">{article.category.area.title}</strong>
                  <small>
                    {new Date(article.updatedAt || article.createdAt).toLocaleDateString()}
                  </small>
                </Toast.Header>
                <Toast.Body
                  className="d-flex flex-column  position-relative"
                  style={{ height: '160px' }}
                >
                  <div>
                    <p>
                      <i>
                        {trans('my_wiki.home.category')}: <small>{article.category.title}</small>
                      </i>
                    </p>
                  </div>
                  <CustomToolTip text={article.title} />
                  <div className="mt-auto">
                    <Link
                      to={`/area/${article.category.area.title}/category/${article.category.title}/article/${article._id}`}
                      className="btn btn-primary w-100"
                    >
                      {trans('my_wiki.home.area.browse')}
                    </Link>
                  </div>
                </Toast.Body>
              </Toast>
            </div>
          ))}
        </article>
      </section>
    </Container>
  );
};

export default Home;
