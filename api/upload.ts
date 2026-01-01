import axios from "axios";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const API_URL = Constants.expoConfig?.extra?.BASE_API || "http://localhost:5001";

// Helper to get token from storage (web or native)
const getToken = async (): Promise<string | null> => {
  if (Platform.OS === "web") {
    // Web: use localStorage
    return localStorage.getItem("accessToken");
  } else {
    // Native: use SecureStore
    return await SecureStore.getItemAsync("accessToken");
  }
};

/**
 * Upload ingredient/recipe image to UploadThing
 * @param fileUri - Local file URI from ImagePicker
 * @returns Uploaded image URL
 */
export const uploadIngredientImage = async (fileUri: string): Promise<string> => {
  try {
    // Get auth token
    const token = await getToken();

    if (!token) {
      throw new Error("Not authenticated - no access token found");
    }

    // Extract filename from URI
    const filename = fileUri.split("/").pop() || `image_${Date.now()}.jpg`;

    // Determine mime type
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    // Create FormData with the file
    const formData = new FormData();

    if (Platform.OS === "web") {
      // Web: Convert blob URL to actual File object
      const response = await fetch(fileUri);
      const blob = await response.blob();
      const file = new File([blob], filename, { type });
      formData.append("files", file);
    } else {
      // Native: Use React Native FormData format
      // @ts-ignore - React Native FormData supports this format
      formData.append("files", {
        uri: fileUri,
        name: filename,
        type: type,
      });
    }

    // Upload directly to UploadThing endpoint
    const response = await axios.post(
      `${API_URL}/api/uploadthing?slug=ingredientImageUploader`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // DON'T set Content-Type manually - let axios set it with boundary
          // "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    // Extract URL from response
    // UploadThing can return different formats
    let imageUrl: string | null = null;

    if (response.data) {
      // Format from onUploadComplete: { uploadedBy: '...', imageUrl: '...' }
      if (response.data.imageUrl) {
        imageUrl = response.data.imageUrl;
      }
      // Array format: [{url: '...'}]
      else if (Array.isArray(response.data) && response.data[0]?.url) {
        imageUrl = response.data[0].url;
      }
      // Nested data: {data: [{url: '...'}]}
      else if (
        response.data.data &&
        Array.isArray(response.data.data) &&
        response.data.data[0]?.url
      ) {
        imageUrl = response.data.data[0].url;
      }
      // Direct URL
      else if (response.data.url) {
        imageUrl = response.data.url;
      }
    }

    if (!imageUrl) {
      throw new Error("Upload completed but no URL returned");
    }

    return imageUrl;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to upload image");
  }
};
