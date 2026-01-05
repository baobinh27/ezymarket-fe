
import { deleteFridgeItem } from "@/api/fridge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteFridgeItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (itemId: string) => deleteFridgeItem(itemId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fridge-items"],
            });
        },
    });
};
