export type BaseFormField = string;

export type GenericFormState<T extends Record<string, BaseFormField>> = {
  [K in keyof T]: BaseFormField;
};
