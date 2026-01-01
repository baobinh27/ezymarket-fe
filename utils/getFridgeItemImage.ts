import { MealItem } from "@/types/types";

export const getFridgeItemImage = (item: MealItem) => {
    if (item.ingredientId) return item.ingredientId.imageURL;
    if (item.recipeId) return item.recipeId.imageUrl;
    return undefined;
}