import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Row,
  Col,
  Button,
  Badge,
  Form,
  Spinner,
  Alert,
  Tab,
  Nav,
} from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/functionHelper';
import { fetchFromApi } from '../utils/fetchData';
import countries from '../data/countries.json';
import { ArticleBackend, UserProfileBackend } from '../dataTypes/types';

const UserProfile: React.FC = () => {
  const { userName, userHash } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState<UserProfileBackend>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchFromApi(`/api/v1/user/user-profile/${userName}/${userHash}`, 'GET');

        if (!res.success || !res.user) {
          setError(true);
          return;
        }
        setProfile(res.user);
        console.log(profile);
      } catch (err) {
        console.warn(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (userHash) {
      loadProfile();
    }
  }, [userHash, userName]);

  if (loading || !profile) {
    return (
      <Container fluid className="my-5 text-center">
        <Spinner animation="border" />
        <div className="mt-2">Profil wird geladen...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="my-5 px-4">
        <Alert variant="warning" className="shadow-sm">
          <h5 className="mb-1">Profil nicht verfügbar</h5>
          <p className="mb-0">Das Profil konnte nicht gefunden werden oder ist privat.</p>
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container fluid className="my-5 px-4">
        <Alert variant="info" className="shadow-sm">
          <h5 className="mb-1">Profil privat</h5>
          <p className="mb-0">Dieses Profil ist privat und kann nicht eingesehen werden.</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="my-4 px-4">
      {/* ================= PROFILE HEADER ================= */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3} className="text-center">
              <img
                src={profile.profileImage || '/images/profileImageDefault.png'}
                alt={profile.username}
                className="rounded-circle img-fluid mb-2"
                style={{ maxWidth: '150px' }}
              />
              {profile.isOnline && <Badge bg="success">Online</Badge>}
            </Col>
            <Col md={9}>
              <h2>
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted mb-1">@{profile.username}</p>
              {profile.email && !profile.isEmailPrivate && (
                <p className="mb-1">
                  <strong>Email:</strong> <a href={`mailto: ${profile.email}`}>{profile.email}</a>
                </p>
              )}
              {profile.location && (
                <p className="mb-1">
                  <strong>Ort:</strong>{' '}
                  {countries.find((c) => c.code === profile.location)?.name || profile.location}
                </p>
              )}
              {profile.description && <p className="mb-1">{profile.description}</p>}
              <p className="text-muted mb-0">
                Registriert am: {formatDate(profile.createdAt)}
                {profile.updatedAt && ` | Zuletzt aktualisiert: ${formatDate(profile.updatedAt)}`}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ================= TABS ================= */}
      <Tab.Container defaultActiveKey="articles">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="articles">Artikel ({profile.articles.length})</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="stats">Statistiken</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {/* ================= USER ARTICLES ================= */}
          <Tab.Pane eventKey="articles">
            {profile.articles.length === 0 ? (
              <Alert variant="info">Dieser Nutzer hat noch keine Artikel veröffentlicht.</Alert>
            ) : (
              <div className="d-flex gap-4 flex-wrap">
                {profile.articles.map((a: ArticleBackend) => (
                  <Card className="shadow-sm" key={a._id}>
                    <Card.Body>
                      <h5>
                        <Link
                          to={`/area/${a.category.area.queryPath}/category/${a.category.queryPath}/article/${a._id}`}
                        >
                          {a.title}
                        </Link>
                      </h5>
                      <p className="text-muted mb-0">
                        Erstellt: {formatDate(a.createdAt)} | Aufrufe: {a.visitors}
                      </p>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Tab.Pane>

          {/* ================= USER STATS ================= */}
          <Tab.Pane eventKey="stats">
            <Card className="shadow-sm mb-3">
              <Card.Body>
                <p>
                  <strong>Anzahl Artikel:</strong> {profile.articles.length}
                </p>
                <p>
                  <strong>Gesamtaufrufe:</strong>{' '}
                  {profile.articles.reduce(
                    (acc: number, a: ArticleBackend) => acc + (a.visitors || 0),
                    0,
                  )}
                </p>
                {/* Weitere Statistiken können hier ergänzt werden */}
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* ================= MESSAGE BOX ================= */}
      {profile.allowMessages && loggedInUser && (
        <Card className="shadow-sm mt-4">
          <Card.Body>
            <Form.Group className="mb-2">
              <Form.Label>Nachricht an {profile.firstName}</Form.Label>
              <Form.Control as="textarea" rows={4} placeholder="Deine Nachricht..." />
            </Form.Group>
            <Button size="sm" variant="primary">
              Nachricht senden
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserProfile;
