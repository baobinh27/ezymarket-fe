import axiosInstance from "@/services/axios";

export type GetAllUnitsParams = {
    page?: number,
    limit?: number
}

export interface Unit {
  _id: string;
  name: string;
  abbreviation: string;
  type: string;
  createdAt: string;
  updatedAt: string;
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