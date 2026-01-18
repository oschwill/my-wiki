import React, { useEffect, useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { iconMap } from '../../../utils/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchFromApi } from '../../../utils/fetchData';
import { useToast } from '../../../context/ToastContext';
import { scrollToRefWithOffset } from '../../../utils/functionHelper';
import WikiContentList from './wikicontent/WikiContenList';
import { CategoryFromApi, Category, Area } from '../../../dataTypes/types';
import Accordion from 'react-bootstrap/Accordion';
import { Language } from '../../../dataTypes/types';

type AreaTranslation = {
  _id?: string | null;
  title: string;
  description: string;
  icon: string;
  language: string;
};

type CategoryTranslation = {
  _id?: string | null;
  title: string;
  description: string;
  area: string;
  language: string;
};

type ApiFieldError = {
  path: string;
  message: string;
};

const WikiContent: React.FC = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<{ path: string; message: string } | null>(null);
  const [newArea, setNewArea] = useState<Record<string, AreaTranslation>>({});
  const [newCategory, setNewCategory] = useState<Record<string, CategoryTranslation>>({});
  const [editMode, setEditMode] = useState<{ type: 'area' | 'category'; id: string } | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [activeAreaKey, setActiveAreaKey] = useState<string | null>(null);
  const [activeCategoryKey, setActiveCategoryKey] = useState<string | null>(null);

  const areaFormRef = useRef<HTMLHeadingElement>(null);
  const categoryFormRef = useRef<HTMLHeadingElement>(null);
  const showToast = useToast();

  const fetchAreas = async () => {
    try {
      const response = await fetchFromApi('/api/v1/content/getArea', 'GET');
      if (response.success && Array.isArray(response.data)) {
        setAreas(response.data);
      } else {
        showToast('Fehler beim Laden der Fachgebiete', 'error');
      }
    } catch {
      showToast('Serverfehler beim Laden der Fachgebiete', 'error');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetchFromApi('/api/v1/content/getCategory', 'GET');
      if (response.success && Array.isArray(response.data)) {
        const formatted = (response.data as CategoryFromApi[]).map((category) => ({
          ...category,
          area: category.area?._id || '',
        }));
        setCategories(formatted);
      } else {
        showToast('Fehler beim Laden der Kategorien', 'error');
      }
    } catch {
      showToast('Serverfehler beim Laden der Kategorien', 'error');
    }
  };
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetchFromApi('/api/v1/content/getLanguages', 'GET');
        if (response.success && Array.isArray(response.data)) {
          const langs = response.data as Language[];
          // optional: nur aktivierte Sprachen
          setLanguages(langs.filter((l) => l.enabled));
        }
      } catch {
        showToast('Fehler beim Laden der Sprachen', 'error');
      }
    };

    fetchAreas();
    fetchCategories();
    fetchLanguages();
  }, []);

  useEffect(() => {
    if (languages.length === 0 || editMode?.type === 'area') return;

    const initialState: Record<string, AreaTranslation> = {};
    languages.forEach((lang) => {
      initialState[lang.locale] = {
        title: '',
        description: '',
        icon: '',
        language: lang._id,
      };
    });

    const initialCategoryState: Record<string, CategoryTranslation> = {};
    languages.forEach((lang) => {
      initialCategoryState[lang.locale] = {
        _id: null,
        title: '',
        description: '',
        area: '',
        language: lang._id,
      };
    });

    setNewArea(initialState);
    setNewCategory(initialCategoryState);

    if (!activeAreaKey) {
      setActiveAreaKey(languages[0].locale);
    }

    if (!activeCategoryKey) {
      setActiveCategoryKey(languages[0].locale);
    }
  }, [languages]);

  const clearForms = () => {
    const initialAreaState: Record<string, AreaTranslation> = {};
    languages.forEach((lang) => {
      initialAreaState[lang.locale] = {
        title: '',
        description: '',
        icon: '',
        language: lang._id,
      };
    });

    const initialCategoryState: Record<string, CategoryTranslation> = {};
    languages.forEach((lang) => {
      initialCategoryState[lang.locale] = {
        _id: null,
        title: '',
        description: '',
        area: '',
        language: lang._id,
      };
    });
    setNewArea(initialAreaState);
    setNewCategory(initialCategoryState);
    setErrorMessage(null);
    if (languages.length) {
      setActiveAreaKey(languages[0].locale);
      setActiveCategoryKey(languages[0].locale);
    }
  };

  const handleEndEdit = () => {
    clearForms();
    setEditMode(null);
  };

  const handleSubmitArea = async () => {
    setErrorMessage(null);

    const translations: Record<string, AreaTranslation> = {};

    Object.entries(newArea).forEach(([locale, data]) => {
      if (data.title && data.description) {
        translations[locale] = data;
      }
    });

    if (!Object.keys(translations).length) {
      setErrorMessage({
        path: 'area',
        message: 'Bitte mindestens eine Sprache ausfüllen.',
      });
      return;
    }

    try {
      let url = '/api/v1/admin/insertAreaBatch';
      let method: 'POST' | 'PUT' = 'POST';
      let payload: any = { translations };

      // Wenn wir im Edit-Modus sind, update statt insert
      if (editMode?.type === 'area') {
        url = '/api/v1/admin/updateAreaBatch';
        method = 'PUT';
        payload = {
          translationGroup: editMode.id,
          translations: Object.fromEntries(
            Object.entries(newArea).map(([locale, data]) => [
              locale,
              {
                ...data,
              },
            ])
          ),
        };
      }
      const response = await fetchFromApi(url, method, payload);

      if (response.success) {
        showToast(
          editMode?.type === 'area' ? 'Fachgebiet aktualisiert' : 'Fachgebiet gespeichert',
          'success'
        );
        fetchAreas();

        // Form zurücksetzen
        setNewArea(
          Object.fromEntries(
            languages.map((lang) => [
              lang.locale,
              {
                title: '',
                description: '',
                icon: '',
                language: lang._id,
              },
            ])
          )
        );

        // Edit Mode zurücksetzen
        setEditMode(null);
      } else {
        if (Array.isArray(response.error)) {
          const message = (response.error as ApiFieldError[]).map((e) => e.message).join('\n');
          showToast(message, 'error');
        } else {
          showToast(response.error?.message || 'Unbekannter Fehler', 'error');
        }
      }
    } catch {
      showToast('Serverfehler', 'error');
    }
  };

  const handleSubmitCategory = async () => {
    setErrorMessage(null);

    const translations: Record<string, CategoryTranslation> = {};

    Object.entries(newCategory).forEach(([locale, data]) => {
      if (data.title && data.description && data.area) {
        translations[locale] = data;
      }
    });

    if (!Object.keys(translations).length) {
      setErrorMessage({ path: 'category', message: 'Bitte mindestens eine Sprache ausfüllen.' });
      return;
    }

    try {
      const url =
        editMode?.type === 'category'
          ? '/api/v1/admin/updateCategoryBatch'
          : '/api/v1/admin/insertCategoryBatch';
      const method: 'POST' | 'PUT' = editMode?.type === 'category' ? 'PUT' : 'POST';
      const payload =
        editMode?.type === 'category'
          ? { translationGroup: editMode.id, translations }
          : { translations };

      const response = await fetchFromApi(url, method, payload);

      if (response.success) {
        showToast(
          editMode?.type === 'category' ? 'Kategorie aktualisiert' : 'Kategorie gespeichert',
          'success'
        );
        fetchCategories();
        // Form zurücksetzen
        const resetState: Record<string, CategoryTranslation> = {};
        languages.forEach((lang) => {
          resetState[lang.locale] = {
            _id: null,
            title: '',
            description: '',
            area: '',
            language: lang._id,
          };
        });
        setNewCategory(resetState);
        setEditMode(null);
      } else {
        showToast(response.error?.message || 'Fehler beim Speichern', 'error');
      }
    } catch (error) {
      showToast('Serverfehler', 'error');
    }
  };

  const handleEditArea = (areaGroup: Area[]) => {
    if (!languages.length) return;

    const newAreaState: Record<string, AreaTranslation> = {};

    languages.forEach((lang) => {
      // Suche die Area in der Gruppe mit der passenden Sprache
      const translation = areaGroup.find((a) => a.language.locale === lang.locale);

      newAreaState[lang.locale] = translation
        ? {
            _id: translation._id,
            title: translation.title,
            description: translation.description,
            icon: translation.icon,
            language: translation.language._id,
          }
        : {
            _id: null,
            title: '',
            description: '',
            icon: '',
            language: lang._id,
          };
    });

    setNewArea(newAreaState);

    // EditMode: wir nehmen die TranslationGroup als id
    setEditMode({ type: 'area', id: areaGroup[0].translationGroup });

    scrollToRefWithOffset(areaFormRef);

    // Accordion auf die erste Sprache setzen
    setActiveAreaKey(languages[0].locale);
  };

  const handleEditCategory = (categoryGroup: Category[]) => {
    if (!languages.length) return;

    const categoryState: Record<string, CategoryTranslation> = {};

    languages.forEach((lang) => {
      const translation = categoryGroup.find((c) => c.language.locale === lang.locale);
      categoryState[lang.locale] = translation
        ? {
            _id: translation._id,
            title: translation.title,
            description: translation.description,
            area: translation.area,
            language: translation.language._id,
          }
        : {
            _id: null,
            title: '',
            description: '',
            area: '',
            language: lang._id,
          };
    });

    setNewCategory(categoryState);
    setEditMode({ type: 'category', id: categoryGroup[0].translationGroup });
    scrollToRefWithOffset(categoryFormRef, 120);
    setActiveCategoryKey(languages[0].locale);
  };

  const handleDeleteArea = async (id: string) => {
    try {
      const response = await fetchFromApi('/api/v1/admin/deleteArea', 'DELETE', { id });

      if (response.success) {
        setAreas((prev) => prev.filter((a) => a._id !== id));
        showToast('Fachgebiet gelöscht', 'success');
        return;
      }

      showToast(response.error.message, 'error');
    } catch {
      showToast('Löschen fehlgeschlagen', 'error');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const response = await fetchFromApi('/api/v1/admin/deleteCategory', 'DELETE', { id });
      if (response.success) {
        setCategories((prev) => prev.filter((c) => c._id !== id));
        showToast('Kategorie gelöscht', 'success');
        return;
      }

      showToast(response.error.message, 'error');
    } catch {
      showToast('Löschen fehlgeschlagen', 'error');
    }
  };

  return (
    <div className="p-3 position-relative">
      {editMode && (
        <div className="position-sticky top-0 z-3 bg-light py-2 text-center mb-3 border border-warning rounded">
          <strong className="text-warning">
            Bearbeitungsmodus aktiv: {editMode.type === 'area' ? 'Fachgebiet' : 'Kategorie'}
          </strong>
          <div className="mt-2">
            <Button variant="outline-dark" size="sm" onClick={handleEndEdit}>
              Bearbeitung beenden
            </Button>
          </div>
        </div>
      )}

      {/* Area Form */}
      <div className={editMode && editMode.type !== 'area' ? 'opacity-25 pointer-events-none' : ''}>
        <h5 ref={areaFormRef}>
          {editMode?.type === 'area' ? 'Fachgebiet bearbeiten' : 'Neues Fachgebiet'}
        </h5>

        <Form className="mb-4">
          {languages.length === 0 ? (
            <div className="alert alert-danger">
              Es sind keine Sprachen angelegt. Bitte legen Sie zuerst Sprachen an.
            </div>
          ) : (
            <Accordion
              activeKey={activeAreaKey}
              onSelect={(k) => {
                if (typeof k === 'string' || k === null) setActiveAreaKey(k);
              }}
            >
              {languages.map((lang) => {
                const area = newArea[lang.locale];
                if (!area) return null;

                return (
                  <Accordion.Item eventKey={lang.locale} key={lang.locale}>
                    <Accordion.Header>
                      {lang.label} ({lang.locale})
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-2">
                        <Form.Label>Titel</Form.Label>
                        <Form.Control
                          type="text"
                          value={area.title}
                          onChange={(e) =>
                            setNewArea({
                              ...newArea,
                              [lang.locale]: { ...area, title: e.target.value },
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Beschreibung</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={area.description}
                          onChange={(e) =>
                            setNewArea({
                              ...newArea,
                              [lang.locale]: { ...area, description: e.target.value },
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Icon wählen</Form.Label>
                        <div className="d-flex flex-wrap gap-2">
                          {Object.entries(iconMap).map(([key, icon]) => (
                            <div
                              key={key}
                              className={`border rounded p-2 ${
                                area.icon === key ? 'border-primary border-3' : 'border-light'
                              }`}
                              onClick={() =>
                                setNewArea({
                                  ...newArea,
                                  [lang.locale]: { ...area, icon: key },
                                })
                              }
                              style={{ cursor: 'pointer' }}
                            >
                              <FontAwesomeIcon icon={icon} size="lg" />
                            </div>
                          ))}
                        </div>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          )}

          <Button
            className="mt-3"
            variant="success"
            onClick={handleSubmitArea}
            disabled={languages.length === 0}
          >
            Fachgebiet speichern
          </Button>

          {errorMessage?.path === 'area' && (
            <div className="invalid-feedback d-block mt-2">{errorMessage.message}</div>
          )}
        </Form>
      </div>

      <hr />

      {/* Category Form */}
      <div
        className={editMode && editMode.type !== 'category' ? 'opacity-25 pointer-events-none' : ''}
      >
        <h5 ref={categoryFormRef}>
          {editMode?.type === 'category' ? 'Kategorie bearbeiten' : 'Neue Kategorie'}
        </h5>

        <Form>
          {languages.length === 0 ? (
            <div className="alert alert-danger">
              Es sind keine Sprachen angelegt. Bitte legen Sie zuerst Sprachen an.
            </div>
          ) : (
            <Accordion
              activeKey={activeCategoryKey}
              onSelect={(k) => {
                if (typeof k === 'string' || k === null) setActiveCategoryKey(k);
              }}
            >
              {languages.map((lang) => {
                const cat = newCategory[lang.locale];
                if (!cat) return null;

                return (
                  <Accordion.Item eventKey={lang.locale} key={lang.locale}>
                    <Accordion.Header>
                      {lang.label} ({lang.locale})
                    </Accordion.Header>
                    <Accordion.Body>
                      <Form.Group className="mb-2">
                        <Form.Label>Titel</Form.Label>
                        <Form.Control
                          type="text"
                          value={cat.title}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              [lang.locale]: { ...cat, title: e.target.value },
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label>Beschreibung</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          value={cat.description}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              [lang.locale]: { ...cat, description: e.target.value },
                            })
                          }
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Fachgebiet zuordnen</Form.Label>
                        <Form.Select
                          value={cat.area}
                          onChange={(e) =>
                            setNewCategory({
                              ...newCategory,
                              [lang.locale]: { ...cat, area: e.target.value },
                            })
                          }
                        >
                          <option value="">Bitte wählen</option>
                          {areas
                            .filter((a) => a.language?.locale === lang.locale)
                            .map((a) => (
                              <option key={a._id} value={a._id}>
                                {a.title}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </Accordion.Body>
                  </Accordion.Item>
                );
              })}
            </Accordion>
          )}

          <Button
            variant="primary"
            onClick={handleSubmitCategory}
            disabled={languages.length === 0}
          >
            {editMode?.type === 'category' ? 'Kategorie aktualisieren' : 'Kategorie speichern'}
          </Button>

          {errorMessage?.path === 'category' && (
            <div className="invalid-feedback d-block">{errorMessage.message}</div>
          )}
        </Form>
      </div>

      <div className="my-4 border-top border-5"></div>

      <div className={editMode ? 'opacity-25 pointer-events-none' : ''}>
        <WikiContentList
          areas={areas}
          categories={categories}
          handleEditArea={handleEditArea}
          handleDeleteArea={handleDeleteArea}
          handleEditCategory={handleEditCategory}
          handleDeleteCategory={handleDeleteCategory}
        />
      </div>
    </div>
  );
};

export default WikiContent;
