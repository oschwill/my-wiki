import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomNavLink from './CustomNavLink';
import { clockFN } from '../../utils/functionHelper';
import { useLanguage } from '../../context/LanguageContext';
import { Area } from '../../dataTypes/types';
import { fetchFromApi } from '../../utils/fetchData';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from '../../hooks/hookHelper';
/* PAYLOAD */
import { PayloadPageLink } from '../../dataTypes/types';
import { fetchFromPayload } from '../../utils/fetchPayload';

const SideBar: React.FC = () => {
  const { language } = useLanguage();
  const { areaSlug } = useParams();
  const [areas, setAreas] = useState<Area[]>([]);
  const [isAreasLoading, setIsAreasLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>(`${clockFN().time} • ${clockFN().date}`);
  const { trans } = useTranslation();
  /* PAYLOAD */
  const [pages, setPages] = useState<PayloadPageLink[]>([]);
  const [isPagesLoading, setIsPagesLoading] = useState<boolean>(false);
  const payloadLocale = language?.locale.split('-')[0];

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { date, time } = clockFN();
      setCurrentTime(`${time} • ${date}`);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Areas fetchen
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
    if (!areas.length || !areaSlug) return;

    const foundArea = areas.find((a) => a.queryPath === areaSlug);
    if (foundArea) {
      setIsOpen(true);
    }
  }, [areas, areaSlug]);

  /* PAYLOAD */
  useEffect(() => {
    if (!language) return;

    const fetchPages = async () => {
      setIsPagesLoading(true);

      try {
        const response = await fetchFromPayload(
          `/api/pages?where[navigation.showInSidebar][equals]=true&select[id]=true&select[title]=true&select[slug]=true&select[navigation]=true&locale=${payloadLocale}`,
        );

        const sidebarPages = response.docs
          .filter((page: PayloadPageLink) => page.navigation?.showInSidebar === true)
          .sort(
            (a: PayloadPageLink, b: PayloadPageLink) =>
              (a.navigation?.order ?? 0) - (b.navigation?.order ?? 0),
          );

        setPages(sidebarPages);
      } finally {
        setIsPagesLoading(false);
      }
    };

    fetchPages();
  }, [language]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <nav className="sidebar overflow-hidden d-flex flex-column">
      <div className="position-sticky pt-3">
        <ul className="nav flex-column justify-content align-content-center">
          <li className="nav-item" style={{ width: '100%' }}>
            <CustomNavLink to="/" label="Home" />
          </li>

          <li className="nav-item" style={{ width: '100%' }}>
            <div className="d-flex align-content-center">
              <a
                className="nav-link"
                aria-current="page"
                data-bs-toggle="collapse"
                href="#area"
                role="button"
                aria-expanded={isOpen}
                aria-controls="area"
                onClick={toggleDropdown}
              >
                <span className="text-secondary">
                  {trans('my_wiki.components.sidebar.link.category')}
                </span>{' '}
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="ms-2 text-dark"
                  style={{
                    transform: isOpen ? 'rotate(90deg)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                />
              </a>
            </div>

            <div className={`collapse ps-4 ${isOpen ? 'show' : ''}`} id="area">
              {isAreasLoading ? (
                <div className="p-2 text-center">
                  <Spinner animation="grow" variant="primary" />
                </div>
              ) : (
                <ul className="nav flex-column">
                  {areas.map((area) => (
                    <li className="nav-item" key={area._id}>
                      <CustomNavLink to={`/area/${area.queryPath}`} label={area.title} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
          {isPagesLoading ? (
            <li className="nav-item" style={{ width: '100%' }}>
              <div className="p-2 text-center">
                <Spinner animation="grow" variant="primary" />
              </div>
            </li>
          ) : (
            pages.map((page) => (
              <li className="nav-item" key={page.id} style={{ width: '100%' }}>
                <CustomNavLink
                  to={`/page/${page.slug}`}
                  label={page.navigation?.sidebarLabel || page.title}
                />
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="mt-auto position-absolute bottom-0 border-top-2 w-100 border-info">
        <div className="p-2 bg-light text-dark text-center">{currentTime}</div>
      </div>
    </nav>
  );
};

export default SideBar;
