import { localStorage } from "./storage";

const HIDDEN_ITEMS_KEY = "dictionary_hidden_items";
const CLONED_ITEMS_KEY = "dictionary_cloned_items";

export type DictionaryType = "ingredient" | "recipe" | "unit";

interface HiddenItems {
  [type: string]: string[];
}

interface ClonedItem {
  id: string;
  originalId: string;
  type: DictionaryType;
  data: any;
  isEdited: boolean;
}

interface ClonedItems {
  [type: string]: ClonedItem[];
}

/**
 * Get all hidden items from storage
 */
export const getHiddenItems = async (): Promise<HiddenItems> => {
  const items = await localStorage.get(HIDDEN_ITEMS_KEY);
  return items || {};
};

/**
 * Check if an item is hidden
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param id - Item ID to check
 */
export const isItemHidden = async (type: DictionaryType, id: string): Promise<boolean> => {
  const hiddenItems = await getHiddenItems();
  return hiddenItems[type]?.includes(id) || false;
};

/**
 * Hide an item by saving its ID to storage
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param id - Item ID to hide
 */
export const hideItem = async (type: DictionaryType, id: string): Promise<void> => {
  const hiddenItems = await getHiddenItems();
  if (!hiddenItems[type]) {
    hiddenItems[type] = [];
  }
  if (!hiddenItems[type].includes(id)) {
    hiddenItems[type].push(id);
    await localStorage.set(HIDDEN_ITEMS_KEY, hiddenItems);
  }
};

/**
 * Unhide an item by removing its ID from storage
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param id - Item ID to unhide
 */
export const unhideItem = async (type: DictionaryType, id: string): Promise<void> => {
  const hiddenItems = await getHiddenItems();
  if (hiddenItems[type]) {
    hiddenItems[type] = hiddenItems[type].filter((itemId) => itemId !== id);
    await localStorage.set(HIDDEN_ITEMS_KEY, hiddenItems);
  }
};

/**
 * Get all cloned items from storage
 */
export const getClonedItems = async (): Promise<ClonedItems> => {
  const items = await localStorage.get(CLONED_ITEMS_KEY);
  return items || {};
};

/**
 * Get cloned items for a specific type
 * @param type - Dictionary type (ingredient, recipe, unit)
 */
export const getClonedItemsByType = async (type: DictionaryType): Promise<ClonedItem[]> => {
  const clonedItems = await getClonedItems();
  return clonedItems[type] || [];
};

/**
 * Clone an item by creating a local copy with temporary ID
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param originalId - Original item ID
 * @param data - Full item data to clone
 * @returns Temporary ID of cloned item
 */
export const cloneItem = async (
  type: DictionaryType,
  originalId: string,
  data: any
): Promise<string> => {
  const clonedItems = await getClonedItems();
  if (!clonedItems[type]) {
    clonedItems[type] = [];
  }

  const tempId = `temp_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const clonedItem: ClonedItem = {
    id: tempId,
    originalId,
    type,
    data: { ...data, _id: tempId },
    isEdited: false,
  };

  clonedItems[type].push(clonedItem);
  await localStorage.set(CLONED_ITEMS_KEY, clonedItems);

  return tempId;
};

/**
 * Mark cloned item as edited
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param tempId - Temporary ID of cloned item
 */
export const markClonedItemAsEdited = async (
  type: DictionaryType,
  tempId: string
): Promise<void> => {
  const clonedItems = await getClonedItems();
  if (clonedItems[type]) {
    const item = clonedItems[type].find((item) => item.id === tempId);
    if (item) {
      item.isEdited = true;
      await localStorage.set(CLONED_ITEMS_KEY, clonedItems);
    }
  }
};

/**
 * Update cloned item data
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param tempId - Temporary ID of cloned item
 * @param data - Data to update
 */
export const updateClonedItem = async (
  type: DictionaryType,
  tempId: string,
  data: any
): Promise<void> => {
  const clonedItems = await getClonedItems();
  if (clonedItems[type]) {
    const item = clonedItems[type].find((item) => item.id === tempId);
    if (item) {
      item.data = { ...item.data, ...data };
      item.isEdited = true;
      await localStorage.set(CLONED_ITEMS_KEY, clonedItems);
    }
  }
};

/**
 * Remove cloned item from storage (after successful API save)
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param tempId - Temporary ID of cloned item
 */
export const removeClonedItem = async (type: DictionaryType, tempId: string): Promise<void> => {
  const clonedItems = await getClonedItems();
  if (clonedItems[type]) {
    clonedItems[type] = clonedItems[type].filter((item) => item.id !== tempId);
    await localStorage.set(CLONED_ITEMS_KEY, clonedItems);
  }
};

/**
 * Get cloned item by temporary ID
 * @param type - Dictionary type (ingredient, recipe, unit)
 * @param tempId - Temporary ID of cloned item
 */
export const getClonedItem = async (
  type: DictionaryType,
  tempId: string
): Promise<ClonedItem | null> => {
  const clonedItems = await getClonedItems();
  if (clonedItems[type]) {
    return clonedItems[type].find((item) => item.id === tempId) || null;
  }
  return null;
};

