import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getIngredients } from "@/api/dictionary";
import dictionaryItemStyles from "@/components/dictionary/DictionaryItemCard/dictionary-item.styles";
import DictionaryItemCard from "@/components/dictionary/DictionaryItemCard/DictionaryItemCard";
import EditIngredientModal from "@/components/dictionary/EditIngredientModal/EditIngredientModal";
import EmptyState from "@/components/dictionary/EmptyState/EmptyState";
import { IText } from "@/components/styled";
import { useAuth } from "@/services/auth/auth.context";
import {
  cloneItem,
  getClonedItemsByType,
  getHiddenItems,
  hideItem,
  unhideItem,
} from "@/utils/dictionaryStorage";

interface DictionaryFridgeItemsProps {
  searchQuery: string;
}

const DictionaryFridgeItems = forwardRef(({ searchQuery }: DictionaryFridgeItemsProps, ref) => {
  const [editIngredientId, setEditIngredientId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [clonedItems, setClonedItems] = useState<any[]>([]);
  const ingredientSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredients", searchQuery],
    queryFn: () => getIngredients({ search: searchQuery || undefined, limit: 10 }),
  });

  useEffect(() => {
    const loadHiddenAndCloned = async () => {
      const hidden = await getHiddenItems();
      setHiddenIds(hidden.ingredient || []);
      const cloned = await getClonedItemsByType("ingredient");
      setClonedItems(cloned.map((item) => item.data));
    };
    loadHiddenAndCloned();
  }, []);

  const ingredients = (data as any)?.ingredients || [];
  const isAdmin = user?.role === "admin";

  const allIngredients = [...ingredients, ...clonedItems];

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

  const handleHide = async (id: string) => {
    await hideItem("ingredient", id);
    const hidden = await getHiddenItems();
    setHiddenIds(hidden.ingredient || []);
    queryClient.invalidateQueries({ queryKey: ["ingredients"] });
  };

  const handleShow = async (id: string) => {
    await unhideItem("ingredient", id);
    const hidden = await getHiddenItems();
    setHiddenIds(hidden.ingredient || []);
    queryClient.invalidateQueries({ queryKey: ["ingredients"] });
  };

  const handleClone = async (item: any) => {
    const tempId = await cloneItem("ingredient", item._id, item);
    const cloned = await getClonedItemsByType("ingredient");
    setClonedItems(cloned.map((c) => c.data));
    setEditIngredientId(tempId);
    ingredientSheetRef.current?.present();
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
      {allIngredients.length === 0 ? (
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
          {allIngredients.map((item: any, index: number) => {
            const isSystemIngredient = !item.creatorId;
            const creatorId = item.creatorId?._id ?? item.creatorId ?? null;
            const isCloned = item._id?.startsWith("temp_ingredient_");
            const isHidden = hiddenIds.includes(item._id);
            const canEdit = isAdmin || creatorId === user?.id || isCloned;

            return (
              <DictionaryItemCard
                key={item._id || `ingredient-${index}`}
                id={item._id}
                type="ingredient"
                icon={item.imageURL || item.imageUrl}
                name={item.name}
                unit="piece"
                expiryDuration={
                  item.defaultExpireDays ? `${item.defaultExpireDays} days` : undefined
                }
                isSystem={!canEdit && !isCloned}
                isHidden={isHidden}
                onEdit={canEdit ? () => handleEdit(item._id) : undefined}
                onHide={canEdit && !isCloned && !isHidden ? () => handleHide(item._id) : undefined}
                onShow={canEdit && !isCloned && isHidden ? () => handleShow(item._id) : undefined}
                onClone={canEdit && !isCloned ? () => handleClone(item) : undefined}
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
