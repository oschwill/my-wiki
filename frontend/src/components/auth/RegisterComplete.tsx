import { Alert, Row } from 'react-bootstrap';

const RegisterComplete: React.FC = () => {
  return (
    <Row md={8} className="mt-4">
      <Alert variant="success" className="text-center d-flex flex-column align-items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="120"
          height="120"
          fill="green"
          className="bi bi-check-circle-fill mb-3"
          viewBox="0 0 16 16"
          style={{ animation: 'pop 0.8s ease' }}
        >
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.97 11.03a.75.75 0 0 0 1.07 0l4-4a.75.75 0 1 0-1.06-1.06L7.5 9.44 5.53 7.47a.75.75 0 0 0-1.06 1.06l2.5 2.5z" />
        </svg>
        <h5>Registrierung erfolgreich!</h5>
        <p>Bitte überprüfe Sie Ihre E-Mail, um Ihre Registrierung abzuschließen.</p>
      </Alert>
    </Row>
  );
};

export default RegisterComplete;
