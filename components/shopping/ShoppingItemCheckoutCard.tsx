import React, { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { ItemImage, IText } from "../styled";
import UnitSelector from "../UnitSelector";

export interface CheckoutItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  isPurchased?: boolean;
  costPerUnit?: string;
  total?: string;
  expiresIn?: string;
  expiryDays?: number;
}

interface ShoppingItemCheckoutCardProps {
  item: CheckoutItem;
  amount: number;
  maxAmount?: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
  onCostChange?: (costPerUnit: string) => void;
  onTotalChange?: (total: string) => void;
  onExpiryChange?: (days: string) => void;
}

/**
 * Component để hiển thị item trong trang checkout
 * Cho phép người dùng nhập chi phí, tổng chi phí, và ngày hết hạn
 */
export const ShoppingItemCheckoutCard: React.FC<ShoppingItemCheckoutCardProps> = ({
  item,
  amount,
  maxAmount,
  setAmount,
  onCostChange,
  onTotalChange,
  onExpiryChange,
}) => {
  const [costPerUnit, setCostPerUnit] = useState(item.costPerUnit || "0");
  const [total, setTotal] = useState(item.total || "0");
  const [expiryDays, setExpiryDays] = useState(item.expiryDays?.toString() || "");

  const handleInputChange = (text: string) => {
    setAmount(
      text === "" ? 0 : Math.min(maxAmount ? maxAmount : Infinity, Math.max(0, parseInt(text)))
    );
  };

  const handleCostChange = (value: string) => {
    setCostPerUnit(value);
    onCostChange?.(value);
  };

  const handleTotalChange = (value: string) => {
    setTotal(value);
    onTotalChange?.(value);
  };

  const handleExpiryChange = (value: string) => {
    setExpiryDays(value);
    onExpiryChange?.(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.itemHeader}>
        <View style={styles.itemInfo}>
          <ItemImage src="https://imgs.search.brave.com/ZyTalHbd6ylc6QNmPc_567ZkdaIA2fOjPirg0xv5rNY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/cG5nYWxsLmNvbS93/cC1jb250ZW50L3Vw/bG9hZHMvMjAxNi8w/NS9DYWJiYWdlLUZy/ZWUtUE5HLUltYWdl/LnBuZw" />
          <View>
            <IText bold size={16}>
              {item.name}
            </IText>
            <IText size={11}>
              {item.quantity} {item.unit}
            </IText>
          </View>
        </View>

        <View style={styles.unitContainer}>
          <IText size={11}>Save as</IText>
          <TextInput
            style={styles.amountInput}
            keyboardType="numeric"
            onChangeText={(text) => handleInputChange(text)}
          />
          <UnitSelector />
        </View>
      </View>

      {/* Cost Information */}
      <View style={styles.section}>
        <View style={styles.row}>
          <View style={styles.inputGroup}>
            <IText size={11}>Cost per unit</IText>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="0"
                value={costPerUnit}
                onChangeText={handleCostChange}
                keyboardType="decimal-pad"
              />
              <IText size={11} color="#999">
                đ
              </IText>
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1.5 }]}>
            <IText size={11}>Total</IText>
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
            <IText size={11}>Expires in</IText>
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
  }

  amountInput: {
    backgroundColor: "white",
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: "center",
    fontSize: 11,
    borderRadius: 5,
    minWidth: 40,
  },
  unitContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
