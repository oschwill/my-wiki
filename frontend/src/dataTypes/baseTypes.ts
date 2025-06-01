export interface BaseFieldShape {
  value: unknown;
  error?: string;
}

interface CloudImageData {
  publicId: string;
  url: string;
  cloudPath: string;
}

type FieldError = {
  path: string;
  message: string;
};
export type FieldErrorList = FieldError[] | undefined;
export type BaseFormField = BaseFieldShape & { value: string };
export type ImageDataField = BaseFieldShape & { value: File | CloudImageData | string | null };
export type ToggleDataField = BaseFieldShape & { value: boolean };

export type SelectDataField = {
  code: string;
  name: string;
};

export type GenericFormState<T extends Record<string, BaseFieldShape>> = {
  [K in keyof T]: T[K];
};

export type TimeLineStep = {
  key: string;
  label: string;
};
