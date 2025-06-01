import { useEffect, useReducer, useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import InteractiveModal from '../general/InteractiveModal';
import ErrorMessage from '../general/ErrorMessage';
import { fetchFromApi } from '../../utils/fetchData';
import { checkLoginUserCredentials } from '../../utils/errorHandling';
import { genericFormReducer, initialLoginUserFormState } from '../../utils/stateHelper';
import { LoginFormState } from '../../dataTypes/types';
import { extractFormValues } from '../../utils/functionHelper';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import TimeLineModul from '../general/TimeLineModul';
import { TimeLineStep } from '../../dataTypes/baseTypes';
import ForgotPasswordForm from './ForgotPasswordForm';

interface LoginUserProps {
  onSwitch: () => void;
  setShow2faForm: React.Dispatch<
    React.SetStateAction<{
      formData: any;
      hasTwoFactor: boolean;
    }>
  >;
}

const LoginUser: React.FC<LoginUserProps> = ({ onSwitch, setShow2faForm }) => {
  const [formData, dispatch] = useReducer(
    genericFormReducer<LoginFormState>,
    initialLoginUserFormState
  );
  const { authToken, setAuthToken } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [generalErrorMessage, setGeneralErrorMessage] = useState(null);

  const handlePasswordResetClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    if (authToken && authToken !== 'null') {
      // Geben einen State Payload mit
      navigate('/', {
        state: {
          toastMessage: 'Erfolgreich eingeloggt! Willkommen zurück 👋',
          toastVariant: 'success',
        },
      });
    }
  }, [authToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    let finalValue = value;

    // Prüfen, ob es ein Input-Element mit type="checkbox" ist
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      finalValue = e.target.checked ? '1' : '0';
    }

    dispatch({
      type: 'SET_FIELD',
      field: name as keyof LoginFormState,
      value: finalValue,
    });
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // resett general Error Message
    setGeneralErrorMessage(null);

    const errors = checkLoginUserCredentials(formData);

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }

    const cleanedFormData = extractFormValues(formData, []);

    try {
      /* DATA FETCHEN */
      const response = await fetchFromApi('/api/v1/user/login', 'POST', cleanedFormData);

      if (response.success) {
        // JWT HANDLEN
        if (response.jwtToken) {
          setAuthToken(response.jwtToken);
        } else {
          setAuthToken('null'); // Cookie based, auth check triggern!
        }

        if (response.hasTwoFactorAuth) {
          const cleaned2faAuthFormData = extractFormValues(formData, ['password']);
          /* HIER SWITCHEN WIR DIE UI AUF DAS TOKEN EINGABE FELD EINFACH! */
          setShow2faForm((prevState) => ({
            ...prevState,
            formData: cleaned2faAuthFormData,
            hasTwoFactor: true,
          }));
        }
      } else {
        setGeneralErrorMessage(response?.error?.message);
      }
    } catch (error: any) {
      console.log(error.message);
      setGeneralErrorMessage(error?.error?.message || `Fehler beim Einloggen: ${error?.message}`);
    }
  };

  return (
    <Row className="mt-4">
      <Col md={2} className="d-flex justify-content-center align-items-center">
        <div
          style={{
            borderRight: '2px solid #ccc',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingRight: '20px',
          }}
          className="bg-light w-100"
        >
          <Button variant="outline-secondary ms-auto" onClick={onSwitch}>
            Registrieren
          </Button>
        </div>
      </Col>
      <Col md={4}>
        <h2 className="mb-4">Login</h2>
        <Form onSubmit={handleSubmit} noValidate>
          <Row>
            <Form.Group controlId="loginFormEmail" className="mb-3">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email.value || ''}
                onChange={handleChange}
                isInvalid={!!formData.email.error}
                required
              />
              <Form.Control.Feedback type="invalid">{formData.email.error}</Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group controlId="loginFormPassword" className="mb-3">
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password.value || ''}
                onChange={handleChange}
                isInvalid={!!formData.password.error}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formData.password.error}
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" id="formGridCheckbox">
                <Form.Check
                  type="checkbox"
                  label="angemeldet bleiben"
                  name="loginStay"
                  onChange={handleChange}
                  checked={formData.loginStay.value === '1'}
                />
              </Form.Group>
            </Col>
            <Col md={6} className="text-end">
              <span className="link-primary" role="button" onClick={handlePasswordResetClick}>
                Passwort vergessen?
              </span>
            </Col>
          </Row>
          <div className="d-flex gap-4">
            <Button variant="primary" type="submit" className="w-25">
              Login
            </Button>
          </div>
        </Form>
        {generalErrorMessage && (
          <ErrorMessage width={8} bsClass="mt-4" generalErrorMessage={generalErrorMessage} />
        )}
      </Col>
      <Col md={2} className="d-flex justify-content-center align-items-center">
        <h3>- ODER -</h3>
      </Col>
      <Col md={4}>
        <Row className="mt-4">
          <Col md={12}>
            <Row className="border-bottom-2 border-primary">
              <Col md={8}>
                <a
                  href="http://localhost:9000/auth/google"
                  className="btn btn-outline-danger w-100 text-center d-flex align-items-center justify-content-center"
                  style={{ gap: '10px' }}
                >
                  <FaGoogle style={{ width: '85px', height: '85px' }} /> {/* Google Icon */}
                  <h5>Login with Google</h5>
                </a>
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <hr />
              </Col>
            </Row>
            <Row>
              <Col md={8}>
                <a
                  href="http://localhost:9000/auth/github"
                  className="btn btn-outline-dark w-100 text-center d-flex align-items-center justify-content-center"
                  style={{ gap: '10px' }}
                >
                  <FaGithub style={{ width: '85px', height: '85px' }} />
                  <h5>Login with GitHub</h5>
                </a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <ForgotPasswordForm showModal={showModal} handleCloseModal={handleCloseModal} />
    </Row>
  );
};

export default LoginUser;
