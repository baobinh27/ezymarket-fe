export interface FridgeItem {
  _id: string;
  itemType: "recipe" | "ingredient";
  foodId?: {
    _id: string;
    name: string;
    imageURL: string;
  };
  unitId?: {
    _id: string;
    name: string;
    abbreviation: string;
  };
  recipeId?: {
    _id: string;
    title: string;
    imageUrl: string;
  }
  quantity: number;
  expiryDate: string;
  purchaseDate?: string;
  status: "in-stock" | "used" | "expired" | "discarded";
  price: number;
}

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks";

export interface Unit {
  _id: string;
  name: string;
  abbreviation: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  _id: string;
  name: string;
  imageURL: string;
  foodCategory: string;
  defaultExpireDays: number;
}

export interface Recipe {
  _id: string;
  title: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
}

export interface MealItem {
  _id: string;
  itemType: "ingredient" | "recipe";
  quantity: number;
  isEaten: boolean;
  note: string;
  recipeId?: Recipe;
  ingredientId?: Ingredient;
  unitId: Unit;
}

export interface MealDetail {
  mealType: MealType;
  items: MealItem[];
}

export interface MealPlan {
  _id: string;
  date: string;
  summary: {
    totalCalories: number;
  };
  meals: MealDetail[];
}

export interface ShoppingItem {
  _id?: string;
  ingredientId: {
    _id: string;
    name: string;
    imageURL: string;
  };
  name: string;
  quantity: number;
  unitId: {
    _id: string;
    name: string;
    abbreviation: string;
  };
  unit: string;
  isPurchased: boolean;
  price: number;
  servingQuantity: number;
  expiryDate: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  owner: {
    _id: string;
    email: string;
  };
  memberCount: number;
  createdAt: string;
}

export interface GroupDetails extends Group {
  members?: {
    _id: string;
    email: string;
  }[];
  updatedAt: string;
}
