//------------------------------------------------------------------------------------------------
// Lógica Global — como token JWT e tratamento de erro.
//------------------------------------------------------------------------------------------------

import apiClient from './client';
/*
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
*/

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Usuário não autorizado.');
    }
    return Promise.reject(error);
  }
);
