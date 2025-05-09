import { Alert, Col } from 'react-bootstrap';
import { ResponsiveColSize } from '../../dataTypes/types';

interface ErrorMessageProps {
  generalErrorMessage: string | undefined;
  width: ResponsiveColSize;
  bsClass: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ generalErrorMessage, width, bsClass }) => {
  return (
    <Col md={width} className={bsClass}>
      <Alert variant="danger" className="text-center">
        <span className="fw-bold">{generalErrorMessage}</span>
      </Alert>
    </Col>
  );
};

export default ErrorMessage;
