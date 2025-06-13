import { FieldErrorList, ImageDataField } from '../dataTypes/baseTypes';

// Gibt uns das Datum und die Uhrzeit zurück
export const clockFN = (): { date: string; time: string } => {
  const date = new Date();
  const dateString = date.toLocaleDateString();
  const timeString = date.toLocaleTimeString();

  return { date: dateString, time: timeString };
};

// Ein Hover Effekt
export const hoverPrevElement = (event: React.MouseEvent<HTMLElement>, colorCode: string) => {
  event.stopPropagation();

  const target = event.target as HTMLElement;
  if (target && target.previousElementSibling) {
    const line = target.previousElementSibling as HTMLElement;
    line.style.background = colorCode;
  }
};

// hier extracten wir übergebene Values aus einem Object
export const extractFormValues = <T extends Record<string, { value: any }>>(
  formData: T,
  excludeKeys?: (keyof T)[]
): Record<string, any> => {
  const result: Record<string, any> = {};

  for (const key in formData) {
    if (!excludeKeys || !excludeKeys.includes(key)) {
      result[key] = formData[key].value;
    }
  }

  return result;
};

// Entscheidet ob ein vorhandenes Bild oder ein Placeholderbild verwendet werden soll
export const showImagePreview = (imageValue: ImageDataField) => {
  const value = imageValue?.value;

  if (!value) return '/images/profileImageDefault.png';

  if (value instanceof File) {
    return URL.createObjectURL(value);
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object' && 'url' in value && typeof value.url === 'string') {
    return value.url;
  }

  return '/images/profileImageDefault.png';
};

// Konvertiert Objecte in eine form-data
export const convertToFormData = (data: Record<string, any>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined) return;

    if (value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
};

// Filtert uns einen Fehler aus einem Errorstate mit einem bestimmten path heraus => z.B. firstName
export const getFieldError = (errors: FieldErrorList | null, field: string): string | undefined => {
  return errors?.find((err) => err.path === field)?.message;
};

export const scrollToRefWithOffset = (ref: React.RefObject<HTMLElement>, offset = 100) => {
  if (ref.current) {
    const top = ref.current.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};
