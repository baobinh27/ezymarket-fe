import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  View
} from "react-native";

import { createUnit, getUnitById, updateUnit } from "@/api/dictionary";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { IText } from "@/components/styled";

interface EditUnitModalProps {
  unitId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditUnitModal = forwardRef<BottomSheetModal, EditUnitModalProps>(
  ({ unitId, onClose, onSuccess }, ref) => {
    const queryClient = useQueryClient();
    const isNew = !unitId || unitId === "new";

    const [name, setName] = useState("");
    const [abbreviation, setAbbreviation] = useState("");
    const [type, setType] = useState("");

    // Fetch unit data if editing
    const { data: unitData, isLoading: isLoadingUnit } = useQuery({
      queryKey: ["unit", unitId],
      queryFn: () => getUnitById(unitId as string),
      enabled: !isNew && !!unitId,
    });

    // Set form data when unit loads
    useEffect(() => {
      if (unitData) {
        const unit = unitData.unit || unitData;
        setName(unit.name || "");
        setAbbreviation(unit.abbreviation || "");
        setType(unit.type || "");
      }
    }, [unitData]);

    // Reset form when opening for new item
    useEffect(() => {
      if (isNew) {
        setName("");
        setAbbreviation("");
        setType("");
      }
    }, [isNew, unitId]);

    // Create mutation
    const createMutation = useMutation({
      mutationFn: createUnit,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["units"] });
        Alert.alert("Success", "Unit created successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to create unit");
      },
    });

    // Update mutation
    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => updateUnit(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["units"] });
        queryClient.invalidateQueries({ queryKey: ["unit", unitId] });
        Alert.alert("Success", "Unit updated successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        Alert.alert("Error", error.message || "Failed to update unit");
      },
    });

    const handleSave = () => {
      if (!name.trim()) {
        Alert.alert("Error", "Please enter unit name");
        return;
      }

      const data = {
        name: name.trim(),
        abbreviation: abbreviation.trim() || undefined,
        type: type.trim() || undefined,
      };

      if (isNew) {
        createMutation.mutate(data);
      } else {
        updateMutation.mutate({ id: unitId as string, data });
      }
    };

    return (
      <IBottomSheetModal
        ref={ref}
        title={isNew ? "New Unit" : "Edit Unit"}
        snapPoints={["70%"]}
        onClose={onClose}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {isLoadingUnit ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#46982D" />
            </View>
          ) : (
            <>
              {/* Form Fields */}
              <View style={styles.formSection}>
                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Name *
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="e.g. Kilogram"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Abbreviation
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={abbreviation}
                    onChangeText={setAbbreviation}
                    placeholder="e.g. kg"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Type
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={type}
                    onChangeText={setType}
                    placeholder="e.g. weight, volume, count"
                    placeholderTextColor="#000000B4"
                  />
                </View>
              </View>
            </>
          )}
        </BottomSheetScrollView>

        {/* Action Button */}
        <View style={styles.actionButtons}>
          <IButton
            variant="primary"
            onPress={
              createMutation.isPending || updateMutation.isPending
                ? undefined
                : handleSave
            }
            style={styles.saveButton}
          >
            {createMutation.isPending || updateMutation.isPending ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <IText size={16} semiBold color="white">
                Done
              </IText>
            )}
          </IButton>
        </View>
      </IBottomSheetModal>
    );
  }
);

EditUnitModal.displayName = "EditUnitModal";

export default EditUnitModal;

const styles = StyleSheet.create({
  centerContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  formSection: {
    gap: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  fieldGroup: {
    gap: 8,
  },
  label: {
    color: "#000000",
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: "#000000",
  },
  actionButtons: {
    paddingTop: 16,
    paddingBottom: 20,
  },
  saveButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 8,
  },
});
