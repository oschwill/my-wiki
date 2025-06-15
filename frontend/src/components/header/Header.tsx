import { faBell, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faGlobe, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Nav, Navbar, Form, InputGroup, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import { fetchFromApi } from '../../utils/fetchData';
import LoadSite from '../loader/LoadSite';

const Header: React.FC = () => {
  const { user, loading, setAuthToken } = useAuth();

  const handleLogout = async () => {
    await fetchFromApi('/api/v1/user/logout', 'POST', null); // cookie und oauth ausloggen

    setAuthToken(null);
    // window.location.reload();
    window.location.href = '/auth';
  };

  return (
    <header className="border-bottom border-2 position-sticky top-0 bg-body z-3">
      <Navbar>
        <Container fluid className="px-4 column-gap-4 mt-2 mb-2">
          <Navbar.Brand as={Link} to="/">
            LOGO
          </Navbar.Brand>
          <Form className="d-flex align-items-center position-relative ">
            <InputGroup>
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2 border-2 rounded-2 custom-width"
                aria-label="Search"
              />
              <InputGroup.Text
                className="position-absolute top-50 end-0 translate-middle-y me-2 pe-auto"
                role="button"
              >
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
            </InputGroup>
          </Form>
          <Nav className="ms-auto align-items-center column-gap-4">
            {user && (user.role === 'creator' || user.role === 'admin') && (
              <div className="d-flex align-items-center gap-1">
                <Link to="/insert-article" className="btn btn-sm btn-outline-secondary w-100">
                  Artikel erstellen
                </Link>
              </div>
            )}
            <div className="d-flex align-items-center gap-1">
              <span>DE</span>
              <FontAwesomeIcon
                icon={faGlobe}
                style={{ height: '25px', width: '25px' }}
                role="button"
              />
            </div>
            <div className="position-relative">
              <FontAwesomeIcon icon={faBell} style={{ height: '25px', width: '25px' }} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                25
                <span className="visually-hidden">unread messages</span>
              </span>
            </div>
            <div className="position-relative">
              <FontAwesomeIcon icon={faEnvelope} style={{ height: '25px', width: '25px' }} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                25
                <span className="visually-hidden">unread messages</span>
              </span>
            </div>
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
