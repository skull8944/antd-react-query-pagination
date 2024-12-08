import axios from 'axios';
import type { AxiosError, AxiosResponse, CreateAxiosDefaults } from 'axios';

export const apiClientFactory = <TData = never>(
  defaultConfig?: CreateAxiosDefaults<TData>,
) => {
  const client = axios.create({
    ...defaultConfig,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      if (
        response.headers['content-type'] === 'multipart/form-data' &&
        response.headers['content-disposition']
      ) {
        const contentDisposition: string =
          response.headers['content-disposition'];
        response.data.fileName = decodeURIComponent(
          contentDisposition.slice(contentDisposition.indexOf('filename=') + 9),
        );
      }

      return response;
    },

    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // Clear user state and redirect to home page
        // userStore?.logout(); // Adjust this line to match your actual clear user method
      } else {
        console.error('query error', error);
      }

      return Promise.reject(error);
    },
  );

  return client;
};
