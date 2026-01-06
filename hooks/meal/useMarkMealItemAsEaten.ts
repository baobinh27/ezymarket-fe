import { markMealItemAsEaten } from "@/api/meal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export type MarkMealItemAsEatenVariables = {
  itemId: string;
  forceEat?: boolean;
};

export const useMarkMealItemAsEaten = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, forceEat }: MarkMealItemAsEatenVariables) =>
      markMealItemAsEaten(itemId, forceEat),
    onSuccess: (data) => {
      // Invalidate meal plans to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};
