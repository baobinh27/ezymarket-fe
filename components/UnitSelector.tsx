import useGetAllUnits from "@/hooks/units/useGetAllUnits";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import IButton from "./IButton";
import ISelect from "./ISelect";
import { IText } from "./styled";

interface UnitSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  modalContainerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  searchInputStyle?: TextStyle;
  overlayStyle?: ViewStyle;
  maxModalHeight?: string | number;
  placeholder?: string;
  showLoading?: boolean;
}

const mockUnitOptions = [
  { label: "Kilogram", value: "kg" },
  { label: "Gram", value: "g" },
  { label: "Liter", value: "l" },
  { label: "Milliliter", value: "ml" },
  { label: "Piece", value: "pc" },
  { label: "Pack", value: "pack" },
  { label: "Box", value: "box" },
  { label: "Dozen", value: "dozen" },
  { label: "Pound", value: "lb" },
  { label: "Ounce", value: "oz" },
  { label: "Part", value: "part" },
  { label: "Set", value: "set" },
];

const UnitSelector = ({
  value = "64f1a2b3c4d5e6f7890a1234",
  onChange,
  buttonStyle,
  buttonTextStyle,
  modalContainerStyle,
  itemStyle,
  itemTextStyle,
  searchInputStyle,
  overlayStyle,
  maxModalHeight = "50%",
  placeholder = "Select Unit",
}: UnitSelectorProps) => {
  const [unit, setUnit] = useState<string>(value);
  const { data, isLoading, isError, refetch } = useGetAllUnits();

  // Convert API response to select options
  const unitOptions =
    data?.units?.map((u) => ({
      label: `${u.name} (${u.abbreviation})`,
      value: u._id,
    })) || mockUnitOptions;

  const handleChange = (newValue: string | number) => {
    const strValue = newValue.toString();
    setUnit(strValue);
    onChange?.(strValue);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#82CD47" />
        <IText style={styles.loadingText}>Loading units...</IText>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <IText color="#FF6B6B">Failed to load units</IText>
        <IButton variant="secondary" onPress={() => refetch()} style={styles.retryButton}>
          <IText semiBold color="#46982D">
            Retry
          </IText>
        </IButton>
      </View>
    );
  }

  return (
    <ISelect
      value={unit}
      onChange={handleChange}
      options={unitOptions}
      placeholder={placeholder}
      searchable
      buttonStyle={buttonStyle}
      buttonTextStyle={buttonTextStyle}
      modalContainerStyle={modalContainerStyle}
      itemStyle={itemStyle}
      itemTextStyle={itemTextStyle}
      searchInputStyle={searchInputStyle}
      overlayStyle={overlayStyle}
      maxModalHeight={maxModalHeight}
      extraModalContent={<UnitRedirector />}
    />
  );
};

const UnitRedirector = () => {
  return (
    <View style={style.redirector}>
      <IText style={{ width: "60%" }}>Don&apos;t see your unit? Create one here!</IText>
      <IButton
        variant="primary"
        onPress={() => {
          // redirect to units management page
        }}
        style={style.redirectorButton}
      >
        <IText color="white" semiBold>
          Manage Units
        </IText>
      </IButton>
    </View>
  );
};

const style = StyleSheet.create({
  redirector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 10,
  },
  redirectorButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundImage: "linear-gradient(135deg, #46982D, #82CD47)",
  },
});

const styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  loadingText: {
    fontSize: 14,
    color: "#000000B4",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FFE0E0",
    borderRadius: 8,
    gap: 8,
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
});

export default UnitSelector;
