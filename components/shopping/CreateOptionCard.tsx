import { Octicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { IText } from '../styled';


interface CreateOptionCardProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onPress: () => void
}

export const createOptions = [
    {
        title: "Shopping Checklist",
        description: "This will create a shopping checklist to help you track your items while shopping.",
        icon: <Octicons size={24} name="checklist" color="#46982D" />,
        onPress: () => {
        console.log("Create Shopping Checklist");
        },
    },
    {
        title: "Instant Receipt",
        description: "Use this when you don't want to plan and already has the complete shopping receipt.",
        icon: <Octicons size={24} name="checklist" color="#46982D" />,
        onPress: () => {
        console.log("Create Instant Receipt");
        },
    },
];



export default function CreateOptionCard({
    title,
    description,
    icon,
    onPress
}: CreateOptionCardProps) {
  return (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
    >
        <View style={styles.optionCard}>
          <View style={styles.optionLeft}>
            {icon && (
              <View style={styles.iconContainer}>{icon}</View>
            )}
            <View style={styles.optionText}>
              <IText bold size={18} color="white">
                {title}
              </IText>
              <IText color="white" size={14} style={{ marginTop: 4 }}>
                {description}
              </IText>
            </View>
          </View>
          <View style={styles.arrow}>
            <IText color="white" bold size={20}>
              &gt;
            </IText>
          </View>
        </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  optionCard: {
    backgroundColor: "#46982D",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  optionText: {
    flex: 1,
  },
  arrow: {
    marginLeft: 12,
  },
})
