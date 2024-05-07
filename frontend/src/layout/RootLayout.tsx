import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import SideBar from '../components/sidebar/SideBar';
import { Col, Container, Row } from 'react-bootstrap';

const RootLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Container fluid className="ms-0">
          <Row>
            <Col xs={2} className="bg-light border-end border-4 super-large-1">
              <SideBar />
            </Col>
            <Col xs={10} className="super-large-11">
              <Outlet />
            </Col>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default RootLayout;
