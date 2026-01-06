import { useGetRecipeDetails } from "@/hooks/dictionary/useGetRecipeDetails";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import IBottomSheetModal, { Ref } from "../IBottomSheetModal";
import { ItemCard, ItemImageWithFallback, IText } from "../styled";

type RecipeIngredientsModalProps = {
  visible: boolean;
  recipeId?: string;
  onClose: () => void;
};

const RecipeIngredientsModal = ({ visible, recipeId, onClose }: RecipeIngredientsModalProps) => {
  const { data: recipe, isLoading } = useGetRecipeDetails(recipeId);
  const bottomSheetRef = useRef<Ref>(null);

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [visible]);

  return (
    <IBottomSheetModal
      ref={bottomSheetRef}
      title="Recipe Ingredients"
      snapPoints={["70%", "100%"]}
      onClose={onClose}
      showCancelButton={true}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#22C55E" />
        </View>
      ) : recipe ? (
        <View style={styles.content}>
          {recipe.imageUrl && (
            <ItemImageWithFallback source={recipe.imageUrl} style={styles.recipeImage} />
          )}

          <View style={styles.infoSection}>
            <IText semiBold style={styles.recipeName}>
              {recipe.title}
            </IText>

            {recipe.description && (
              <IText size={12} color="#666" style={styles.description}>
                {recipe.description}
              </IText>
            )}

            <View style={styles.statsRow}>
              {recipe.prepTime !== undefined && (
                <ItemCard style={styles.statCard}>
                  <IText size={11} color="#666">
                    Prep time
                  </IText>
                  <IText semiBold>{recipe.prepTime}m</IText>
                </ItemCard>
              )}
              {recipe.cookTime !== undefined && (
                <ItemCard style={styles.statCard}>
                  <IText size={11} color="#666">
                    Cook time
                  </IText>
                  <IText semiBold>{recipe.cookTime}m</IText>
                </ItemCard>
              )}
            </View>
          </View>

          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <View style={styles.ingredientsSection}>
              <IText semiBold style={styles.sectionTitle}>
                Ingredients ({recipe.ingredients.length})
              </IText>

              {recipe.ingredients.map((ingredient: any, index: number) => (
                <ItemCard key={index} style={styles.ingredientCard}>
                  <View style={styles.ingredientContent}>
                    {ingredient.imageUrl && (
                      <ItemImageWithFallback
                        source={ingredient.imageUrl}
                        style={styles.ingredientImage}
                      />
                    )}
                    <View style={styles.ingredientInfo}>
                      <IText semiBold>{ingredient.name || ingredient.foodId?.name}</IText>
                      <IText size={11} color="#666">
                        {ingredient.quantity} {ingredient.unit || ingredient.unitId?.abbreviation}
                      </IText>
                    </View>
                  </View>
                </ItemCard>
              ))}
            </View>
          )}
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <IText>Recipe not found</IText>
        </View>
      )}
    </IBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  recipeImage: {
    height: 200,
    width: 200,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: "center",
  },
  infoSection: {
    marginBottom: 24,
  },
  recipeName: {
    fontSize: 18,
    marginBottom: 8,
  },
  description: {
    marginBottom: 12,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
  },
  ingredientsSection: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  ingredientCard: {
    paddingVertical: 12,
  },
  ingredientContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  ingredientImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  ingredientInfo: {
    flex: 1,
  },
});

export default RecipeIngredientsModal;
