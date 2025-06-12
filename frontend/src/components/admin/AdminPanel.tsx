import React, { useState } from 'react';
import { Tab, Nav, Row, Col, Alert, Spinner } from 'react-bootstrap';
import WikiContent from './sections/WikiContent';

interface AdminPanelProps {
  user: any; // erstmal nur als any...
  loading: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, loading }) => {
  const [activeKey, setActiveKey] = useState('areas');

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status" />
        <div>Benutzerdaten werden geladen...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="danger">
        <strong>Fehlende Berechtigung:</strong> Du musst eingeloggt sein, um das Admin-Panel zu
        sehen.
      </Alert>
    );
  }

  return (
    <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k || 'areas')}>
      <Row>
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="areas">
              <Alert variant="info">
                <h4>Fachgebiete verwalten</h4>
                <p>
                  Hier kannst du neue Fachgebiete und Kategorien erstellen oder bestehende
                  bearbeiten.
                </p>
              </Alert>
              <WikiContent />
            </Tab.Pane>
          </Tab.Content>
        </Col>
        <Col sm={3}>
          <Nav variant="pills" className="flex-column">
            <Nav.Item>
              <Nav.Link eventKey="areas">Fachgebiete und Kategorien</Nav.Link>
            </Nav.Item>
            {/* Weitere Admin-Sektionen */}
          </Nav>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default AdminPanel;
