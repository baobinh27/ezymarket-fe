import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { createIngredient, getIngredientById, updateIngredient } from "@/api/dictionary";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { useImageUpload } from "@/hooks/useImageUpload";
import {
  getClonedItem,
  markClonedItemAsEdited,
  removeClonedItem,
  updateClonedItem,
} from "@/utils/dictionaryStorage";
import styles from "./EditIngredientModal.styles";

interface EditIngredientModalProps {
  ingredientId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditIngredientModal = forwardRef<BottomSheetModal, EditIngredientModalProps>(
  ({ ingredientId, onClose, onSuccess }, ref) => {
    const queryClient = useQueryClient();
    const isNew = !ingredientId || ingredientId === "new";
    const isCloned = ingredientId?.startsWith("temp_ingredient_");

    const [name, setName] = useState("");
    const [category, setCategory] = useState("other");
    const [defaultExpireDays, setDefaultExpireDays] = useState("3");
    const [showCategoryPicker, setShowCategoryPicker] = useState(false);

    const [originalData, setOriginalData] = useState<{
      name: string;
      category: string;
      imageUrl: string;
      defaultExpireDays: string;
    } | null>(null);

    const { imageUrl, isUploading, uploadImage, setImageUrl: setImageUrlDirect } = useImageUpload();

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
      {       value: "other", label: "Other (Khác)" },
    ];

    const { data: ingredientData, isLoading: isLoadingIngredient } = useQuery({
      queryKey: ["ingredient", ingredientId],
      queryFn: () => getIngredientById(ingredientId as string),
      enabled: !isNew && !!ingredientId && !isCloned,
    });

    useEffect(() => {
      const loadClonedItem = async () => {
        if (isCloned && ingredientId) {
          const cloned = await getClonedItem("ingredient", ingredientId);
          if (cloned) {
            const item = cloned.data;
            setName(item.name || "");
            setCategory(item.foodCategory || item.category || "other");
            setImageUrlDirect(item.imageURL || item.imageUrl || "");
            setDefaultExpireDays(item.defaultExpireDays?.toString() || "3");
            setOriginalData({
              name: item.name || "",
              category: item.foodCategory || item.category || "other",
              imageUrl: item.imageURL || item.imageUrl || "",
              defaultExpireDays: item.defaultExpireDays?.toString() || "3",
            });
          }
        }
      };
      loadClonedItem();
    }, [isCloned, ingredientId, setImageUrlDirect]);

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

        setOriginalData({
          name,
          category,
          imageUrl,
          defaultExpireDays,
        });
      }
    }, [ingredientData, setImageUrlDirect]);

    useEffect(() => {
      if (isNew) {
        setName("");
        setCategory("other");
        setImageUrlDirect("");
        setDefaultExpireDays("3");
      }
    }, [isNew, ingredientId, setImageUrlDirect]);

    const createMutation = useMutation({
      mutationFn: createIngredient,
      onSuccess: async (data, variables) => {
        if (isCloned && ingredientId) {
          await removeClonedItem("ingredient", ingredientId);
        }
        queryClient.invalidateQueries({ queryKey: ["ingredients"] });
        Alert.alert("Success", "Ingredient created successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to create ingredient");
      },
    });

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

    const handleSave = async () => {
      if (!name.trim()) {
        Alert.alert("Error", "Please enter ingredient name");
        return;
      }

      const data = {
        name: name.trim(),
        category: category.trim() || "other",
        imageUrl: imageUrl || undefined,
        defaultExpiryDays: parseInt(defaultExpireDays) || 3,
      };

      if (isCloned && ingredientId) {
        await updateClonedItem("ingredient", ingredientId, data);
        await markClonedItemAsEdited("ingredient", ingredientId);
        createMutation.mutate(data);
      } else if (isNew) {
        createMutation.mutate(data);
      } else {
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
      try {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
          const localUri = result.assets[0].uri;
          await uploadImage(localUri);
        }
      } catch (error) {
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
                        {category
                          ? CATEGORIES.find((c) => c.value === category)?.label
                          : "Select category"}
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
                          <IText size={14} color={category === cat.value ? "#82CD47" : "#000000"}>
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
