import React from 'react';
import { Button, Col, Form, Row, Image } from 'react-bootstrap';
import { FaTimesCircle, FaUpload } from 'react-icons/fa';
import { ShieldLock, PersonBadge } from 'react-bootstrap-icons';
import SelectField from '../form/SelectField';
import LoadSpinner from '../loader/LoadSpinner';
import ErrorMessage from '../general/ErrorMessage';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { FieldErrorList } from '../../dataTypes/baseTypes';

interface MyUserDataProps {
  imagePreview: string;
  formData: any;
  handleChange: (e: React.ChangeEvent<any>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePasswordChangeRequest: () => void;
  resetProfileImage: (e: React.MouseEvent) => void;
  getRootProps: () => DropzoneRootProps;
  getInputProps: () => DropzoneInputProps;
  isDragActive: boolean;
  countries: any[];
  getFieldError: (errors: FieldErrorList | null, field: string) => string | undefined;
  generalErrorMessage: FieldErrorList | null;
  isSaving: boolean;
}

const MyUserData: React.FC<MyUserDataProps> = ({
  imagePreview,
  formData,
  handleChange,
  handleSubmit,
  handlePasswordChangeRequest,
  resetProfileImage,
  getRootProps,
  getInputProps,
  isDragActive,
  countries,
  getFieldError,
  generalErrorMessage,
  isSaving,
}) => {
  const privacyToggles = [
    {
      name: 'isProfilePrivate',
      label: 'Profil privat machen',
    },
    {
      name: 'isEmailPrivate',
      label: 'E-Mail privat machen',
      condition: !formData.isProfilePrivate.value,
    },
  ];
  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Row className="mb-4">
        <Col md={3} className="d-flex justify-content-center">
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
            {formData.profileImage.value instanceof File && (
              <a
                href="#"
                onClick={resetProfileImage}
                className="position-absolute top-50 start-50 translate-middle p-2 text-light"
                style={{ fontSize: '40px', cursor: 'pointer' }}
              >
                <FaTimesCircle className="hover:text-dark" />
              </a>
            )}
          </div>
        </Col>
        <Col md={5}>
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
              Profilbild hierher ziehen oder klicken, um eine Datei auszuwählen (nur jpg und png
              Bilder möglich)
            </p>
          </div>
        </Col>
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
        <Col md={6}>
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
                !!formData.firstName.error || !!getFieldError(generalErrorMessage, 'firstName')
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
          {[
            ['allowMessages', 'Nachrichten erlauben'],
            ['notifyOnNewArticles', 'Benachrichtigungen für neue Artikel'],
            ['emailNotifyOnNewArticles', 'E-Mail Benachrichtigungen für neue Artikel'],
            ['twoFactorAuth', '2FA Authentifizierung aktivieren'],
          ].map(([name, label]) => (
            <Form.Check
              key={name}
              type="switch"
              id={name}
              label={label}
              name={name}
              checked={formData[name].value}
              onChange={handleChange}
              className="mb-3 custom-switch-lg"
            />
          ))}
          <div className="d-flex gap-5">
            {privacyToggles.map(({ name, label, condition }) => {
              if (condition === false) return null;

              return (
                <Form.Check
                  key={name}
                  type="switch"
                  id={name}
                  label={label}
                  name={name}
                  checked={formData[name].value}
                  onChange={handleChange}
                  className="mb-3 custom-switch-lg"
                />
              );
            })}
          </div>
        </Col>
      </Row>

      <Button variant="primary" type="submit" className="mt-3" disabled={isSaving}>
        {isSaving ? <LoadSpinner /> : 'Speichern'}
      </Button>

      {getFieldError(generalErrorMessage, 'general') && (
        <ErrorMessage
          width={8}
          bsClass="mt-4"
          generalErrorMessage={getFieldError(generalErrorMessage, 'general')}
        />
      )}
    </Form>
  );
};

export default MyUserData;
