import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { forwardRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import {
  createRecipe,
  getIngredientSuggestions,
  getRecipeById,
  getTagSuggestions,
  getUnitSuggestions,
  updateRecipe,
} from "@/api/dictionary";
import { RecipeIngredient } from "@/app/(app)/profile/dictionary/types";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import { IText } from "@/components/styled";
import { useAuth } from "@/services/auth/auth.context";

interface EditRecipeModalProps {
  recipeId?: string | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditRecipeModal = forwardRef<BottomSheetModal, EditRecipeModalProps>(
  ({ recipeId, onClose, onSuccess }, ref) => {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";
    const isNew = !recipeId || recipeId === "new";
    const [canEditRecipe, setCanEditRecipe] = useState(true);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [servings, setServings] = useState("4");
    const [directions, setDirections] = useState<string[]>([]);
    const [ingredients, setIngredients] = useState<RecipeIngredient[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");
    const [tagSuggestions, setTagSuggestions] = useState<any[]>([]);
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [ingredientSuggestions, setIngredientSuggestions] = useState<{
      [key: number]: any[];
    }>({});
    const [unitSuggestions, setUnitSuggestions] = useState<{
      [key: number]: any[];
    }>({});
    const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<
      number | null
    >(null);
    const [activeUnitSuggestionIndex, setActiveUnitSuggestionIndex] = useState<
      number | null
    >(null);
    const suggestionTimers = useRef<{
      [key: number]: ReturnType<typeof setTimeout>;
    }>({});
    const unitSuggestionTimers = useRef<{
      [key: number]: ReturnType<typeof setTimeout>;
    }>({});
    const tagSuggestionTimer = useRef<ReturnType<typeof setTimeout> | null>(
      null
    );

    const { data: recipeData, isLoading: isLoadingRecipe } = useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: () => getRecipeById(recipeId as string),
      enabled: !isNew && !!recipeId,
    });

    useEffect(() => {
      if (!recipeData) return;

      const recipe = recipeData;
      
      const creatorId = recipe.creatorId?._id ?? recipe.creatorId ?? null;
      const hasPermission = isAdmin || (creatorId === user?.id);
      setCanEditRecipe(hasPermission);
      
      setTitle(recipe.title ?? "");
      setDescription(recipe.description ?? "");
      setImageUrl(recipe.imageUrl ?? "");
      setPrepTime(recipe.prepTime?.toString() ?? "");
      setCookTime(recipe.cookTime?.toString() ?? "");
      setServings(recipe.servings?.toString() ?? "4");
      setDirections(recipe.directions ?? []);
      setIngredients(recipe.ingredients ?? []);
      
      const tagsList = (recipe.tags ?? [])
        .map((tag: any) => typeof tag === "object" ? tag.name : tag)
        .filter(Boolean);
      setTags(tagsList);
    }, [recipeData, user?.id, isAdmin]);

    useEffect(() => {
      if (isNew) {
        setTitle("");
        setDescription("");
        setImageUrl("");
        setPrepTime("");
        setCookTime("");
        setServings("4");
        setDirections([]);
        setIngredients([]);
        setTags([]);
        setTagInput("");
        setTagSuggestions([]);
        setShowTagSuggestions(false);
        setIngredientSuggestions({});
        setUnitSuggestions({});
        setActiveSuggestionIndex(null);
        setActiveUnitSuggestionIndex(null);
      }
    }, [isNew, recipeId]);

    useEffect(() => {
      return () => {
        Object.values(suggestionTimers.current).forEach((timer) => {
          clearTimeout(timer);
        });
        Object.values(unitSuggestionTimers.current).forEach((timer) => {
          clearTimeout(timer);
        });
        if (tagSuggestionTimer.current) {
          clearTimeout(tagSuggestionTimer.current);
        }
      };
    }, []);

    const createMutation = useMutation({
      mutationFn: createRecipe,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        Alert.alert("Success", "Recipe created successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message ?? error?.message ?? "Failed to create recipe";
        Alert.alert("Error", errorMessage);
      },
    });

    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) =>
        updateRecipe(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
        Alert.alert("Success", "Recipe updated successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message ?? error?.message ?? "Failed to update recipe";
        Alert.alert("Error", errorMessage);
      },
    });

    const handleSave = () => {
      if (!title.trim()) {
        Alert.alert("Error", "Please enter recipe title");
        return;
      }

      const filteredDirections = directions.filter((d) => d.trim());
      const data = {
        title: title.trim(),
        ...(description.trim() && { description: description.trim() }),
        ...(imageUrl && { imageUrl }),
        ...(prepTime && { prepTime: parseInt(prepTime) }),
        ...(cookTime && { cookTime: parseInt(cookTime) }),
        servings: parseInt(servings) || 4,
        ...(filteredDirections.length > 0 && { directions: filteredDirections }),
        ...(ingredients.length > 0 && { ingredients }),
        ...(tags.length > 0 && { tags }),
      };

      if (isNew) {
        createMutation.mutate(data);
      } else {
        updateMutation.mutate({ id: recipeId as string, data });
      }
    };

    const handlePickImage = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUrl(result.assets[0].uri);
        Alert.alert(
          "Info",
          "Image upload will be implemented with UploadThing"
        );
      }
    };

    const handleSearchOnline = () => {
      Alert.alert("Info", "Online search will be implemented");
    };

    const addDirection = () => {
      setDirections([...directions, ""]);
    };

    const updateDirection = (index: number, value: string) => {
      const newDirections = [...directions];
      newDirections[index] = value;
      setDirections(newDirections);
    };

    const removeDirection = (index: number) => {
      setDirections(directions.filter((_, i) => i !== index));
    };

    const addIngredient = () => {
      setIngredients([
        ...ingredients,
        {
          name: "",
          quantity: 0,
          unitText: "",
          optional: false,
        },
      ]);
    };

    const updateIngredient = (
      index: number,
      field: keyof RecipeIngredient,
      value: any
    ) => {
      const newIngredients = [...ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      setIngredients(newIngredients);

      if (field === "name" && value && value.length > 0) {
        if (suggestionTimers.current[index]) {
          clearTimeout(suggestionTimers.current[index]);
        }

        suggestionTimers.current[index] = setTimeout(async () => {
          try {
            const suggestions = await getIngredientSuggestions(value);
            setIngredientSuggestions((prev) => ({
              ...prev,
              [index]: suggestions ?? [],
            }));
            setActiveSuggestionIndex(index);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
            setIngredientSuggestions((prev) => ({
              ...prev,
              [index]: [],
            }));
          }
        }, 300);
      } else if (field === "name" && (!value || value.length === 0)) {
        setIngredientSuggestions((prev) => {
          const newState = { ...prev };
          delete newState[index];
          return newState;
        });
        setActiveSuggestionIndex(null);
      }

      if (field === "unitText" && value && value.length > 0) {
        if (unitSuggestionTimers.current[index]) {
          clearTimeout(unitSuggestionTimers.current[index]);
        }

        unitSuggestionTimers.current[index] = setTimeout(async () => {
          try {
            const suggestions = await getUnitSuggestions(value);
            setUnitSuggestions((prev) => ({
              ...prev,
              [index]: suggestions ?? [],
            }));
            setActiveUnitSuggestionIndex(index);
          } catch (error) {
            console.error("Error fetching unit suggestions:", error);
            setUnitSuggestions((prev) => ({
              ...prev,
              [index]: [],
            }));
          }
        }, 300);
      } else if (field === "unitText" && (!value || value.length === 0)) {
        setUnitSuggestions((prev) => {
          const newState = { ...prev };
          delete newState[index];
          return newState;
        });
        setActiveUnitSuggestionIndex(null);
      }
    };

    const selectIngredientSuggestion = (index: number, suggestion: any) => {
      const newIngredients = [...ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
        name: suggestion.name,
        ingredientId: suggestion._id,
      };
      setIngredients(newIngredients);
      setIngredientSuggestions((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
      setActiveSuggestionIndex(null);
    };

    const selectUnitSuggestion = (index: number, suggestion: any) => {
      const newIngredients = [...ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
        unitText: suggestion.abbreviation || suggestion.name,
        unitId: suggestion._id,
      };
      setIngredients(newIngredients);
      setUnitSuggestions((prev) => {
        const newState = { ...prev };
        delete newState[index];
        return newState;
      });
      setActiveUnitSuggestionIndex(null);
    };

    const removeIngredient = (index: number) => {
      setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleTagInputChange = (value: string) => {
      setTagInput(value);

      if (tagSuggestionTimer.current) {
        clearTimeout(tagSuggestionTimer.current);
      }

      if (value.trim().length > 0) {
        tagSuggestionTimer.current = setTimeout(async () => {
          try {
            const suggestions = await getTagSuggestions(value);
            setTagSuggestions(suggestions || []);
            setShowTagSuggestions(true);
          } catch (error) {
            console.error("Error fetching tag suggestions:", error);
            setTagSuggestions([]);
          }
        }, 300);
      } else {
        setTagSuggestions([]);
        setShowTagSuggestions(false);
      }
    };

    const addTag = (tagName?: string) => {
      const nameToAdd = (tagName || tagInput.trim()).toLowerCase();
      if (nameToAdd && !tags.includes(nameToAdd)) {
        setTags([...tags, nameToAdd]);
        setTagInput("");
        setTagSuggestions([]);
        setShowTagSuggestions(false);
      }
    };

    const removeTag = (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
    };

    const selectTagSuggestion = (suggestion: any) => {
      const tagName =
        typeof suggestion === "string" ? suggestion : suggestion.name;
      addTag(tagName);
    };

    const handleTagInputSubmit = () => {
      if (tagInput.trim()) {
        addTag();
      }
    };

    return (
      <IBottomSheetModal
        ref={ref}
        title={isNew ? "New Recipe" : "Edit Recipe"}
        snapPoints={["90%"]}
        onClose={onClose}
      >
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          {isLoadingRecipe ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#46982D" />
            </View>
          ) : (
            <>
              {/* Image Upload Section */}
              <View style={styles.imageSection}>
                <TouchableOpacity
                  style={styles.imagePlaceholder}
                  onPress={handlePickImage}
                >
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                  ) : (
                    <View style={styles.imagePlaceholderContent}>
                      <Octicons name="image" size={32} color="#000000B4" />
                      <IText
                        size={12}
                        color="#000000B4"
                        style={styles.uploadText}
                      >
                        Upload an image
                      </IText>
                    </View>
                  )}
                </TouchableOpacity>

                <IText size={14} color="#000000B4" style={styles.orText}>
                  or
                </IText>

                <TouchableOpacity
                  onPress={handleSearchOnline}
                  style={styles.searchButton}
                >
                  <IText size={14} semiBold color="#82CD47">
                    Search online
                  </IText>
                </TouchableOpacity>
              </View>

              {/* Form Fields */}
              <View style={styles.formSection}>
                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Title *
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Enter recipe title"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Description
                  </IText>
                  <TextInput
                    style={[styles.input, styles.textArea]}
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Describe your recipe"
                    placeholderTextColor="#000000B4"
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Prep Time (minutes)
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={prepTime}
                    onChangeText={setPrepTime}
                    placeholder="15"
                    keyboardType="numeric"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Cook Time (minutes)
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={cookTime}
                    onChangeText={setCookTime}
                    placeholder="30"
                    keyboardType="numeric"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Servings
                  </IText>
                  <TextInput
                    style={styles.input}
                    value={servings}
                    onChangeText={setServings}
                    placeholder="4"
                    keyboardType="numeric"
                    placeholderTextColor="#000000B4"
                  />
                </View>

                {/* Directions Section */}
                <View style={styles.fieldGroup}>
                  <View style={styles.sectionHeader}>
                    <IText size={14} semiBold style={styles.label}>
                      Directions
                    </IText>
                    <TouchableOpacity
                      onPress={addDirection}
                      style={styles.addButton}
                    >
                      <Octicons name="plus" size={16} color="#82CD47" />
                      <IText
                        size={12}
                        semiBold
                        color="#82CD47"
                        style={{ marginLeft: 4 }}
                      >
                        Add Step
                      </IText>
                    </TouchableOpacity>
                  </View>
                  {directions.map((direction, index) => (
                    <View key={index} style={styles.listItem}>
                      <View style={styles.listItemNumber}>
                        <IText size={12} color="#000000B4">
                          {index + 1}
                        </IText>
                      </View>
                      <TextInput
                        style={[styles.input, styles.listItemInput]}
                        value={direction}
                        onChangeText={(value) => updateDirection(index, value)}
                        placeholder={`Step ${index + 1}...`}
                        placeholderTextColor="#000000B4"
                        multiline
                      />
                      <TouchableOpacity
                        onPress={() => removeDirection(index)}
                        style={styles.removeButton}
                      >
                        <Octicons name="trash" size={16} color="#FF6B6B" />
                      </TouchableOpacity>
                    </View>
                  ))}
                  {directions.length === 0 && (
                    <IText
                      size={12}
                      color="#000000B4"
                      style={{ fontStyle: "italic" }}
                    >
                      No directions added yet
                    </IText>
                  )}
                </View>

                {/* Ingredients Section */}
                <View style={styles.fieldGroup}>
                  <View style={styles.sectionHeader}>
                    <IText size={14} semiBold style={styles.label}>
                      Ingredients
                    </IText>
                    <TouchableOpacity
                      onPress={addIngredient}
                      style={styles.addButton}
                    >
                      <Octicons name="plus" size={16} color="#82CD47" />
                      <IText
                        size={12}
                        semiBold
                        color="#82CD47"
                        style={{ marginLeft: 4 }}
                      >
                        Add Ingredient
                      </IText>
                    </TouchableOpacity>
                  </View>
                  {ingredients.map((ingredient, index) => (
                      <View key={index} style={styles.ingredientCard}>
                        <View style={styles.ingredientRow}>
                          <View
                            style={{
                              flex: 1,
                              marginRight: 8,
                              position: "relative",
                            }}
                          >
                          <TextInput
                            style={styles.input}
                            value={ingredient.name}
                            onChangeText={(value) =>
                              updateIngredient(index, "name", value)
                            }
                            placeholder="Ingredient name"
                            placeholderTextColor="#000000B4"
                            onBlur={() => {
                              setTimeout(() => {
                                setActiveSuggestionIndex(null);
                              }, 200);
                            }}
                            onFocus={() => {
                              if (ingredientSuggestions[index]?.length > 0) {
                                setActiveSuggestionIndex(index);
                              }
                            }}
                          />
                          {activeSuggestionIndex === index &&
                            ingredientSuggestions[index]?.length > 0 && (
                              <View style={styles.suggestionsContainer}>
                                {ingredientSuggestions[index]
                                  .slice(0, 5)
                                  .map((suggestion, sugIndex) => (
                                    <TouchableOpacity
                                      key={suggestion._id || sugIndex}
                                      style={styles.suggestionItem}
                                      onPress={() =>
                                        selectIngredientSuggestion(
                                          index,
                                          suggestion
                                        )
                                      }
                                    >
                                      <IText size={14} color="#000000">
                                        {suggestion.name}
                                      </IText>
                                    </TouchableOpacity>
                                  ))}
                              </View>
                            )}
                        </View>
                        <TextInput
                          style={[styles.input, { width: 80 }]}
                          value={ingredient.quantity?.toString() || ""}
                          onChangeText={(value) =>
                            updateIngredient(
                              index,
                              "quantity",
                              parseFloat(value) || 0
                            )
                          }
                          placeholder="Qty"
                          keyboardType="numeric"
                          placeholderTextColor="#000000B4"
                        />
                        <View
                          style={{
                            width: 80,
                            marginLeft: 8,
                            position: "relative",
                          }}
                        >
                          <TextInput
                            style={styles.input}
                            value={ingredient.unitText || ""}
                            onChangeText={(value) =>
                              updateIngredient(index, "unitText", value)
                            }
                            placeholder="Unit"
                            placeholderTextColor="#000000B4"
                            onBlur={() => {
                              setTimeout(() => {
                                setActiveUnitSuggestionIndex(null);
                              }, 250);
                            }}
                            onFocus={() => {
                              if (unitSuggestions[index]?.length > 0) {
                                setActiveUnitSuggestionIndex(index);
                              }
                            }}
                          />
                          {
                            activeUnitSuggestionIndex === index &&
                            unitSuggestions[index]?.length > 0 &&
                            (
                              <View style={styles.unitSuggestionsContainer}>
                                {unitSuggestions[index]
                                  .slice(0, 5)
                                  .map((suggestion, sugIndex) => {
                                    const isLast = sugIndex === unitSuggestions[index].slice(0, 5).length - 1;
                                    return (
                                      <TouchableOpacity
                                        key={suggestion._id || sugIndex}
                                        style={[
                                          styles.suggestionItem,
                                          isLast && styles.suggestionItemLast,
                                        ]}
                                        onPress={() => {
                                          selectUnitSuggestion(index, suggestion);
                                        }}
                                        activeOpacity={0.7}
                                      >
                                        <View style={styles.unitSuggestionContent}>
                                          <IText size={14} color="#000000" semiBold>
                                            {suggestion.abbreviation ||
                                              suggestion.name}
                                          </IText>
                                          {suggestion.name &&
                                            suggestion.name !==
                                              suggestion.abbreviation && (
                                                <IText
                                                  size={12}
                                                  color="#000000B4"
                                                  style={{ marginLeft: 8 }}
                                                >
                                                  {suggestion.name}
                                                </IText>
                                              )}
                                        </View>
                                      </TouchableOpacity>
                                    );
                                  })}
                              </View>
                            )}
                        </View>
                        <TouchableOpacity
                          onPress={() => removeIngredient(index)}
                          style={styles.removeButton}
                        >
                          <Octicons name="trash" size={16} color="#FF6B6B" />
                        </TouchableOpacity>
                      </View>
                      <TextInput
                        style={[styles.input, { marginTop: 8 }]}
                        value={ingredient.note || ""}
                        onChangeText={(value) =>
                          updateIngredient(index, "note", value)
                        }
                        placeholder="Note (optional)"
                        placeholderTextColor="#000000B4"
                      />
                      <TouchableOpacity
                        onPress={() =>
                          updateIngredient(
                            index,
                            "optional",
                            !ingredient.optional
                          )
                        }
                        style={styles.optionalToggle}
                      >
                        <Octicons
                          name={ingredient.optional ? "check-circle" : "circle"}
                          size={16}
                          color={ingredient.optional ? "#82CD47" : "#000000B4"}
                        />
                        <IText
                          size={12}
                          color="#000000B4"
                          style={{ marginLeft: 6 }}
                        >
                          Optional
                        </IText>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {ingredients.length === 0 && (
                    <IText
                      size={12}
                      color="#000000B4"
                      style={{ fontStyle: "italic" }}
                    >
                      No ingredients added yet
                    </IText>
                  )}
                </View>

                {/* Tags Section */}
                <View style={styles.fieldGroup}>
                  <IText size={14} semiBold style={styles.label}>
                    Tags
                  </IText>

                  {/* Display existing tags as chips */}
                  {tags.length > 0 && (
                    <View style={styles.tagsContainer}>
                      {tags.map((tag, index) => (
                        <View key={index} style={styles.tagChip}>
                          <IText size={12} color="#000000">
                            {tag}
                          </IText>
                          <TouchableOpacity
                            onPress={() => removeTag(index)}
                            style={styles.tagRemoveButton}
                          >
                            <Octicons name="x" size={14} color="#000000B4" />
                          </TouchableOpacity>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Tag input with autocomplete */}
                  <View style={styles.tagInputContainer}>
                    <TextInput
                      style={styles.input}
                      value={tagInput}
                      onChangeText={handleTagInputChange}
                      placeholder="Type to add tags..."
                      placeholderTextColor="#000000B4"
                      onSubmitEditing={handleTagInputSubmit}
                      onBlur={() => {
                        setTimeout(() => {
                          setShowTagSuggestions(false);
                        }, 200);
                      }}
                      onFocus={() => {
                        if (tagSuggestions.length > 0) {
                          setShowTagSuggestions(true);
                        }
                      }}
                    />
                    {showTagSuggestions && tagSuggestions.length > 0 && (
                      <View style={styles.tagSuggestionsContainer}>
                        {tagSuggestions.slice(0, 5).map((suggestion, index) => {
                          const tagName =
                            typeof suggestion === "string"
                              ? suggestion
                              : suggestion.name;
                          const isSelected = tags.includes(
                            tagName.toLowerCase()
                          );
                          const isLast =
                            index === tagSuggestions.slice(0, 5).length - 1;
                          return (
                            <TouchableOpacity
                              key={suggestion._id || index}
                              style={[
                                styles.suggestionItem,
                                isLast && styles.suggestionItemLast,
                                isSelected && styles.suggestionItemDisabled,
                              ]}
                              onPress={() =>
                                !isSelected && selectTagSuggestion(suggestion)
                              }
                              disabled={isSelected}
                            >
                              <IText
                                size={14}
                                color={isSelected ? "#000000B4" : "#000000"}
                              >
                                {tagName}
                                {isSelected && " (added)"}
                              </IText>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    )}
                  </View>
                  {!showTagSuggestions && (
                    <IText size={11} color="#000000B4" style={{ marginTop: 4 }}>
                      Press Enter or select from suggestions to add tag
                    </IText>
                  )}
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
            style={[
              styles.saveButton,
              ...(createMutation.isPending || updateMutation.isPending
                ? [{ opacity: 0.6 }]
                : []),
            ]}
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

EditRecipeModal.displayName = "EditRecipeModal";

export default EditRecipeModal;

const styles = StyleSheet.create({
  centerContainer: {
    paddingVertical: 40,
    alignItems: "center",
  },
  imageSection: {
    alignItems: "center",
    marginVertical: 20,
  },
  imagePlaceholder: {
    width: 160,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#EEEEEE",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    overflow: "hidden",
  },
  imagePlaceholderContent: {
    alignItems: "center",
    gap: 8,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  uploadText: {
    textAlign: "center",
  },
  orText: {
    marginVertical: 8,
  },
  searchButton: {
    borderWidth: 1,
    borderColor: "#82CD47",
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  formSection: {
    gap: 20,
    marginBottom: 20,
  },
  fieldGroup: {
    gap: 8,
    overflow: "visible",
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
  textArea: {
    minHeight: 80,
    textAlignVertical: "top",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#82CD47",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 8,
  },
  listItemNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  listItemInput: {
    flex: 1,
    minHeight: 40,
  },
  ingredientCard: {
    backgroundColor: "#FAFAFA",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "visible",
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  optionalToggle: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  tagInputContainer: {
    position: "relative",
  },
  suggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginTop: 4,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  suggestionsContainerInline: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tagSuggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginTop: 4,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tagSuggestionsContainerInline: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginTop: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  unitSuggestionsContainer: {
    position: "absolute",
    top: "100%",
    left: 0,
    minWidth: 180,
    maxWidth: 250,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginTop: 4,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
    maxHeight: 200,
  },
  unitSuggestionsContainerInline: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    marginTop: 4,
    minWidth: 180,
    maxWidth: 250,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxHeight: 200,
  },
  unitSuggestionContent: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  suggestionItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingBottom: 13,
  },
  suggestionItemDisabled: {
    opacity: 0.5,
    backgroundColor: "#F5F5F5",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagRemoveButton: {
    padding: 2,
  },
});
