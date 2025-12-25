import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { forwardRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createIngredient,
  getIngredientById,
  updateIngredient,
} from "@/api/dictionary";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { useImageUpload } from "@/hooks/useImageUpload";

interface EditIngredientModalProps {
  ingredientId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditIngredientModal = forwardRef<BottomSheetModal, EditIngredientModalProps>(
  ({ ingredientId, onClose, onSuccess }, ref) => {
    const queryClient = useQueryClient();
    const isNew = !ingredientId || ingredientId === "new";

    const [name, setName] = useState("");
    const [category, setCategory] = useState("other");
    const [defaultExpireDays, setDefaultExpireDays] = useState("3");
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    // Store original data for comparison
    const [originalData, setOriginalData] = useState<{
      name: string;
      category: string;
      imageUrl: string;
      defaultExpireDays: string;
    } | null>(null);

    // Use image upload hook
    const { imageUrl, isUploading, uploadImage, setImageUrl: setImageUrlDirect } = useImageUpload();

    // Available categories from backend
    const CATEGORIES = [
      { value: "vegetables", label: "Vegetables (Rau củ)" },
      { value: "fruits", label: "Fruits (Trái cây)" },
      { value: "meat", label: "Meat (Thịt)" },
      { value: "seafood", label: "Seafood (Hải sản)" },
      { value: "dairy", label: "Dairy (Sữa)" },
      { value: "grains", label: "Grains (Ngũ cốc)" },
      { value: "spices", label: "Spices (Gia vị)" },
      { value: "beverages", label: "Beverages (Đồ uống)" },
      { value: "condiments", label: "Condiments (Nước chấm)" },
      { value: "frozen", label: "Frozen (Đồ đông lạnh)" },
      { value: "canned", label: "Canned (Đồ hộp)" },
      { value: "bakery", label: "Bakery (Bánh mì)" },
      { value: "snacks", label: "Snacks (Đồ ăn vặt)" },
      { value: "other", label: "Other (Khác)" },
    ];

    // Fetch ingredient data if editing
    const { data: ingredientData, isLoading: isLoadingIngredient } = useQuery({
      queryKey: ["ingredient", ingredientId],
      queryFn: () => getIngredientById(ingredientId as string),
      enabled: !isNew && !!ingredientId,
    });

    // Set form data when ingredient loads
    useEffect(() => {
      if (ingredientData) {
        const ingredient = (ingredientData as any).ingredient || ingredientData;
        const name = ingredient.name || "";
        const category = ingredient.foodCategory || ingredient.category || "";
        const imageUrl = ingredient.imageURL || ingredient.imageUrl || "";
        const defaultExpireDays = ingredient.defaultExpireDays?.toString() || "3";

        setName(name);
        setCategory(category);
        setImageUrlDirect(imageUrl);
        setDefaultExpireDays(defaultExpireDays);

        // Store original data for comparison
        setOriginalData({
          name,
          category,
          imageUrl,
          defaultExpireDays,
        });
      }
    }, [ingredientData, setImageUrlDirect]);

    // Reset form when opening for new item
    useEffect(() => {
      if (isNew) {
        setName("");
        setCategory("other");
        setImageUrlDirect("");
        setDefaultExpireDays("3");
      }
    }, [isNew, ingredientId, setImageUrlDirect]);

    // Create mutation
    const createMutation = useMutation({
      mutationFn: createIngredient,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        Alert.alert("Success", "Ingredient created successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to create ingredient");
      },
    });

    // Update mutation
    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => updateIngredient(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        queryClient.invalidateQueries({ queryKey: ["ingredient", ingredientId] });
        Alert.alert("Success", "Ingredient updated successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to update ingredient");
      },
    });

    const handleSave = () => {
      if (!name.trim()) {
        Alert.alert("Error", "Please enter ingredient name");
        return;
      }

      const data = {
        name: name.trim(),
        foodCategory: category.trim() || "other",
        imageUrl: imageUrl || undefined,
        defaultExpireDays: parseInt(defaultExpireDays) || 3,
      };

      if (isNew) {
        createMutation.mutate(data);
      } else {
        // Check if there are any changes before updating
        if (originalData) {
          const hasChanges =
            name.trim() !== originalData.name ||
            category.trim() !== originalData.category ||
            (imageUrl || "") !== (originalData.imageUrl || "") ||
            defaultExpireDays !== originalData.defaultExpireDays;

          if (!hasChanges) {
            Alert.alert("No Changes", "No changes were made to save.");
            return;
          }
        }

        updateMutation.mutate({ id: ingredientId as string, data });
      }
    };

    const handlePickImage = async () => {
      console.log("📸 handlePickImage: Opening image picker");
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        console.log("📸 Image picker result:", result);

        if (!result.canceled && result.assets[0]) {
          const localUri = result.assets[0].uri;
          console.log("📸 Selected image URI:", localUri);

          // Upload image using hook
          await uploadImage(localUri);
        } else {
          console.log("📸 Image picker cancelled");
        }
      } catch (error) {
        console.error("📸 Image picker error:", error);
        Alert.alert("Error", "Failed to pick image");
      }
    };

    const handleSearchOnline = () => {
      Alert.alert("Info", "Online search will be implemented");
    };

    return (
      <IBottomSheetModal
        ref={ref}
        title={isNew ? "New Fridge Item" : "Edit Fridge Item"}
        snapPoints={["90%"]}
        onClose={onClose}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {isLoadingIngredient ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#46982D" />
            </View>
          ) : (
            <>
              {/* Image Upload Section */}
              <View style={styles.imageSection}>
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={handlePickImage}
                  disabled={isUploading}
                >
                  {imageUrl ? (
                    <>
                      <Image source={{ uri: imageUrl }} style={styles.image} />
                      {isUploading && (
                        <View style={styles.uploadingOverlay}>
                          <ActivityIndicator size="large" color="#46982D" />
                        </View>
                      )}
                    </>
                  ) : (
                    <View style={styles.imagePlaceholderContent}>
                      {isUploading ? (
                        <ActivityIndicator size={32} color="#46982D" />
                      ) : (
                        <>
                          <Octicons name="image" size={32} color="#000000B4" />
                          <IText size={12} color="#000000B4" style={styles.uploadText}>
                            Upload an image
                          </IText>
                        </>
                      )}
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
                    Name *
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter ingredient name"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Category
                  </IText>
                  <TouchableOpacity
                    style={styles.input}
                    onPress={() => setShowCategoryPicker(!showCategoryPicker)}
                  >
                    <View style={styles.categoryInputRow}>
                      <IText size={14} color={category ? "#000000" : "#000000B4"}>
                        {category ? CATEGORIES.find(c => c.value === category)?.label : "Select category"}
                      </IText>
                      <Octicons name="chevron-down" size={16} color="#000000B4" />
                    </View>
                  </TouchableOpacity>

                  {showCategoryPicker && (
                    <ScrollView style={styles.categoryPickerContainer}>
                      {CATEGORIES.map((cat) => (
                        <Pressable
                          key={cat.value}
                          style={[
                            styles.categoryOption,
                            category === cat.value && styles.categoryOptionSelected,
                          ]}
                          onPress={() => {
                            setCategory(cat.value);
                            setShowCategoryPicker(false);
                          }}
                        >
                          <IText
                            size={14}
                            color={category === cat.value ? "#82CD47" : "#000000"}
                          >
                            {cat.label}
                          </IText>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Default expiry duration
                  </IText>
                  <View style={styles.expiryRow}>
                    <TextInput
                      style={[styles.input, styles.expiryInput]}
                      value={defaultExpireDays}
                      onChangeText={setDefaultExpireDays}
                      placeholder="3"
                      keyboardType="numeric"
                      placeholderTextColor="#000000B4"
                    />
                    <IText size={14} color="#000000B4">
                      days
                    </IText>
                  </View>
                </View>
              </View>
            </>
          )}
        </BottomSheetScrollView>

        {/* Action Button */}
        <View style={styles.actionButtons}>
          <IButton
            variant="primary"
            onPress={createMutation.isPending || updateMutation.isPending ? undefined : handleSave}
            style={styles.saveButton}
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

EditIngredientModal.displayName = "EditIngredientModal";

export default EditIngredientModal;

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
    width: 120,
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
  uploadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
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
  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  expiryInput: {
    flex: 1,
  },
  categoryInputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryPickerContainer: {
    maxHeight: 200,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  categoryOptionSelected: {
    backgroundColor: "#E8F5E0",
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
