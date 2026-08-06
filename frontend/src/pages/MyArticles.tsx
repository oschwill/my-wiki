import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Tabs, Tab, Button } from 'react-bootstrap';
import { fetchFromApi } from '../utils/fetchData';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';
import ConfirmModal from '../components/modal/ConfirmModal';
import { ArticleFeatureFlags, ArticleFieldErrors } from '../dataTypes/types';
import InsertNewArticle from '../components/articles/InsertNewArticle';
import { useAuth } from '../context/AuthContext';
import ShowMyArticles from '../components/articles/ShowMyArticles';
import { useTranslation } from '../hooks/hookHelper';

const MyArticles = () => {
  const [tabKey, setTabKey] = useState('insert');
  const [areas, setAreas] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [articleUserEmail, setArticleUserEmail] = useState('');
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
  const location = useLocation();
  const { trans } = useTranslation();

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
        console.error(trans('my_wiki.my_articles.areas.failed_loading'), err);
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
        console.warn(trans('my_wiki.my_articles.categories.failed_loading'), err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedArea]);

  useEffect(() => {
    if (location.state?.editArticleId) {
      handleEditArticle(location.state.editArticleId);
    }
  }, [location.state]);

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
      showToast(trans('my_wiki.my_articles.form.required_fields.error'), 'warning');
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('category', selectedCategory);
      formData.append('contentTitle', title);
      formData.append('content', content);
      formData.append('email', articleUserEmail);

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
        showToast(trans('my_wiki.my_articles.article.save_success'), 'success');

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
      showToast(trans('my_wiki.my_articles.article.save_failed'), 'error');
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
    console.log(res.data.content);
    const article = res.data;

    setSelectedArea(article.category.area._id);
    setSelectedCategory(article.category._id);
    setTitle(article.title);
    setContent(article.content);
    setArticleUserEmail(article.createdBy.email);

    setFeatureFlags({
      allowCommentsection: article.allowCommentsection,
      allowExportToPDF: article.allowExportToPDF,
      allowPrinting: article.allowPrinting,
      allowSharing: article.allowSharing,
      allowEditing: article.allowEditing,
      allowShowAuthor: article.allowShowAuthor,
    });
  };

  const handleCancelEdit = () => {
    setEditArticleId(null);
    handleReset();
    setTabKey('articles');
  };

  return (
    <Container fluid className="my-4">
      <h1 className="mb-4">{trans('my_wiki.my_articles.administration.headline')}</h1>

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
                  <strong>{trans('my_wiki.my_articles.administration.edit_modus.headline')}</strong>
                  <Button
                    size="sm"
                    variant="outline-dark"
                    className="ms-3"
                    onClick={handleCancelEdit}
                  >
                    {trans('my_wiki.my_articles.administration.edit_modus.cancel')}
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
                content={content}
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
                mode="edit-own"
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
        title={trans('my_wiki.my_articles.article.save')}
        body={trans('my_wiki.my_articles.article.actually_save')}
        confirmText="Speichern"
        confirmVariant="success"
        onConfirm={handleSubmit}
      />

      {/* RESET CONFIRM */}
      <ConfirmModal
        show={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        title={trans('my_wiki.my_articles.article.reject')}
        body={trans('my_wiki.my_articles.article.actually_reject')}
        confirmText="Zurücksetzen"
        confirmVariant="warning"
        onConfirm={handleReset}
      />
    </Container>
  );
};

export default MyArticles;
