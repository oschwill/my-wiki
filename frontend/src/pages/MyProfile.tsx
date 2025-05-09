import { useEffect, useReducer, useState } from 'react';
import { Tab, Tabs, Row, Col, Form, Button, Image, Container } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  genericFormReducer,
  initialUserProfileFormState,
  mapUserToFormData,
} from '../utils/stateHelper';
import { UserProfileFormState } from '../dataTypes/types';
import { fetchFromApi } from '../utils/fetchData';
import { PencilSquare, PersonBadge, ShieldLock, GraphUp, ChatDots } from 'react-bootstrap-icons';
import { FaTimesCircle, FaUpload } from 'react-icons/fa';
import { convertToFormData, getFieldError, showImagePreview } from '../utils/functionHelper';
import SelectField from '../components/form/SelectField';
import countries from '../data/data';
import { checkMyUserProfileData } from '../utils/errorHandling';
import ErrorMessage from '../components/general/ErrorMessage';
import { FieldErrorList } from '../dataTypes/baseTypes';
import LoadSpinner from '../components/loader/LoadSpinner';
import { useToast } from '../context/ToastContext';

const MyProfile: React.FC = () => {
  const { user, loading } = useAuth();
  const [key, setKey] = useState<string>('profile');
  const [updateUserValues, setUpdateUserValues] = useState({});
  const [generalErrorMessage, setGeneralErrorMessage] = useState<FieldErrorList | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const showToast = useToast();
  const [formData, dispatch] = useReducer(
    genericFormReducer<UserProfileFormState>,
    initialUserProfileFormState
  );
  const { refreshUser } = useAuth();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
    },
    maxSize: 2 * 1024 * 1024,
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        dispatch({
          type: 'SET_FIELD',
          field: 'profileImage',
          value: acceptedFiles[0],
        });

        // Request Form Data Object State
        setUpdateUserValues((currentState) => ({
          ...currentState,
          profileImage: acceptedFiles[0],
        }));
      }
    },
  });

  useEffect(() => {
    if (!user && !loading) {
      navigate('/');
    }
    const getMyData = async () => {
      const response = await fetchFromApi('/api/v1/user/me', 'GET', []);

      if (response.success && response.user) {
        const mappedData = mapUserToFormData(response.user);
        mappedData.originalProfileImage = mappedData.profileImage;
        dispatch({ type: 'SET_MULTIPLE_FIELDS', values: mappedData });
      }
    };

    getMyData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setGeneralErrorMessage(null);
    // Hier später: API Call zum Speichern
    const errors = checkMyUserProfileData(formData);

    if (Object.keys(errors).length > 0) {
      dispatch({ type: 'SET_ERRORS', errors });
      return;
    }

    // REQUEST
    const formatUserData = convertToFormData(updateUserValues);
    try {
      /* DATA FETCHEN */
      const response = await fetchFromApi('/api/v1/user/changeUserData', 'PATCH', formatUserData);
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);

      if (response.success) {
        // SUCCESS
        await refreshUser();
        showToast('Profil gespeichert', 'success');
      } else {
        // ERROR
        setGeneralErrorMessage(response?.error);
        console.log('General Error', generalErrorMessage);
      }
    } catch (error: any) {
      //
      setGeneralErrorMessage(error.message);
      showToast(error.message, 'error');
      setIsSaving(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type, value } = e.target;

    let finalValue: string | boolean | File | HTMLImageElement | null;

    if (e.target instanceof HTMLInputElement && type === 'checkbox') {
      finalValue = e.target.checked;
    } else {
      finalValue = value;
    }

    dispatch({
      type: 'SET_FIELD',
      field: name as keyof UserProfileFormState,
      value: finalValue,
    });

    // Request Form Data Object State
    setUpdateUserValues((currentState) => ({
      ...currentState,
      [name]: finalValue,
    }));
  };

  const handlePasswordChangeRequest = () => {
    console.log('Passwort ändern anfragen');
    // Platzhalter - später Implementierung
  };

  const resetProfileImage = () => {
    const originalValue = formData.originalProfileImage.value;

    if (
      originalValue &&
      typeof originalValue === 'object' &&
      'url' in originalValue &&
      typeof originalValue.url === 'string'
    ) {
      dispatch({
        type: 'SET_FIELD',
        field: 'profileImage',
        value: originalValue.url,
      });
    } else {
      dispatch({
        type: 'SET_FIELD',
        field: 'profileImage',
        value: null,
      });
    }
  };

  const imagePreview = showImagePreview(formData.profileImage);

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">Willkommen {formData.userName.value}</h1>
      <Tabs
        id="profile-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || 'profile')}
        className="mb-3"
      >
        <Tab
          eventKey="profile"
          title={
            <span className="d-flex align-items-center gap-2">
              <PencilSquare /> Meine Statistiken
            </span>
          }
        >
          <Form onSubmit={handleSubmit} noValidate>
            <Row className="mb-4">
              <Col md={3} className="d-flex justify-content-center">
                {/* Bildvorschau */}
                <div className="d-flex justify-content-center position-relative">
                  <Image
                    src={imagePreview}
                    alt="Profilbild Vorschau"
                    roundedCircle
                    style={{
                      width: '220px',
                      height: '220px',
                      objectFit: 'cover',
                      marginBottom: '10px',
                    }}
                  />
                  {/* Reset-Button */}
                  {formData.profileImage.value instanceof File && (
                    <a
                      href="#"
                      onClick={resetProfileImage}
                      className="position-absolute top-50 start-50 translate-middle p-2 text-light"
                      style={{ fontSize: '40px', cursor: 'pointer' }}
                    >
                      <FaTimesCircle
                        style={{ transition: 'color 0.3s' }}
                        className="hover:text-dark"
                      />
                    </a>
                  )}
                </div>
              </Col>
              <Col md={5}>
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`border d-flex flex-column p-4 text-center rounded h-100 justify-content-center ${
                    isDragActive ? 'bg-light' : ''
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <input {...getInputProps()} />
                  <div className="mb-3">
                    <FaUpload size={40} className="text-muted" />
                  </div>
                  <p>
                    Profilbild hierher ziehen oder klicken, um eine Datei auszuwählen (nur jpg und
                    png Bilder möglich)
                  </p>
                </div>
              </Col>
              {/* PASSWORT ÄNDERN!! */}
              <Col md={4}>
                <Row>
                  <Col md={12}>
                    <h5 className="d-flex align-items-center gap-2">
                      <ShieldLock /> Passwort ändern
                    </h5>
                    <Button variant="secondary" onClick={handlePasswordChangeRequest}>
                      Passwort ändern anfragen
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={12} className="mt-4">
                    <h5 className="d-flex align-items-center gap-2">
                      <ShieldLock /> Email ändern
                    </h5>
                    <Button variant="secondary" onClick={handlePasswordChangeRequest}>
                      Email ändern anfragen
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={6} className="">
                <h5 className="d-flex align-items-center gap-2">
                  <PersonBadge /> Daten
                </h5>
                <Form.Group className="mb-3">
                  <Form.Label>Vorname*</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.firstName.value}
                    onChange={handleChange}
                    isInvalid={
                      !!formData.firstName.error ||
                      !!getFieldError(generalErrorMessage, 'firstName')
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formData.firstName.error}
                    {getFieldError(generalErrorMessage, 'firstName')}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nachname*</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.lastName.value}
                    onChange={handleChange}
                    isInvalid={
                      !!formData.lastName.error || !!getFieldError(generalErrorMessage, 'lastName')
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formData.lastName.error}
                    {getFieldError(generalErrorMessage, 'lastName')}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <SelectField
                    label="Land*"
                    field={formData.location}
                    handleChange={handleChange}
                    selectData={countries}
                    controlId="formLocation"
                    bsClass="mb-4"
                    formName="location"
                  />
                  {getFieldError(generalErrorMessage, 'location') && (
                    <div className="invalid-feedback d-block">
                      {getFieldError(generalErrorMessage, 'location')}
                    </div>
                  )}
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Beschreibung</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="description"
                    value={formData.description.value}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <h5 className="d-flex align-items-center gap-2">
                  <ShieldLock /> Wiki Einstellungen
                </h5>
                <Form.Check
                  type="switch"
                  id="allowMessages"
                  label="Nachrichten erlauben"
                  name="allowMessages"
                  checked={formData.allowMessages.value}
                  onChange={handleChange}
                  className="mb-3 custom-switch-lg"
                />

                <Form.Check
                  type="switch"
                  id="isProfilePrivate"
                  label="Profil privat machen"
                  name="isProfilePrivate"
                  checked={formData.isProfilePrivate.value}
                  onChange={handleChange}
                  className="mb-3 custom-switch-lg"
                />

                <Form.Check
                  type="switch"
                  id="notifyOnNewArticles"
                  label="Benachrichtigungen für neue Artikel"
                  name="notifyOnNewArticles"
                  checked={formData.notifyOnNewArticles.value}
                  onChange={handleChange}
                  className="mb-3 custom-switch-lg"
                />

                <Form.Check
                  type="switch"
                  id="emailNotifyOnNewArticles"
                  label="E-Mail Benachrichtigungen für neue Artikel"
                  name="emailNotifyOnNewArticles"
                  checked={formData.emailNotifyOnNewArticles.value}
                  onChange={handleChange}
                  className="mb-3 custom-switch-lg"
                />
                <Form.Check
                  type="switch"
                  id="twoFactorAuth"
                  label="2FA Authentifizierung aktivieren"
                  name="twoFactorAuth"
                  checked={formData.twoFactorAuth.value}
                  onChange={handleChange}
                  className="mb-3 custom-switch-lg"
                />
              </Col>
            </Row>

            <Button variant="primary" type="submit" className="mt-3" disabled={isSaving}>
              {isSaving ? <LoadSpinner /> : 'Speichern'}
            </Button>
          </Form>
          {getFieldError(generalErrorMessage, 'general') && (
            <ErrorMessage
              width={8}
              bsClass="mt-4"
              generalErrorMessage={getFieldError(generalErrorMessage, 'locatgeneralion')}
            />
          )}
        </Tab>

        <Tab
          eventKey="stats"
          title={
            <span className="d-flex align-items-center gap-2">
              <GraphUp /> Meine Statisitk
            </span>
          }
        >
          <div>
            <h3>Statistiken</h3>
            <p>Hier später Statistiken über Artikel, Kommentare etc.</p>
          </div>
        </Tab>

        <Tab
          eventKey="requests"
          title={
            <span className="d-flex align-items-center gap-2">
              <ChatDots /> Meine Anfragen
            </span>
          }
        >
          <div>
            <h3>Anfragen an Webseitenbetreiber</h3>
            <p>Hier kannst du Supportanfragen oder sonstiges senden (später noch ausbauen).</p>
          </div>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default MyProfile;
