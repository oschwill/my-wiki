import React, { useState, useEffect, useRef } from 'react';
import { Container, Tabs, Tab, Button } from 'react-bootstrap';
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
    allowShowAuthor: true,
  });
  const [editArticleId, setEditArticleId] = useState<string | null>(null);

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

      const url = editArticleId
        ? `/api/v1/creator/updateArticle/${editArticleId}`
        : `/api/v1/creator/createArticle`;

      const method = editArticleId ? 'PUT' : 'POST';

      const res = await fetchFromApi(url, method, formData);

      if (res.success) {
        showToast('Der Artikel wurde erfolgreich gespeichert!', 'success');

        const createdArticleId = res?._id;
        setLastCreatedArticleId(createdArticleId);

        handleReset();
        setEditArticleId(null);
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
    console.log(checked);

    setFeatureFlags((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleEditArticle = async (articleId: string) => {
    setTabKey('insert');
    setEditArticleId(articleId);

    const res = await fetchFromApi(`/api/v1/creator/getMySingleArticle/${articleId}`, 'GET');

    const article = res.data;

    setSelectedArea(article.category.area._id);
    setSelectedCategory(article.category._id);
    setTitle(article.title);
    setContent(article.content);

    setFeatureFlags({
      allowCommentsection: article.allowCommentsection,
      allowExportToPDF: article.allowExportToPDF,
      allowPrinting: article.allowPrinting,
      allowSharing: article.allowSharing,
      allowEditing: article.allowEditing,
      allowShowAuthor: article.allowShowAuthor,
    });

    setTimeout(() => {
      editorRef.current?.setContent(article.content);
    }, 0);
  };

  const handleCancelEdit = () => {
    setEditArticleId(null);
    handleReset();
  };

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">Artikelverwaltung</h1>

      <Tabs activeKey={tabKey} onSelect={(k) => setTabKey(k || 'insert')} className="mb-3">
        <Tab eventKey="insert" title="Artikel erstellen">
          <div style={{ position: 'relative' }}>
            {editArticleId && (
              <>
                {/* Hintergrund abdunkeln */}
                <div
                  className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
                  style={{ zIndex: 1000 }}
                />
                {/* Banner für Editmodus */}
                <div
                  className="position-sticky top-0 bg-warning p-3 text-center shadow mb-3"
                  style={{ zIndex: 1100 }}
                >
                  <strong>✏️ Bearbeitungsmodus aktiv</strong>
                  <Button
                    size="sm"
                    variant="outline-dark"
                    className="ms-3"
                    onClick={handleCancelEdit}
                  >
                    Bearbeitung abbrechen
                  </Button>
                </div>
              </>
            )}

            {/* InsertNewArticle Formular */}
            <div
              style={
                editArticleId
                  ? {
                      position: 'relative',
                      zIndex: 1099,
                      backgroundColor: '#fff',
                      padding: '1%',
                      borderRadius: '6px',
                    }
                  : undefined
              }
            >
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
            </div>
          </div>
        </Tab>

        <Tab eventKey="articles" title="Meine Artikel">
          {loggedInUser && (
            <ShowMyArticles
              userId={loggedInUser.userId}
              highlightArticleId={lastCreatedArticleId}
              active={tabKey === 'articles'}
              onEditArticle={handleEditArticle}
            />
          )}
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
