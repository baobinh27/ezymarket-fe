import { FontAwesome6 } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import IButton from "./IButton";

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps {
    value: string | number | null;
    onChange: (value: string | number) => void;
    options: SelectOption[];

    placeholder?: string;
    disabled?: boolean;

    // styles
    containerStyle?: ViewStyle;
    buttonStyle?: ViewStyle;
    buttonTextStyle?: TextStyle;
    modalContainerStyle?: ViewStyle;
    itemStyle?: ViewStyle;
    itemTextStyle?: TextStyle;
    searchInputStyle?: TextStyle;
    overlayStyle?: ViewStyle;

    extraModalContent?: React.ReactNode;

    error?: string;
    required?: boolean;
    searchable?: boolean;
    maxModalHeight?: string | number;
}

export default function ISelect({
    value,
    onChange,
    options,
    placeholder = "Select...",
    disabled = false,

    buttonStyle,
    buttonTextStyle,
    modalContainerStyle,
    itemStyle,
    itemTextStyle,
    searchInputStyle,
    overlayStyle,

    extraModalContent,

    error,
    required = false,
    searchable = false,
    maxModalHeight = "50%",
}: SelectProps) {
    const [visible, setVisible] = useState(false);
    const [search, setSearch] = useState("");

    const selectedLabel = useMemo(() => {
        const found = options.find((o) => o.value === value);
        return found?.label;
    }, [value, options]);

    const filteredOptions = useMemo(() => {
        if (!searchable || search.trim() === "") return options;
        return options.filter((o) =>
            o.label.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, options, searchable]);

    return (
        <>
            {/* Select button */}
            <IButton
                style={[styles.button, buttonStyle]}
                onPress={() => !disabled && setVisible(true)}
            >
                <Text style={[styles.buttonText, buttonTextStyle]}>
                    {selectedLabel ? selectedLabel : placeholder}
                </Text>
                <View style={styles.buttonIcon}>
                    <FontAwesome6 name="caret-down" size={16} color="#000000B4" />
                </View>
            </IButton>


            {/* Error */}
            {/* {error ? <Text style={styles.errorText}>{error}</Text> : null} */}

            {/* Modal */}
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                {/* Overlay */}
                <Pressable style={[styles.overlay, overlayStyle]} onPress={() => setVisible(false)}>
                    {/* Dropdown container */}
                    <Pressable
                        style={[
                            styles.modalContainer, 
                            typeof maxModalHeight === 'number' ? { maxHeight: maxModalHeight } : { maxHeight: maxModalHeight as any },
                            modalContainerStyle
                        ]}
                        onPress={(e) => e.stopPropagation()}
                    >
                        {/* Search */}
                        {searchable && (
                            <TextInput
                                placeholder="Search..."
                                value={search}
                                onChangeText={setSearch}
                                style={[styles.searchInput, searchInputStyle]}
                            />
                        )}

                        {/* List */}
                        <FlatList
                            data={filteredOptions}
                            keyExtractor={(item) => item.value.toString()}
                            renderItem={({ item }) => (
                                <Pressable
                                    onPress={() => {
                                        onChange(item.value);
                                        setVisible(false);
                                        setSearch("");
                                    }}
                                    style={[styles.item, itemStyle]}
                                >
                                    <Text style={[styles.itemText, itemTextStyle]}>
                                        {item.label}
                                    </Text>
                                </Pressable>
                            )}
                            ListEmptyComponent={
                                <Text style={{ padding: 12, color: "#999" }}>No results</Text>
                            }
                        />
                    </Pressable>

                    {extraModalContent}
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 5,
        padding: 4,
    },
    buttonText: {
        fontSize: 11,
        color: "#333",
    },
    buttonIcon: {
        marginLeft: 6,
        justifyContent: "center",
        alignItems: "center",
    },
    // errorText: {
    //     marginTop: 4,
    //     color: "red",
    //     fontSize: 12,
    // },

    // modal
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.35)",
        justifyContent: "center",
        paddingHorizontal: 30,
        gap: 10,
    },
    modalContainer: {
        backgroundColor: "white",
        borderRadius: 15,
        maxHeight: "50%",
        padding: 10,
    },

    // search
    searchInput: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        borderColor: "#ccc",
    },

    item: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    itemText: {
        fontSize: 14,
    },
});
