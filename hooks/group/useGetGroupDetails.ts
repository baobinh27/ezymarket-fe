import { getGroupDetails } from "@/api/group";
import { useQuery } from "@tanstack/react-query";

const useGetGroupDetails = (groupId: string | null, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["group-details", groupId],
    queryFn: () => (groupId ? getGroupDetails(groupId) : Promise.reject()),
    enabled: enabled && groupId !== null,
  });
};

export default useGetGroupDetails;
