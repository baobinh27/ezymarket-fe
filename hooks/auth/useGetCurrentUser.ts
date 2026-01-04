import { getCurrentUser } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentUser = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
};
