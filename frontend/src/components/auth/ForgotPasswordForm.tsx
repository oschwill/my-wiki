import { Alert, Form } from 'react-bootstrap';
import InteractiveModal from '../general/InteractiveModal';
import TimeLineModul from '../general/TimeLineModul';
import { useState } from 'react';
import TokenForm from './tokenForm/TokenForm';
import { TimeLineStep } from '../../dataTypes/baseTypes';
import { fetchFromApi } from '../../utils/fetchData';
import { useLanguage } from '../../context/LanguageContext';

interface ForgotPasswordFormProps {
  showModal: boolean;
  handleCloseModal: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ showModal, handleCloseModal }) => {
  const [resetStep, setResetStep] = useState<string>('email');
  const [email, setEmail] = useState('');
  const [token] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { language } = useLanguage();

  const resetSteps: TimeLineStep[] = [
    { key: 'email', label: 'E-Mail eingeben' },
    { key: 'token', label: 'Token eingeben' },
    { key: 'newPassword', label: 'Neues Passwort' },
    { key: 'success', label: 'Erfolg' },
  ];

  const handlePasswordReset = async () => {
    setErrorMessage('');

    const fetchAndHandle = async (url: string, payload: any, nextStep?: string) => {
      try {
        const response = await fetchFromApi(url, 'PATCH', payload);

        if (response.success) {
          if (nextStep) setResetStep(nextStep);
        } else {
          setErrorMessage(response.error[0]?.message || 'Unbekannter Fehler.');
        }
      } catch (err) {
        setErrorMessage('Fehler bei der Verbindung zum Server.');
      }
    };

    switch (resetStep) {
      case 'email':
        if (email === '') {
          setErrorMessage('Bitte geben Sie eine Email ein.');
          return;
        }

        const data = {
          email,
          locale: language?.locale || 'de-DE',
        };

        await fetchAndHandle('/api/v1/user/forgot-password/send-token', data, 'token');
        break;

      case 'newPassword':
        if (newPassword === '' || repeatPassword === '') {
          setErrorMessage('Bitte füllen Sie alle Felder aus.');
          return;
        }

        await fetchAndHandle(
          '/api/v1/user/reset-password',
          { email, password: newPassword, repeatPassword },
          'success',
        );
        break;

      default:
        setErrorMessage('Ein unerwarteter Fehler ist aufgetreten.');
        break;
    }
  };

  return (
    <InteractiveModal
      showModal={showModal}
      handleCloseModal={handleCloseModal}
      handlePasswordReset={handlePasswordReset}
      title="Passwort zurücksetzen"
      cancelTitle={resetStep !== 'success' ? 'Abbrechen' : 'Beenden'}
      triggerTitle={
        resetStep === 'email'
          ? 'Token anfordern'
          : resetStep === 'token'
            ? undefined
            : resetStep === 'newPassword'
              ? 'Passwort setzen'
              : resetStep === 'success'
                ? undefined
                : undefined
      }
    >
      <TimeLineModul resetSteps={resetSteps} resetStep={resetStep} />
      {resetStep === 'email' && (
        <Form.Group controlId="formResetEmail">
          <Form.Label>E-Mail-Adresse</Form.Label>
          <Form.Control
            type="email"
            placeholder="Gib deine E-Mail ein"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Form.Group>
      )}

      {resetStep === 'token' && (
        <>
          <TokenForm
            userData={{
              formData: {
                email,
                forgotPasswordToken: token,
              },
            }}
            fetchUrl="/api/v1/user//forgot-password/check-token"
            onSuccessStepChange={() => setResetStep('newPassword')}
          />
          <Alert variant="info" className="mt-3">
            Ein Token wurde an <strong>{email}</strong> gesendet. Bitte überprüfen Sie Ihr
            E-Mail-Postfach.
          </Alert>
        </>
      )}

      {resetStep === 'newPassword' && (
        <>
          <Form.Group controlId="formNewPassword">
            <Form.Label>Neues Passwort</Form.Label>
            <Form.Control
              type="password"
              placeholder="Neues Passwort"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formRepeatPassword">
            <Form.Label>Passwort wiederholen</Form.Label>
            <Form.Control
              type="password"
              placeholder="Wiederholen"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
            />
          </Form.Group>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </>
      )}
      {resetStep === 'success' && (
        <div className="text-center my-4">
          <svg
            width="80"
            height="80"
            viewBox="0 0 52 52"
            className="mb-3"
            style={{ stroke: '#28a745', strokeWidth: 3, fill: 'none' }}
          >
            <circle cx="26" cy="26" r="25" className="circle" />
            <path
              className="check"
              fill="none"
              d="M14 27l7 7 17-17"
              style={{
                strokeDasharray: 48,
                strokeDashoffset: 48,
                animation: 'dash 0.5s ease forwards 0.3s',
              }}
            />
          </svg>
          <h5>Ihr Passwort wurde erfolgreich geändert!</h5>
        </div>
      )}
    </InteractiveModal>
  );
};

export default ForgotPasswordForm;
