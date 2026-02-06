import { Container } from 'react-bootstrap';

const PrivacyPolicy = () => {
  return (
    <Container className="my-5">
      <h1 className="mb-4">Datenschutzerklärung</h1>

      <p>
        Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre
        Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG).
      </p>

      <h4 className="mt-4">1. Verantwortlicher</h4>
      <p>
        Oliver Schwill
        <br />
        E-Mail: kontakt@deinedomain.de
      </p>

      <h4 className="mt-4">2. Zugriffsdaten</h4>
      <p>
        Beim Besuch dieser Website werden automatisch Informationen erfasst (z. B. IP-Adresse,
        Browsertyp, Uhrzeit des Zugriffs). Diese Daten dienen ausschließlich der technischen
        Überwachung und Verbesserung der Website.
      </p>

      <h4 className="mt-4">3. Personenbezogene Daten</h4>
      <p>
        Personenbezogene Daten werden nur erhoben, wenn Sie diese freiwillig zur Verfügung stellen
        (z. B. bei Registrierung oder Kontaktaufnahme).
      </p>

      <h4 className="mt-4">4. Cookies</h4>
      <p>
        Diese Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. Sie können die
        Speicherung von Cookies in Ihrem Browser deaktivieren.
      </p>

      <h4 className="mt-4">5. Ihre Rechte</h4>
      <ul>
        <li>Auskunft über Ihre gespeicherten Daten</li>
        <li>Berichtigung oder Löschung</li>
        <li>Einschränkung der Verarbeitung</li>
        <li>Widerruf erteilter Einwilligungen</li>
      </ul>

      <h4 className="mt-4">6. Änderungen</h4>
      <p>Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.</p>
    </Container>
  );
};

export default PrivacyPolicy;
