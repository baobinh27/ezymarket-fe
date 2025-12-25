// Dictionary Types
export type DictionaryTab = "fridge-items" | "recipes" | "units";

export interface DictionaryTabItem {
  name: DictionaryTab;
  title: string;
}

// Ingredient/Fridge Item Types
export interface Ingredient {
  _id: string;
  id?: string;
  name: string;
  imageURL?: string;
  imageUrl?: string;
  foodCategory?: string;
  category?: string;
  defaultExpireDays?: number;
  defaultUnitId?: string;
  creatorId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIngredientInput {
  name: string;
  category?: string;
  imageUrl?: string;
  defaultExpiryDays?: number;
  defaultUnitId?: string;
}

export interface UpdateIngredientInput extends Partial<CreateIngredientInput> {}

// Recipe Types
export interface RecipeIngredient {
  ingredientId?: string;
  name: string;
  quantity: number;
  unitId?: string | null;
  unitText?: string;
  note?: string;
  optional?: boolean;
}

export interface Recipe {
  _id: string;
  id?: string;
  creatorId?: string | { _id: string; userName: string; avatar?: string } | null;
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  directions?: string[];
  ingredients?: RecipeIngredient[];
  tags?: any[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecipeInput {
  title: string;
  description?: string;
  imageUrl?: string;
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  directions?: string[];
  ingredients?: RecipeIngredient[];
  tags?: string[];
}

export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {}

// Unit Types
export interface Unit {
  _id: string;
  id?: string;
  name: string;
  abbreviation?: string;
  type?: string;
  defaultValue?: number;
  conversionFactor?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUnitInput {
  name: string;
  abbreviation?: string;
  type?: string;
  defaultValue?: number;
}

export interface UpdateUnitInput extends Partial<CreateUnitInput> {}

// API Response Types
export interface PaginatedResponse<T> {
  data?: T[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
}

export interface IngredientsResponse extends PaginatedResponse<Ingredient> {
  ingredients?: Ingredient[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface RecipesResponse extends PaginatedResponse<Recipe> {
  recipes?: Recipe[];
}

export interface UnitsResponse extends PaginatedResponse<Unit> {
  units?: Unit[];
}

export interface SingleIngredientResponse {
  ingredient?: Ingredient;
}

export interface SingleRecipeResponse {
  recipe?: Recipe;
}

export interface SingleUnitResponse {
  unit?: Unit;
}
