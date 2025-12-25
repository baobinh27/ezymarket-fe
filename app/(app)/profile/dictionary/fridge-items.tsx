import { View, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { IText } from "@/components/styled";
import { getIngredients } from "@/api/dictionary";
import DictionaryItemCard from "./components/DictionaryItemCard";
import EmptyState from "./components/EmptyState";
import EditIngredientModal from "./components/EditIngredientModal";
import dictionaryItemStyles from "./dictionary-item.styles";

interface DictionaryFridgeItemsProps {
  searchQuery: string;
}

const DictionaryFridgeItems = forwardRef(({ searchQuery }: DictionaryFridgeItemsProps, ref) => {
  const [editIngredientId, setEditIngredientId] = useState<string | null>(null);
  const ingredientSheetRef = useRef<BottomSheetModal>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredients", searchQuery],
    queryFn: () => getIngredients({ search: searchQuery || undefined, limit: 100 }),
  });

  const ingredients = (data as any)?.ingredients || [];

  const handleCreateNew = () => {
    setEditIngredientId(null);
    ingredientSheetRef.current?.present();
  };

  const handleEdit = (id: string) => {
    setEditIngredientId(id);
    ingredientSheetRef.current?.present();
  };

  const handleCloseModal = () => {
    ingredientSheetRef.current?.dismiss();
    setEditIngredientId(null);
  };

  // Expose handleCreateNew to parent
  useImperativeHandle(ref, () => ({
    handleCreateNew,
  }));

  if (isLoading) {
    return (
      <View style={dictionaryItemStyles.centerContainer}>
        <ActivityIndicator size="large" color="#46982D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={dictionaryItemStyles.centerContainer}>
        <IText color="#000000B4">Something went wrong. Please try again.</IText>
      </View>
    );
  }

  return (
    <View style={dictionaryItemStyles.container}>

      {ingredients.length === 0 ? (
        <EmptyState
          icon="package"
          title={searchQuery ? "No items found" : "No fridge items yet"}
          message={
            searchQuery
              ? "Try adjusting your search terms"
              : "Tap '+ New' to add your first fridge item"
          }
        />
      ) : (
        <>
          {ingredients.map((item: any, index: number) => {
            // System ingredient if creatorId is null/undefined
            const isSystemIngredient = !item.creatorId;

            return (
              <DictionaryItemCard
                key={item._id || `ingredient-${index}`}
                id={item._id}
                type="ingredient"
                icon={item.imageURL}
                name={item.name}
                unit="piece"
                expiryDuration={item.defaultExpireDays ? `${item.defaultExpireDays} days` : undefined}
                isSystem={isSystemIngredient}
                onEdit={() => {
                  if (!isSystemIngredient) {
                    handleEdit(item._id);
                  }
                }}
                onHide={() => {
                  console.log("Hide ingredient:", item._id);
                }}
                onClone={() => {
                  console.log("Clone ingredient:", item._id);
                }}
              />
            );
          })}
        </>
      )}

      {/* Edit Modal */}
      <EditIngredientModal
        ref={ingredientSheetRef}
        ingredientId={editIngredientId}
        onClose={handleCloseModal}
      />
    </View>
  );
});

DictionaryFridgeItems.displayName = "DictionaryFridgeItems";

export default DictionaryFridgeItems;
