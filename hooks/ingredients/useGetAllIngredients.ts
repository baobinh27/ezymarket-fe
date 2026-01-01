import { getAllIngredients, GetAllIngredientsParams } from "@/api/ingredients";
import { useQuery } from "@tanstack/react-query";

const useGetAllIngredients = ({
  params,
  enabled,
}: {
  params: GetAllIngredientsParams;
  enabled: boolean;
}) => {
  return useQuery({
    enabled: enabled,
    queryKey: ["ingredients", params],
    queryFn: ({ queryKey }) => {
      const [, params] = queryKey as [string, GetAllIngredientsParams];
      return getAllIngredients(params);
    },
  });
};

export default useGetAllIngredients;
