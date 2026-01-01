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
  getHiddenItems,
  hideItem,
  unhideItem,
} from "@/utils/dictionaryStorage";

interface DictionaryRecipesProps {
  searchQuery: string;
}

const normalizeRecipeForClone = (item: any) => {
  const tagsList = (item.tags ?? [])
    .map((tag: any) => (typeof tag === "object" ? tag.name : tag))
    .filter(Boolean);

  return {
    title: item.title ?? "",
    description: item.description ?? "",
    imageUrl: item.imageUrl ?? "",
    prepTime: item.prepTime ?? undefined,
    cookTime: item.cookTime ?? undefined,
    servings: item.servings ?? 4,
    directions: item.directions ?? [],
    ingredients: item.ingredients ?? [],
    tags: tagsList,
  };
};

const DictionaryRecipes = forwardRef(({ searchQuery }: DictionaryRecipesProps, ref) => {
  const [editRecipeId, setEditRecipeId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const recipeSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", searchQuery],
    queryFn: () => getRecipes({ search: searchQuery || undefined, limit: 10 }),
  });

  useEffect(() => {
    const loadHidden = async () => {
      const hidden = await getHiddenItems();
      setHiddenIds(hidden.recipe || []);
    };
    loadHidden();
  }, []);

  const recipes = data?.recipes ?? [];
  const isAdmin = user?.role === "admin";

  const handleCreateNew = () => {
    setEditRecipeId(null);
    setInitialData(null);
    recipeSheetRef.current?.present();
  };

  const handleEdit = (id: string) => {
    setEditRecipeId(id);
    setInitialData(null);
    recipeSheetRef.current?.present();
  };

  const handleCloseModal = () => {
    recipeSheetRef.current?.dismiss();
    setEditRecipeId(null);
    setInitialData(null);
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

  const handleClone = (item: any) => {
    setEditRecipeId(null);
    setInitialData(normalizeRecipeForClone(item));
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
      {recipes.length === 0 ? (
        <EmptyState
          icon="book"
          title={searchQuery ? "No recipes found" : "No recipes yet"}
          message={
            searchQuery ? "Try adjusting your search terms" : "Tap '+ New' to add your first recipe"
          }
        />
      ) : (
        recipes.map((item: any) => {
          const creatorId = item.creatorId?._id ?? item.creatorId ?? null;
          const isHidden = hiddenIds.includes(item._id);
          const canEdit = isAdmin || creatorId === user?.id;

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
              isSystem={!canEdit}
              isHidden={isHidden}
              onEdit={canEdit ? () => handleEdit(item._id) : undefined}
              onHide={canEdit && !isHidden ? () => handleHide(item._id) : undefined}
              onShow={canEdit && isHidden ? () => handleShow(item._id) : undefined}
              onClone={canEdit ? () => handleClone(item) : undefined}
            />
          );
        })
      )}

      <EditRecipeModal
        ref={recipeSheetRef}
        recipeId={editRecipeId}
        initialData={initialData}
        onClose={handleCloseModal}
      />
    </View>
  );
});

DictionaryRecipes.displayName = "DictionaryRecipes";

export default DictionaryRecipes;
