import axiosInstance from "@/services/axios";

// Type definitions
export interface FridgeItemInput {
  foodId: string;
  unitId: string;
  quantity: number;
  purchaseDate?: string;
  expiryDate?: string;
  price?: number;
  status?: "in-stock" | "used" | "expired" | "discarded";
}

export interface FridgeItemResponse {
  _id: string;
  userId?: string | null;
  groupId?: string | null;
  foodId: {
    _id: string;
    name: string;
    imageURL?: string;
  };
  unitId: {
    _id: string;
    name: string;
    abbreviation?: string;
  };
  quantity: number;
  purchaseDate?: string;
  expiryDate?: string;
  price?: number;
  status: "in-stock" | "used" | "expired" | "discarded";
  createdAt: string;
  updatedAt: string;
}

export interface FridgeItemListParams {
  page?: number;
  limit?: number;
  sortBy?: string; // e.g., "expiryDate_asc"
  status?: "in-stock" | "used" | "expired" | "discarded";
  search?: string;
}

// GET /api/fridge-items - Get all fridge items with filters
export const getFridgeItems = async (params?: FridgeItemListParams) => {
  const response = await axiosInstance.get("/api/fridge-items", { params });
  return response.data;
};

// POST /api/fridge-items - Create new fridge item
export const createFridgeItem = async (data: FridgeItemInput) => {
  const response = await axiosInstance.post("/api/fridge-items", data);
  return response.data;
};

// PATCH /api/fridge-items/:itemId - Update fridge item
export const updateFridgeItem = async (
  itemId: string,
  data: Partial<FridgeItemInput>,
  originalData?: Partial<FridgeItemInput>
) => {
  // Check if there are any changes before calling API
  if (originalData) {
    const hasChanges = Object.keys(data).some((key) => {
      const k = key as keyof FridgeItemInput;
      return data[k] !== originalData[k];
    });

    if (!hasChanges) {
      throw new Error("No changes were made to save.");
    }
  }

  const response = await axiosInstance.patch(`/api/fridge-items/${itemId}`, data);
  return response.data;
};

// DELETE /api/fridge-items/:itemId - Delete fridge item
export const deleteFridgeItem = async (itemId: string) => {
  const response = await axiosInstance.delete(`/api/fridge-items/${itemId}`);
  return response.data;
};