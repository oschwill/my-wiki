import React, { useState, useEffect, useRef } from 'react';
import { Container, Tabs, Tab, Form, Button, Spinner } from 'react-bootstrap';
import { fetchFromApi } from '../utils/fetchData';
import { Editor } from '@tinymce/tinymce-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import ConfirmModal from '../components/modal/ConfirmModal';

type FieldErrors = {
  area?: boolean;
  category?: boolean;
  title?: boolean;
  content?: boolean;
};

const InsertArticle = () => {
  const [tabKey, setTabKey] = useState('insert');
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { language } = useLanguage();
  const showToast = useToast();
  const editorRef = useRef<any>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const [featureFlags, setFeatureFlags] = useState({
    allowCommentsection: true,
    allowExportToPDF: false,
    allowPrinting: true,
    allowSharing: true,
    allowEditing: false,
  });

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const locale = language?.locale || 'de-DE';
        const res = await fetchFromApi(`/api/v1/content/public/areas?locale=${locale}`, 'GET');
        setAreas(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Areas', err);
      }
    };

    fetchAreas();
  }, [language]);

  useEffect(() => {
    if (!selectedArea) return;

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const locale = language?.locale || 'de-DE';
        const res = await fetchFromApi(
          `/api/v1/content/public/category/${selectedArea}?locale=${locale}`,
          'GET',
        );
        setCategories(res.data);
      } catch (err) {
        console.warn('Fehler beim Laden der Kategorien', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedArea]);

  const handleReset = () => {
    setShowResetConfirm(false);

    setSelectedArea('');
    setSelectedCategory('');
    setTitle('');
    setContent('');

    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  };

  const handleSubmit = async () => {
    setShowSaveConfirm(false);

    const newErrors = {
      area: !selectedArea,
      category: !selectedCategory,
      title: !title.trim(),
      content: !content.trim(),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some(Boolean);

    if (hasError) {
      showToast('Bitte füllen Sie alle Pflichtfelder aus!', 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('contentTitle', title);
      formData.append('content', content);

      // Feature Flags
      Object.entries(featureFlags).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const res = await fetchFromApi('/api/v1/creator/createArticle', 'POST', formData);

      if (res.success) {
        showToast('Der Artikel wurde erfolgreich gespeichert!', 'success');
        handleReset();
        return;
      }
      console.log(res);
      showToast(res.error.message, 'error');
      if (res.error.errorCode === 11000) {
        setErrors({ area: false, category: false, title: true, content: false });
      }
    } catch (err) {
      showToast('Fehler beim Speichern des Artikels!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFlagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;

    setFeatureFlags((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">Artikelverwaltung</h1>

      <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k || 'insert')} className="mb-3">
        <Tab eventKey="insert" title="Neuen Artikel erstellen">
          <Form onSubmit={(e) => e.preventDefault()}>
            {/* AREA */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Fachgebiet wählen:</strong>
              </Form.Label>
              <Form.Select
                value={selectedArea}
                isInvalid={errors.area}
                onChange={(e) => {
                  setSelectedArea(e.target.value);
                  setErrors((prev) => ({ ...prev, area: false }));
                }}
              >
                <option value="">Bitte wählen</option>
                {areas.map((area: any) => (
                  <option key={area._id} value={area._id}>
                    {area.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {/* CATEGORY */}
            {selectedArea && (
              <Form.Group className="mb-3">
                <Form.Label>Kategorie wählen</Form.Label>
                {loadingCategories ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Form.Select
                    value={selectedCategory}
                    isInvalid={errors.category}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setErrors((prev) => ({ ...prev, category: false }));
                    }}
                  >
                    <option value="">Bitte wählen</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))}
                  </Form.Select>
                )}
              </Form.Group>
            )}

            {/* TITLE */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Titel:</strong>
              </Form.Label>
              <Form.Control
                value={title}
                isInvalid={errors.title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: false }));
                }}
              />
            </Form.Group>

            {/* CONTENT */}
            <Form.Group className="mb-3">
              <Form.Label>
                <strong>Inhalt:</strong>
              </Form.Label>
              <div className={errors.content ? 'border border-danger rounded' : ''}>
                <Editor
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  tinymceScriptSrc="/tinymce/tinymce.min.js"
                  licenseKey="gpl"
                  init={{
                    height: 600,
                    menubar: true,
                    plugins:
                      'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
                    toolbar:
                      'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | fullscreen',
                  }}
                  onEditorChange={(newContent) => setContent(newContent)}
                />
              </div>
            </Form.Group>

            {/* FLAGS */}
            <Form.Group className="mb-4">
              <Form.Label>
                <strong>Artikel Einstellungen:</strong>
              </Form.Label>

              {[
                ['allowCommentsection', 'Kommentare erlauben'],
                ['allowExportToPDF', 'PDF Export erlauben'],
                ['allowPrinting', 'Drucken erlauben'],
                ['allowSharing', 'Teilen erlauben'],
                ['allowEditing', 'Bearbeitung erlauben'],
              ].map(([name, label]) => (
                <Form.Check
                  key={name}
                  type="switch"
                  name={name}
                  label={label}
                  checked={(featureFlags as any)[name]}
                  onChange={handleFlagChange}
                  className="mb-3 custom-switch-lg"
                />
              ))}
            </Form.Group>

            {/* ACTION BUTTONS */}
            <div className="d-flex gap-2">
              <Button onClick={() => setShowSaveConfirm(true)} disabled={submitting}>
                {submitting ? 'Speichern...' : 'Speichern'}
              </Button>

              <Button
                variant="secondary"
                onClick={() => setShowResetConfirm(true)}
                disabled={submitting}
              >
                Zurücksetzen
              </Button>
            </div>
          </Form>
        </Tab>

        <Tab eventKey="articles" title="Meine Artikel (demnächst)">
          <p>Demnächst kannst du hier deine erstellten Artikel einsehen.</p>
        </Tab>
      </Tabs>

      {/* SAVE CONFIRM */}
      <ConfirmModal
        show={showSaveConfirm}
        onClose={() => setShowSaveConfirm(false)}
        title="Artikel speichern"
        body="Möchtest du diesen Artikel wirklich speichern?"
        confirmText="Speichern"
        confirmVariant="success"
        onConfirm={handleSubmit}
      />

      {/* RESET CONFIRM */}
      <ConfirmModal
        show={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title="Formular zurücksetzen"
        body="Möchtest du alle Eingaben wirklich verwerfen?"
        confirmText="Zurücksetzen"
        confirmVariant="warning"
        onConfirm={handleReset}
      />
    </Container>
  );
};

export default InsertArticle;
