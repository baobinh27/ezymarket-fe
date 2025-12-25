import { useState, useEffect, forwardRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
  StyleSheet,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Octicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { IText } from "@/components/styled";
import IButton from "@/components/IButton";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import { getRecipeById, createRecipe, updateRecipe } from "@/api/dictionary";

interface EditRecipeModalProps {
  recipeId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditRecipeModal = forwardRef<BottomSheetModal, EditRecipeModalProps>(
  ({ recipeId, onClose, onSuccess }, ref) => {
    const queryClient = useQueryClient();
    const isNew = !recipeId || recipeId === "new";

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [servings, setServings] = useState("4");

    // Fetch recipe data if editing
    const { data: recipeData, isLoading: isLoadingRecipe } = useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: () => getRecipeById(recipeId as string),
      enabled: !isNew && !!recipeId,
    });

    // Set form data when recipe loads
    useEffect(() => {
      if (recipeData) {
        const recipe = recipeData.recipe || recipeData;
        setTitle(recipe.title || "");
        setDescription(recipe.description || "");
        setImageUrl(recipe.imageUrl || "");
        setPrepTime(recipe.prepTime?.toString() || "");
        setCookTime(recipe.cookTime?.toString() || "");
        setServings(recipe.servings?.toString() || "4");
      }
    }, [recipeData]);

    // Reset form when opening for new item
    useEffect(() => {
      if (isNew) {
        setTitle("");
        setDescription("");
        setImageUrl("");
        setPrepTime("");
        setCookTime("");
        setServings("4");
      }
    }, [isNew, recipeId]);

    // Create mutation
    const createMutation = useMutation({
      mutationFn: createRecipe,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        Alert.alert("Success", "Recipe created successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to create recipe");
      },
    });

    // Update mutation
    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => updateRecipe(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
        Alert.alert("Success", "Recipe updated successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to update recipe");
      },
    });

    const handleSave = () => {
      if (!title.trim()) {
        Alert.alert("Error", "Please enter recipe title");
        return;
      }

      const data = {
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl || undefined,
        prepTime: parseInt(prepTime) || undefined,
        cookTime: parseInt(cookTime) || undefined,
        servings: parseInt(servings) || 4,
      };

      if (isNew) {
        createMutation.mutate(data);
      } else {
        updateMutation.mutate({ id: recipeId as string, data });
      }
    };

    const handlePickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUrl(result.assets[0].uri);
        Alert.alert("Info", "Image upload will be implemented with UploadThing");
      }
    };

    const handleSearchOnline = () => {
      Alert.alert("Info", "Online search will be implemented");
    };

    return (
      <IBottomSheetModal
        ref={ref}
        title={isNew ? "New Recipe" : "Edit Recipe"}
        snapPoints={["90%"]}
        onClose={onClose}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {isLoadingRecipe ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#46982D" />
            </View>
          ) : (
            <>
              {/* Image Upload Section */}
              <View style={styles.imageSection}>
                <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImage}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                  ) : (
                    <View style={styles.imagePlaceholderContent}>
                      <Octicons name="image" size={32} color="#000000B4" />
                      <IText size={12} color="#000000B4" style={styles.uploadText}>
                        Upload an image
                      </IText>
                    </View>
                  )}
                </TouchableOpacity>

                <IText size={14} color="#000000B4" style={styles.orText}>
                  or
                </IText>

                <TouchableOpacity onPress={handleSearchOnline} style={styles.searchButton}>
                  <IText size={14} semiBold color="#82CD47">
                    Search online
                  </IText>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Title *
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter recipe title"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Description
                  </IText>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe your recipe"
                    placeholderTextColor="#000000B4"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Prep Time (minutes)
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={prepTime}
                    onChangeText={setPrepTime}
                    placeholder="15"
                    keyboardType="numeric"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Cook Time (minutes)
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={cookTime}
                    onChangeText={setCookTime}
                    placeholder="30"
                    keyboardType="numeric"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Servings
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={servings}
                    onChangeText={setServings}
                    placeholder="4"
                    keyboardType="numeric"
                    placeholderTextColor="#000000B4"
                  />
                </View>
              </View>
            </>
          )}
        </BottomSheetScrollView>

        {/* Action Button */}
        <View style={styles.actionButtons}>
          <IButton
            variant="primary"
            onPress={handleSave}
            style={styles.saveButton}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <IText size={16} semiBold color="white">
                Done
              </IText>
            )}
          </IButton>
        </View>
      </IBottomSheetModal>
    );
  }
);

EditRecipeModal.displayName = "EditRecipeModal";

export default EditRecipeModal;

const styles = StyleSheet.create({
  centerContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: 160,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EEEEEE",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  imagePlaceholderContent: {
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    textAlign: "center",
  },
  orText: {
    marginVertical: 8,
  },
  searchButton: {
    borderWidth: 1,
    borderColor: "#82CD47",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  formSection: {
    gap: 20,
    marginBottom: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#000000",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#000000",
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  actionButtons: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  saveButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
  },
});
