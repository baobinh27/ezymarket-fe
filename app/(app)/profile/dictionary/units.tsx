import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getUnits } from "@/api/dictionary";
import { IText } from "@/components/styled";
import { useAuth } from "@/services/auth/auth.context";
import DictionaryUnitCard from "./components/DictionaryUnitCard";
import EditUnitModal from "./components/EditUnitModal";
import EmptyState from "./components/EmptyState";
import dictionaryItemStyles from "./dictionary-item.styles";

interface DictionaryUnitsProps {
  searchQuery: string;
}

const DictionaryUnits = forwardRef(({ searchQuery }: DictionaryUnitsProps, ref) => {
  const [editUnitId, setEditUnitId] = useState<string | null>(null);
  const unitSheetRef = useRef<BottomSheetModal>(null);
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["units", searchQuery],
    queryFn: () => getUnits({ search: searchQuery || undefined, limit: 10 }),
  });

  const units = data?.units ?? [];
  const isAdmin = user?.role === "admin";

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
          const canEdit = isAdmin;

          return (
            <DictionaryUnitCard
              key={item._id ?? item.id}
              id={item._id ?? item.id}
              name={item.name}
              abbreviation={item.abbreviation}
              type={item.type}
              isSystem={!canEdit}
              onEdit={() => {
                if (canEdit) {
                  handleEdit(item._id ?? item.id);
                }
              }}
              onHide={() => {
                console.log("Hide unit:", item._id ?? item.id);
              }}
              onClone={() => {
                console.log("Clone unit:", item._id ?? item.id);
              }}
            />
          );
        })
      )}

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
