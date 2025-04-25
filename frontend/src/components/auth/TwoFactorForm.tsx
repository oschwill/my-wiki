import { useRef, useState } from 'react';
import { Form, Row, Col, Button, Card, Alert, Stack } from 'react-bootstrap';
import {
  ShieldLockFill,
  InfoCircleFill,
  CheckCircleFill,
  EnvelopeFill,
} from 'react-bootstrap-icons';

const blockLengths = [8, 4, 4, 4, 12];

const TwoFactorTokenSplitForm = ({ show2faForm }: any) => {
  const [blocks, setBlocks] = useState<string[]>(Array(5).fill(''));
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    const cleanValue = value.replace(/[^a-fA-F0-9]/g, '').slice(0, blockLengths[index]);
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = cleanValue;
    setBlocks(updatedBlocks);

    if (cleanValue.length === blockLengths[index] && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('Text').replace(/[^a-fA-F0-9\-]/g, '');
    const parts = pasted.split('-');
    if (parts.length === 5 && parts.every((p, i) => p.length === blockLengths[i])) {
      setBlocks(parts);
      setErrorMessage('');
      setSuccessMessage('Token automatisch erkannt und eingefügt!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullToken = blocks.join('-');

    if (blocks.some((b, i) => b.length !== blockLengths[i])) {
      setErrorMessage('Bitte gib den vollständigen Token ein.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage(`Token erfolgreich übermittelt: ${fullToken}`);
    console.log('Full Token:', fullToken);
  };

  return (
    <Card className="p-4 shadow-sm">
      <h5 className="mb-4 d-flex align-items-center gap-2">
        <ShieldLockFill /> 2FA Token Validierung
      </h5>
      <Alert variant="info" className="mb-4">
        <EnvelopeFill className="text-primary me-2" />
        Überprüfe bitte deine E-Mail-Adresse, das Token wurde versendet und geben Sie es hier ein.
      </Alert>
      <Row>
        {/* Linke Seite: Token Eingabe */}
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Stack direction="horizontal" gap={2} className="mb-3 flex-wrap">
              {blocks.map((block, idx) => (
                <div key={idx} className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    value={block}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onPaste={handlePaste}
                    ref={(el) => (inputsRef.current[idx] = el)}
                    maxLength={blockLengths[idx]}
                    className="text-center text-uppercase"
                    placeholder={Array(blockLengths[idx]).fill('•').join('')}
                    style={{
                      width: `${blockLengths[idx] + 5}ch`,
                      fontFamily: 'monospace',
                      textAlign: 'center',
                      textTransform: 'uppercase',
                    }}
                  />
                  {idx < 4 && <span className="mx-1 fs-5">-</span>}
                </div>
              ))}
            </Stack>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage}</Alert>}

            <Button type="submit" className="w-100">
              Token überprüfen
            </Button>
          </Form>
        </Col>

        {/* Rechte Seite: Informationen */}
        <Col md={6}>
          <div className="ps-md-4 border-start mt-4 mt-md-0">
            <p className="text-muted d-flex align-items-center gap-2">
              <EnvelopeFill className="text-primary" />
              Der 2FA-Token wurde an deine E-Mail-Adresse gesendet.
            </p>
            <p className="text-muted d-flex align-items-center gap-2">
              <InfoCircleFill className="text-info" />
              Bitte gib den vollständigen Token exakt wie erhalten ein – du kannst ihn auch
              einfügen.
            </p>
            <p className="text-muted d-flex align-items-center gap-2">
              <CheckCircleFill
                className={`text-${show2faForm?.hasTwoFactor ? 'success' : 'danger'}`}
              />
              Zwei-Faktor-Authentifizierung ist bei dir{' '}
              <strong>{show2faForm?.hasTwoFactor ? 'aktiviert' : 'nicht aktiviert'}</strong>.
            </p>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default TwoFactorTokenSplitForm;
