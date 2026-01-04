import { createGroup, CreateGroupParams } from "@/api/group";
import { useMutation } from "@tanstack/react-query";

const useCreateGroup = () => {
  return useMutation({
    mutationFn: (params: CreateGroupParams) => createGroup(params),
  });
};

export default useCreateGroup;
