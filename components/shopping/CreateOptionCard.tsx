import { Octicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IText } from "../styled";

interface CreateOptionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onPress: () => void;
}

export const createOptions = [
  {
    title: "Shopping Checklist",
    description:
      "This will create a shopping checklist to help you track your items while shopping.",
    icon: <Octicons size={28} name="checklist" color="#46982D" />,
    onPress: () => {},
  },
  {
    title: "Instant Receipt",
    description:
      "Use this when you don't want to plan and already has the complete shopping receipt.",
    icon: <Octicons size={28} name="zap" color="#46982D" />,
    onPress: () => {},
  },
];

export default function CreateOptionCard({
  title,
  description,
  icon,
  onPress,
}: CreateOptionCardProps) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={["#46982D", "#82CD47"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.optionCard}
      >
        <View style={styles.optionLeft}>
          <View style={styles.optionTitle}>
            {icon && <View style={styles.iconContainer}>{icon}</View>}
            <IText bold size={18} color="white" style={styles.titleText}>
              {title}
            </IText>
            <View style={{ backgroundColor: "white", borderRadius: 4, padding: 2 }}>
              <Octicons size={34} name="chevron-right" color="#82CD47" />
            </View>
          </View>
          <IText color="white" size={12}>
            {description}
          </IText>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  optionLeft: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    backgroundColor: "white",
    borderRadius: 4,
    padding: 5,
  },
  optionTitle: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    flex: 1,
    marginLeft: 10,
  },
  arrow: {
    marginLeft: 12,
  },
});
