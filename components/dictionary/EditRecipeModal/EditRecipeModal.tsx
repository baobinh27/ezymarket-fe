import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import React, { forwardRef, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Image, TextInput, TouchableOpacity, View } from "react-native";

import {
  createRecipe,
  getRecipeById,
  updateRecipe,
} from "@/api/dictionary";
import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import IngredientSelector from "@/components/IngredientSelector";
import { IText } from "@/components/styled";
import UnitSelector from "@/components/UnitSelector";
import { useEntityChange } from "@/hooks/useEntityChange";
import { useUnitChange } from "@/hooks/useUnitChange";
import { useAuth } from "@/services/auth/auth.context";
import { RecipeIngredient } from "@/types/dictionary";
import {
  getClonedItem,
  markClonedItemAsEdited,
  removeClonedItem,
  updateClonedItem,
} from "@/utils/dictionaryStorage";
import styles from "./EditRecipeModal.styles";

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
    const isCloned = recipeId?.startsWith("temp_recipe_");
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
    
    const { handleUnitChange: getUnitChangeResult } = useUnitChange();
    
    const {
      suggestions: tagSuggestions,
      showSuggestions: showTagSuggestions,
      searchSuggestions: searchTagSuggestions,
      clearSuggestions: clearTagSuggestions,
      setShowSuggestions: setShowTagSuggestions,
      handleEntityChangeFromSuggestion: handleTagSuggestionSelect,
    } = useEntityChange({
      entityType: "tag",
    });
    

    const { data: recipeData, isLoading: isLoadingRecipe } = useQuery({
      queryKey: ["recipe", recipeId],
      queryFn: () => getRecipeById(recipeId as string),
      enabled: !isNew && !!recipeId && !isCloned,
    });

    useEffect(() => {
      const loadClonedItem = async () => {
        if (isCloned && recipeId) {
          const cloned = await getClonedItem("recipe", recipeId);
          if (cloned) {
            const recipe = cloned.data;
            setTitle(recipe.title ?? "");
            setDescription(recipe.description ?? "");
            setImageUrl(recipe.imageUrl ?? "");
            setPrepTime(recipe.prepTime?.toString() ?? "");
            setCookTime(recipe.cookTime?.toString() ?? "");
            setServings(recipe.servings?.toString() ?? "4");
            setDirections(recipe.directions ?? []);
            setIngredients(recipe.ingredients ?? []);
            const tagsList = (recipe.tags ?? [])
              .map((tag: any) => (typeof tag === "object" ? tag.name : tag))
              .filter(Boolean);
            setTags(tagsList);
            setCanEditRecipe(true);
          }
        }
      };
      loadClonedItem();
    }, [isCloned, recipeId]);

    useEffect(() => {
      if (!recipeData) return;

      const recipe = recipeData;
      
      const creatorId = recipe.creatorId?._id ?? recipe.creatorId ?? null;
      const hasPermission = isAdmin || creatorId === user?.id;
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
        .map((tag: any) => (typeof tag === "object" ? tag.name : tag))
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
        clearTagSuggestions();
      }
    }, [isNew, recipeId, clearTagSuggestions]);


    const createMutation = useMutation({
      mutationFn: createRecipe,
      onSuccess: async () => {
        if (isCloned && recipeId) {
          await removeClonedItem("recipe", recipeId);
        }
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        Alert.alert("Success", "Recipe created successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ?? error?.message ?? "Failed to create recipe";
        Alert.alert("Error", errorMessage);
      },
    });

    const updateMutation = useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => updateRecipe(id, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["recipes"] });
        queryClient.invalidateQueries({ queryKey: ["recipe", recipeId] });
        Alert.alert("Success", "Recipe updated successfully");
        onSuccess?.();
        onClose();
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.message ?? error?.message ?? "Failed to update recipe";
        Alert.alert("Error", errorMessage);
      },
    });

    const handleSave = async () => {
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

      if (isCloned && recipeId) {
        await updateClonedItem("recipe", recipeId, data);
        await markClonedItemAsEdited("recipe", recipeId);
        createMutation.mutate(data);
      } else if (isNew) {
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
        Alert.alert("Info", "Image upload will be implemented with UploadThing");
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

    const updateIngredient = (index: number, field: keyof RecipeIngredient, value: any) => {
      const newIngredients = [...ingredients];
      newIngredients[index] = { ...newIngredients[index], [field]: value };
      setIngredients(newIngredients);
    };

    const handleUnitChange = (index: number, unitId: string) => {
      const result = getUnitChangeResult(unitId);
      if (result) {
      const newIngredients = [...ingredients];
      newIngredients[index] = {
        ...newIngredients[index],
          unitId: result.unitId,
          unitText: result.unitText,
      };
      setIngredients(newIngredients);
      }
    };

    const removeIngredient = (index: number) => {
      setIngredients(ingredients.filter((_, i) => i !== index));
    };

    const handleTagInputChange = (value: string) => {
      setTagInput(value);
      searchTagSuggestions(value);
    };

    const addTag = (tagName?: string) => {
      const nameToAdd = (tagName || tagInput.trim()).toLowerCase();
      if (nameToAdd && !tags.includes(nameToAdd)) {
        setTags([...tags, nameToAdd]);
        setTagInput("");
        clearTagSuggestions();
      }
    };

    const removeTag = (index: number) => {
      setTags(tags.filter((_, i) => i !== index));
    };

    const selectTagSuggestion = (suggestion: any) => {
      const result = handleTagSuggestionSelect(suggestion);
      if (result) {
        addTag(result.name);
      }
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
                <TouchableOpacity style={styles.imagePlaceholder} onPress={handlePickImage}>
                  {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                  ) : (
                    <View style={styles.imagePlaceholderContent}>
                      <Octicons name="image" size={32} color="#000000B4" />
                      <IText size={12} color="#000000B4" style={styles.uploadText}>
                        Upload an image
                      </IText>
                    </View>
                  )}
                </TouchableOpacity>

                <IText size={14} color="#000000B4" style={styles.orText}>
                  or
                </IText>

                <TouchableOpacity onPress={handleSearchOnline} style={styles.searchButton}>
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
                    <TouchableOpacity onPress={addDirection} style={styles.addButton}>
                      <Octicons name="plus" size={16} color="#82CD47" />
                      <IText size={12} semiBold color="#82CD47" style={{ marginLeft: 4 }}>
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
                    <IText size={12} color="#000000B4" style={{ fontStyle: "italic" }}>
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
                    <TouchableOpacity onPress={addIngredient} style={styles.addButton}>
                      <Octicons name="plus" size={16} color="#82CD47" />
                      <IText size={12} semiBold color="#82CD47" style={{ marginLeft: 4 }}>
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
                            }}
                          >
                          <IngredientSelector
                            value={ingredient.name}
                            onChange={(selected) => {
                              const newIngredients = [...ingredients];
                              newIngredients[index] = {
                                ...newIngredients[index],
                                name: selected.name,
                                ingredientId: selected.id,
                              };
                              setIngredients(newIngredients);
                            }}
                            placeholder="Ingredient name"
                            inputStyle={styles.input}
                            maxModalHeight="50%"
                          />
                        </View>
                        <TextInput
                          style={[styles.input, { width: 80 }]}
                          value={ingredient.quantity?.toString() || ""}
                          onChangeText={(value) =>
                            updateIngredient(index, "quantity", parseFloat(value) || 0)
                          }
                          placeholder="Qty"
                          keyboardType="numeric"
                          placeholderTextColor="#000000B4"
                        />
                        <View
                          style={{
                            width: 120,
                            marginLeft: 8,
                          }}
                        >
                          <UnitSelector
                            value={ingredient.unitId || ""}
                            onChange={(unitId) => handleUnitChange(index, unitId)}
                            placeholder="Unit"
                            maxModalHeight="50%"
                            buttonStyle={styles.input}
                          />
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
                        onChangeText={(value) => updateIngredient(index, "note", value)}
                        placeholder="Note (optional)"
                        placeholderTextColor="#000000B4"
                      />
                      <TouchableOpacity
                        onPress={() => updateIngredient(index, "optional", !ingredient.optional)}
                        style={styles.optionalToggle}
                      >
                        <Octicons
                          name={ingredient.optional ? "check-circle" : "circle"}
                          size={16}
                          color={ingredient.optional ? "#82CD47" : "#000000B4"}
                        />
                        <IText size={12} color="#000000B4" style={{ marginLeft: 6 }}>
                          Optional
                        </IText>
                      </TouchableOpacity>
                    </View>
                  ))}
                  {ingredients.length === 0 && (
                    <IText size={12} color="#000000B4" style={{ fontStyle: "italic" }}>
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
                            typeof suggestion === "string" ? suggestion : suggestion.name;
                          const isSelected = tags.includes(tagName.toLowerCase());
                          const isLast = index === tagSuggestions.slice(0, 5).length - 1;
                          return (
                            <TouchableOpacity
                              key={suggestion._id || index}
                              style={[
                                styles.suggestionItem,
                                isLast && styles.suggestionItemLast,
                                isSelected && styles.suggestionItemDisabled,
                              ]}
                              onPress={() => !isSelected && selectTagSuggestion(suggestion)}
                              disabled={isSelected}
                            >
                              <IText size={14} color={isSelected ? "#000000B4" : "#000000"}>
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
            onPress={createMutation.isPending || updateMutation.isPending ? undefined : handleSave}
            style={[
              styles.saveButton,
              ...(createMutation.isPending || updateMutation.isPending ? [{ opacity: 0.6 }] : []),
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
