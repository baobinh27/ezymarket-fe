import axiosInstance from "@/services/axios";
import { PaginatedResponse } from "@/types/api";

export interface GetAllIngredientsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
}

export const getAllIngredients = ({
  page,
  limit,
  category,
  search,
}: GetAllIngredientsParams): Promise<PaginatedResponse<any>> => {
  return axiosInstance.get("/api/ingredients", {
    params: {
      page,
      limit,
      category,
      search,
    },
  });
};
