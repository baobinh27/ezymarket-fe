import { getReportOverview } from "@/api/reports";
import { useQuery } from "@tanstack/react-query";

const useGetReportOverview = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["report-overview"],
    queryFn: () => getReportOverview(),
    enabled,
  });
};

export default useGetReportOverview;
