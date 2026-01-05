
import { updateFridgeItem, UpdateFridgeItemParams } from "@/api/fridge";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateFridgeItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            itemId,
            params,
        }: {
            itemId: string;
            params: UpdateFridgeItemParams;
        }) => updateFridgeItem(itemId, params),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["fridge-items"],
            });
        },
    });
};
