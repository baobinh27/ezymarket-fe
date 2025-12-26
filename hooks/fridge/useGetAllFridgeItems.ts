import { getAllFridgeItems, GetAllFridgeItemsParams } from "@/api/fridge";
import { useQuery } from "@tanstack/react-query";

export const useGetAllFridgeItems = ({ params, enabled = true }: {params: GetAllFridgeItemsParams, enabled?: boolean}) => {
  return useQuery({
    enabled: enabled,
    queryKey: ["fridge-items", params],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, GetAllFridgeItemsParams];

      return getAllFridgeItems(params);
    },
  });
};
