import { Form, Button, Spinner } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { InsertNewArticleProps } from '../../dataTypes/types';

const InsertNewArticle: React.FC<InsertNewArticleProps> = ({
  areas,
  categories,
  selectedArea,
  selectedCategory,
  title,
  errors,
  featureFlags,
  loadingCategories,
  submitting,
  editorRef,
  onAreaChange,
  onCategoryChange,
  onTitleChange,
  onContentChange,
  onFlagChange,
  onSaveClick,
  onResetClick,
}) => {
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      {/* AREA */}
      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Fachgebiet wählen:</strong>
        </Form.Label>
        <Form.Select
          value={selectedArea}
          isInvalid={errors.area}
          onChange={(e) => onAreaChange(e.target.value)}
        >
          <option value="">Bitte wählen</option>
          {areas.map((area) => (
            <option key={area._id} value={area._id}>
              {area.title}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* CATEGORY */}
      {selectedArea && (
        <Form.Group className="mb-3">
          <Form.Label>Kategorie wählen</Form.Label>
          {loadingCategories ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Form.Select
              value={selectedCategory}
              isInvalid={errors.category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">Bitte wählen</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.title}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
      )}

      {/* TITLE */}
      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Titel:</strong>
        </Form.Label>
        <Form.Control
          value={title}
          isInvalid={errors.title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </Form.Group>

      {/* CONTENT */}
      <Form.Group className="mb-3">
        <Form.Label>
          <strong>Inhalt:</strong>
        </Form.Label>
        <div className={errors.content ? 'border border-danger rounded' : ''}>
          <Editor
            onInit={(_, editor) => (editorRef.current = editor)}
            tinymceScriptSrc="/tinymce/tinymce.min.js"
            licenseKey="gpl"
            init={{
              height: 600,
              menubar: true,
              plugins:
                'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount',
              toolbar:
                'undo redo | bold italic | alignleft aligncenter alignright | bullist numlist | fullscreen',
            }}
            onEditorChange={onContentChange}
          />
        </div>
      </Form.Group>

      {/* FLAGS */}
      <Form.Group className="mb-4">
        <Form.Label>
          <strong>Artikel Einstellungen:</strong>
        </Form.Label>

        {[
          ['allowCommentsection', 'Kommentare erlauben'],
          ['allowExportToPDF', 'PDF Export erlauben'],
          ['allowPrinting', 'Drucken erlauben'],
          ['allowSharing', 'Teilen erlauben'],
          ['allowEditing', 'Bearbeitung erlauben'],
        ].map(([name, label]) => (
          <Form.Check
            key={name}
            type="switch"
            name={name}
            label={label}
            checked={(featureFlags as any)[name]}
            onChange={onFlagChange}
            className="mb-3 custom-switch-lg"
          />
        ))}
      </Form.Group>

      {/* ACTIONS */}
      <div className="d-flex gap-2">
        <Button onClick={onSaveClick} disabled={submitting}>
          {submitting ? 'Speichern...' : 'Speichern'}
        </Button>

        <Button variant="secondary" onClick={onResetClick} disabled={submitting}>
          Zurücksetzen
        </Button>
      </div>
    </Form>
  );
};

export default InsertNewArticle;
