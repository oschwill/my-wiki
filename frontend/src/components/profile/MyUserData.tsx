import React from 'react';
import { Button, Col, Form, Row, Image } from 'react-bootstrap';
import { FaTimesCircle, FaUpload } from 'react-icons/fa';
import { ShieldLock, PersonBadge } from 'react-bootstrap-icons';
import SelectField from '../form/SelectField';
import LoadSpinner from '../loader/LoadSpinner';
import ErrorMessage from '../general/ErrorMessage';
import { DropzoneRootProps, DropzoneInputProps } from 'react-dropzone';
import { FieldErrorList } from '../../dataTypes/baseTypes';
import { useTranslation } from '../../hooks/hookHelper';

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
  const { trans } = useTranslation();
  const privacyToggles = [
    {
      name: 'isProfilePrivate',
      label: trans('my_wiki.components.my_user_data.is_profile_private'),
    },
    {
      name: 'isEmailPrivate',
      label: trans('my_wiki.components.my_user_data.is_email_private'),
      condition: !formData.isProfilePrivate.value,
    },
  ];

  const translatedCountries = countries.map((country) => ({
    code: country.code,
    name: trans(`my_wiki.data.countries.${country.code}`),
  }));

  return (
    <Form onSubmit={handleSubmit} noValidate>
      <Row className="mb-4">
        <Col md={3} className="d-flex justify-content-center">
          <div className="d-flex justify-content-center position-relative">
            <Image
              src={imagePreview}
              alt={trans('my_wiki.components.my_user_data.image_alt')}
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
            <p>{trans('my_wiki.components.my_user_data.upload_text')}</p>
          </div>
        </Col>
        <Col md={4}>
          <Row>
            <Col md={12}>
              <h5 className="d-flex align-items-center gap-2">
                <ShieldLock /> {trans('my_wiki.components.my_user_data.change_password')}
              </h5>
              <Button variant="secondary" onClick={handlePasswordChangeRequest}>
                {trans('my_wiki.components.my_user_data.request_change_password')}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12} className="mt-4">
              <h5 className="d-flex align-items-center gap-2">
                <ShieldLock /> {trans('my_wiki.components.my_user_data.change_email')}
              </h5>
              <Button variant="secondary" onClick={handlePasswordChangeRequest}>
                {trans('my_wiki.components.my_user_data.request_change_email')}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col md={6}>
          <h5 className="d-flex align-items-center gap-2">
            <PersonBadge /> {trans('my_wiki.components.my_user_data.data')}
          </h5>
          <Form.Group className="mb-3">
            <Form.Label>{trans('my_wiki.components.my_user_data.first_name')}</Form.Label>
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
            <Form.Label>{trans('my_wiki.components.my_user_data.last_name')}</Form.Label>
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
              label={trans('my_wiki.components.my_user_data.country')}
              field={formData.location}
              handleChange={handleChange}
              selectData={translatedCountries}
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
            <Form.Label>{trans('my_wiki.components.my_user_data.description')}</Form.Label>
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
            <ShieldLock /> {trans('my_wiki.components.my_user_data.wiki_settings')}
          </h5>
          {[
            ['allowMessages', trans('my_wiki.components.my_user_data.allow_messages')],
            [
              'notifyOnNewArticles',
              trans('my_wiki.components.my_user_data.notify_on_new_articles'),
            ],
            [
              'emailNotifyOnNewArticles',
              trans('my_wiki.components.my_user_data.email_notify_on_new_articles'),
            ],
            ['twoFactorAuth', trans('my_wiki.components.my_user_data.two_factor_auth')],
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
        {isSaving ? <LoadSpinner /> : trans('my_wiki.components.my_user_data.save')}
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
