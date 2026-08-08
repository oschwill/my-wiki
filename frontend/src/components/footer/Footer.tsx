import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/hookHelper';

const Footer: React.FC = () => {
  const { trans } = useTranslation();
  return (
    <footer className="bg-transparent py-3 text-center">
      <Container>
        <hr />
        <div className="d-flex justify-content-center gap-3">
          <Link to="/terms-and-conditions">
            {trans('my_wiki.components.footer.link.terms_and_conditions')}
          </Link>
          <Link to="/privacy-policy">{trans('my_wiki.components.footer.link.privacy_policy')}</Link>
        </div>
        <div>@copyright Oliver Schwill 2026</div>
      </Container>
    </footer>
  );
};

export default Footer;
