import { getAccessToken } from '@/api/auth';
import { SecureStorage } from '@/utils/secureStorage';
import axios from 'axios';
import Constants from 'expo-constants';

type Extra = {
    BASE_API: string;
};

const { BASE_API } = Constants.expoConfig?.extra as Extra;

const axiosInstance = axios.create({
    baseURL: BASE_API,
    timeout: 5000,
    // validateStatus: () => true, // Avoid logging errors in console
    headers: {
        'Content-Type': 'application/json',
    },
})

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const refreshToken = await SecureStorage.getItem("refresh_token");
      if (!refreshToken) return null;

      try {
        const res = await getAccessToken(refreshToken);
        const newAccess = res.data.token;
        return newAccess;
      } catch (err) {
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
}


// Attach access token automatically (if it has) when sending a request
axiosInstance.interceptors.request.use(async (config) => {
  const token = SecureStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      const newToken = await refreshAccessToken();

      if (newToken) {
        SecureStorage.setItem('accessToken', newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(original);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;