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
