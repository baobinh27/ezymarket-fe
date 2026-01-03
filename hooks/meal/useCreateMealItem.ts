import { createMealItem, CreateMealItemParams } from "@/api/meal";
import { useMutation } from "@tanstack/react-query";

const useCreateMealItem = () => {
    return useMutation({
        mutationFn: (data: CreateMealItemParams) => createMealItem(data)
    })
}

export default useCreateMealItem;