import { Form } from 'react-bootstrap';
import { BaseFormField, SelectDataField } from '../../dataTypes/baseTypes';
import { ChangeEventHandler } from 'react';

interface SelectFieldProps {
  label: string;
  field: BaseFormField;
  handleChange: ChangeEventHandler<HTMLSelectElement>;
  selectData: Array<SelectDataField>;
  controlId: string;
  bsClass: string;
  formName: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  field,
  handleChange,
  selectData,
  controlId,
  bsClass,
  formName,
}) => {
  return (
    <Form.Group controlId={controlId} className={bsClass}>
      <Form.Label>{label}</Form.Label>
      <Form.Select
        name={formName}
        value={field.value || ''}
        onChange={handleChange}
        isInvalid={!!field.error}
        required
      >
        <option value="">Bitte wählen...</option>
        {selectData.map((item) => (
          <option key={item.code} value={item.code}>
            {item.name}
          </option>
        ))}
      </Form.Select>
      <Form.Control.Feedback type="invalid">{field.error}</Form.Control.Feedback>
    </Form.Group>
  );
};

export default SelectField;
