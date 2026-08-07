import React, { useState } from 'react';
import { Tab, Nav, Row, Col, Alert, Spinner } from 'react-bootstrap';
import WikiContent from './sections/WikiContent';
import UserList from './sections/users/UserList';
import WikiLanguages from './sections/location/WikiLanguages';
import { useTranslation } from '../../hooks/hookHelper';
import { transHtml } from '../../utils/functionHelper';

interface AdminPanelProps {
  user: any; // erstmal nur als any...
  loading: boolean;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ user, loading }) => {
  const [activeKey, setActiveKey] = useState('languages');
  const { trans } = useTranslation();

  if (loading) {
    return (
      <div className="text-center p-4">
        <Spinner animation="border" role="status" />
        <div>{trans('my_wiki.components.admin_panel.loading_text')}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert variant="danger">
        {transHtml(trans('my_wiki.components.admin_panel.no_permission'))}
      </Alert>
    );
  }

  return (
    <Tab.Container activeKey={activeKey} onSelect={(k) => setActiveKey(k || 'languages')}>
      <Row className="position-relative">
        <Col sm={9}>
          <Tab.Content>
            <Tab.Pane eventKey="areas">
              <Alert variant="info">
                <h4>{trans('my_wiki.components.admin_panel.area_category.headline')}</h4>
                <p>{trans('my_wiki.components.admin_panel.area_category.text')}</p>
              </Alert>
              <WikiContent />
            </Tab.Pane>
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="users">
              <Alert variant="info">
                <h4>{trans('my_wiki.components.admin_panel.user.headline')}</h4>
                <p>{trans('my_wiki.components.admin_panel.user.text')}</p>
              </Alert>
              <UserList />
            </Tab.Pane>
          </Tab.Content>
          <Tab.Content>
            <Tab.Pane eventKey="languages">
              <Alert variant="info">
                <h4>{trans('my_wiki.components.admin_panel.languages.headline')}</h4>
                <p>{trans('my_wiki.components.admin_panel.languages.text')}</p>
              </Alert>
              <WikiLanguages />
            </Tab.Pane>
          </Tab.Content>
        </Col>
        <Col sm={3}>
          <div className="admin-sidebar">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="languages">
                  {trans('my_wiki.components.admin_panel.languages.nav_item')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="areas">
                  {trans('my_wiki.components.admin_panel.area_category.nav_item')}
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="users">
                  {trans('my_wiki.components.admin_panel.user.nav_item')}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Col>
      </Row>
    </Tab.Container>
  );
};

export default AdminPanel;
