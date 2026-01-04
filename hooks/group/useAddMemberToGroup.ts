import { addMemberToGroup } from "@/api/group";
import { useMutation } from "@tanstack/react-query";

const useAddMemberToGroup = () => {
  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      addMemberToGroup(groupId, userId),
  });
};

export default useAddMemberToGroup;
