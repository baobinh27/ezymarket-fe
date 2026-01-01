import axiosInstance from "@/services/axios";

// NOTE: axiosInstance response interceptor already unwraps response.data
// So we receive data directly, not need to access response.data

// Ingredients API
export const getIngredients = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
}) => {
  try {
    // Response is already unwrapped by interceptor (returns response.data)
    const data = await axiosInstance.get("/api/ingredients", {
      params,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return data || { ingredients: [], pagination: { total: 0 } };
  } catch (error) {
    return { ingredients: [], pagination: { total: 0 } };
  }
};

export const getIngredientById = async (id: string) => {
  const data = await axiosInstance.get(`/api/ingredients/${id}`);
  return data;
};

export const createIngredient = async (data: {
  name: string;
  category?: string;
  imageUrl?: string;
  defaultExpiryDays?: number;
  defaultUnitId?: string;
}) => {
  const result = await axiosInstance.post("/api/ingredients", data);
  return result;
};

export const updateIngredient = async (
  id: string,
  data: {
    name?: string;
    category?: string;
    imageUrl?: string;
    defaultExpiryDays?: number;
    defaultUnitId?: string;
  }
) => {
  const result = await axiosInstance.put(`/api/ingredients/${id}`, data);
  return result;
};

export const deleteIngredient = async (id: string) => {
  const result = await axiosInstance.delete(`/api/ingredients/${id}`);
  return result;
};

export const getIngredientSuggestions = async (query: string) => {
  if (!query || !query.trim()) {
    return [];
  }
  try {
    const data = await axiosInstance.get("/api/ingredients/suggestions", {
      params: { q: query.trim() },
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return (data as any)?.ingredients || [];
  } catch (error) {
    return [];
  }
};

// Recipes API
export const getRecipes = async (params?: { page?: number; limit?: number; search?: string }) => {
  try {
    const data = await axiosInstance.get("/api/recipes/search", {
      params,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return data || { recipes: [], total: 0 };
  } catch (error) {
    return { recipes: [], total: 0 };
  }
};

export const getRecipeById = async (id: string) => {
  const data = await axiosInstance.get(`/api/recipes/${id}`);
  return data;
};

export const createRecipe = async (data: any) => {
  const result = await axiosInstance.post("/api/recipes", data);
  return result;
};

export const updateRecipe = async (id: string, data: any) => {
  const result = await axiosInstance.put(`/api/recipes/${id}`, data);
  return result;
};

export const deleteRecipe = async (id: string) => {
  const result = await axiosInstance.delete(`/api/recipes/${id}`);
  return result;
};

// Units API
export const getUnits = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}) => {
  try {
    const data = await axiosInstance.get("/api/units", {
      params,
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return data || { units: [], pagination: { total: 0 } };
  } catch (error) {
    return { units: [], pagination: { total: 0 } };
  }
};

export const getUnitById = async (id: string) => {
  const data = await axiosInstance.get(`/api/units/${id}`);
  return data;
};

export const createUnit = async (data: { name: string; type?: string; defaultValue?: number }) => {
  const result = await axiosInstance.post("/api/units", data);
  return result;
};

export const updateUnit = async (
  id: string,
  data: {
    name?: string;
    type?: string;
    defaultValue?: number;
  }
) => {
  const result = await axiosInstance.put(`/api/units/${id}`, data);
  return result;
};

export const deleteUnit = async (id: string) => {
  const result = await axiosInstance.delete(`/api/units/${id}`);
  return result;
};

// Tags API
export const getTagSuggestions = async (query?: string) => {
  if (!query || !query.trim()) {
    return [];
  }
  try {
    const data = await axiosInstance.get("/api/recipe-tags/suggest", {
      params: { q: query.trim() },
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return data || [];
  } catch (error) {
    return [];
  }
};

export const getUnitSuggestions = async (query: string) => {
  if (!query || !query.trim()) {
    return [];
  }
  try {
    const data = await axiosInstance.get("/api/units/search", {
      params: {
        q: query.trim(),
        limit: 10,
      },
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    return (data as any)?.units || [];
  } catch (error) {
    return [];
  }
};
