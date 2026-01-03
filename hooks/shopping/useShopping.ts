import {
    addItem,
    checkoutShoppingList,
    createShoppingList,
    CreateShoppingListPayload,
    getShoppingListById,
    getShoppingLists,
    removeItem,
    ShoppingList,
    updateItem,
    updateShoppingList
} from "@/api/shopping";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useShoppingLists = (groupId: string | undefined) => {
    return useQuery({
        queryKey: ["shopping-lists", groupId],
        queryFn: () => getShoppingLists(groupId!),
        enabled: !!groupId,
    });
};

export const useShoppingList = (id: string) => {
    return useQuery({
        queryKey: ["shopping-list", id],
        queryFn: () => getShoppingListById(id),
        enabled: !!id,
    });
};

export const useUpdateShoppingList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: { title?: string; description?: string } }) =>
            updateShoppingList(id, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["shopping-list", data._id] });
            queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
        },
    });
};

export const useCreateShoppingList = () => {
    const queryClient = useQueryClient();

    return useMutation<ShoppingList, Error, CreateShoppingListPayload>({
        mutationFn: createShoppingList,
        onSuccess: (data) => {
            console.log("Created shopping list:", data);
            // Invalidate queries to refresh the list
            queryClient.invalidateQueries({ queryKey: ["shopping-lists"] });
        },
    });
};

export const useAddShoppingItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            listId,
            item,
        }: {
            listId: string;
            item: {
                name: string;
                quantity: number;
                unit: string;
                ingredientId?: string;
            };
        }) => addItem(listId, item),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["shopping-list", variables.listId],
            });
            queryClient.invalidateQueries({
                queryKey: ["shopping-lists"],
            });
        },
    });
};

export const useUpdateItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            listId,
            itemId,
            data,
        }: {
            listId: string;
            itemId: string;
            data: {
                name?: string;
                quantity?: number;
                unitId?: string;
                isPurchased?: boolean;
            };
        }) => updateItem(listId, itemId, data),
        onMutate: async ({ listId, itemId, data }) => {
            // Cancel any outgoing refetches
            await queryClient.cancelQueries({
                queryKey: ["shopping-list", listId],
            });

            // Snapshot the previous value
            const previousList = queryClient.getQueryData<ShoppingList>([
                "shopping-list",
                listId,
            ]);

            // Optimistically update to the new value
            if (previousList) {
                queryClient.setQueryData<ShoppingList>(
                    ["shopping-list", listId],
                    (old) => {
                        if (!old) return old;
                        return {
                            ...old,
                            items: old.items.map((item) =>
                                item._id === itemId
                                    ? ({ ...item, ...data } as ShoppingList["items"][number])
                                    : item
                            ),
                        };
                    }
                );
            }

            // Return a context object with the snapshotted value
            return { previousList };
        },
        onError: (err, variables, context: any) => {
            // If the mutation fails, use the context returned from onMutate to roll back
            if (context?.previousList) {
                queryClient.setQueryData(
                    ["shopping-list", variables.listId],
                    context.previousList
                );
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success to ensure data consistency
            queryClient.invalidateQueries({
                queryKey: ["shopping-list", variables.listId],
            });
        },
    });
};

export const useDeleteItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            listId,
            itemId,
        }: {
            listId: string;
            itemId: string;
        }) => removeItem(listId, itemId),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["shopping-list", variables.listId],
            });
            queryClient.invalidateQueries({
                queryKey: ["shopping-lists"],
            });
        },
    });
};

export const useCheckoutShoppingList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            listId,
            items,
        }: {
            listId: string;
            items: {
                itemId: string;
                price?: number;
                servingQuantity?: number;
                expiryDate?: string;
            }[];
        }) => checkoutShoppingList(listId, items),
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["shopping-list", variables.listId],
            });
            queryClient.invalidateQueries({
                queryKey: ["shopping-lists"],
            });
        },
    });
};
