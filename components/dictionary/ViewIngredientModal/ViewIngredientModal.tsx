import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import React, { forwardRef } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";

import { getIngredientById } from "@/api/dictionary";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { ItemImage, IText } from "@/components/styled";
import styles from "./ViewIngredientModal.styles";

interface ViewIngredientModalProps {
  ingredientId: string | null;
  onClose: () => void;
  onEdit?: () => void;
}

const CATEGORIES: Record<string, string> = {
  vegetables: "Vegetables (Rau củ)",
  fruits: "Fruits (Trái cây)",
  meat: "Meat (Thịt)",
  seafood: "Seafood (Hải sản)",
  dairy: "Dairy (Sữa)",
  grains: "Grains (Ngũ cốc)",
  spices: "Spices (Gia vị)",
  beverages: "Beverages (Đồ uống)",
  condiments: "Condiments (Nước chấm)",
  frozen: "Frozen (Đồ đông lạnh)",
  canned: "Canned (Đồ hộp)",
  bakery: "Bakery (Bánh mì)",
  snacks: "Snacks (Đồ ăn vặt)",
  other: "Other (Khác)",
};

const ViewIngredientModal = forwardRef<BottomSheetModal, ViewIngredientModalProps>(
  ({ ingredientId, onClose, onEdit }, ref) => {
    const { data: ingredientData, isLoading } = useQuery({
      queryKey: ["ingredient", ingredientId],
      queryFn: () => getIngredientById(ingredientId as string),
      enabled: !!ingredientId,
    });

    if (!ingredientId) return null;

    const ingredient = ingredientData
      ? (ingredientData as any).ingredient || ingredientData
      : null;

    const imageUrl = ingredient?.imageURL || ingredient?.imageUrl || "";
    const name = ingredient?.name || "";
    const category = ingredient?.foodCategory || ingredient?.category || "other";
    const defaultExpireDays = ingredient?.defaultExpireDays || 3;

    return (
      <IBottomSheetModal ref={ref} title="Fridge Item Details" snapPoints={["70%"]} onClose={onClose}>
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#46982D" />
            </View>
          ) : ingredient ? (
            <View style={styles.container}>
              {/* Image Section */}
              <View style={styles.imageSection}>
                {imageUrl ? (
                  <ItemImage source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Octicons name="package" size={48} color="#000000B4" />
                  </View>
                )}
              </View>

              {/* Details Section */}
              <View style={styles.detailsSection}>
                <View style={styles.detailRow}>
                  <IText size={14} color="#000000B4" style={styles.label}>
                    Name
                  </IText>
                  <IText size={16} bold>
                    {name}
                  </IText>
                </View>

                <View style={styles.detailRow}>
                  <IText size={14} color="#000000B4" style={styles.label}>
                    Category
                  </IText>
                  <IText size={16}>{CATEGORIES[category] || category}</IText>
                </View>

                <View style={styles.detailRow}>
                  <IText size={14} color="#000000B4" style={styles.label}>
                    Default Expiry Duration
                  </IText>
                  <IText size={16}>{defaultExpireDays} days</IText>
                </View>
              </View>

              {/* Edit Button */}
              {onEdit && (
                <View style={styles.buttonSection}>
                  <IButton variant="primary" onPress={onEdit} style={styles.editButton}>
                    <IText size={16} semiBold color="white">
                      Edit
                    </IText>
                  </IButton>
                </View>
              )}
            </View>
          ) : (
            <View style={styles.centerContainer}>
              <IText color="#000000B4">Ingredient not found</IText>
            </View>
          )}
        </BottomSheetScrollView>
      </IBottomSheetModal>
    );
  }
);

ViewIngredientModal.displayName = "ViewIngredientModal";

export default ViewIngredientModal;
