import { getAllFridges } from "@/api/fridge";
import { useQuery } from "@tanstack/react-query";


const useGetAllFridges = ({ enabled = true }: { enabled: boolean }) => {
    return useQuery({
        enabled: enabled,
        queryKey: ['fridges'],
        queryFn: () => getAllFridges(),
    })
}

export default useGetAllFridges;