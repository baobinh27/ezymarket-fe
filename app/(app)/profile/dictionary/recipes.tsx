import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getRecipes } from "@/api/dictionary";
import dictionaryItemStyles from "@/components/dictionary/DictionaryItemCard/dictionary-item.styles";
import DictionaryItemCard from "@/components/dictionary/DictionaryItemCard/DictionaryItemCard";
import EditRecipeModal from "@/components/dictionary/EditRecipeModal/EditRecipeModal";
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

interface DictionaryRecipesProps {
  searchQuery: string;
}

const DictionaryRecipes = forwardRef(({ searchQuery }: DictionaryRecipesProps, ref) => {
  const [editRecipeId, setEditRecipeId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [clonedItems, setClonedItems] = useState<any[]>([]);
  const recipeSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", searchQuery],
    queryFn: () => getRecipes({ search: searchQuery || undefined, limit: 10 }),
  });

  useEffect(() => {
    const loadHiddenAndCloned = async () => {
      const hidden = await getHiddenItems();
      setHiddenIds(hidden.recipe || []);
      const cloned = await getClonedItemsByType("recipe");
      setClonedItems(cloned.map((item) => item.data));
    };
    loadHiddenAndCloned();
  }, []);

  const recipes = data?.recipes ?? [];
  const isAdmin = user?.role === "admin";

  const allRecipes = [...recipes, ...clonedItems];

  const handleCreateNew = () => {
    setEditRecipeId(null);
    recipeSheetRef.current?.present();
  };

  const handleEdit = (id: string) => {
    setEditRecipeId(id);
    recipeSheetRef.current?.present();
  };

  const handleCloseModal = () => {
    recipeSheetRef.current?.dismiss();
    setEditRecipeId(null);
  };

  const handleHide = async (id: string) => {
    await hideItem("recipe", id);
    const hidden = await getHiddenItems();
    setHiddenIds(hidden.recipe || []);
    queryClient.invalidateQueries({ queryKey: ["recipes"] });
  };

  const handleShow = async (id: string) => {
    await unhideItem("recipe", id);
    const hidden = await getHiddenItems();
    setHiddenIds(hidden.recipe || []);
    queryClient.invalidateQueries({ queryKey: ["recipes"] });
  };

  const handleClone = async (item: any) => {
    const tempId = await cloneItem("recipe", item._id, item);
    const cloned = await getClonedItemsByType("recipe");
    setClonedItems(cloned.map((c) => c.data));
    setEditRecipeId(tempId);
    recipeSheetRef.current?.present();
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
      {allRecipes.length === 0 ? (
        <EmptyState
          icon="book"
          title={searchQuery ? "No recipes found" : "No recipes yet"}
          message={
            searchQuery ? "Try adjusting your search terms" : "Tap '+ New' to add your first recipe"
          }
        />
      ) : (
        allRecipes.map((item: any) => {
          const creatorId = item.creatorId?._id ?? item.creatorId ?? null;
          const isCloned = item._id?.startsWith("temp_recipe_");
          const isHidden = hiddenIds.includes(item._id);
          const canEdit = isAdmin || creatorId === user?.id || isCloned;

          const validTags = (item.tags ?? []).filter((tag: any) => {
            if (!tag || typeof tag === "string" || !tag._id) return false;
            const nameStr = tag.name ?? "";
            return !(nameStr.length === 24 && /^[0-9a-fA-F]{24}$/.test(nameStr));
          });

          return (
            <DictionaryItemCard
              key={item._id}
              id={item._id}
              type="recipe"
              icon={item.imageUrl}
              name={item.title}
              description={item.description}
              tags={validTags}
              ingredientsCount={item.ingredients?.length ?? 0}
              isSystem={!canEdit && !isCloned}
              isHidden={isHidden}
              onEdit={canEdit ? () => handleEdit(item._id) : undefined}
              onHide={canEdit && !isCloned && !isHidden ? () => handleHide(item._id) : undefined}
              onShow={canEdit && !isCloned && isHidden ? () => handleShow(item._id) : undefined}
              onClone={canEdit && !isCloned ? () => handleClone(item) : undefined}
            />
          );
        })
      )}

      <EditRecipeModal ref={recipeSheetRef} recipeId={editRecipeId} onClose={handleCloseModal} />
    </View>
  );
});

DictionaryRecipes.displayName = "DictionaryRecipes";

export default DictionaryRecipes;
