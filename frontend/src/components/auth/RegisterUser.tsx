import { useEffect, useReducer } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { RegisterFormState } from '../../dataTypes/types';
import { genericFormReducer, initialRegisterUserFormState } from '../../utils/authHelper';

interface RegisterUserProps {
  onSwitch: () => void;
}

const RegisterUser: React.FC<RegisterUserProps> = ({ onSwitch }) => {
  const [formData, dispatch] = useReducer(
    genericFormReducer<RegisterFormState>,
    initialRegisterUserFormState
  );

  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      dispatch({ type: 'AUTO_GENERATE_USERNAME' });
    }
  }, [formData.firstName, formData.lastName]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    dispatch({
      type: 'SET_FIELD',
      field: e.target.name as keyof RegisterFormState,
      value: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('User data:', formData);
  };

  return (
    <Row className="mt-4">
      {/* Linke Seite: Formular */}
      <Col md={8}>
        <h2 className="mb-4">Registrierung</h2>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formFirstName" className="mb-3">
                <Form.Label>Vorname</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Max"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formLastName" className="mb-3">
                <Form.Label>Nachname</Form.Label>
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Mustermann"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formUsername" className="mb-3">
            <Form.Label>Benutzername</Form.Label>
            <Form.Control type="text" value={formData.username} disabled />
          </Form.Group>

          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>E-Mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Row>
            <Col md={6}>
              <Form.Group controlId="formPassword" className="mb-3">
                <Form.Label>Passwort</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label>Passwort wiederholen</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group controlId="formCountry" className="mb-4">
            <Form.Label>Land</Form.Label>
            <Form.Select name="country" value={formData.country} onChange={handleChange} required>
              <option value="">Bitte wählen...</option>
              <option value="DE">Deutschland</option>
              <option value="AT">Österreich</option>
              <option value="CH">Schweiz</option>
            </Form.Select>
          </Form.Group>

          <div className="d-flex gap-4">
            <Button variant="primary" type="submit" className="w-25">
              Registrieren
            </Button>
            <Button variant="secondary" type="submit" className="w-25">
              Reset
            </Button>
          </div>
        </Form>
      </Col>

      {/* Rechte Seite: Border mit Login-Button */}
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
          <Button variant="outline-secondary" onClick={onSwitch}>
            Zum Login
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default RegisterUser;
