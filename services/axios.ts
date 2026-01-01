import { getAccessToken } from "@/services/tokenRefresh";
import { SecureStorage } from "@/utils/secureStorage";
import axios, { AxiosError, AxiosResponse } from "axios";
import Constants from "expo-constants";

declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
  export interface AxiosInstance {
    get<T = any>(url: string, config?: any): Promise<T>;
    post<T = any>(url: string, data?: any, config?: any): Promise<T>;
    patch<T = any>(url: string, data?: any, config?: any): Promise<T>;
    put<T = any>(url: string, data?: any, config?: any): Promise<T>;
    delete<T = any>(url: string, config?: any): Promise<T>;
  }
}

//------------------------------------------------------------------------------
// Refresh queue, to make sure only one refreshAccessToken can exist at any time
// (avoid race condition)
let isRefreshing = false;

type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

let failedQueue: QueueItem[] = [];

const processQueue = (error: any, token: string | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });

  failedQueue = [];
};
//
//------------------------------------------------------------------------------

type Extra = {
  BASE_API: string;
};

const { BASE_API = "http://localhost:5001" } = Constants.expoConfig?.extra as Extra;

const axiosInstance = axios.create({
  baseURL: BASE_API,
  timeout: 5000,
  // validateStatus: () => true, // Avoid logging errors in console
  headers: {
    "Content-Type": "application/json",
  },
});

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
  const token = await SecureStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => response.data,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      // A refreshAccessToken request already exists, put it in queue
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(axiosInstance(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const newToken = await refreshAccessToken();

        if (!newToken) throw new Error("Refresh failed");

        await SecureStorage.setItem("accessToken", newToken);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (error.response?.status === 400 || error.response?.status === 429) {
      return Promise.reject(
        new Error(error.response.data?.message || "Something went wrong (400/429)")
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
