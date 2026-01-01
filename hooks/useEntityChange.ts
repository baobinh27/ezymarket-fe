import {
    getIngredientSuggestions,
    getTagSuggestions,
    getUnitSuggestions,
} from "@/api/dictionary";
import useGetAllUnits from "@/hooks/units/useGetAllUnits";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Generic interface cho entity change result
 */
export interface EntityChangeResult<T = any> {
  id: string;
  name: string;
  displayText?: string;
  data?: T;
}

/**
 * Options cho useEntityChange hook
 */
export interface UseEntityChangeOptions<T = any> {
  entityType: "unit" | "ingredient" | "tag";
  onEntityChange?: (result: EntityChangeResult<T>) => void;
  debounceMs?: number;
}

/**
 * Generic hook để xử lý entity change (unit, ingredient, tag, etc.)
 * Hỗ trợ suggestions với debounce và tự động mapping data
 */
export const useEntityChange = <T = any>(options: UseEntityChangeOptions<T>) => {
  const { entityType, onEntityChange, debounceMs = 300 } = options;

  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: unitsData } = useGetAllUnits(
    entityType === "unit" ? { page: 1, limit: 100 } : undefined
  );

  useEffect(() => {
    return () => {
      if (suggestionTimerRef.current) {
        clearTimeout(suggestionTimerRef.current);
      }
    };
  }, []);

  /**
   * Fetch suggestions based on query
   */
  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!query || !query.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsLoadingSuggestions(false);
        return;
      }

      setIsLoadingSuggestions(true);

      try {
        let results: any[] = [];

        switch (entityType) {
          case "ingredient":
            results = await getIngredientSuggestions(query);
            break;
          case "tag":
            results = await getTagSuggestions(query);
            break;
          case "unit":
            results = await getUnitSuggestions(query);
            break;
          default:
            results = [];
        }

        setSuggestions(results || []);
        setShowSuggestions(true);
      } catch (error) {
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    [entityType]
  );

  /**
   * Debounced search suggestions
   */
  const searchSuggestions = useCallback(
    (query: string) => {
      // Clear previous timer
      if (suggestionTimerRef.current) {
        clearTimeout(suggestionTimerRef.current);
      }

      if (!query || !query.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      // Set new timer
      suggestionTimerRef.current = setTimeout(() => {
        fetchSuggestions(query);
      }, debounceMs);
    },
    [fetchSuggestions, debounceMs]
  );

  /**
   * Handle entity change from ID (used for unit selector)
   */
  const handleEntityChangeById = useCallback(
    (id: string): EntityChangeResult<T> | null => {
      if (!id) return null;

      let result: EntityChangeResult<T> | null = null;

      if (entityType === "unit" && unitsData?.units) {
        const unit = unitsData.units.find((u) => u._id === id);
        if (unit) {
          result = {
            id: unit._id,
            name: unit.name,
            displayText: unit.abbreviation || unit.name,
            data: unit as T,
          };
        }
      }

      if (result && onEntityChange) {
        onEntityChange(result);
      }

      return result;
    },
    [entityType, unitsData, onEntityChange]
  );

  /**
   * Handle entity change from suggestion object
   */
  const handleEntityChangeFromSuggestion = useCallback(
    (suggestion: any): EntityChangeResult<T> | null => {
      if (!suggestion) return null;

      let result: EntityChangeResult<T> | null = null;

      switch (entityType) {
        case "ingredient":
          result = {
            id: suggestion._id || suggestion.id,
            name: suggestion.name,
            displayText: suggestion.name,
            data: suggestion as T,
          };
          break;
        case "tag":
          result = {
            id: suggestion._id || suggestion.id || suggestion,
            name: typeof suggestion === "string" ? suggestion : suggestion.name || suggestion,
            displayText: typeof suggestion === "string" ? suggestion : suggestion.name || suggestion,
            data: suggestion as T,
          };
          break;
        case "unit":
          result = {
            id: suggestion._id || suggestion.id,
            name: suggestion.name,
            displayText: suggestion.abbreviation || suggestion.name,
            data: suggestion as T,
          };
          break;
      }

      if (result && onEntityChange) {
        onEntityChange(result);
      }

      return result;
    },
    [entityType, onEntityChange]
  );

  /**
   * Clear suggestions
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowSuggestions(false);
    if (suggestionTimerRef.current) {
      clearTimeout(suggestionTimerRef.current);
    }
  }, []);

  return {
    // Suggestions
    suggestions,
    isLoadingSuggestions,
    showSuggestions,
    searchSuggestions,
    clearSuggestions,
    setShowSuggestions,

    // Entity change handlers
    handleEntityChangeById,
    handleEntityChangeFromSuggestion,

    // Data
    units: entityType === "unit" ? unitsData?.units || [] : [],
    isLoadingUnits: entityType === "unit" && !unitsData,
  };
};

