import { getMyGroups } from "@/api/group";
import { useQuery } from "@tanstack/react-query";

const useGetMyGroups = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["my-groups"],
    queryFn: getMyGroups,
    enabled,
  });
};

export default useGetMyGroups;
