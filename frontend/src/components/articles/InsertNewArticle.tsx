import { Form, Button, Spinner } from 'react-bootstrap';
import { Editor } from '@tinymce/tinymce-react';
import { InsertNewArticleProps } from '../../dataTypes/types';
import { useTranslation } from '../../hooks/hookHelper';

const InsertNewArticle: React.FC<InsertNewArticleProps> = ({
  content,
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
  mode,
}) => {
  const isForeignEdit = mode === 'edit-foreign';
  const { trans } = useTranslation();
  return (
    <Form onSubmit={(e) => e.preventDefault()}>
      {/* AREA */}
      {!isForeignEdit && (
        <Form.Group className="mb-3">
          <Form.Label>
            <strong>{trans('my_wiki.components.insert_new_article.choose_area')}</strong>
          </Form.Label>
          <Form.Select
            value={selectedArea}
            isInvalid={errors.area}
            onChange={(e) => onAreaChange(e.target.value)}
          >
            <option value="">{trans('my_wiki.components.insert_new_article.please_choose')}</option>
            {areas.map((area) => (
              <option key={area._id} value={area._id}>
                {area.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      )}

      {/* CATEGORY */}
      {!isForeignEdit && selectedArea && (
        <Form.Group className="mb-3">
          <Form.Label>
            <strong>{trans('my_wiki.components.insert_new_article.choose_category')}</strong>
          </Form.Label>
          {loadingCategories ? (
            <Spinner animation="border" size="sm" />
          ) : (
            <Form.Select
              value={selectedCategory}
              isInvalid={errors.category}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="">
                {trans('my_wiki.components.insert_new_article.please_choose')}
              </option>
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
          <strong>{trans('my_wiki.components.insert_new_article.title')}</strong>
        </Form.Label>
        <Form.Control
          value={title}
          isInvalid={errors.title}
          disabled={isForeignEdit}
          onChange={(e) => onTitleChange(e.target.value)}
        />
      </Form.Group>

      {/* CONTENT */}
      <Form.Group className="mb-3">
        <Form.Label>
          <strong>{trans('my_wiki.components.insert_new_article.content')}</strong>
        </Form.Label>
        <div className={errors.content ? 'border border-danger rounded' : ''}>
          <Editor
            value={content}
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
      {!isForeignEdit && (
        <Form.Group className="mb-4">
          <Form.Label>
            <strong>
              {trans('my_wiki.components.insert_new_article.article_settings.headline')}
            </strong>
          </Form.Label>

          {[
            [
              'allowCommentsection',
              trans('my_wiki.components.insert_new_article.article_settings.allow_comment'),
            ],
            [
              'allowExportToPDF',
              trans('my_wiki.components.insert_new_article.article_settings.allow_pdf'),
            ],
            [
              'allowPrinting',
              trans('my_wiki.components.insert_new_article.article_settings.allow_printing'),
            ],
            [
              'allowSharing',
              trans('my_wiki.components.insert_new_article.article_settings.allow_sharing'),
            ],
            [
              'allowEditing',
              trans('my_wiki.components.insert_new_article.article_settings.allow_editing'),
            ],
            [
              'allowShowAuthor',
              trans('my_wiki.components.insert_new_article.article_settings.allow_show_author'),
            ],
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
      )}

      {/* ACTIONS */}
      <div className="d-flex gap-2">
        <Button onClick={onSaveClick} disabled={submitting}>
          {submitting
            ? trans('my_wiki.components.insert_new_article.button.is_saving')
            : isForeignEdit
              ? trans('my_wiki.components.insert_new_article.button.edit')
              : trans('my_wiki.components.insert_new_article.button.save')}
        </Button>

        <Button variant="secondary" onClick={onResetClick} disabled={submitting}>
          {trans('my_wiki.components.insert_new_article.button.reset')}
        </Button>
      </div>
    </Form>
  );
};

export default InsertNewArticle;
