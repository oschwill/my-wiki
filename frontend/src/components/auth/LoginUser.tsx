import { Form, Button, Col, Row } from 'react-bootstrap';

interface LoginUserProps {
  onSwitch: () => void;
}

const LoginUser: React.FC<LoginUserProps> = ({ onSwitch }) => {
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
        <Form>
          <Row>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>E-Mail</Form.Label>
              <Form.Control type="email" name="email" required />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Passwort</Form.Label>
              <Form.Control type="password" name="password" required />
            </Form.Group>
          </Row>
          <div className="d-flex gap-4">
            <Button variant="primary" type="submit" className="w-25">
              Login
            </Button>
          </div>
        </Form>
      </Col>
      <Col md={2} className="d-flex justify-content-center align-items-center">
        <h3>- ODER -</h3>
      </Col>
      <Col md={4}>
        <Row className="border-bottom-2 border-primary">
          <Col md={12}>*Login Google*</Col>
        </Row>
        <Row>
          <Col md={12}>*Login Github*</Col>
        </Row>
      </Col>
    </Row>
  );
};

export default LoginUser;
