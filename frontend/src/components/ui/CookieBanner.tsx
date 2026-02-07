// components/ui/CookieBanner.tsx
import { Button, Card } from 'react-bootstrap';
import { useCookieConsent } from '../../context/CookieConsentContext';
import { defaultConsent } from '../../dataTypes/cookieConsent';

const CookieBanner: React.FC = () => {
  const { consent, setConsent } = useCookieConsent();

  // bereits entschieden → nichts anzeigen
  if (consent) return null;

  return (
    <div
      className="position-fixed bottom-0 w-100 p-3 "
      style={{ zIndex: 2000, background: '#eaeaea' }}
    >
      <Card className="shadow text-black" style={{ background: '#eaeaea' }}>
        <Card.Body>
          <Card.Title>🍪 Cookies & Datenschutz</Card.Title>
          <Card.Text>
            Wir verwenden Cookies, um grundlegende Funktionen bereitzustellen und optionale Dienste
            zu verbessern.
          </Card.Text>

          <div className="d-flex gap-2 flex-wrap">
            <Button
              variant="primary"
              onClick={() =>
                setConsent({
                  ...defaultConsent,
                  analytics: true,
                  marketing: true,
                })
              }
            >
              Alle akzeptieren
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                setConsent({
                  ...defaultConsent,
                })
              }
            >
              Nur notwendige Cookies
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CookieBanner;
