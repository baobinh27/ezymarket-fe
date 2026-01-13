import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import Constants from "expo-constants";

const API_URL =
  Constants.expoConfig?.extra?.BASE_API || "http://localhost:5001";

const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    return localStorage.getItem("accessToken");
  }
  return await SecureStore.getItemAsync("accessToken");
};

interface PresignedUrlResponse {
  url: string;
  key: string;
  name: string;
  customId: string | null;
}

/**
 * Upload ingredient/recipe image to UploadThing
 * @param fileUri - Local file URI from ImagePicker
 * @returns Uploaded image URL
 */
export const uploadIngredientImage = async (
  fileUri: string
): Promise<string> => {
  const token = await getToken();
  if (!token) {
    throw new Error("Not authenticated");
  }

  const filename = fileUri.split("/").pop() || `image_${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(filename);
  const mimeType = match ? `image/${match[1]}` : "image/jpeg";

  const fileResponse = await fetch(fileUri);
  const blob = await fileResponse.blob();

  const presignedResponse = await fetch(
    `${API_URL}/api/uploadthing?actionType=upload&slug=ingredientImageUploader`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "x-uploadthing-package": "@uploadthing/react",
        "x-uploadthing-version": "7.0.0",
      },
      body: JSON.stringify({
        files: [{ name: filename, size: blob.size, type: mimeType }],
      }),
    }
  );

  if (!presignedResponse.ok) {
    throw new Error("Failed to get upload URL");
  }

  const presignedData: PresignedUrlResponse[] = await presignedResponse.json();
  if (!presignedData || presignedData.length === 0) {
    throw new Error("No presigned URL returned");
  }

  const { url: presignedUrl, key } = presignedData[0];

  const formData = new FormData();
  formData.append("file", blob, filename);

  const uploadResponse = await fetch(presignedUrl, {
    method: "PUT",
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload file to storage");
  }

  return `https://utfs.io/f/${key}`;
};
