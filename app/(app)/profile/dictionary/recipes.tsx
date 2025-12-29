import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getRecipes } from "@/api/dictionary";
import { IText } from "@/components/styled";
import { useAuth } from "@/services/auth/auth.context";
import DictionaryItemCard from "./components/DictionaryItemCard";
import EditRecipeModal from "./components/EditRecipeModal";
import EmptyState from "./components/EmptyState";
import dictionaryItemStyles from "./dictionary-item.styles";

interface DictionaryRecipesProps {
  searchQuery: string;
}

const DictionaryRecipes = forwardRef(({ searchQuery }: DictionaryRecipesProps, ref) => {
  const [editRecipeId, setEditRecipeId] = useState<string | null>(null);
  const recipeSheetRef = useRef<BottomSheetModal>(null);
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", searchQuery],
    queryFn: () => getRecipes({ search: searchQuery || undefined, limit: 10 }),
  });

  const recipes = data?.recipes ?? [];
  const isAdmin = user?.role === "admin";

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
            searchQuery
              ? "Try adjusting your search terms"
              : "Tap '+ New' to add your first recipe"
          }
        />
      ) : (
        recipes.map((item: any) => {
          const creatorId = item.creatorId?._id ?? item.creatorId ?? null;
          const canEdit = isAdmin || (creatorId === user?.id);

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
              onEdit={canEdit ? () => handleEdit(item._id) : undefined}
              onHide={canEdit ? () => console.log("Hide recipe:", item._id) : undefined}
              onClone={canEdit ? () => console.log("Clone recipe:", item._id) : undefined}
            />
          );
        })
      )}

      <EditRecipeModal
        ref={recipeSheetRef}
        recipeId={editRecipeId}
        onClose={handleCloseModal}
      />
    </View>
  );
});

DictionaryRecipes.displayName = "DictionaryRecipes";

export default DictionaryRecipes;
