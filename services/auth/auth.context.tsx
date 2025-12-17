// src/services/auth.context.tsx
import { loginRequest, registerRequest } from "@/api/auth";
import { SecureStorage } from "@/utils/secureStorage";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import axiosInstance from "../axios";

type User = { id: string; name: string } | null;

type AuthContextType = {
  user: User;
  isLoggedIn: boolean;
  otp: string | null;
  loading: boolean;
  setOtp: (otp: string | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otp, setOtp] = useState<string | null>(null);

  // Load token khi app mở lại
  useEffect(() => {
    (async () => {
      const refresh = await SecureStorage.getItem("refreshToken");
      if (!refresh) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        // Gọi API refresh lần đầu
        const { refreshToken, token } = (await axiosInstance.post(
          `/api/user/token/refresh`,
          { refreshToken: refresh }
        )) as { refreshToken: string; token: string };

        await SecureStorage.setItem("accessToken", token);
        await SecureStorage.setItem("refreshToken", refreshToken);
        setUser(user);
        setIsLoggedIn(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        await SecureStorage.deleteItem("refreshToken");
        await SecureStorage.deleteItem("accessToken");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, token, refreshToken } = await loginRequest(email, password);

      await SecureStorage.setItem("accessToken", token);
      await SecureStorage.setItem("refreshToken", refreshToken);

      setUser(user);
      setIsLoggedIn(true);

      return {
        success: true,
        message: "Login success!",
      };
    } catch (error: any) {
      const status = error?.response?.status;

      if (status === 400 || status === 401) {
        return {
          success: false,
          message: "Invalid credentials!",
        };
      }

      if (status === 500) {
        return {
          success: false,
          message: "Server internal error!",
        };
      }

      return {
        success: false,
        message: "Something went wrong!",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await SecureStorage.deleteItem("accessToken");
    await SecureStorage.deleteItem("refreshToken");

    setUser(null);
    setIsLoggedIn(false);
  };

  const register = async (
    email: string,
    username: string,
    password: string
  ) => {
    try {
      const { data } = await registerRequest(email, "000000000000", password);

      return {
        success: true,
        message: "Register success! Check your mail to verify your account!",
      };
    } catch (error: any) {
      console.log(error);

      const status = error?.response?.status;
      const message = error?.response?.data?.message;

      if (status === 400 || status === 401) {
        return {
          success: false,
          message: message,
        };
      }

      if (status === 500) {
        return {
          success: false,
          message: message,
        };
      }

      return {
        success: false,
        message: "Something went wrong!",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        otp,
        loading,
        setOtp,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook để truy cập context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
