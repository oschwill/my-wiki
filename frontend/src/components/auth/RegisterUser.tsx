import { useEffect, useReducer, useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RegisterFormState } from '../../dataTypes/types';
import { genericFormReducer, initialRegisterUserFormState } from '../../utils/stateHelper';
import { checkRegisterUserCredentials } from '../../utils/errorHandling';
import { fetchFromApi } from '../../utils/fetchData';
import { extractFormValues } from '../../utils/functionHelper';
import RegisterComplete from './RegisterComplete';
import ErrorMessage from '../general/ErrorMessage';
import { useIpAddress } from '../../hooks/hookHelper';
import SelectField from '../form/SelectField';
import countries from '../../data/data';
import { useLanguage } from '../../context/LanguageContext';

interface RegisterUserProps {
  onSwitch: () => void;
}

const RegisterUser: React.FC<RegisterUserProps> = ({ onSwitch }) => {
  const [formData, dispatch] = useReducer(
    genericFormReducer<RegisterFormState>,
    initialRegisterUserFormState,
  );
  const [generalErrorMessage, setGeneralErrorMessage] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [shouldBlinkLoginButton, setShouldBlinkLoginButton] = useState(false);
  const { language } = useLanguage();

  useIpAddress(dispatch);

  useEffect(() => {
    if (formData.firstName.value || formData.lastName.value) {
      dispatch({ type: 'AUTO_GENERATE_USERNAME' } as any);
    }
  }, [formData.firstName.value, formData.lastName.value]);

  useEffect(() => {
    if (registrationSuccess) {
      setShouldBlinkLoginButton(true);

      const timer = setTimeout(() => {
        setShouldBlinkLoginButton(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [registrationSuccess]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name as keyof RegisterFormState,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // resett general Error Message
    setGeneralErrorMessage(null);

    const errors = checkRegisterUserCredentials(formData);

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }

    /* EXTRACTEN */
    const cleanedFormData = {
      ...extractFormValues(formData, ['username']),
      locale: language?.locale || 'de-DE',
    };

    try {
      /* DATA FETCHEN */
      const response = await fetchFromApi('/api/v1/user/register', 'POST', cleanedFormData);

      if (response.success) {
        setRegistrationSuccess(true);
      } else {
        setGeneralErrorMessage(response?.error?.message);
      }
    } catch (error: any) {
      setGeneralErrorMessage(
        error?.error.message || `Fehler bei der Registrierung: ${error?.message}`,
      );
    }
  };

  return (
    <Row className="mt-4">
      <Col md={8}>
        <h2 className="mb-4">Registrierung</h2>
        {!registrationSuccess ? (
          <Form onSubmit={handleSubmit} noValidate>
            <Row>
              <Col md={6}>
                <Form.Group controlId="formFirstName" className="mb-3">
                  <Form.Label>Vorname*</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName.value || ''}
                    onChange={handleChange}
                    placeholder="Max"
                    isInvalid={!!formData.firstName.error}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formData.firstName.error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="formLastName" className="mb-3">
                  <Form.Label>Nachname*</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName.value || ''}
                    onChange={handleChange}
                    placeholder="Mustermann"
                    isInvalid={!!formData.lastName.error}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formData.firstName.error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="formUsername" className="mb-3">
              <Form.Label>Benutzername</Form.Label>
              <Form.Control type="text" value={formData.username.value || ''} disabled />
            </Form.Group>

            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>E-Mail*</Form.Label>
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

            <Row>
              <Col md={6}>
                <Form.Group controlId="formPassword" className="mb-3">
                  <Form.Label>Passwort*</Form.Label>
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
              </Col>
              <Col md={6}>
                <Form.Group controlId="formConfirmPassword" className="mb-3">
                  <Form.Label>Passwort wiederholen*</Form.Label>
                  <Form.Control
                    type="password"
                    name="repeatPassword"
                    value={formData.repeatPassword.value || ''}
                    onChange={handleChange}
                    isInvalid={!!formData.repeatPassword.error}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {formData.repeatPassword.error}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <SelectField
              label="Land*"
              field={formData.location}
              handleChange={handleChange}
              selectData={countries}
              controlId="formLocation"
              bsClass="mb-4"
              formName="location"
            />
            <div className="d-flex gap-4">
              <Button variant="primary" type="submit" className="w-25">
                Registrieren
              </Button>
            </div>
          </Form>
        ) : (
          <RegisterComplete />
        )}
      </Col>

      {/* Border mit Login-Button */}
      <Col md={4} className="d-flex justify-content-center align-items-center">
        <div
          style={{
            borderLeft: '2px solid #ccc',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            paddingLeft: '20px',
          }}
          className="bg-light w-100"
        >
          <Button
            variant="outline-secondary"
            onClick={onSwitch}
            className={shouldBlinkLoginButton ? 'pulse-button' : ''}
          >
            Zum Login
          </Button>
        </div>
      </Col>
      {generalErrorMessage && (
        <ErrorMessage width={8} bsClass="mt-4" generalErrorMessage={generalErrorMessage} />
      )}
    </Row>
  );
};

export default RegisterUser;
