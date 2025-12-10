import React, { useEffect, useState } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import { fetchFromApi } from '../../../../utils/fetchData';
import { useToast } from '../../../../context/ToastContext';
import ConfirmModal from '../../../modal/ConfirmModal';

interface Language {
  _id: string;
  key: string;
  label: string;
  locale: string;
  country?: string;
  enabled: boolean;
}

const WikiLanguages: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [newLanguage, setNewLanguage] = useState({
    key: '',
    label: '',
    locale: '',
    country: '',
  });
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [languageToDelete, setLanguageToDelete] = useState<string | null>(null);
  const showToast = useToast();

  // Sprachen laden
  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await fetchFromApi('/api/v1/content/getLanguages', 'GET');
      if (response.success && Array.isArray(response.data)) {
        setLanguages(response.data);
      } else {
        showToast('Fehler beim Laden der Sprachen', 'error');
      }
    } catch {
      showToast('Serverfehler beim Laden der Sprachen', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  // Neue Sprache anlegen
  const handleAddLanguage = async () => {
    if (!newLanguage.key || !newLanguage.label || !newLanguage.locale) {
      showToast('Bitte füllen Sie alle Pflichtfelder aus!', 'error');
      return;
    }

    try {
      const response = await fetchFromApi('/api/v1/admin/insertLanguage', 'POST', newLanguage);
      if (response.success) {
        showToast('Sprache erfolgreich erstellt', 'success');
        setNewLanguage({ key: '', label: '', locale: '', country: '' });
        fetchLanguages();
      } else {
        showToast(response.message || 'Fehler beim Erstellen der Sprache', 'error');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
      showToast(message, 'error');
    }
  };

  // Sprache löschen
  const handleDeleteClick = (id: string) => {
    setLanguageToDelete(id);
    setShowDeleteModal(true);
  };

  // Sprache löschen nach Bestätigung
  const handleConfirmDelete = async () => {
    if (!languageToDelete) return;

    try {
      const response = await fetchFromApi('/api/v1/admin/deleteLanguage', 'DELETE', {
        id: languageToDelete,
      });
      if (response.success) {
        showToast('Sprache erfolgreich gelöscht', 'success');
        setLanguages((prev) => prev.filter((l) => l._id !== languageToDelete));
      } else {
        showToast(response.message || 'Fehler beim Löschen der Sprache', 'error');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unbekannter Fehler';
      showToast(message, 'error');
    } finally {
      setShowDeleteModal(false);
      setLanguageToDelete(null);
    }
  };

  return (
    <div className="p-3">
      <h5>Neue Sprache erstellen</h5>
      <Form className="mb-4">
        <Form.Group className="mb-2">
          <Form.Label>Key (z.B. en_US)</Form.Label>
          <Form.Control
            type="text"
            value={newLanguage.key}
            onChange={(e) => setNewLanguage({ ...newLanguage, key: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Label</Form.Label>
          <Form.Control
            type="text"
            value={newLanguage.label}
            onChange={(e) => setNewLanguage({ ...newLanguage, label: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>Locale (z.B. en-US)</Form.Label>
          <Form.Control
            type="text"
            value={newLanguage.locale}
            onChange={(e) => setNewLanguage({ ...newLanguage, locale: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Land (optional)</Form.Label>
          <Form.Control
            type="text"
            value={newLanguage.country}
            onChange={(e) => setNewLanguage({ ...newLanguage, country: e.target.value })}
          />
        </Form.Group>

        <Button variant="success" onClick={handleAddLanguage}>
          Sprache speichern
        </Button>
      </Form>

      <h5>Vorhandene Sprachen</h5>
      <Table striped bordered hover responsive className="mt-3">
        <thead>
          <tr>
            <th>Key</th>
            <th>Label</th>
            <th>Locale</th>
            <th>Land</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {languages.map((lang) => (
            <tr key={lang._id}>
              <td>{lang.key}</td>
              <td>{lang.label}</td>
              <td>{lang.locale}</td>
              <td>{lang.country || '-'}</td>
              <td>
                <Button size="sm" variant="danger" onClick={() => handleDeleteClick(lang._id)}>
                  Löschen
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ConfirmModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Sprache löschen"
        body="Möchten Sie diese Sprache wirklich löschen?"
        confirmText="Löschen"
        confirmVariant="danger"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default WikiLanguages;
