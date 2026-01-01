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
  cloneItem,
  getClonedItemsByType,
  getHiddenItems,
  hideItem,
  unhideItem,
} from "@/utils/dictionaryStorage";

interface DictionaryUnitsProps {
  searchQuery: string;
}

const DictionaryUnits = forwardRef(({ searchQuery }: DictionaryUnitsProps, ref) => {
  const [editUnitId, setEditUnitId] = useState<string | null>(null);
  const [hiddenIds, setHiddenIds] = useState<string[]>([]);
  const [clonedItems, setClonedItems] = useState<any[]>([]);
  const unitSheetRef = useRef<BottomSheetModal>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ["units", searchQuery],
    queryFn: () => getUnits({ search: searchQuery || undefined, limit: 10 }),
  });

  useEffect(() => {
    const loadHiddenAndCloned = async () => {
      const hidden = await getHiddenItems();
      setHiddenIds(hidden.unit || []);
      const cloned = await getClonedItemsByType("unit");
      setClonedItems(cloned.map((item) => item.data));
    };
    loadHiddenAndCloned();
  }, []);

  const units = data?.units ?? [];
  const isAdmin = user?.role === "admin";

  const allUnits = [...units, ...clonedItems];

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

  const handleClone = async (item: any) => {
    const tempId = await cloneItem("unit", item._id || item.id, item);
    const cloned = await getClonedItemsByType("unit");
    setClonedItems(cloned.map((c) => c.data));
    setEditUnitId(tempId);
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
      {allUnits.length === 0 ? (
        <EmptyState
          icon="dash"
          title={searchQuery ? "No units found" : "No units yet"}
          message={
            searchQuery ? "Try adjusting your search terms" : "Tap '+ New' to add your first unit"
          }
        />
      ) : (
        allUnits.map((item: any) => {
          const isCloned = (item._id || item.id)?.startsWith("temp_unit_");
          const isHidden = hiddenIds.includes(item._id || item.id);
          const canEdit = isAdmin || isCloned;

          return (
            <DictionaryUnitCard
              key={item._id ?? item.id}
              id={item._id ?? item.id}
              name={item.name}
              abbreviation={item.abbreviation}
              type={item.type}
              isSystem={!canEdit && !isCloned}
              isHidden={isHidden}
              onEdit={() => {
                if (canEdit) {
                  handleEdit(item._id ?? item.id);
                }
              }}
              onHide={
                canEdit && !isCloned && !isHidden
                  ? () => handleHide(item._id ?? item.id)
                  : undefined
              }
              onShow={
                canEdit && !isCloned && isHidden
                  ? () => handleShow(item._id ?? item.id)
                  : undefined
              }
              onClone={canEdit && !isCloned ? () => handleClone(item) : undefined}
            />
          );
        })
      )}

      <EditUnitModal ref={unitSheetRef} unitId={editUnitId} onClose={handleCloseModal} />
    </View>
  );
});

DictionaryUnits.displayName = "DictionaryUnits";

export default DictionaryUnits;
