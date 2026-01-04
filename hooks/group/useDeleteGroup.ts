import { deleteGroup } from "@/api/group";
import { useMutation } from "@tanstack/react-query";

const useDeleteGroup = () => {
  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(groupId),
  });
};

export default useDeleteGroup;
