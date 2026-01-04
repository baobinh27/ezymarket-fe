import { removeMemberFromGroup } from "@/api/group";
import { useMutation } from "@tanstack/react-query";

const useRemoveMemberFromGroup = () => {
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      removeMemberFromGroup(groupId, userId),
  });
};

export default useRemoveMemberFromGroup;
