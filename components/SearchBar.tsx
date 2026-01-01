import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TextInputProps, View, ViewStyle } from "react-native";

interface SearchBarProps extends Omit<TextInputProps, "style"> {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  iconColor?: string;
  containerStyle?: ViewStyle;
  inputStyle?: any;
  iconSize?: number;
}

/**
 * SearchBar component for searching/filtering content
 *
 * ---
 * **Props**
 * - {string} - **value** - Current search value
 * - {function} - **onChangeText** - Callback when text changes
 * - {string} - **[placeholder]** - Placeholder text (default: "Search...")
 * - {string} - **[iconColor]** - Color of the search icon (default: "#82CD47")
 * - {number} - **[iconSize]** - Size of the search icon (default: 16)
 * - {object} - **[containerStyle]** - Custom styles for the container
 * - {object} - **[inputStyle]** - Custom styles for the text input
 * - {...TextInputProps} - All other TextInput props are supported
 *
 * ---
 * **Example usage**
 * ```tsx
 * const [query, setQuery] = useState("");
 *
 * <SearchBar
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Search items..."
 *   containerStyle={{ flex: 1 }}
 * />
 * ```
 */
const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = "Search...",
  iconColor = "#82CD47",
  iconSize = 16,
  containerStyle,
  inputStyle,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        placeholderTextColor="#0000004B"
        value={value}
        onChangeText={onChangeText}
        {...textInputProps}
      />
      <FontAwesome6 name="magnifying-glass" size={iconSize} color={iconColor} style={styles.icon} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000000B4",
  },
  icon: {
    marginLeft: 8,
  },
});

export default SearchBar;
