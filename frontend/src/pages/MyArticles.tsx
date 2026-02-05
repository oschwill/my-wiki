import React, { useState, useEffect, useRef } from 'react';
import { Container, Tabs, Tab } from 'react-bootstrap';
import { fetchFromApi } from '../utils/fetchData';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import ConfirmModal from '../components/modal/ConfirmModal';
import { ArticleFeatureFlags, ArticleFieldErrors } from '../dataTypes/types';
import InsertNewArticle from '../components/articles/InsertNewArticle';
import { useAuth } from '../context/AuthContext';
import ShowMyArticles from '../components/articles/ShowMyArticles';

const MyArticles = () => {
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
  const [errors, setErrors] = useState<ArticleFieldErrors>({});
  const [lastCreatedArticleId, setLastCreatedArticleId] = useState<string | null>(null);
  const { user: loggedInUser } = useAuth();

  const [featureFlags, setFeatureFlags] = useState<ArticleFeatureFlags>({
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

        const createdArticleId = res?._id;
        setLastCreatedArticleId(createdArticleId);

        handleReset();
        setTabKey('articles');
        return;
      }
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
          <InsertNewArticle
            areas={areas}
            categories={categories}
            selectedArea={selectedArea}
            selectedCategory={selectedCategory}
            title={title}
            errors={errors}
            featureFlags={featureFlags}
            loadingCategories={loadingCategories}
            submitting={submitting}
            editorRef={editorRef}
            onAreaChange={(val) => {
              setSelectedArea(val);
              setErrors((p) => ({ ...p, area: false }));
            }}
            onCategoryChange={(val) => {
              setSelectedCategory(val);
              setErrors((p) => ({ ...p, category: false }));
            }}
            onTitleChange={(val) => {
              setTitle(val);
              setErrors((p) => ({ ...p, title: false }));
            }}
            onContentChange={setContent}
            onFlagChange={handleFlagChange}
            onSaveClick={() => setShowSaveConfirm(true)}
            onResetClick={() => setShowResetConfirm(true)}
          />
        </Tab>

        <Tab eventKey="articles" title="Meine Artikel">
          {loggedInUser && (
            <ShowMyArticles
              userId={loggedInUser.userId}
              highlightArticleId={lastCreatedArticleId}
              active={tabKey === 'articles'}
            />
          )}
        </Tab>
        <Tab eventKey="edit" title="bestehenden Artikel bearbeiten" disabled>
          <p>Hier editieren wir einen bestehenden Artikel</p>
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

export default MyArticles;
