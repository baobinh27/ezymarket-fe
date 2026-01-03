import {
    getIngredientSuggestions,
    IngredientSuggestion,
} from "@/api/ingredients";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// Debounce hook implementation within the same file to keep it self-contained
// or we could import if a utility exists. For now, inline is fine or simple logic.
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export const useIngredientSuggestions = (query: string) => {
    const debouncedQuery = useDebounce(query, 300);

    return useQuery<{ ingredients: IngredientSuggestion[] }>({
        queryKey: ["ingredient-suggestions", debouncedQuery],
        queryFn: () => getIngredientSuggestions(debouncedQuery),
        enabled: debouncedQuery.length > 1, // Only search if query has more than 1 char
        staleTime: 60 * 1000, // Cache suggestions for 1 minute
    });
};
