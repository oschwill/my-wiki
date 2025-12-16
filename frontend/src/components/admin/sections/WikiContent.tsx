import React, { useEffect, useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { iconMap } from '../../../utils/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchFromApi } from '../../../utils/fetchData';
import { useToast } from '../../../context/ToastContext';
import { scrollToRefWithOffset } from '../../../utils/functionHelper';
import WikiContentList from './wikicontent/WikiContenList';
import { CategoryFromApi } from '../../../dataTypes/types';

const WikiContent: React.FC = () => {
  const [areas, setAreas] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<{ path: string; message: string } | null>(null);
  const [newArea, setNewArea] = useState({ title: '', description: '', icon: '' });
  const [newCategory, setNewCategory] = useState({ title: '', description: '', area: '' });
  const [editMode, setEditMode] = useState<{ type: 'area' | 'category'; id: string } | null>(null);

  const areaFormRef = useRef<HTMLHeadingElement>(null);
  const categoryFormRef = useRef<HTMLHeadingElement>(null);
  const showToast = useToast();

  useEffect(() => {
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

    fetchAreas();
    fetchCategories();
  }, []);

  const clearForms = () => {
    setNewArea({ title: '', description: '', icon: '' });
    setNewCategory({ title: '', description: '', area: '' });
    setErrorMessage(null);
  };

  const handleEndEdit = () => {
    clearForms();
    setEditMode(null);
  };

  const handleSubmitArea = async () => {
    setErrorMessage(null);
    if (!newArea.title || !newArea.description || !newArea.icon) {
      setErrorMessage({ path: 'area', message: 'Bitte füllen Sie alle Felder aus!' });
      return;
    }

    try {
      const url =
        editMode?.type === 'area' ? '/api/v1/admin/updateArea' : '/api/v1/admin/insertArea';
      const method = editMode?.type === 'area' ? 'PUT' : 'POST';
      const payload = editMode?.type === 'area' ? { ...newArea, _id: editMode.id } : newArea;
      const response = await fetchFromApi(url, method, payload);

      if (response.success) {
        if (editMode?.type === 'area') {
          setAreas((prev) =>
            prev.map((a) => (a._id === editMode.id ? { ...newArea, _id: editMode.id } : a))
          );
          showToast('Fachgebiet aktualisiert', 'success');
        } else {
          setAreas((prev) => [...prev, { ...newArea, _id: response._id }]);
          showToast('Fachgebiet gespeichert', 'success');
        }
        clearForms();
        setEditMode(null);
      } else {
        showToast(response.error?.message || 'Fehler beim Speichern', 'error');
      }
    } catch {
      showToast('Ein Fehler ist aufgetreten.', 'error');
    }
  };

  const handleSubmitCategory = async () => {
    setErrorMessage(null);
    if (!newCategory.title || !newCategory.description || !newCategory.area) {
      setErrorMessage({ path: 'category', message: 'Bitte füllen Sie alle Felder aus!' });
      return;
    }

    try {
      const url =
        editMode?.type === 'category'
          ? '/api/v1/admin/updateCategory'
          : '/api/v1/admin/insertCategory';
      const method = editMode?.type === 'category' ? 'PUT' : 'POST';
      const payload =
        editMode?.type === 'category' ? { ...newCategory, _id: editMode.id } : newCategory;
      const response = await fetchFromApi(url, method, payload);

      if (response.success) {
        if (editMode?.type === 'category') {
          setCategories((prev) =>
            prev.map((c) => (c._id === editMode.id ? { ...newCategory, _id: editMode.id } : c))
          );
          showToast('Kategorie aktualisiert', 'success');
        } else {
          setCategories((prev) => [...prev, { ...newCategory, _id: response._id }]);
          showToast('Kategorie gespeichert', 'success');
        }
        clearForms();
        setEditMode(null);
      } else {
        showToast(response.error?.message || 'Fehler beim Speichern', 'error');
      }
    } catch {
      showToast('Ein Fehler ist aufgetreten.', 'error');
    }
  };

  const handleEditArea = (area: any) => {
    setNewArea({ title: area.title, description: area.description, icon: area.icon });
    setEditMode({ type: 'area', id: area._id });
    scrollToRefWithOffset(areaFormRef);
  };

  const handleEditCategory = (category: any) => {
    setNewCategory({
      title: category.title,
      description: category.description,
      area: category.area,
    });
    setEditMode({ type: 'category', id: category._id });
    scrollToRefWithOffset(categoryFormRef, 120);
  };

  const handleDeleteArea = async (id: string) => {
    try {
      const response = await fetchFromApi('/api/v1/admin/deleteArea', 'DELETE', { id });
      console.log(response);
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
          <Form.Group className="mb-2">
            <Form.Label>Titel</Form.Label>
            <Form.Control
              type="text"
              value={newArea.title}
              onChange={(e) => setNewArea({ ...newArea, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={newArea.description}
              onChange={(e) => setNewArea({ ...newArea, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Icon wählen</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {Object.entries(iconMap).map(([key, icon]) => (
                <div
                  key={key}
                  className={`border rounded p-2 ${
                    newArea.icon === key ? 'border-primary border-3' : 'border-light'
                  }`}
                  onClick={() => setNewArea({ ...newArea, icon: key })}
                  style={{ cursor: 'pointer' }}
                >
                  <FontAwesomeIcon icon={icon} size="lg" />
                </div>
              ))}
            </div>
          </Form.Group>

          <Button variant="success" onClick={handleSubmitArea}>
            {editMode?.type === 'area' ? 'Fachgebiet aktualisieren' : 'Fachgebiet speichern'}
          </Button>
          {errorMessage?.path === 'area' && (
            <div className="invalid-feedback d-block">{errorMessage.message}</div>
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
          <Form.Group className="mb-2">
            <Form.Label>Titel</Form.Label>
            <Form.Control
              type="text"
              value={newCategory.title}
              onChange={(e) => setNewCategory({ ...newCategory, title: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-2">
            <Form.Label>Beschreibung</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fachgebiet zuordnen</Form.Label>
            <Form.Select
              value={newCategory.area}
              onChange={(e) => setNewCategory({ ...newCategory, area: e.target.value })}
            >
              <option value="">Bitte wählen</option>
              {areas.map((area, index) => (
                <option key={index} value={area._id}>
                  {area.title}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button variant="primary" onClick={handleSubmitCategory}>
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
