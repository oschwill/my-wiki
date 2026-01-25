import { fetchFromApi } from '../utils/fetchData';
import { Area } from '../dataTypes/types';

export const homeLoader = async (): Promise<{ areas: Area[] }> => {
  const stored = localStorage.getItem('language');
  const locale = stored ? JSON.parse(stored).locale : 'de-DE';

  const response = await fetchFromApi(`/api/v1/content/public/areas?locale=${locale}`, 'GET');

  if (!response.success) {
    throw new Error('Failed to load areas');
  }

  return {
    areas: response.data as Area[],
  };
};
