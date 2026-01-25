import React, { useState, useEffect, useRef } from 'react';
import { Container, Tabs, Tab, Form, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../utils/fetchData';
import { Editor } from '@tinymce/tinymce-react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

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
  const navigate = useNavigate();
  const { language } = useLanguage();

  const showToast = useToast();

  const editorRef = useRef<any>(null);

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

  // Lade Kategorien
  useEffect(() => {
    if (!selectedArea) return;

    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const res = await fetchFromApi(`/api/v1/content/getCategory/${selectedArea}`, 'GET');
        setCategories(res.data);
      } catch (err) {
        console.error('Fehler beim Laden der Kategorien', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedArea]);

  const handleReset = () => {
    setSelectedArea('');
    setSelectedCategory('');
    setTitle('');
    setContent('');
    if (editorRef.current) {
      editorRef.current.setContent('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || !title || !content) {
      showToast('Bitte füllen Sie alle Pflichtfelder aus!.', 'warning');
      return;
    }
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('contentTitle', title);
      formData.append('content', content);

      const res = await fetchFromApi('/api/v1/creator/createArticle', 'POST', formData);

      console.log(res);

      if (res.success) {
        alert('Artikel erfolgreich erstellt!');
        handleReset();
        // navigate('/');
      }
    } catch (err) {
      showToast('Fehler beim Speichern des Artikels!', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">Artikelverwaltung</h1>
      <Tabs
        id="insert-article-tabs"
        activeKey={tabKey}
        onSelect={(k) => setTabKey(k || 'insert')}
        className="mb-3"
      >
        <Tab eventKey="insert" title="Neuen Artikel erstellen">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="areaSelect">
              <Form.Label>Fachgebiet wählen</Form.Label>
              <Form.Select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                <option value="">Bitte wählen</option>
                {areas.map((area: any) => (
                  <option key={area._id} value={area._id}>
                    {area.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {selectedArea && (
              <Form.Group className="mb-3" controlId="categorySelect">
                <Form.Label>Kategorie wählen</Form.Label>
                {loadingCategories ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  <Form.Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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

            <Form.Group className="mb-3" controlId="titleInput">
              <Form.Label>Titel</Form.Label>
              <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="contentEditor">
              <Form.Label>Inhalt</Form.Label>
              <Editor
                onInit={(evt, editor) => (editorRef.current = editor)}
                tinymceScriptSrc="/tinymce/tinymce.min.js"
                licenseKey="gpl"
                init={{
                  height: 600,
                  menubar: true,
                  plugins:
                    'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table code help wordcount',
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | ' +
                    'alignleft aligncenter alignright alignjustify | ' +
                    'bullist numlist outdent indent table | removeformat | fullscreen | help',
                }}
                onEditorChange={(newContent) => {
                  setContent(newContent);
                }}
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting ? 'Speichern...' : 'Speichern'}
              </Button>
              <Button variant="secondary" onClick={handleReset} disabled={submitting}>
                Zurücksetzen
              </Button>
            </div>
          </Form>
        </Tab>

        <Tab eventKey="articles" title="Meine Artikel (demnächst)">
          <p>Demnächst kannst du hier deine erstellten Artikel einsehen.</p>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default InsertArticle;
