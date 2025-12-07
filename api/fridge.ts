import axiosInstance from "@/services/axios";

export const getAllFridges = async () => {
    const response = await axiosInstance.get('/api/fridges');
    return response.data;
}