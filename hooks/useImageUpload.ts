import { useState } from "react";
import { Alert } from "react-native";
import { uploadIngredientImage } from "@/api/upload";

interface UseImageUploadResult {
  imageUrl: string;
  isUploading: boolean;
  uploadImage: (fileUri: string) => Promise<void>;
  setImageUrl: (url: string) => void;
  resetImage: () => void;
}

export const useImageUpload = (initialUrl: string = ""): UseImageUploadResult => {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const uploadImage = async (fileUri: string): Promise<void> => {
    console.log("🚀 useImageUpload: Starting upload", fileUri);

    // Show local image immediately for better UX
    setImageUrl(fileUri);
    setIsUploading(true);

    try {
      console.log("📤 useImageUpload: Calling uploadIngredientImage");
      const uploadedUrl = await uploadIngredientImage(fileUri);

      console.log("✅ useImageUpload: Upload successful", uploadedUrl);
      setImageUrl(uploadedUrl);

      Alert.alert("Success", "Image uploaded successfully");
    } catch (error: any) {
      console.error("❌ useImageUpload: Upload failed", error);

      Alert.alert(
        "Upload Error",
        error.message || "Failed to upload image. Please try again."
      );

      // Revert to empty if upload fails
      setImageUrl("");
    } finally {
      setIsUploading(false);
      console.log("🏁 useImageUpload: Upload process finished");
    }
  };

  const resetImage = () => {
    setImageUrl("");
    setIsUploading(false);
  };

  return {
    imageUrl,
    isUploading,
    uploadImage,
    setImageUrl,
    resetImage,
  };
};
