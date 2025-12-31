import axiosInstance from "@/services/axios";
import { Unit } from "@/types/types";

export type GetAllUnitsParams = {
    page?: number,
    limit?: number
}

export interface GetAllUnitsResponse {
  units: Unit[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAllUnits = ({page = 1, limit = 100}: GetAllUnitsParams = {}): Promise<GetAllUnitsResponse> => {
    return axiosInstance.get('/api/units', {
        params: {
            page,
            limit
        }
    })
}