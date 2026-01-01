import { EntityChangeResult, useEntityChange } from "@/hooks/useEntityChange";

/**
 * @deprecated Use useEntityChange với entityType: "unit" thay thế
 * Giữ lại để backward compatibility
 */
export interface UnitChangeResult {
  unitId: string;
  unitText: string;
  unitName?: string;
  unitAbbreviation?: string;
}

export interface UseUnitChangeOptions {
  onUnitChange?: (result: UnitChangeResult) => void;
}

/**
 * @deprecated Use useEntityChange với entityType: "unit" thay thế
 * Wrapper hook để tương thích với code cũ
 */
export const useUnitChange = (options?: UseUnitChangeOptions) => {
  const { handleEntityChangeById, units, isLoadingUnits } = useEntityChange({
    entityType: "unit",
    onEntityChange: (result) => {
      if (options?.onUnitChange) {
        options.onUnitChange({
          unitId: result.id,
          unitText: result.displayText || result.name,
          unitName: result.name,
          unitAbbreviation: (result.data as any)?.abbreviation,
        });
      }
    },
  });

  const handleUnitChange = (unitId: string): UnitChangeResult | null => {
    const result = handleEntityChangeById(unitId);
    if (!result) return null;

    return {
      unitId: result.id,
      unitText: result.displayText || result.name,
      unitName: result.name,
      unitAbbreviation: (result.data as any)?.abbreviation,
    };
  };

  return {
    handleUnitChange,
    units,
    isLoading: isLoadingUnits,
  };
};

export type { EntityChangeResult };

