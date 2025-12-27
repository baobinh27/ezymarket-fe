import { FridgeItem } from "@/components/fridge/FridgeItemCard";
import axiosInstance from "@/services/axios";
import { PaginatedResponse } from "@/types/api";

export type GetAllFridgeItemsParams = {
    page?: number,
    limit?: number,
    sortBy: 'expiryDate_asc' | 'expiryDate_desc' | 'purchaseDate_asc' 
        | 'purchaseDate_desc' | 'createdAt_asc' | 'createdAt_desc',
    status?: 'in-stock' | 'used' | 'expired' | 'discarded',
    search?: string
}

export const getAllFridgeItems = ({page, limit, sortBy, status, search}: GetAllFridgeItemsParams): Promise<PaginatedResponse<FridgeItem>> => {
    return axiosInstance.get('/api/fridge-items', {
        params: {
            page,
            limit,
            sortBy,
            status,
            search
        }
    })
}

export type CreateFridgeItemParams = {
    foodId: string,
    unitId: string,
    quantity: number,
    purchaseDate?: string,
    expiryDate: string,
    price: number,
    status: string
}

export const createFridgeItem = ({foodId, unitId, quantity, purchaseDate, expiryDate, price, status}: CreateFridgeItemParams) => {
    purchaseDate = purchaseDate ? purchaseDate : (new Date()).toLocaleString();
    return axiosInstance.post('/api/fridge-items', {
        foodId,
        unitId,
        quantity,
        purchaseDate,
        expiryDate,
        price,
        status
    })
}