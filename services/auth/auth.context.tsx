// src/services/auth.context.tsx
import { localStorage } from "@/utils/storage";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { loginApi } from "./auth.api";

type User = { id: string; name: string } | null;

type AuthContextType = {
  user: User;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load token khi app mở lại
  useEffect(() => {
    (async () => {
      const saved = await localStorage.get("auth");
      if (saved?.user) {
        setUser(saved.user);
        setIsLoggedIn(true);
      }
      setLoading(false);
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user } = await loginApi({ email, password });
    if (user) {
      await localStorage.set("auth", { token, user });
      setUser(user);
      setIsLoggedIn(true);
    }
    
  };

  const logout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    await localStorage.remove("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        loading,
        login,
        logout,
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
