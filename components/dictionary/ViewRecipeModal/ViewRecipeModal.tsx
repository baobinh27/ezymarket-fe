import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import React, { forwardRef } from "react";
import { ActivityIndicator, View } from "react-native";

import { getRecipeById } from "@/api/dictionary";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { ItemImage, IText } from "@/components/styled";
import styles from "./ViewRecipeModal.styles";

interface ViewRecipeModalProps {
  recipeId: string | null;
  onClose: () => void;
  onEdit?: () => void;
}

const ViewRecipeModal = forwardRef<BottomSheetModal, ViewRecipeModalProps>(
  ({ recipeId, onClose, onEdit }, ref) => {
    const { data: recipeData, isLoading } = useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: () => getRecipeById(recipeId as string),
      enabled: !!recipeId,
    });

    if (!recipeId) return null;

    const recipe = recipeData ? (recipeData as any).recipe || recipeData : null;

    const imageUrl = recipe?.imageUrl || "";
    const title = recipe?.title || "";
    const description = recipe?.description || "";
    const prepTime = recipe?.prepTime;
    const cookTime = recipe?.cookTime;
    const servings = recipe?.servings;
    const ingredients = recipe?.ingredients || [];
    const directions = recipe?.directions || recipe?.cookingSteps || [];
    const tags = (recipe?.tags || []).filter((tag: any) => {
      if (typeof tag === "string" || !tag?._id) return false;
      const nameStr = tag.name ?? "";
      return !(nameStr.length === 24 && /^[0-9a-fA-F]{24}$/.test(nameStr));
    });

    return (
      <IBottomSheetModal ref={ref} title="Recipe Details" snapPoints={["90%"]} onClose={onClose}>
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#46982D" />
            </View>
          ) : recipe ? (
            <View style={styles.container}>
              {/* Image Section */}
              <View style={styles.imageSection}>
                {imageUrl ? (
                  <ItemImage source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Octicons name="book" size={48} color="#000000B4" />
                  </View>
                )}
              </View>

              {/* Title and Description */}
              <View style={styles.headerSection}>
                <IText size={24} bold>
                  {title}
                </IText>
                {description && (
                  <IText size={14} color="#000000B4" style={styles.description}>
                    {description}
                  </IText>
                )}
              </View>

              {/* Meta Information */}
              <View style={styles.metaSection}>
                {prepTime !== undefined && (
                  <View style={styles.metaItem}>
                    <Octicons name="clock" size={16} color="#000000B4" />
                    <IText size={14} color="#000000B4">
                      Prep: {prepTime} min
                    </IText>
                  </View>
                )}
                {cookTime !== undefined && (
                  <View style={styles.metaItem}>
                    <Octicons name="clock" size={16} color="#000000B4" />
                    <IText size={14} color="#000000B4">
                      Cook: {cookTime} min
                    </IText>
                  </View>
                )}
                {servings !== undefined && (
                  <View style={styles.metaItem}>
                    <Octicons name="people" size={16} color="#000000B4" />
                    <IText size={14} color="#000000B4">
                      Serves: {servings}
                    </IText>
                  </View>
                )}
              </View>

              {/* Tags */}
              {tags.length > 0 && (
                <View style={styles.tagsSection}>
                  <IText size={14} semiBold style={styles.sectionTitle}>
                    Tags
                  </IText>
                  <View style={styles.tagsContainer}>
                    {tags.map((tag: any) => {
                      const tagName = typeof tag === "object" ? tag.name : tag;
                      return (
                        <View key={typeof tag === "object" ? tag._id : tagName} style={styles.tag}>
                          <IText size={12} color="#46982D">
                            {tagName}
                          </IText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Ingredients */}
              {ingredients.length > 0 && (
                <View style={styles.section}>
                  <IText size={16} semiBold style={styles.sectionTitle}>
                    Ingredients ({ingredients.length})
                  </IText>
                  <View style={styles.ingredientsList}>
                    {ingredients.map((ing: any, index: number) => (
                      <View key={index} style={styles.ingredientItem}>
                        <IText size={14} color="#000000B4">
                          • {ing.name || ing.ingredientId?.name || "Ingredient"} - {ing.quantity}{" "}
                          {ing.unitId?.abbreviation || ing.unitText || ""}
                        </IText>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Directions */}
              {directions.length > 0 && (
                <View style={styles.section}>
                  <IText size={16} semiBold style={styles.sectionTitle}>
                    Directions
                  </IText>
                  <View style={styles.directionsList}>
                    {directions.map((step: any, index: number) => (
                      <View key={index} style={styles.directionItem}>
                        <View style={styles.stepNumber}>
                          <IText size={14} bold color="white">
                            {index + 1}
                          </IText>
                        </View>
                        <IText size={14} color="#000000B4" style={styles.stepText}>
                          {step.description || step || ""}
                        </IText>
                      </View>
                    ))}
                  </View>
                </View>
              )}

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
              <IText color="#000000B4">Recipe not found</IText>
            </View>
          )}
        </BottomSheetScrollView>
      </IBottomSheetModal>
    );
  }
);

ViewRecipeModal.displayName = "ViewRecipeModal";

export default ViewRecipeModal;
