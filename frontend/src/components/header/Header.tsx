import { faBell, faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, Nav, Navbar, Image, Form, InputGroup } from 'react-bootstrap';

const Header: React.FC = () => {
  return (
    <header className="border-bottom border-2 ">
      <Navbar>
        <Container fluid className="px-4 column-gap-4">
          <Navbar.Brand href="#home">LOGO</Navbar.Brand>
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
            <Nav.Link href="#home">placeholder</Nav.Link>
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

            <Image src="/images/profileImageDefault.png" width="50px" roundedCircle />
          </Nav>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
