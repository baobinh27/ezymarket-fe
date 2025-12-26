import { useState } from "react";
import { StyleSheet, TextStyle, View, ViewStyle } from "react-native";
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
]

const UnitSelector = ({
    value = 'pc',
    onChange,
    buttonStyle,
    buttonTextStyle,
    modalContainerStyle,
    itemStyle,
    itemTextStyle,
    searchInputStyle,
    overlayStyle,
    maxModalHeight = "50%",
    placeholder = "Select Unit"
}: UnitSelectorProps) => {
    const [unit, setUnit] = useState<string>(value);

    const handleChange = (newValue: string | number) => {
        const strValue = newValue.toString();
        setUnit(strValue);
        onChange?.(strValue);
    };

    return <ISelect
        value={unit}
        onChange={handleChange}
        options={mockUnitOptions}
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
}

const UnitRedirector = () => {
    return <View style={style.redirector}>
        <IText style={{width: '60%'}}>Don&apos;t see your unit? Create one here!</IText>
        <IButton
            variant="primary"
            onPress={() => {
                // redirect to units management page
            }}
            style={style.redirectorButton}
        >
            <IText color="white" semiBold>Manage Units</IText>

        </IButton>
    </View>
}

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
        backgroundImage: 'linear-gradient(135deg, #46982D, #82CD47)',
    }

});

export default UnitSelector;