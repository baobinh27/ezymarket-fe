import axiosInstance from "@/services/axios";
import { Group, GroupDetails } from "@/types/types";

export type CreateGroupParams = {
  name: string;
  description: string;
};

export const createGroup = (data: CreateGroupParams) => {
  return axiosInstance.post("/api/groups", data);
};

export const getMyGroups = (): Promise<{ groups: Group[] }> => {
  return axiosInstance.get("/api/groups/mine");
};

export const getGroupDetails = (groupId: string): Promise<{group: GroupDetails}> => {
  return axiosInstance.get(`/api/groups/${groupId}`);
};

export const addMemberToGroup = (groupId: string, userId: string) => {
  return axiosInstance.post(`/api/groups/${groupId}/members`, { userId });
};

export const removeMemberFromGroup = (groupId: string, userId: string) => {
  return axiosInstance.delete(`/api/groups/${groupId}/members/${userId}`);
};

export const deleteGroup = (groupId: string) => {
  return axiosInstance.delete(`/api/groups/${groupId}`);
};
