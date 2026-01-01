import axiosInstance from "@/services/axios";

export const loginRequest = async (email: string, password: string): Promise<any> => {
  return axiosInstance.post("/api/user/login", { email, password });
};

export const registerRequest = async (email: string, username: string, password: string) => {
  return axiosInstance.post("/api/user/register", { email, phone: username, password });
};

// export const getAccessToken = async (refreshToken: string) => {
//     return axiosInstance.post('/api/user/token/refresh', {refreshToken});
// }

export const forgotPasswordRequest = async (email: string) => {
  return axiosInstance.post("/api/user/password/reset-request", { email });
};

export const forgotPasswordVerify = async (email: string, otp: string, newPassword: string) => {
  return axiosInstance.post("/api/user/password/reset", { email, otp, newPassword });
};

export const getCurrentUser = async (): Promise<any> => {
  return axiosInstance.get("/api/user/me");
};
