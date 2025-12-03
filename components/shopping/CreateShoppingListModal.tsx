import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import IButton from "../IButton";
import { IText } from "../styled";

export interface CreateOption {
  id: string;
  title: string;
  description: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

interface CreateShoppingListModalProps {
  bottomSheetRef: React.RefObject<BottomSheet | null>;
  options: CreateOption[];
}

export const CreateShoppingListModal: React.FC<CreateShoppingListModalProps> = ({
  bottomSheetRef,
  options,
}) => {
  const snapPoints = useMemo(() => [1, "55%"], []);

  const handleOptionPress = useCallback(
    (onPress: () => void) => {
      onPress();
      bottomSheetRef.current?.close();
    },
    [bottomSheetRef]
  );

  // Custom backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={1}
        disappearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={styles.background}
      enableOverDrag
      backdropComponent={renderBackdrop}
    >

      <BottomSheetView style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <IText bold size={24}>
            Create
          </IText>
          <IButton
            variant="secondary"
            style={styles.cancelButton}
            onPress={() => bottomSheetRef.current?.close()}
          >
            <IText color="#46982D" semiBold size={14}>
              Cancel
            </IText>
          </IButton>
        </View>

        {/* Options List */}
        <BottomSheetScrollView
          style={styles.optionsContainer}
          contentContainerStyle={styles.optionsContent}
          showsVerticalScrollIndicator={false}
        >
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleOptionPress(option.onPress)}
              activeOpacity={0.7}
            >
              <View style={styles.optionCard}>
                <View style={styles.optionLeft}>
                  {option.icon && (
                    <View style={styles.iconContainer}>{option.icon}</View>
                  )}
                  <View style={styles.optionText}>
                    <IText bold size={18} color="white">
                      {option.title}
                    </IText>
                    <IText color="white" size={14} style={{ marginTop: 4 }}>
                      {option.description}
                    </IText>
                  </View>
                </View>
                <View style={styles.arrow}>
                  <IText color="white" bold size={20}>
                    &gt;
                  </IText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  background: {
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  cancelButton: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsContent: {
    gap: 12,
    paddingBottom: 24,
  },
  optionCard: {
    backgroundColor: "#46982D",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    flex: 1,
  },
  arrow: {
    marginLeft: 12,
  },
});
