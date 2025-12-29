import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getIngredients } from "@/api/dictionary";
import { IText } from "@/components/styled";
import { useAuth } from "@/services/auth/auth.context";
import DictionaryItemCard from "./components/DictionaryItemCard";
import EditIngredientModal from "./components/EditIngredientModal";
import EmptyState from "./components/EmptyState";
import dictionaryItemStyles from "./dictionary-item.styles";

interface DictionaryFridgeItemsProps {
  searchQuery: string;
}

const DictionaryFridgeItems = forwardRef(({ searchQuery }: DictionaryFridgeItemsProps, ref) => {
  const [editIngredientId, setEditIngredientId] = useState<string | null>(null);
  const ingredientSheetRef = useRef<BottomSheetModal>(null);
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredients", searchQuery],
    queryFn: () => getIngredients({ search: searchQuery || undefined, limit: 10 }),
  });

  const ingredients = (data as any)?.ingredients || [];
  const isAdmin = user?.role === "admin";

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
            const isSystemIngredient = !item.creatorId;
            const creatorId = item.creatorId?._id ?? item.creatorId ?? null;
            
            const canEdit = 
              isAdmin || 
              (creatorId === user?.id);

            return (
              <DictionaryItemCard
                key={item._id || `ingredient-${index}`}
                id={item._id}
                type="ingredient"
                icon={item.imageURL}
                name={item.name}
                unit="piece"
                expiryDuration={item.defaultExpireDays ? `${item.defaultExpireDays} days` : undefined}
                isSystem={!canEdit}
                onEdit={canEdit ? () => handleEdit(item._id) : undefined}
                onHide={canEdit ? () => {
                  console.log("Hide ingredient:", item._id);
                } : undefined}
                onClone={canEdit ? () => {
                  console.log("Clone ingredient:", item._id);
                } : undefined}
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
