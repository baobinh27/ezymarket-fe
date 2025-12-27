import { createFridgeItem, CreateFridgeItemParams } from "@/api/fridge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateFridgeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: CreateFridgeItemParams) => createFridgeItem(params),
    onSuccess: () => {
      // Invalidate fridge items query to refresh the list
      queryClient.invalidateQueries({
        queryKey: ["fridge-items"],
      });
    },
  });
};
