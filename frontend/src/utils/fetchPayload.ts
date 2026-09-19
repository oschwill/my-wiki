import axios from 'axios';

const PAYLOAD_URL = import.meta.env.VITE_PAYLOAD_API_URL;

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export const fetchFromPayload = async (route: string, method: HttpMethod = 'GET', data?: any) => {
  try {
    const url = `${PAYLOAD_URL}${route}`;

    const config = {
      method,
      url,
      headers: {
        'Content-Type': 'application/json',
      },
      ...(method === 'GET' ? { params: data } : { data: data || {} }),
    };

    const response = await axios(config);

    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Payload API error:', error.response?.data);
      console.error('Payload API status:', error.response?.status);

      throw error?.response?.data || error;
    }

    throw error;
  }
};
