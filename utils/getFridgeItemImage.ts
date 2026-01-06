import { FridgeItem, MealItem } from "@/types/types";

export const getMealItemImage = (item: MealItem) => {
    if (item.ingredientId) return item.ingredientId.imageURL;
    if (item.recipeId) return item.recipeId.imageUrl;
    return undefined;
}

export const getFridgeItemImage = (item: FridgeItem) => {
    if (item.foodId) return item.foodId.imageURL;
    if (item.recipeId) return item.recipeId.imageUrl;
}

export const getFridgeItemName = (item: FridgeItem) => {
    if (item.foodId) return item.foodId.name;
    if (item.recipeId) return item.recipeId.title;
    return undefined;
}