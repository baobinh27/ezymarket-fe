import { useState } from "react";
import { StyleSheet, View } from "react-native";
import IButton from "./IButton";
import ISelect from "./ISelect";
import { IText } from "./styled";

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

const UnitSelector = () => {
    const [unit, setUnit] = useState<string>('pc');

    return <ISelect
        value={unit}
        onChange={(value) => { setUnit(value.toString()) }}
        options={mockUnitOptions}
        placeholder="Select Unit"
        searchable
        extraModalContent={<UnitRedirector />}
    />
}

const UnitRedirector = () => {
    return <View style={style.redirector}>
        <IText style={{width: '60%'}}>Don't see your unit? Create one here!</IText>
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