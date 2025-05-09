import { Spinner } from 'react-bootstrap';

const LoadSpinner: React.FC = () => {
  return (
    <>
      <Spinner
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
        className="me-2"
      />
      Wird gespeichert...
    </>
  );
};

export default LoadSpinner;
