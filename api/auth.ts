import axiosInstance from "@/services/axios";

export const loginRequest = (email: string, password: string) => {
  return axiosInstance.post('/api/user/login', { email, password });
};

export const registerRequest = (email: string, username: string, password: string) => {
    return axiosInstance.post('/api/user/register', {email, phone: username, password});
}

export const getAccessToken = (refreshToken: string) => {
    return axiosInstance.post('/api/user/refreshToken', {refreshToken});
}

export const forgotPasswordRequest = (email: string) => {
    return axiosInstance.post('/api/user/forgot-password', {email});
}