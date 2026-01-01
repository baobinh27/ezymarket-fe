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
  getHiddenItems,
  hideItem,
  unhideItem,
} from "@/utils/dictionaryStorage";

interface DictionaryFridgeItemsProps {
  searchQuery: string;
}

const normalizeIngredientForClone = (item: any) => {
  return {
    name: item.name ?? "",
    category: item.foodCategory ?? item.category ?? "other",
    imageUrl: item.imageURL ?? item.imageUrl ?? "",
    defaultExpireDays: item.defaultExpireDays ?? 3,
  };
};

const DictionaryFridgeItems = forwardRef(({ searchQuery }: DictionaryFridgeItemsProps, ref) => {
  const [editIngredientId, setEditIngredientId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const ingredientSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["ingredients", searchQuery],
    queryFn: () => getIngredients({ search: searchQuery || undefined, limit: 10 }),
  });

  useEffect(() => {
    const loadHidden = async () => {
      const hidden = await getHiddenItems();
      setHiddenIds(hidden.ingredient || []);
    };
    loadHidden();
  }, []);

  const ingredients = (data as any)?.ingredients || [];
  const isAdmin = user?.role === "admin";

  const handleCreateNew = () => {
    setEditIngredientId(null);
    setInitialData(null);
    ingredientSheetRef.current?.present();
  };

  const handleEdit = (id: string) => {
    setEditIngredientId(id);
    setInitialData(null);
    ingredientSheetRef.current?.present();
  };

  const handleCloseModal = () => {
    ingredientSheetRef.current?.dismiss();
    setEditIngredientId(null);
    setInitialData(null);
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

  const handleClone = (item: any) => {
    setEditIngredientId(null);
    setInitialData(normalizeIngredientForClone(item));
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
            const isHidden = hiddenIds.includes(item._id);
            const canEdit = isAdmin || creatorId === user?.id;

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
                isSystem={!canEdit}
                isHidden={isHidden}
                onEdit={canEdit ? () => handleEdit(item._id) : undefined}
                onHide={canEdit && !isHidden ? () => handleHide(item._id) : undefined}
                onShow={canEdit && isHidden ? () => handleShow(item._id) : undefined}
                onClone={canEdit ? () => handleClone(item) : undefined}
              />
            );
          })}
        </>
      )}

      {/* Edit Modal */}
      <EditIngredientModal
        ref={ingredientSheetRef}
        ingredientId={editIngredientId}
        initialData={initialData}
        onClose={handleCloseModal}
      />
    </View>
  );
});

DictionaryFridgeItems.displayName = "DictionaryFridgeItems";

export default DictionaryFridgeItems;
