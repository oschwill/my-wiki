import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iconMap } from '../../../../utils/icons';
import { Area, Category } from '../../../../dataTypes/types';

interface WikiContentListProps {
  areas: Area[];
  categories: Category[];
  handleEditArea: (areaGroup: Area[]) => void;
  handleDeleteArea: (id: string) => void;
  handleEditCategory: (categoryGroup: Category[]) => void;
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
  // Gruppiere Areas nach translationGroup
  const groupedAreas = areas.reduce<Record<string, Area[]>>((acc, area) => {
    if (!acc[area.translationGroup]) acc[area.translationGroup] = [];
    acc[area.translationGroup].push(area);
    return acc;
  }, {});

  // Gruppiere Categories nach translationGroup (so wie bei Areas)
  const groupedCategories = categories.reduce<Record<string, Category[]>>((acc, cat) => {
    const groupId = cat.translationGroup || cat._id;
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(cat);
    return acc;
  }, {});

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h4 className="mb-4">Vorhandene Fachgebiete</h4>

      <Table striped hover responsive className="mb-5">
        <thead>
          <tr>
            <th>Icon</th>
            <th>Titel</th>
            <th>Beschreibung</th>
            <th>Sprache</th>
            <th>Bearbeiten</th>
            <th>Löschen</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedAreas).map((group) => (
            <tr key={group[0].translationGroup}>
              <td>
                {group.map((area) => (
                  <div key={area._id} className="mb-1">
                    <FontAwesomeIcon icon={iconMap[area.icon]} size="lg" />
                  </div>
                ))}
              </td>
              <td>
                {group.map((area) => (
                  <div key={area._id} className="mb-1">
                    {area.title}
                  </div>
                ))}
              </td>
              <td>
                {group.map((area) => (
                  <div key={area._id} className="mb-1">
                    {area.description}
                  </div>
                ))}
              </td>
              <td>
                {group.map((area) => (
                  <div key={area._id} className="mb-1">
                    {area.language?.label} ({area.language?.locale})
                  </div>
                ))}
              </td>
              <td className="align-middle text-center">
                <Button variant="warning" size="sm" onClick={() => handleEditArea(group)}>
                  Bearbeiten
                </Button>
              </td>
              <td className="d-flex flex-column">
                {group.map((area) => (
                  <Button
                    key={area._id}
                    variant="danger"
                    size="sm"
                    className="mb-1"
                    onClick={() => handleDeleteArea(area._id)}
                  >
                    Löschen {area.language?.locale}
                  </Button>
                ))}
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
            <th>Sprache</th>
            <th>Bearbeiten</th>
            <th>Löschen</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(groupedCategories).map((group) => (
            <tr key={group[0]._id}>
              <td>
                {group.map((cat) => (
                  <div key={cat._id} className="mb-1">
                    {cat.title}
                  </div>
                ))}
              </td>
              <td>
                {group.map((cat) => (
                  <div key={cat._id} className="mb-1">
                    {cat.description}
                  </div>
                ))}
              </td>
              <td>
                {group.map((cat) => {
                  const area = areas.find((a) => a._id === cat.area);
                  return <div key={cat._id}>{area ? area.title : 'Unbekannt'}</div>;
                })}
              </td>
              <td>
                {group.map((cat) => (
                  <div key={cat._id}>
                    {cat.language?.label} ({cat.language?.locale})
                  </div>
                ))}
              </td>
              <td className="align-middle text-center">
                <Button variant="warning" size="sm" onClick={() => handleEditCategory(group)}>
                  Bearbeiten
                </Button>
              </td>
              <td className="d-flex flex-column">
                {group.map((cat) => (
                  <Button
                    key={cat._id}
                    variant="danger"
                    size="sm"
                    className="mb-1"
                    onClick={() => handleDeleteCategory(cat._id)}
                  >
                    Löschen {cat.language?.locale}
                  </Button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default WikiContentList;
