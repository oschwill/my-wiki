export type BaseFormField = {
  value: string;
  error?: string;
};

export type SelectDataField = {
  code: string;
  name: string;
};

export type GenericFormState<T extends Record<string, BaseFormField>> = {
  [K in keyof T]: BaseFormField;
};
