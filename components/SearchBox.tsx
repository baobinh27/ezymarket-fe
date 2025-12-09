import { Octicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TextStyle, View, ViewStyle } from "react-native";

interface SearchBoxProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  debounceMs = 300,
  containerStyle,
  inputStyle,
  iconColor = "#46982D",
  iconSize = 26,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChangeText(localValue);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [localValue, debounceMs, onChangeText]);


  return (
    <View style={[styles.searchContainer, containerStyle]}>
      <TextInput
        style={[styles.searchInput, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={localValue}
        onChangeText={setLocalValue}
      />
        <Octicons name="search" size={24} color={iconColor} />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#82CD47",
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 12,
    gap: 8
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000000B4",
  },
});
