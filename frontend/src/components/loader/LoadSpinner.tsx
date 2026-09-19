import { Spinner } from 'react-bootstrap';

interface LoadSpinnerProps {
  text: string;
}

const LoadSpinner: React.FC<LoadSpinnerProps> = ({ text }) => {
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
      {text}
    </>
  );
};

export default LoadSpinner;
