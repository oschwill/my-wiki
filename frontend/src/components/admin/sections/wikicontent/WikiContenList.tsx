import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconMap } from '../../../../utils/icons';

interface Area {
  _id: string;
  title: string;
  description: string;
  icon: string;
}

interface Category {
  _id: string;
  title: string;
  description: string;
  area: string;
}

interface WikiContentListProps {
  areas: Area[];
  categories: Category[];
  handleEditArea: (area: Area) => void;
  handleDeleteArea: (id: string) => void;
  handleEditCategory: (category: Category) => void;
  handleDeleteCategory: (id: string) => void;
}

const WikiContentList: React.FC<WikiContentListProps> = ({
  areas,
  categories,
  handleEditArea,
  handleDeleteArea,
  handleEditCategory,
  handleDeleteCategory,
}) => {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="mb-4">Vorhandene Fachgebiete</h4>

      <Table striped hover responsive className="mb-5">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Titel</th>
            <th>Beschreibung</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {areas.map((area) => (
            <tr key={area._id}>
              <td>
                <FontAwesomeIcon icon={iconMap[area.icon]} size="lg" />
              </td>
              <td>{area.title}</td>
              <td>{area.description}</td>
              <td>
                <Button
                  variant="warning"
                  size="sm"
                  onClick={() => handleEditArea(area)}
                  className="me-2"
                >
                  Bearbeiten
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDeleteArea(area._id)}>
                  Löschen
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <h4 className="mb-3">Vorhandene Kategorien</h4>

      <Table striped hover responsive>
        <thead>
          <tr>
            <th>Titel</th>
            <th>Beschreibung</th>
            <th>Fachgebiet</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const area = areas.find((a) => a._id === category.area);
            return (
              <tr key={category._id}>
                <td>{category.title}</td>
                <td>{category.description}</td>
                <td>{area ? area.title : 'Unbekannt'}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                    className="me-2"
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteCategory(category._id)}
                  >
                    Löschen
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default WikiContentList;
