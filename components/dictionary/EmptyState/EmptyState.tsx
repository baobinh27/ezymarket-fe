import React from "react";
import { Octicons } from "@expo/vector-icons";
import { View } from "react-native";

import { IText } from "@/components/styled";
import emptyStateStyles from "./EmptyState.styles";

interface EmptyStateProps {
  icon?: keyof typeof Octicons.glyphMap;
  title: string;
  message?: string;
}

export default function EmptyState({ icon = "package", title, message }: EmptyStateProps) {
  return (
    <View style={emptyStateStyles.container}>
      <View style={emptyStateStyles.iconContainer}>
        <Octicons name={icon} size={48} color="#D1D5DB" />
      </View>
      <IText size={16} semiBold color="#6B7280" style={emptyStateStyles.title}>
        {title}
      </IText>
      {message && (
        <IText size={14} color="#9CA3AF" style={emptyStateStyles.message}>
          {message}
        </IText>
      )}
    </View>
  );
}
