import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent py-3 text-center">
      <Container>
        <hr />
        <div className="d-flex justify-content-center gap-3">
          <Link to="/terms-and-conditions">AGB</Link>
          <Link to="/privacy-policy">Datenschutzrichtlinien</Link>
        </div>
        <div>@copyright Oliver Schwill 2026</div>
      </Container>
    </footer>
  );
};

export default Footer;
