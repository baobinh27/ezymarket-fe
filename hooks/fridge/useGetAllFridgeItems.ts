import { getAllFridgeItems, GetAllFridgeItemsParams } from "@/api/fridge";
import { PaginatedResponse } from "@/types/api";
import { FridgeItem } from "@/components/fridge/FridgeItemCard";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export const useGetAllFridgeItems = ({ params, enabled = true }: {params: GetAllFridgeItemsParams, enabled?: boolean}): UseQueryResult<PaginatedResponse<FridgeItem>, Error> => {
  return useQuery({
    enabled: enabled,
    queryKey: ["fridge-items", params],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, GetAllFridgeItemsParams];

      return getAllFridgeItems(params);
    },
  });
};
