import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from '../../hooks/hookHelper';

const LoadSite: React.FC = () => {
  const [showMessage, setShowMessage] = useState(false);
  const { trans } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="overlay">
      <div className="spinner-container text-center">
        <Spinner animation="border" variant="dark" />

        {showMessage && (
          <div className="mt-3">
            <div className="fw-semibold">Einen Moment bitte …</div>

            <small className="text-muted">{trans('my_wiki.system.loading_longer')}</small>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadSite;
