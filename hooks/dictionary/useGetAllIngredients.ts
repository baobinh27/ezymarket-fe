import { getIngredients } from "@/api/dictionary";
import { useQuery } from "@tanstack/react-query";

export const useGetAllIngredients = (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  return useQuery({
    queryKey: ["all-ingredients", params],
    queryFn: () => getIngredients(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
