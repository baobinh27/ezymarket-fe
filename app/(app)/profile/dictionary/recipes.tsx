import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, View } from "react-native";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { getRecipes } from "@/api/dictionary";
import { IText } from "@/components/styled";
import DictionaryItemCard from "./components/DictionaryItemCard";
import EmptyState from "./components/EmptyState";
import EditRecipeModal from "./components/EditRecipeModal";
import dictionaryItemStyles from "./dictionary-item.styles";
import { useAuth } from "@/services/auth/auth.context";

interface DictionaryRecipesProps {
  searchQuery: string;
}

const DictionaryRecipes = forwardRef(({ searchQuery }: DictionaryRecipesProps, ref) => {
  const [editRecipeId, setEditRecipeId] = useState<string | null>(null);
  const recipeSheetRef = useRef<BottomSheetModal>(null);
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["recipes", searchQuery],
    queryFn: () => getRecipes({ search: searchQuery || undefined, limit: 100 }),
  });

  const recipes = (data as any)?.recipes || (data as any)?.data || [];
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
          const isSystemRecipe = !item.creatorId;
          const canEdit = isAdmin || (!isSystemRecipe && item.creatorId === user?.id);

          return (
            <DictionaryItemCard
              key={item._id || item.id}
              id={item._id || item.id}
              type="recipe"
              icon={item.imageUrl}
              name={item.title}
              description={item.description}
              isSystem={!canEdit}
              onEdit={() => {
                if (canEdit) {
                  handleEdit(item._id || item.id);
                }
              }}
              onHide={() => {
                console.log("Hide recipe:", item._id || item.id);
              }}
              onClone={() => {
                console.log("Clone recipe:", item._id || item.id);
              }}
            />
          );
        })
      )}

      {/* Edit Modal */}
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
