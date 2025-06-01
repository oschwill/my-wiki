import { useRef, useState } from 'react';
import { Form, Stack, Alert, Button } from 'react-bootstrap';
import { fetchFromApi } from '../../../utils/fetchData';
import { useAuth } from '../../../context/AuthContext';

interface TokenFormProps {
  userData: {
    formData: any;
  };
  fetchUrl: string;
  onSuccessStepChange?: () => void;
}

const blockLengths: number[] = [8, 4, 4, 4, 12];

const TokenForm: React.FC<TokenFormProps> = ({ userData, fetchUrl, onSuccessStepChange }) => {
  const [blocks, setBlocks] = useState<string[]>(Array(5).fill(''));
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { setAuthToken } = useAuth();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullToken = blocks.join('-');

    if (blocks.some((b, i) => b.length !== blockLengths[i])) {
      setErrorMessage('Bitte gib den vollständigen Token ein.');
      return;
    }

    setErrorMessage('');
    const formData = { ...userData.formData, token: fullToken };
    const response = await fetchFromApi(fetchUrl, 'POST', formData);

    if (response.success) {
      setAuthToken(response.jwtToken ?? 'null');
      // Nur optional wenn wir das übergeben haben!
      onSuccessStepChange?.();
    } else {
      setSuccessMessage('');
      setErrorMessage(response.error?.message || 'Ein unbekannter Fehler ist aufgetreten.');
    }
  };

  return (
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
  );
};

export default TokenForm;
