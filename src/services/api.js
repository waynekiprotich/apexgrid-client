import axios from 'axios';

// In dev, Vite proxies /api/* to the Flask backend (see vite.config.js)
// In prod, set VITE_API_BASE_URL to your deployed backend URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true, // needed for the httpOnly refresh token cookie
});

export const setupInterceptors = (getAccessToken, refreshAccessToken) => {
  api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  let refreshPromise = null;

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      // Do not attempt to refresh if the failed request was the refresh request itself
      if (originalRequest.url === '/auth/refresh' || originalRequest.url.endsWith('/auth/refresh')) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // De-duplicate concurrent refresh attempts
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken().finally(() => {
            refreshPromise = null;
          });
        }
        const newToken = await refreshPromise;
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;
