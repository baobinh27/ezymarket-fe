import { View, ActivityIndicator } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState, forwardRef, useImperativeHandle } from "react";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

import { IText } from "@/components/styled";
import { getUnits } from "@/api/dictionary";
import DictionaryUnitCard from "./components/DictionaryUnitCard";
import EmptyState from "./components/EmptyState";
import EditUnitModal from "./components/EditUnitModal";
import dictionaryItemStyles from "./dictionary-item.styles";

interface DictionaryUnitsProps {
  searchQuery: string;
}

const DictionaryUnits = forwardRef(({ searchQuery }: DictionaryUnitsProps, ref) => {
  const [editUnitId, setEditUnitId] = useState<string | null>(null);
  const unitSheetRef = useRef<BottomSheetModal>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["units", searchQuery],
    queryFn: () => getUnits({ search: searchQuery || undefined, limit: 100 }),
  });

  const units = (data as any)?.units || (data as any)?.data || [];

  console.log("=== DEBUG Units ===");
  console.log("Raw data:", JSON.stringify(data, null, 2));
  console.log("Units count:", units.length);
  console.log("First unit:", units[0]);

  const handleCreateNew = () => {
    setEditUnitId(null);
    unitSheetRef.current?.present();
  };

  const handleEdit = (id: string) => {
    setEditUnitId(id);
    unitSheetRef.current?.present();
  };

  const handleCloseModal = () => {
    unitSheetRef.current?.dismiss();
    setEditUnitId(null);
  };

  // Expose handleCreateNew to parent
  useImperativeHandle(ref, () => ({
    handleCreateNew,
  }));

  if (isLoading) {
    return (
      <View style={dictionaryItemStyles.centerContainer}>
        <ActivityIndicator size="large" color="#46982D" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={dictionaryItemStyles.centerContainer}>
        <IText color="#000000B4">Something went wrong. Please try again.</IText>
      </View>
    );
  }

  return (
    <View style={dictionaryItemStyles.container}>

      {units.length === 0 ? (
        <EmptyState
          icon="dash"
          title={searchQuery ? "No units found" : "No units yet"}
          message={
            searchQuery
              ? "Try adjusting your search terms"
              : "Tap '+ New' to add your first unit"
          }
        />
      ) : (
        units.map((item: any) => {
          const isSystemUnit = !item.creatorId;

          return (
            <DictionaryUnitCard
              key={item._id || item.id}
              id={item._id || item.id}
              name={item.name}
              abbreviation={item.abbreviation}
              type={item.type}
              isSystem={isSystemUnit}
              onEdit={() => {
                if (!isSystemUnit) {
                  handleEdit(item._id || item.id);
                }
              }}
              onHide={() => {
                console.log("Hide unit:", item._id || item.id);
              }}
              onClone={() => {
                console.log("Clone unit:", item._id || item.id);
              }}
            />
          );
        })
      )}

      {/* Edit Modal */}
      <EditUnitModal
        ref={unitSheetRef}
        unitId={editUnitId}
        onClose={handleCloseModal}
      />
    </View>
  );
});

DictionaryUnits.displayName = "DictionaryUnits";

export default DictionaryUnits;
