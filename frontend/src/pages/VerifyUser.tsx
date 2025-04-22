import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../utils/fetchData';
import { Col, Row } from 'react-bootstrap';

const VerifyUser: React.FC = () => {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [message, setMessage] = useState<string>('Verifizierung läuft...');

  useEffect(() => {
    const verifyUser = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email');
      const token = urlParams.get('token');

      if (!email || !token) {
        navigate('/'); // Einfach dann auf die Hauptseite weiterleiten!
      }

      try {
        // PATCH-Request
        const response = await fetchFromApi('/api/v1/user/register', 'PATCH', {
          emailVerifyCode: token,
          email: email,
        });

        if (response.success) {
          setMessage(response.message);
        } else {
          setMessage(response?.error?.message);
        }
      } catch (error: any) {
        setMessage(error?.error.message || `Fehler bei der Verifizierung: ${error}`);
      }
    };

    verifyUser();
  }, [navigate]);

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (secondsLeft === 0) {
      navigate('/auth');
    }
  }, [secondsLeft, navigate]);

  return (
    <Row>
      <Col md={12} className="d-flex justify-content-center align-items-center flex-column gap-4">
        <h2>{message}</h2>
        <h3 className="text-center">{secondsLeft}</h3>
      </Col>
    </Row>
  );
};

export default VerifyUser;
