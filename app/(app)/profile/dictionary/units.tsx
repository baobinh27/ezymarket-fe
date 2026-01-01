import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { getUnits } from "@/api/dictionary";
import dictionaryItemStyles from "@/components/dictionary/DictionaryItemCard/dictionary-item.styles";
import DictionaryUnitCard from "@/components/dictionary/DictionaryUnitCard/DictionaryUnitCard";
import EditUnitModal from "@/components/dictionary/EditUnitModal/EditUnitModal";
import EmptyState from "@/components/dictionary/EmptyState/EmptyState";
import { IText } from "@/components/styled";
import { useAuth } from "@/services/auth/auth.context";
import {
  getHiddenItems,
  hideItem,
  unhideItem,
} from "@/utils/dictionaryStorage";

interface DictionaryUnitsProps {
  searchQuery: string;
}

const normalizeUnitForClone = (item: any) => {
  return {
    name: item.name ?? "",
    abbreviation: item.abbreviation ?? "",
    type: item.type ?? "",
  };
};

const DictionaryUnits = forwardRef(({ searchQuery }: DictionaryUnitsProps, ref) => {
  const [editUnitId, setEditUnitId] = useState<string | null>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const unitSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["units", searchQuery],
    queryFn: () => getUnits({ search: searchQuery || undefined, limit: 10 }),
  });

  useEffect(() => {
    const loadHidden = async () => {
      const hidden = await getHiddenItems();
      setHiddenIds(hidden.unit || []);
    };
    loadHidden();
  }, []);

  const units = data?.units ?? [];
  const isAdmin = user?.role === "admin";

  const handleCreateNew = () => {
    setEditUnitId(null);
    setInitialData(null);
    unitSheetRef.current?.present();
  };

  const handleEdit = (id: string) => {
    setEditUnitId(id);
    setInitialData(null);
    unitSheetRef.current?.present();
  };

  const handleCloseModal = () => {
    unitSheetRef.current?.dismiss();
    setEditUnitId(null);
    setInitialData(null);
  };

  const handleHide = async (id: string) => {
    await hideItem("unit", id);
    const hidden = await getHiddenItems();
    setHiddenIds(hidden.unit || []);
    queryClient.invalidateQueries({ queryKey: ["units"] });
  };

  const handleShow = async (id: string) => {
    await unhideItem("unit", id);
    const hidden = await getHiddenItems();
    setHiddenIds(hidden.unit || []);
    queryClient.invalidateQueries({ queryKey: ["units"] });
  };

  const handleClone = (item: any) => {
    setEditUnitId(null);
    setInitialData(normalizeUnitForClone(item));
    unitSheetRef.current?.present();
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
            searchQuery ? "Try adjusting your search terms" : "Tap '+ New' to add your first unit"
          }
        />
      ) : (
        units.map((item: any) => {
          const isHidden = hiddenIds.includes(item._id || item.id);
          const canEdit = isAdmin;

          return (
            <DictionaryUnitCard
              key={item._id ?? item.id}
              id={item._id ?? item.id}
              name={item.name}
              abbreviation={item.abbreviation}
              type={item.type}
              isSystem={!canEdit}
              isHidden={isHidden}
              onEdit={() => {
                if (canEdit) {
                  handleEdit(item._id ?? item.id);
                }
              }}
              onHide={
                canEdit && !isHidden ? () => handleHide(item._id ?? item.id) : undefined
              }
              onShow={
                canEdit && isHidden ? () => handleShow(item._id ?? item.id) : undefined
              }
              onClone={canEdit ? () => handleClone(item) : undefined}
            />
          );
        })
      )}

      <EditUnitModal
        ref={unitSheetRef}
        unitId={editUnitId}
        initialData={initialData}
        onClose={handleCloseModal}
      />
    </View>
  );
});

DictionaryUnits.displayName = "DictionaryUnits";

export default DictionaryUnits;
