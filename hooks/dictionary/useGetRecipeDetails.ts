import { getRecipeById } from "@/api/dictionary";
import { useQuery } from "@tanstack/react-query";

export const useGetRecipeDetails = (recipeId?: string) => {
  return useQuery({
    queryKey: ["recipe", recipeId],
    queryFn: () => getRecipeById(recipeId!),
    enabled: !!recipeId,
  });
};
