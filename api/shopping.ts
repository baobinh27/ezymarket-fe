import axiosInstance from "@/services/axios";
import { ShoppingItem } from "@/types/types";

// Types



export interface ShoppingList {
    _id: string;
    groupId: string;
    creatorId: string;
    title: string;
    description?: string;
    status: "active" | "completed" | "archived";
    items: ShoppingItem[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateShoppingListPayload {
    groupId: string;
    title: string;
    description?: string;
    items?: {
        name: string;
        quantity: number;
        unitId: string;
        ingredientId?: string;
    }[];
}

// Routes
export const createShoppingList = async (
    payload: CreateShoppingListPayload
): Promise<ShoppingList> => {
    return axiosInstance.post("/api/shopping-lists", payload);
};

export const getShoppingLists = async (
    groupId: string
): Promise<ShoppingList[]> => {
    return axiosInstance.get(`/api/shopping-lists/group/${groupId}`);
};

export const getShoppingListById = async (
    id: string
): Promise<ShoppingList> => {
    return axiosInstance.get(`/api/shopping-lists/${id}`);
};

export const updateShoppingList = async (
    id: string,
    data: { title?: string; description?: string }
): Promise<ShoppingList> => {
    return axiosInstance.put(`/api/shopping-lists/${id}`, data);
};

export const addItem = async (
    listId: string,
    item: {
        name: string;
        quantity: number;
        unit: string;
        ingredientId?: string;
    }
): Promise<ShoppingList> => {
    return axiosInstance.post(`/api/shopping-lists/${listId}/items`, item);
};

export const updateItem = async (
    listId: string,
    itemId: string,
    data: {
        name?: string;
        quantity?: number;
        unit?: string;
        isPurchased?: boolean;
    }
): Promise<ShoppingList> => {
    return axiosInstance.put(
        `/api/shopping-lists/${listId}/items/${itemId}`,
        data
    );
};

export const removeItem = async (
    listId: string,
    itemId: string
): Promise<ShoppingList> => {
    return axiosInstance.delete(`/api/shopping-lists/${listId}/items/${itemId}`);
};

export const deleteShoppingList = async (id: string): Promise<void> => {
    return axiosInstance.delete(`/api/shopping-lists/${id}`);
};

export const checkoutShoppingList = async (
    id: string,
    items: {
        itemId: string;
        price?: number;
        servingQuantity?: number;
        expiryDate?: string;
    }[]
): Promise<ShoppingList> => {
    return axiosInstance.post(`/api/shopping-lists/${id}/checkout`, { items });
};
