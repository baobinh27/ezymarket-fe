import { createMealItem, CreateMealItemParams } from "@/api/meal";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateMealItemFromPlanning = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealItemParams) => createMealItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-plans"] });
    },
  });
};
