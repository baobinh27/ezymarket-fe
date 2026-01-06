import { cookMealItem } from "@/api/meal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMarkMealItemAsCooked = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cookMealItem(itemId),
    onSuccess: (data) => {
      // Invalidate meal plans to refetch updated data
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};
