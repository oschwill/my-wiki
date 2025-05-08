import { Spinner } from 'react-bootstrap';

const LoadSite: React.FC = () => {
  return (
    <div className="overlay">
      <div className="spinner-container">
        <Spinner animation="border" variant="dark" />
      </div>
    </div>
  );
};

export default LoadSite;
