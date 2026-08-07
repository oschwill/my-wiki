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
import { useTranslation } from '../hooks/hookHelper';

const UserProfile: React.FC = () => {
  const { userName, userHash } = useParams();
  const { user: loggedInUser } = useAuth();

  const [profile, setProfile] = useState<UserProfileBackend>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { trans } = useTranslation();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchFromApi(`/api/v1/user/user-profile/${userName}/${userHash}`, 'GET');

        if (!res.success || !res.user) {
          setError(true);
          return;
        }
        setProfile(res.user);
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
        <div className="mt-2">{trans('my_wiki.user_profile.loading_text')}</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container fluid className="my-5 px-4">
        <Alert variant="warning" className="shadow-sm">
          <h5 className="mb-1">{trans('my_wiki.user_profile.not_available.headline')}</h5>
          <p className="mb-0">{trans('my_wiki.user_profile.not_available.text')}</p>
        </Alert>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container fluid className="my-5 px-4">
        <Alert variant="info" className="shadow-sm">
          <h5 className="mb-1">{trans('my_wiki.user_profile.is_private.headline')}</h5>
          <p className="mb-0">{trans('my_wiki.user_profile.is_private.text')}</p>
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
              {profile.isOnline && (
                <Badge bg="success">{trans('my_wiki.user_profile.status')}</Badge>
              )}
            </Col>
            <Col md={9}>
              <h2>
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-muted mb-1">@{profile.username}</p>
              {profile.email && !profile.isEmailPrivate && (
                <p className="mb-1">
                  <strong>{trans('my_wiki.user_profile.email')}</strong>{' '}
                  <a href={`mailto: ${profile.email}`}>{profile.email}</a>
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
                {trans('my_wiki.user_profile.registered_at')} {formatDate(profile.createdAt)}
                {profile.updatedAt &&
                  ` | ${trans('my_wiki.user_profile.updated_at')} ${formatDate(profile.updatedAt)}`}
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ================= TABS ================= */}
      <Tab.Container defaultActiveKey="articles">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="articles">
              {trans('my_wiki.user_profile.articles.tab')} ({profile.articles.length})
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="stats">{trans('my_wiki.user_profile.statistics.tab')}</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {/* ================= USER ARTICLES ================= */}
          <Tab.Pane eventKey="articles">
            {profile.articles.length === 0 ? (
              <Alert variant="info">{trans('my_wiki.user_profile.articles.no_articles')}</Alert>
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
                        {trans('my_wiki.user_profile.articles.created_at', {
                          createdAt: formatDate(a.createdAt),
                          visitors: a.visitors,
                        })}
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
                  <strong>{trans('my_wiki.user_profile.statistics.number_of_items')}</strong>{' '}
                  {profile.articles.length}
                </p>
                <p>
                  <strong>{trans('my_wiki.user_profile.statistics.total_views')}</strong>{' '}
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
              <Form.Label>
                {trans('my_wiki.user_profile.message_box.label', {
                  firstName: profile.firstName,
                })}
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={trans('my_wiki.user_profile.message_box.placeholder')}
              />
            </Form.Group>
            <Button size="sm" variant="primary">
              {trans('my_wiki.user_profile.message_box.button')}
            </Button>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default UserProfile;
