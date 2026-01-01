import { createMealItemBulk, CreateMealItemBulkParams } from "@/api/meal";
import { useMutation } from "@tanstack/react-query";


const useCreateMealItemBulk = () => {
    return useMutation({
        mutationFn: (data: CreateMealItemBulkParams) => createMealItemBulk(data)
    })
}

export default useCreateMealItemBulk;