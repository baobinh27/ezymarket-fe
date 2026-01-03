// src/services/auth.context.tsx
import { loginRequest, registerRequest } from "@/api/auth";
import { SecureStorage } from "@/utils/secureStorage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import axiosInstance from "../axios";
import { startTokenRefreshInterval, stopTokenRefreshInterval } from "../tokenRefresh";

type User = {
  id: string;
  userName?: string;
  email?: string;
  role?: string;
  groupId?: string | null;
} | null;

type AuthContextType = {
  user: User;
  isLoggedIn: boolean;
  otp: string | null;
  loading: boolean;
  setOtp: (otp: string | null) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    // Decode JWT payload using base64url decoding
    const base64url = parts[1];
    // Convert base64url to base64 (replace - with + and _ with /)
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    // Add padding if needed
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    // Decode using atob (available in React Native)
    const decoded = JSON.parse(atob(padded));

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    // Consider token expired if it will expire within 5 minutes
    return expirationTime - currentTime < 5 * 60 * 1000;
  } catch (e) {
    console.warn("Something went wrong when checking token expiration:", e)
    return true;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [otp, setOtp] = useState<string | null>(null);

  // Load token khi app mở lại
  useEffect(() => {
    (async () => {
      const refreshToken = await SecureStorage.getItem("refreshToken");
      const accessToken = await SecureStorage.getItem("accessToken");

      if (!refreshToken) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      // Check if refresh token is expired
      if (isTokenExpired(refreshToken)) {
        console.warn("Refresh token is expired");
        await SecureStorage.deleteItem("refreshToken");
        await SecureStorage.deleteItem("accessToken");
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      try {
        // Only refresh if access token is expired or missing
        if (!accessToken || isTokenExpired(accessToken)) {
          const response = await axiosInstance.post(
            `/api/user/token/refresh`,
            { refreshToken }
          );

          const { refreshToken: newRefreshToken, token: newAccessToken } =
            response.data as { refreshToken: string; token: string };

          await SecureStorage.setItem("accessToken", newAccessToken);
          await SecureStorage.setItem("refreshToken", newRefreshToken);
        }

        setIsLoggedIn(true);
        // Start periodic token refresh on successful login check
        startTokenRefreshInterval();

      } catch (e: any) {
        const status = e?.response?.status;

        // Only clear tokens on unauthorized errors (401, 403)
        // Don't clear on network errors or server errors (5xx)
        if (status === 401 || status === 403) {
          console.warn("Token refresh failed: Unauthorized");
          await SecureStorage.deleteItem("refreshToken");
          await SecureStorage.deleteItem("accessToken");
          setIsLoggedIn(false);
          stopTokenRefreshInterval();
        } else {
          // For other errors, just log and leave tokens intact
          // They might work on the next attempt
          console.error("Token refresh failed:", e?.message || e);
          setIsLoggedIn(false);
        }
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

      // Start periodic token refresh on successful login
      startTokenRefreshInterval();

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
        message: "Something went wrong!" + error,
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

    // Stop periodic token refresh on logout
    stopTokenRefreshInterval();
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const { data } = await registerRequest(email, "098765432134", password);

      return {
        success: true,
        message: "Register success! Check your mail to verify your account!",
      };
    } catch (error: any) {
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
