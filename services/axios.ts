import { getAccessToken } from '@/api/auth';
import { SecureStorage } from '@/utils/secureStorage';
import axios, { AxiosError } from 'axios';
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
      const refreshToken = await SecureStorage.getItem("refreshToken");
      if (!refreshToken) return null;

      try {
        const res = await getAccessToken(refreshToken);
        const newAccess = res.data.token;
        return newAccess;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  const token = await SecureStorage.getItem('accessToken');
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

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    // Không có response → lỗi network / timeout
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: "Network error. Please check your connection.",
        raw: error,
      });
    }

    const { status, data } = error.response;

    // Backend trả { message: string }
    const message =
      typeof data?.message === "string"
        ? data.message
        : "Something went wrong";

    // Xử lý theo status
    switch (status) {
      case 400:
        return Promise.reject({
          status,
          message,
        });

      case 429:
        return Promise.reject({
          status,
          message,
        });

      default:
        return Promise.reject({
          status,
          message: "Unexpected server error",
        });
    }
  }
);


export default axiosInstance;