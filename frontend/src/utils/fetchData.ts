import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export const fetchFromApi = async (
  route: string,
  method: HttpMethod,
  data?: any,
  customHeaders?: Record<string, string>
) => {
  try {
    const url = `${API_URL}${route}`;

    let headers: Record<string, string> = {};

    if (data instanceof FormData) {
      headers['Content-Type'] = 'multipart/form-data';
    } else if (method !== 'GET') {
      headers['Content-Type'] = 'application/json';
    }

    headers = { ...headers, ...customHeaders };

    if (!headers['Authorization']) {
      let token = sessionStorage.getItem('authToken');
      if (token) {
        token = token.replace(/^"(.+)"$/, '$1');
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const config = {
      method,
      url,
      headers,
      withCredentials: true,
      validateStatus: (status: number) => status < 500,
      ...(method === 'GET' ? { params: data } : { data: data || {} }),
    };

    const response = await axios(config);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw error?.response?.data || error;
    }
    throw error;
  }
};
