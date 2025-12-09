import IBottomSheetModal from "@/components/IBottomSheetModal";
import IButton from "@/components/IButton";
import QuantitySelector from "@/components/QuantitySelector";
import { SearchBox } from "@/components/SearchBox";
import AddItemCard from "@/components/shopping/AddItemCard";
import { ItemCard, ItemImage, IText } from "@/components/styled";
import UnitSelector from "@/components/UnitSelector";
import { Octicons } from "@expo/vector-icons";
import { BottomSheetModal, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { ScrollView } from 'react-native-gesture-handler';

interface CreateItem {
//   id: string;
  name: string;
  quantity: number;
  unit: string;
}

const recommendedItems = [
  { name: "Apple", imageUrl: "", isRecommended: true },
  { name: "Pork Ribs", imageUrl: "", isRecommended: true },
  { name: "Bread", imageUrl: "", isRecommended: false },
  { name: "Milk", imageUrl: "", isRecommended: false },
  { name: "Apple", imageUrl: "", isRecommended: true },
  { name: "Pork Ribs", imageUrl: "", isRecommended: true },
  { name: "Bread", imageUrl: "", isRecommended: false },
  { name: "Milk", imageUrl: "", isRecommended: false },
  { name: "Apple", imageUrl: "", isRecommended: true },
  { name: "Pork Ribs", imageUrl: "", isRecommended: true },
  { name: "Bread", imageUrl: "", isRecommended: false },
  { name: "Milk", imageUrl: "", isRecommended: false },
];

export default function CreateShoppingListScreen() {
  const router = useRouter();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [listName, setListName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
//   const [items, setItems] = useState<CreateItem[]>([
//     { id: "1", name: "Cabbage", quantity: 2, unit: "pieces" },
//     { id: "2", name: "Egg", quantity: 10, unit: "pieces" },
//     { id: "3", name: "Milk", quantity: 1, unit: "cartons" },
//   ]);

  const [items, setItems] = useState<CreateItem[]>([
    { name: "Cabbage", quantity: 2, unit: "pieces" },
    { name: "Egg", quantity: 10, unit: "pieces" },
    { name: "Milk", quantity: 1, unit: "cartons" },
  ]);


  const handleConfirm = () => {
    // Handle creating the shopping list
    console.log("Creating list:", listName, items);
    router.back();
  };

  const handleAddItem = () => {
    setIsModalOpen(true);
    bottomSheetRef.current?.present();
  };

  const handleDismissModal = useCallback(() => {
    setIsModalOpen(false);
    bottomSheetRef.current?.dismiss();
    setSearchText("");
  }, []);

  const handleSelectItem = (itemName: string) => {
    const newItem: CreateItem = {
      name: itemName,
      quantity: 1,
      unit: "pieces",
    };
    setItems([newItem, ...items]);
    // handleDismissModal();
  };

  const handleDeleteItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const updateItemQuantity = (index: number, quantity: number) => {
    const updated = [...items];
    updated[index].quantity = quantity;
    setItems(updated);
  };

  return (
    <ScrollView
      style={[{ flex: 1}, isModalOpen && styles.scrollViewWithModal]}
      contentContainerStyle={{ padding: 16, gap: 16 }}
    >
      {/* List Name Display/Input and Add Button */}
      <View style={styles.topRow}>
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
            <IText size={16} bold={!!listName} color={listName ? "#000" : "#9CA3AF"}>
              {listName || "Enter new list name..."}
            </IText>
            <Octicons name="pencil" size={18} color="#46982D" />
          </TouchableOpacity>
        )}
        <IButton 
          variant="primary" 
          style={styles.addButton}
          onPress={handleAddItem}
        >
          <View style={styles.addButtonContent}>
            <View style={styles.plusIcon}>
              <Octicons size={24} name="plus" color="#46982D" />
            </View>
            <IText color="white" semiBold>Add</IText>
          </View>
        </IButton>
      </View>

      {/* Items List */}
      <View style={{ gap: 12 }}>
        {items.map((item, index) => (
          <ItemCard key={index}>
            <View style={styles.itemContent}>
              <ItemImage 
                src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw"
                style={styles.itemImage}
              />
              <View style={styles.itemDetails}>
                <IText semiBold size={14}>{item.name}</IText>
                <View style={styles.quantityRow}>
                  <QuantitySelector 
                    state={item.quantity}
                    maxState={100}
                    setState={(value) => updateItemQuantity(index, value)}
                  />
                  <UnitSelector />
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
        ))}
      </View>

      {/* Add Items Bottom Sheet */}
      <IBottomSheetModal 
        ref={bottomSheetRef} 
        title="Add new items"
        snapPoints={["43%"]}
        onClose={() => {
          setIsModalOpen(false);
          setSearchText("");
        }}
        useBackdrop={false}
      >
          <SearchBox
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search for category or items..."      
            containerStyle={styles.searchBoxContainer}
          />
        <BottomSheetScrollView 
          style={styles.itemsList}
          contentContainerStyle={styles.itemsListContent}
          showsVerticalScrollIndicator={false}
        >
            {recommendedItems
              .filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()))
              .map((item, index) => (
                <AddItemCard
                  key={index}
                  name={item.name}
                  imageUrl={item.imageUrl}
                  isRecommended={item.isRecommended}
                  onPress={() => handleSelectItem(item.name)}
                />
              ))}


            <View style={styles.redirector}>
                <IText style={{width: '65%'}}>Don’t see your items? Create it for your own use!</IText>
                <IButton
                    variant="primary"
                    onPress={() => {
                        // redirect to units management page
                    }}
                    style={styles.redirectorButton}
                >
                    <IText color="white" semiBold>Create Now!</IText>
        
                </IButton>
            </View>
        </BottomSheetScrollView>
      </IBottomSheetModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewWithModal: {
    maxHeight: '55%',
  },
  topRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  nameInput: {
    flex: 1,
    // paddingHorizontal: 16,
    paddingVertical: 4,
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#000000B4",
    borderBottomWidth: 1,
    borderColor: "#000000B4",
    marginLeft: 2,
  },
  nameDisplay: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    paddingVertical: 4,
    fontFamily: "Inter_700Bold",
    borderBottomWidth: 1,
    borderColor: "#000000B4"
  },
  addButton: {
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  addButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  plusIcon: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 4,
  },
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
