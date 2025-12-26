import axiosInstance from "@/services/axios";

export type GetAllFridgeItemsParams = {
    page?: number,
    limit?: number,
    sortBy: 'expiryDate_asc' | 'expiryDate_desc' | 'purchaseDate_asc' 
        | 'purchaseDate_desc' | 'createdAt_asc' | 'createdAt_desc',
    status?: 'in-stock' | 'used' | 'expired' | 'discarded',
    search?: string
}

export const getAllFridgeItems = ({page, limit, sortBy, status, search}: GetAllFridgeItemsParams) => {
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