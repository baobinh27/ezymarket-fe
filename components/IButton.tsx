import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import styled from "styled-components/native";

interface IButtonProps {
  variant?: "primary" | "secondary" | "tertiary" | "none";
  children: React.ReactNode;
  onPress?: () => void;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: ViewStyle | (ViewStyle | undefined)[];
}

const IBackground = styled(LinearGradient as any).attrs<{
  variant?: "primary" | "secondary" | "tertiary" | "none";
}>((props) => ({
  colors:
    props.variant === "primary"
      ? ["#82CD47", "#46982D"]
      : props.variant === "tertiary"
        ? ["#EEE", "#EEE"]
        : ["#FFF", "#FFF"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
}))<{ variant?: "primary" | "secondary" | "tertiary" | "none" }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
/**
 * Component nút bấm, với 4 variant và style tuỳ chỉnh.
 *
 * ---
 * **Props**
 * - {boolean} - **[variant]** - Kiểu nút bấm. Bao gồm `primary`, `secondary`, `tertiary`, và `none`. Mặc định là `none`.
 * - {function} - **[onPress]** - Hàm được gọi khi người dùng nhấn nút.
 * - {function} - **[onLongPress]** - Hàm được gọi khi người dùng nhấn giữ nút (hơn 500ms).
 * - {function} - **[onPressIn]** - Hàm được gọi khi người dùng bắt đầu nhấn nút.
 * - {function} - **[onPressOut]** - Hàm được gọi khi người dùng thả nút.
 * - {ViewStyle | ViewStyle[]} - **[style]** - Style tuỳ chỉnh cho nút bấm.
 * - {React.ReactNode} - **children** - Nội dung bên trong nút bấm.
 *
 * ---
 * **Ví dụ sử dụng**
 * ```tsx
 * <IButton variant="primary" onPress={() => console.log("Clicked!")}>
 *     <IText color="white">Click Me</IText>
 * </IButton>
 * ```
 */
export default function IButton({
  variant = "none",
  children,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  style,
}: IButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        styles.button,
        style,
        pressed && styles.pressed,
        variant === "secondary" && styles.border,
      ]}
    >
      <IBackground variant={variant} />
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  border: {
    borderWidth: 1,
    borderColor: "#82CD47",
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
});
