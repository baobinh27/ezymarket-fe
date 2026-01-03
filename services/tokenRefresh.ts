import { SecureStorage } from "@/utils/secureStorage";
import Constants from "expo-constants";

type Extra = {
  BASE_API: string;
};

const { BASE_API = "http://localhost:5001" } = Constants.expoConfig?.extra as Extra;

export const getAccessToken = async (refreshToken: string) => {
  const response = await fetch(`${BASE_API}/api/user/token/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to refresh token");
  }

  return response.json();
};

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;

    const base64url = parts[1];
    const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded));

    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    // Consider token expired if it will expire within 5 minutes
    return expirationTime - currentTime < 5 * 60 * 1000;
  } catch (e) {
    console.warn("Error checking token expiration:", e);
    return true;
  }
};

let refreshInterval: ReturnType<typeof setInterval> | null = null;
let isRefreshing = false;

/**
 * Refresh the access token using the refresh token
 */
export const refreshAccessTokenManually = async (): Promise<boolean> => {
  if (isRefreshing) return false;

  const refreshToken = await SecureStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  isRefreshing = true;
  try {
    const response = await fetch(`${BASE_API}/api/user/token/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error(`Token refresh failed with status ${response.status}`);
    }

    const { token: newAccessToken, refreshToken: newRefreshToken } =
      await response.json();

    await SecureStorage.setItem("accessToken", newAccessToken);
    await SecureStorage.setItem("refreshToken", newRefreshToken);

    console.log("✓ Token refreshed successfully");
    return true;
  } catch (error) {
    console.error("✗ Token refresh failed:", error);
    return false;
  } finally {
    isRefreshing = false;
  }
};

/**
 * Start periodic token refresh check (every 5 minutes)
 * This proactively refreshes tokens before they expire
 */
export const startTokenRefreshInterval = () => {
  if (refreshInterval) return; // Already running

  console.log("▶ Starting token refresh interval (every 5 minutes)");

  refreshInterval = setInterval(async () => {
    const accessToken = await SecureStorage.getItem("accessToken");

    if (!accessToken) {
      stopTokenRefreshInterval();
      return;
    }

    // Check if token is expired or about to expire
    if (isTokenExpired(accessToken)) {
      console.log("⟳ Token expiring soon, refreshing...");
      await refreshAccessTokenManually();
    }
  }, 5 * 60 * 1000); // Check every 5 minutes
};

/**
 * Stop the periodic token refresh check
 */
export const stopTokenRefreshInterval = () => {
  if (refreshInterval) {
    console.log("⏸ Stopping token refresh interval");
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};
