import { getAllUnits, GetAllUnitsParams } from "@/api/unit";
import { useQuery } from "@tanstack/react-query";

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

const useGetAllUnits = (params: GetAllUnitsParams = { page: 1, limit: 100 }) => {
  return useQuery({
    queryKey: ["units", params.page, params.limit],
    queryFn: () => getAllUnits(params),
  });
};

export default useGetAllUnits;
