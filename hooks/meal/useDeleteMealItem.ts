import { deleteMealItem } from "@/api/meal";
import { useMutation } from "@tanstack/react-query";

const useDeleteMealItem = () => {
    return useMutation({
        mutationFn: (itemId: string) => deleteMealItem(itemId)
    })
}

export default useDeleteMealItem;