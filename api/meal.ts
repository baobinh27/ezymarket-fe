import axiosInstance from "@/services/axios";
import { MealPlan, MealType } from "@/types/types";

export type GetMealByDateRangeParams = {
    startDate: string,
    endDate: string
}

export const getMealByDateRange = async (params: GetMealByDateRangeParams): Promise<MealPlan[]> => {
    // console.log("params: ", params);
    
    return axiosInstance.get('/api/meal-plans', {
        params
    });
}

export type CreateMealItemParams = {
    itemType: "recipe" | "ingredient",
    quantity: number,
    recipeId?: string,
    ingredientId?: string
    unitId?: string,
    date: string,
    mealType: MealType
}

export const createMealItem = async (data: CreateMealItemParams) => {
    // console.log("data: ", data);
    
    return axiosInstance.post('/api/meal-plans/items', data);
}

export type CreateMealItemBulkParams = {
    date: string,
    mealType: MealType
    items: {
        itemType: "recipe" | "ingredient",
        quantity: number,
        recipeId?: string,
        ingredientId?: string,
        unitId?: string
    }[]
}

export const createMealItemBulk = async (data: CreateMealItemBulkParams) => {
    return axiosInstance.post('/api/meal-plans/items/bulk', data)
}

export const deleteMealItem = async (itemId: string) => {
    return axiosInstance.delete(`/api/meal-plans/items/${itemId}`);
}