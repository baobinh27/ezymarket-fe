import { getMealByDateRange, GetMealByDateRangeParams } from "@/api/meal";
import { useQuery } from "@tanstack/react-query";

const useGetMealByDateRange = ({
  params,
  enabled = true,
}: {
  params: GetMealByDateRangeParams;
  enabled?: boolean;
}) => {
  return useQuery({
    enabled,
    queryKey: ["meals", params.startDate, params.endDate],
    queryFn: () => {
      return getMealByDateRange(params);
    },
  });
};

export default useGetMealByDateRange;
