// frontend/src/components/admin/sections/WikiContent.tsx
import React, { useEffect, useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { iconMap } from '../../../utils/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchFromApi } from '../../../utils/fetchData';
import { useToast } from '../../../context/ToastContext';

const WikiContent: React.FC = () => {
  // später durch echte Daten aus DB ersetzen
  const [areas, setAreas] = useState<
    { title: string; description: string; icon: string; _id: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [newArea, setNewArea] = useState({
    title: '',
    description: '',
    icon: '',
  });

  const [newCategory, setNewCategory] = useState({
    title: '',
    description: '',
    area: '',
  });
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
      } catch (err: any) {
        showToast('Serverfehler beim Laden der Fachgebiete', 'error');
      }
    };

    fetchAreas();
  }, []);

  const handleAddArea = async () => {
    setErrorMessage(null);
    if (!newArea.title || !newArea.icon || !newArea.description) {
      setErrorMessage('Bitte füllen Sie alle Felder aus!');
      return;
    }
    setNewArea({ title: '', description: '', icon: '' });
    // INSERTEN
    try {
      /* DATA FETCHEN */
      const response = await fetchFromApi('/api/v1/admin/insertArea', 'POST', newArea);
      console.log(response);
      if (response.success) {
        const insertedArea = {
          ...newArea,
          _id: response._id,
        };
        setAreas([...areas, insertedArea]);
        showToast('Fachgebiet gespeichert', 'success');
      } else {
        // ERROR
        setErrorMessage(
          response.error.message ||
            'Denk dran Titel muss 3 Zeichen lang sein und die Beschreibung 10 Zeichen!!'
        );
        showToast('Fachgebiet speichern fehlgeschlagen', 'error');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  const handleAddCategory = async () => {
    setErrorMessage(null);
    if (!newCategory.title || !newCategory.description || !newCategory.area) return;
    setNewCategory({ title: '', description: '', area: '' });

    // INSERTEN
    try {
      /* DATA FETCHEN */
      const response = await fetchFromApi('/api/v1/admin/insertCategory', 'POST', newCategory);

      if (response.success) {
        showToast('Kategorie gespeichert', 'success');
      } else {
        // ERROR
        setErrorMessage(response.error.message);
        showToast('Kategorie speichern fehlgeschlagen', 'error');
      }
    } catch (error: any) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="p-3">
      <h5>Neues Fachgebiet</h5>
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

        <Button variant="success" onClick={handleAddArea}>
          Fachgebiet speichern
        </Button>
        {errorMessage && <div className="invalid-feedback d-block">{errorMessage}</div>}
      </Form>

      <hr />

      <h5>Neue Kategorie</h5>
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

        <Button variant="primary" onClick={handleAddCategory}>
          Kategorie speichern
        </Button>
        {errorMessage && <div className="invalid-feedback d-block">{errorMessage}</div>}
      </Form>
    </div>
  );
};

export default WikiContent;
