import { useState } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { EnvelopeFill, InfoCircleFill, CheckCircleFill } from 'react-bootstrap-icons';
import { fetchFromApi } from '../../../utils/fetchData';
import { useLanguage } from '../../../context/LanguageContext';

interface TokenInfosProps {
  show2faForm: {
    formData: any;
    hasTwoFactor: boolean;
  };
}

const TwoFactorTokenInfos: React.FC<TokenInfosProps> = ({ show2faForm }) => {
  const [resendToken, setResendToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { language } = useLanguage();

  const resendTwoFactorToken = async () => {
    if (show2faForm.formData) {
      const data = { ...show2faForm.formData, locale: language?.locale || 'de-DE' };
      const response = await fetchFromApi('/api/v1/user/check-2fa/resendToken', 'PATCH', data);
      if (response.success) {
        setResendToken(true);
        setErrorMessage(null);
      } else {
        setErrorMessage(response.error?.message || 'Ein unbekannter Fehler ist aufgetreten.');
      }
    }
  };

  return (
    <div className="ps-md-4 border-start mt-4 mt-md-0">
      <p className="text-muted d-flex align-items-center gap-2">
        <EnvelopeFill className="text-primary" />
        Der 2FA-Token wurde an deine E-Mail-Adresse gesendet.
      </p>
      <p className="text-muted d-flex align-items-center gap-2">
        <InfoCircleFill className="text-info" />
        Bitte gib den vollständigen Token exakt wie erhalten ein – du kannst ihn auch einfügen.
      </p>
      <p className="text-muted d-flex align-items-center gap-2">
        <CheckCircleFill className={`text-${show2faForm?.hasTwoFactor ? 'success' : 'danger'}`} />
        Zwei-Faktor-Authentifizierung ist bei dir{' '}
        <strong>{show2faForm?.hasTwoFactor ? 'aktiviert' : 'nicht aktiviert'}</strong>.
      </p>

      {resendToken ? (
        <Alert variant="success">Das 2FA wurde erneut an Ihre E-Mail versendet.</Alert>
      ) : (
        <Button className="w-100" onClick={resendTwoFactorToken}>
          Token erneut senden
        </Button>
      )}
      {errorMessage && (
        <Alert variant="danger" className="mt-2">
          {errorMessage}
        </Alert>
      )}
    </div>
  );
};

export default TwoFactorTokenInfos;
