import { Container } from 'react-bootstrap';

const Footer: React.FC = () => {
  return (
    <footer className="bg-transparent py-3 text-center">
      <Container>
        <hr />
        <span>@copyright Oliver Schwill</span>
      </Container>
    </footer>
  );
};

export default Footer;
