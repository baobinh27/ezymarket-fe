import { CardGroup, ItemCard, IText } from "@/components/styled";
import { useNotificationSettings } from "@/hooks/notifications/useNotificationSettings";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from "react-native";

export default function NotificationSettings() {
  const router = useRouter();
  const { settings, toggleEnabled, toggleExpiryReminders, toggleMealReminders } =
    useNotificationSettings();

  const handleBack = () => {
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 16,
        gap: 16,
        paddingBottom: 32,
      }}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={24} color="#46982D" />
        </TouchableOpacity>
        <IText bold size={20}>
          Notification Settings
        </IText>
      </View>

      {/* Master Toggle */}
      <CardGroup>
        <ItemCard style={styles.settingRow}>
          <View style={styles.settingContent}>
            <View>
              <IText semiBold size={16}>
                Enable Notifications
              </IText>
              <IText size={12} color="#666" style={{ marginTop: 4 }}>
                Turn on/off all notifications
              </IText>
            </View>
          </View>
          <Switch
            value={settings.enabled}
            onValueChange={toggleEnabled}
            trackColor={{ false: "#CCCCCC", true: "#82CD47" }}
            thumbColor={settings.enabled ? "#46982D" : "#FFFFFF"}
          />
        </ItemCard>
      </CardGroup>

      {/* Notification Types */}
      {settings.enabled && (
        <CardGroup>
          {/* Expiry Reminders */}
          <ItemCard style={styles.settingRow}>
            <View style={styles.settingContent}>
              <View>
                <IText semiBold size={16}>
                  Expiry Reminders
                </IText>
                <IText size={12} color="#666" style={{ marginTop: 4 }}>
                  Get notified when items are about to expire
                </IText>
              </View>
            </View>
            <Switch
              value={settings.expiryReminders}
              onValueChange={toggleExpiryReminders}
              trackColor={{ false: "#CCCCCC", true: "#82CD47" }}
              thumbColor={settings.expiryReminders ? "#46982D" : "#FFFFFF"}
            />
          </ItemCard>

          {/* Meal Reminders */}
          <ItemCard style={styles.settingRow}>
            <View style={styles.settingContent}>
              <View>
                <IText semiBold size={16}>
                  Meal Reminders
                </IText>
                <IText size={12} color="#666" style={{ marginTop: 4 }}>
                  Daily at 8 AM, 11 AM, 6 PM, 10 PM
                </IText>
              </View>
            </View>
            <Switch
              value={settings.mealReminders}
              onValueChange={toggleMealReminders}
              trackColor={{ false: "#CCCCCC", true: "#82CD47" }}
              thumbColor={settings.mealReminders ? "#46982D" : "#FFFFFF"}
            />
          </ItemCard>
        </CardGroup>
      )}

      {/* Info Section */}
      <View style={styles.infoCard}>
        <MaterialCommunityIcons name="information-outline" size={20} color="#1370D1" />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <IText semiBold size={12} color="#1370D1">
            Notification Info
          </IText>
          <IText size={11} color="#1370D1" style={{ marginTop: 4, lineHeight: 16 }}>
            • Expiry reminders notify you up to 3 days before items expire{"\n"}• Meal reminders are sent at standard meal times daily
          </IText>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  settingContent: {
    flex: 1,
    marginRight: 12,
  },
  infoCard: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 8,
    marginTop: 8,
  },
});
