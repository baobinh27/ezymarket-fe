import { getRecipes } from "@/api/dictionary";
import { useQuery } from "@tanstack/react-query";

export const useGetAllRecipes = (params?: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  return useQuery({
    queryKey: ["all-recipes", params],
    queryFn: () => getRecipes(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};
