import { faBell, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faGlobe } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Nav, Navbar, Button, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { fetchFromApi } from '../../utils/fetchData';
import LoadSite from '../loader/LoadSite';
import { useLanguage } from '../../context/LanguageContext';
import SearchBar from './SearchBar';
import myWikiLogo from '../../assets/images/my-wiki-logo.svg';
import { useTranslation } from '../../hooks/hookHelper';
import { useEffect, useState } from 'react';
/* PAYLOAD */
import { fetchFromPayload } from '../../utils/fetchPayload';
import { PayloadPageLink } from '../../dataTypes/types';

const Header: React.FC = () => {
  const { user, loading, setAuthToken } = useAuth();
  const { language, setLanguage, languages, loading: langLoading } = useLanguage();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const { trans } = useTranslation();
  /* PAYLOAD */
  const [pages, setPages] = useState<PayloadPageLink[]>([]);
  const [isPagesLoading, setIsPagesLoading] = useState<boolean>(false);
  const payloadLocale = language?.locale.split('-')[0];

  const handleLogout = async () => {
    await fetchFromApi('/api/v1/user/logout', 'POST', null);

    setAuthToken(null);

    window.location.href = '/auth';
  };

  /**
   * Aktuelle Anzahl ungelesener Nachrichten laden
   */
  const loadUnreadMessageCount = async () => {
    if (!user?.userId) {
      setUnreadMessageCount(0);
      return;
    }

    try {
      const response = await fetchFromApi('/api/v1/messaging/unread-count', 'GET', null);

      if (response?.success) {
        setUnreadMessageCount(response.count || 0);
      }
    } catch (error) {
      console.error('Error loading unread message count:', error);
    }
  };

  /**
   * Initial laden und auf Änderungen der Nachrichten reagieren.
   */
  useEffect(() => {
    if (!user?.userId) {
      setUnreadMessageCount(0);
      return;
    }

    loadUnreadMessageCount();

    const handleMessagingUpdate = () => {
      loadUnreadMessageCount();
    };

    window.addEventListener('messaging:updated', handleMessagingUpdate);

    return () => {
      window.removeEventListener('messaging:updated', handleMessagingUpdate);
    };
  }, [user?.userId]);

  /* PAYLOAD */
  useEffect(() => {
    const fetchPages = async () => {
      setIsPagesLoading(true);

      try {
        const response = await fetchFromPayload(
          `/api/pages?where[navigation.showInHeader][equals]=true&select[id]=true&select[title]=true&select[slug]=true&select[navigation]=true&locale=${payloadLocale}`,
        );

        const headerPages = response.docs.sort(
          (a: PayloadPageLink, b: PayloadPageLink) =>
            (a.navigation?.order ?? 0) - (b.navigation?.order ?? 0),
        );

        setPages(headerPages);
      } catch (error) {
        console.error('Error loading header pages:', error);
      } finally {
        setIsPagesLoading(false);
      }
    };

    fetchPages();
  }, []);

  return (
    <header className="border-bottom border-2 position-sticky top-0 bg-body z-3">
      <Navbar>
        <Container fluid className="px-4 column-gap-4 mt-2 mb-2">
          <div>
            <Navbar.Brand as={Link} to="/">
              <img src={myWikiLogo} alt="My Wiki" height={60} />
            </Navbar.Brand>
          </div>

          <SearchBar />

          {isPagesLoading ? (
            <LoadSite />
          ) : (
            <Nav className="align-items-center column-gap-3">
              {pages.map((page) => (
                <Link
                  key={page.id}
                  to={`/page/${page.slug}`}
                  className="text-body text-decoration-none"
                >
                  {page.navigation?.headerLabel || page.title}
                </Link>
              ))}
            </Nav>
          )}

          <Nav className="ms-auto align-items-center column-gap-4">
            {user && (user.role === 'creator' || user.role === 'admin') && (
              <div className="d-flex align-items-center gap-1">
                <Link to="/insert-article" className="btn btn-sm btn-outline-secondary w-100">
                  {trans('my_wiki.components.header.create_article')}
                </Link>
              </div>
            )}

            {/* Language */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" id="dropdown-language">
                {langLoading ? '...' : language?.label} <FontAwesomeIcon icon={faGlobe} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {languages.map((lang) => (
                  <Dropdown.Item
                    key={lang._id}
                    active={lang.locale === language?.locale}
                    onClick={() => setLanguage(lang)}
                  >
                    {lang.label}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            {/* Notifications */}
            <div className="position-relative" aria-disabled>
              <FontAwesomeIcon icon={faBell} style={{ height: '25px', width: '25px' }} />
            </div>
            {/* Messages */}
            <Link to="/user/me?tab=requests" className="text-body text-decoration-none">
              <div className="position-relative">
                <FontAwesomeIcon icon={faEnvelope} style={{ height: '25px', width: '25px' }} />
                {unreadMessageCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadMessageCount}
                    <span className="visually-hidden">
                      {trans('my_wiki.header.unread_messages')}
                    </span>
                  </span>
                )}
              </div>
            </Link>

            {loading ? (
              <LoadSite />
            ) : user && user.userId ? (
              <div className="d-flex align-items-center">
                <ProfileDropdown user={user} onLogout={handleLogout} />
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline-secondary ms-auto">Login</Button>
              </Link>
            )}
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
