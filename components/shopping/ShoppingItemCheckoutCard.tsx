import { ShoppingItem } from "@/types/types";
import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import QuantitySelector from "../QuantitySelector";
import { ItemImage, IText } from "../styled";

interface ShoppingItemCheckoutCardProps {
  item: ShoppingItem;
  // amount: number,
  maxAmount?: number,
  onQuantityChange?: (quantity: number) => void;
  onServingQuantityChange?: (quantity: number) => void;
  onPriceChange?: (price: string) => void;
  onTotalChange?: (total: string) => void;
  onExpiryChange?: (days: string) => void;
}

/**
 * Component để hiển thị item trong trang checkout
 * Cho phép người dùng nhập chi phí, tổng chi phí, và ngày hết hạn
 */
export const ShoppingItemCheckoutCard: React.FC<ShoppingItemCheckoutCardProps> = ({
  item,
  maxAmount,
  onQuantityChange,
  onServingQuantityChange,
  onPriceChange,
  onTotalChange,
  onExpiryChange,
}) => {
  const initialQuantity = React.useRef(item.quantity);
  const initialUnit = React.useRef(item.unit);

  const [price, setPrice] = useState(item.price?.toString() || "0");
  const [total, setTotal] = useState(((item.price || 0) * (item.quantity || 0)).toString());
  const [expiryDays, setExpiryDays] = useState("");
  const [servingQuantity, setServingQuantity] = useState(item.servingQuantity || 0);


  // Recalculate total when price or amount changes
  // Removed useEffect to allow two-way binding

  const handleServingQuantityChange = (newQuantity: number) => {
    setServingQuantity(newQuantity);
    onServingQuantityChange?.(newQuantity);
  }

  const handlePriceChange = (value: string) => {
    setPrice(value);
    onPriceChange?.(value);
    const p = parseFloat(value) || 0;
    const q = item.quantity || 0;
    const newTotal = p * q;
    setTotal(newTotal.toString());
    onTotalChange?.(newTotal.toString());
  };

  const handleTotalChange = (value: string) => {
    setTotal(value);
    onTotalChange?.(value);

    // Update unit price when total changes
    const t = parseFloat(value) || 0;
    const q = item.quantity || 1; // Avoid division by zero
    if (q > 0) {
      const newPrice = Math.round(t / q);
      setPrice(newPrice.toString());
      onPriceChange?.(newPrice.toString());
    }
  };

  const handleExpiryChange = (value: string) => {
    setExpiryDays(value);
    onExpiryChange?.(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <ItemImage src={item.ingredientId?.imageURL} />
          <View>
            <IText bold size={16}>
              {item.name}
            </IText>
            <IText size={11}>
              {initialQuantity.current} {initialUnit.current}
            </IText>
          </View>
        </View>

        <View style={styles.unitContainer}>
          <IText size={11}>
            Serving
          </IText>
          <QuantitySelector
            state={servingQuantity}
            setState={(value) => {
              if (typeof value === 'function') {
                handleServingQuantityChange(value(servingQuantity));
              } else {
                handleServingQuantityChange(value);
              }
            }}
            maxState={maxAmount}
          />
        </View>
      </View>

      {/* Cost Information */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <IText size={11}>
              Cost per unit
            </IText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={price}
                onChangeText={handlePriceChange}
                keyboardType="decimal-pad"
              />
              <IText size={11} color="#999">
                đ
              </IText>
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1.5 }]}>
            <IText size={11}>
              Total
            </IText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={total}
                onChangeText={handleTotalChange}
                keyboardType="decimal-pad"
              />
              <IText size={11} color="#999">
                đ
              </IText>
            </View>
          </View>


          <View style={[styles.inputGroup, { flex: 0.85, marginLeft: 20 }]}>
            <IText size={11}>
              Expires in
            </IText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={expiryDays}
                onChangeText={handleExpiryChange}
                keyboardType="number-pad"
              />
              <IText size={11} color="#999" style={{ marginRight: 6 }}>
                days
              </IText>
            </View>
          </View>
        </View>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    padding: 12,
    // marginBottom: 12,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  itemInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  section: {
    gap: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 5,
    paddingHorizontal: 6,
    marginTop: 4,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 11,
    paddingVertical: 8,

  },

  amountInput: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: 'center',
    fontSize: 11,
    borderRadius: 5,
    minWidth: 40,
  },
  unitContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5
  },
});
