import { Container } from 'react-bootstrap';

const TermsAndConditions = () => {
  return (
    <Container className="my-5">
      <h1 className="mb-4">Allgemeine Geschäftsbedingungen (AGB)</h1>

      <h4>1. Geltungsbereich</h4>
      <p>
        Diese AGB gelten für die Nutzung der Website „My Wiki“ in der jeweils aktuellen Fassung.
      </p>

      <h4 className="mt-4">2. Inhalte</h4>
      <p>
        Die bereitgestellten Inhalte dienen ausschließlich Informationszwecken. Für Richtigkeit,
        Vollständigkeit und Aktualität wird keine Gewähr übernommen.
      </p>

      <h4 className="mt-4">3. Nutzerkonten</h4>
      <p>
        Nutzer sind verpflichtet, ihre Zugangsdaten vertraulich zu behandeln. Missbräuchliche
        Nutzung ist untersagt.
      </p>

      <h4 className="mt-4">4. Urheberrecht</h4>
      <p>
        Alle Inhalte dieser Website unterliegen dem Urheberrecht. Eine Weiterverwendung ohne
        ausdrückliche Zustimmung ist nicht gestattet.
      </p>

      <h4 className="mt-4">5. Haftung</h4>
      <p>
        Es wird keine Haftung für Schäden übernommen, die durch die Nutzung oder Nichtverfügbarkeit
        der Website entstehen.
      </p>

      <h4 className="mt-4">6. Schlussbestimmungen</h4>
      <p>Es gilt das Recht der Bundesrepublik Deutschland.</p>
    </Container>
  );
};

export default TermsAndConditions;
