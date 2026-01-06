import IButton from "@/components/IButton";
import { useToast } from "@/components/IToast";
import QuantitySelector from "@/components/QuantitySelector";
import ShoppingAddItemModal from "@/components/shopping/create/ShoppingAddItemModal";
import { ItemCard, ItemImage, IText } from "@/components/styled";
import UnitSelector from "@/components/UnitSelector";
import useGetMyGroups from "@/hooks/group/useGetMyGroups";
import { useCreateShoppingList } from "@/hooks/shopping/useShopping";
import { useAuth } from "@/services/auth/auth.context";
import { useSnackBar } from "@/services/auth/snackbar.context";
import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface CreateItem {
  ingredientId?: string;
  name: string;
  quantity: number;
  unitId: string;
  imageURL?: string | null;
}
export default function CreateShoppingListScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const [items, setItems] = useState<CreateItem[]>([]);

  // API Hooks
  const { user } = useAuth();
  const { data: groupsData, isLoading: groupsLoading } = useGetMyGroups();
  const createListMutation = useCreateShoppingList();

  const { showSnackBar } = useSnackBar();
  const { showToast } = useToast();

  // Get the first group ID from user's groups
  const groupId = groupsData?.groups?.[0]?.id;

  const handleConfirm = () => {
    if (!listName.trim()) {
      showSnackBar("Please enter a list name", "error");
      return;
    }

    if (items.length === 0) {
      showSnackBar("Please add at least one item", "error");
      return;
    }

    if (!groupId) {
      showSnackBar("Please join or create a group first", "error");
      return;
    }

    createListMutation.mutate(
      {
        groupId,
        title: listName,
        description,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unitId: i.unitId,
          ingredientId: i.ingredientId,
        })),
      },
      {
        onSuccess: () => {
          showSnackBar("List " + listName + " created successfully!", "success");
          router.back();
        },
        onError: (error) => {
          showSnackBar(error.message || "Failed to create list", "error");
        },
      }
    );
  };




  const handleAddItem = () => {
    setIsModalOpen(true);
    bottomSheetRef.current?.present();
  };

  const handleDeleteItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSelectItem = (item: any) => {
    const newItem: CreateItem = {
      name: item.name,
      quantity: 1,
      unitId: "",
      ingredientId: item._id,
      imageURL: item.imageURL,
    };
    setItems((prev) => [newItem, ...prev]);

    showToast(`Added ${item.name}`, "success", 3000, {
      icon: <Octicons name="trash" size={18} color="#f44336" />,
      onPress: () => {
        setItems((prev) => prev.filter((i) => i !== newItem));
      }
    });
  };



  const updateItemQuantity = (index: number, quantity: number) => {
    const updated = [...items];
    updated[index].quantity = quantity;

    setItems(updated);
  };

  const updateItemUnit = (index: number, unitId: string) => {
    const updated = [...items];
    updated[index].unitId = unitId;
    // console.log("updated", unitId);
    setItems(updated);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <SafeAreaView style={{ flex: 1 }} edges={[]}>
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            {isEditingName ? (
              <TextInput
                style={styles.nameInput}
                value={listName}
                onChangeText={setListName}
                onBlur={() => setIsEditingName(false)}
                autoFocus
              />
            ) : (
              <TouchableOpacity
                style={styles.nameDisplay}
                onPress={() => setIsEditingName(true)}
              >
                <IText size={24} bold={!!listName} color={listName ? "#000" : "#9CA3AF"}>
                  {listName || "Enter new list name"}
                </IText>
                <Octicons style={{ paddingTop: 8 }} name="pencil" size={18} color="#46982D" />
              </TouchableOpacity>
            )}

            <View style={styles.inputGroup}>
              <IText size={14} semiBold style={{ marginBottom: 8 }}>Description</IText>
              {isEditingDescription ? (
                <TextInput
                  style={styles.descriptionInput}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Add any notes..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                  textAlignVertical="top"
                  autoFocus
                  onBlur={() => setIsEditingDescription(false)}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => setIsEditingDescription(true)}
                  style={styles.descriptionDisplay}
                >
                  <IText size={14} color={description ? "#000000B4" : "#9CA3AF"}>
                    {description || "Add any notes"}
                  </IText>
                  <Octicons name="pencil" size={14} color="#46982D" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Actions Section */}
          <View style={styles.actionSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <IText size={18} semiBold>Items ({items.length})</IText>
              <TouchableOpacity onPress={handleAddItem}>
                <IText color="#46982D" semiBold>+ Add Items</IText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Items List */}
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 16, paddingBottom: 16 }}>
          <View style={{ gap: 12, flex: 1 }}>
            {items.length === 0 ? (
              <View style={styles.emptyState}>
                <View style={styles.emptyStateIcon}>
                  <Octicons name="list-unordered" size={32} color="#9CA3AF" />
                </View>
                <IText color="#6B7280" style={{ textAlign: 'center', marginTop: 8 }}>
                  No items yet. Start by adding some!
                </IText>
                <IButton variant="primary" onPress={handleAddItem} style={{ marginTop: 10, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 6 }}>
                  <IText semiBold color="white">Browse Ingredients</IText>
                </IButton>
              </View>
            ) : (
              items.map((item, index) => (
                <ItemCard key={index}>
                  <View style={styles.itemContent}>
                    <ItemImage
                      src={item.imageURL || "https://placehold.co/48x48"}
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <IText semiBold size={14}>{item.name}</IText>
                      <View style={styles.quantityRow}>
                        <QuantitySelector
                          state={item.quantity}
                          maxState={100}
                          setState={(value) => {
                            if (typeof value === 'function') {
                              updateItemQuantity(index, value(item.quantity));
                            } else {
                              updateItemQuantity(index, value);
                            }
                          }}
                        />
                        <UnitSelector
                          value={item.unitId}
                          onChange={(value) => updateItemUnit(index, value)}
                        />
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleDeleteItem(index)}
                      style={styles.menuButton}
                    >
                      <Octicons name="trash" size={22} color="#eb000090" />
                    </TouchableOpacity>
                  </View>
                </ItemCard>
              ))
            )}
          </View>
        </ScrollView>

        {/* Fixed Footer */}
        <View style={styles.footer}>
          <IButton
            variant="primary"
            onPress={handleConfirm}
            style={styles.createButton}
          >
            {createListMutation.isPending ? (
              <ActivityIndicator color="white" />
            ) : (
              <IText color="white" bold size={16}>Create Shopping List</IText>
            )}
          </IButton>
        </View>
      </SafeAreaView>

      {/* Add Items Bottom Sheet */}
      <ShoppingAddItemModal
        ref={bottomSheetRef}
        onClose={() => {
          setIsModalOpen(false);
          setSearchText("");
        }}
        existingIngredientIds={new Set(items.map((i) => i.ingredientId).filter(Boolean) as string[])}
        onConfirmItem={(newItem) => {
          setItems((prev) => [newItem, ...prev]);
          showToast(`Added ${newItem.name}`, "success", 3000, {
            icon: <Octicons name="trash" size={18} color="#f44336" />,
            onPress: () => {
              setItems((prev) => prev.filter((i) => i !== newItem));
            }
          });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollViewWithModal: {
    opacity: 0.5,
  },
  headerSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginTop: 16,
  },
  descriptionInput: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "Inter_Regular",
    minHeight: 20,
  },
  descriptionDisplay: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    minHeight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    paddingVertical: 4,
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: "#000000B4",
    borderBottomWidth: 1,
    borderColor: "#000000B4",
    marginLeft: 2,
  },

  nameDisplay: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 4,
    fontFamily: "Inter_700Bold",
    borderBottomWidth: 1,
    borderColor: "#000000B4",
    fontSize: 24,
  },

  actionSection: {
    marginBottom: 16,
  },
  footer: {
    padding: 10,
    backgroundColor: "white",
  },
  createButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Existing Item Styles
  itemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    gap: 4,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },
  menuButton: {
    padding: 8,
  },
  searchBoxContainer: {
    flex: 0,
    marginBottom: 10
  },
  itemsList: {
    flex: 1,
  },
  itemsListContent: {
    paddingBottom: 24,
  },
  redirector: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 5,
    gap: 5
  },
  redirectorButton: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundImage: 'linear-gradient(135deg, #46982D, #82CD47)',
  }
});
