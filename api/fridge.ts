import axiosInstance from "@/services/axios";
import { PaginatedResponse } from "@/types/api";
import { FridgeItem } from "@/types/types";

export type GetAllFridgeItemsParams = {
  page?: number;
  limit?: number;
  sortBy:
  | "expiryDate_asc"
  | "expiryDate_desc"
  | "purchaseDate_asc"
  | "purchaseDate_desc"
  | "createdAt_asc"
  | "createdAt_desc";
  status?: "in-stock" | "used" | "expired" | "discarded";
  search?: string;
};

export const getAllFridgeItems = (
  params: GetAllFridgeItemsParams
): Promise<PaginatedResponse<FridgeItem>> => {
  return axiosInstance.get("/api/fridge-items", {
    params,
  });
};

export type CreateFridgeItemParams = {
  foodId: string;
  unitId: string;
  quantity: number;
  purchaseDate?: string;
  expiryDate: string;
  price: number;
  status: string;
};

export const createFridgeItem = ({
  foodId,
  unitId,
  quantity,
  purchaseDate,
  expiryDate,
  price,
  status,
}: CreateFridgeItemParams) => {
  purchaseDate = purchaseDate ? purchaseDate : new Date().toLocaleString();
  return axiosInstance.post("/api/fridge-items", {
    foodId,
    unitId,
    quantity,
    purchaseDate,
    expiryDate,
    price,
    status,
  });
};

export type UpdateFridgeItemParams = {
  unitId?: string;
  quantity?: number;
};

export const updateFridgeItem = (
  itemId: string,
  params: UpdateFridgeItemParams
) => {
  return axiosInstance.patch(`/api/fridge-items/${itemId}`, params);
};

export const deleteFridgeItem = (itemId: string) => {
  return axiosInstance.delete(`/api/fridge-items/${itemId}`);
};
