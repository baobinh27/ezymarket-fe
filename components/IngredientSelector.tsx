import { getIngredientSuggestions } from "@/api/dictionary";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    TextInput,
    TextStyle,
    View,
    ViewStyle,
} from "react-native";
import IButton from "./IButton";
import styles from "./IngredientSelector.styles";
import { IText } from "./styled";

interface IngredientSelectorProps {
  value?: string;
  onChange?: (ingredient: { id: string; name: string }) => void;
  buttonStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  modalContainerStyle?: ViewStyle;
  itemStyle?: ViewStyle;
  itemTextStyle?: TextStyle;
  searchInputStyle?: TextStyle;
  overlayStyle?: ViewStyle;
  maxModalHeight?: string | number;
  placeholder?: string;
  inputStyle?: TextStyle;
  inputTextStyle?: TextStyle;
}

const IngredientSelector = ({
  value = "",
  onChange,
  buttonStyle,
  buttonTextStyle,
  modalContainerStyle,
  itemStyle,
  itemTextStyle,
  searchInputStyle,
  overlayStyle,
  maxModalHeight = "50%",
  placeholder = "Ingredient name",
  inputStyle,
  inputTextStyle,
}: IngredientSelectorProps) => {
  const [ingredientName, setIngredientName] = useState(value);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIngredientName(value);
  }, [value]);

  useEffect(() => {
    if (modalVisible && searchQuery.trim().length > 0) {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }

      setIsLoading(true);
      searchTimerRef.current = setTimeout(async () => {
        try {
          const results = await getIngredientSuggestions(searchQuery);
          setSuggestions(results || []);
        } catch (error) {
          setSuggestions([]);
        } finally {
          setIsLoading(false);
        }
      }, 300);
    } else if (modalVisible && searchQuery.trim().length === 0) {
      setSuggestions([]);
      setIsLoading(false);
    }

    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, [searchQuery, modalVisible]);

  const handleSelect = (ingredient: any) => {
    setIngredientName(ingredient.name);
    onChange?.({
      id: ingredient._id || ingredient.id,
      name: ingredient.name,
    });
    setModalVisible(false);
    setSearchQuery("");
  };

  const handleInputChange = (text: string) => {
    setIngredientName(text);
    if (onChange) {
      onChange({
        id: "",
        name: text,
      });
    }
  };

  const handleOpenModal = () => {
    setModalVisible(true);
    setSearchQuery(ingredientName);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, inputStyle]}
          value={ingredientName}
          onChangeText={handleInputChange}
          placeholder={placeholder}
          placeholderTextColor="#000000B4"
          onFocus={handleOpenModal}
        />
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          setModalVisible(false);
          setSearchQuery("");
        }}
      >
        <Pressable
          style={[styles.overlay, overlayStyle]}
          onPress={() => {
            setModalVisible(false);
            setSearchQuery("");
          }}
        >
          <Pressable
            style={[
              styles.modalContainer,
              typeof maxModalHeight === "number"
                ? { maxHeight: maxModalHeight }
                : { maxHeight: maxModalHeight as any },
              modalContainerStyle,
            ]}
            onPress={(e) => e.stopPropagation()}
          >
            <TextInput
              placeholder="Search ingredients..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, searchInputStyle]}
              autoFocus
              placeholderTextColor="#000000B4"
            />

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator color="#82CD47" />
                <IText style={styles.loadingText}>Searching...</IText>
              </View>
            )}

            {!isLoading && suggestions.length > 0 && (
              <ScrollView style={styles.suggestionsList}>
                {suggestions.map((ingredient, index) => (
                  <Pressable
                    key={ingredient._id || index}
                    style={[styles.suggestionItem, itemStyle]}
                    onPress={() => handleSelect(ingredient)}
                  >
                    <IText style={[styles.suggestionText, itemTextStyle]}>{ingredient.name}</IText>
                  </Pressable>
                ))}
              </ScrollView>
            )}

            {!isLoading && suggestions.length === 0 && searchQuery.trim().length > 0 && (
              <View style={styles.emptyContainer}>
                <IText style={styles.emptyText}>No ingredients found</IText>
              </View>
            )}

            {!isLoading && searchQuery.trim().length === 0 && (
              <View style={styles.emptyContainer}>
                <IText style={styles.emptyText}>Type to search ingredients...</IText>
              </View>
            )}

            <IButton
              style={styles.closeButton}
              onPress={() => {
                setModalVisible(false);
                setSearchQuery("");
              }}
            >
              <IText color="#82CD47" semiBold>
                Close
              </IText>
            </IButton>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default IngredientSelector;

