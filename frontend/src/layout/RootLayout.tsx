import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import SideBar from '../components/sidebar/SideBar';
import { Container } from 'react-bootstrap';
import Footer from '../components/footer/Footer';
import MainLayout from './MainLayout';

const RootLayout: React.FC = () => {
  return (
    <>
      <Header />
      <main className="flex-grow-1">
        <Container fluid className="ms-0">
          <MainLayout
            sidebarChildren={<SideBar />}
            outletChildren={<Outlet />}
            footerChildren={<Footer />}
          />
        </Container>
      </main>
    </>
  );
};

export default RootLayout;
