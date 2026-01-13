import IButton from "@/components/IButton";
import { ItemCard, IText } from "@/components/styled";
import { useNotifications } from "@/hooks/notifications/useNotifications";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

export default function Notifications() {
  const { notifications, isLoading, deleteNotification, markAsRead, clearAll, unreadCount } =
    useNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "expiry":
        return "clock-alert";
      case "meal_reminder":
        return "bell";
      default:
        return "information";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "expiry":
        return "#FF6B6B";
      case "meal_reminder":
        return "#4CAF50";
      default:
        return "#1370D1";
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const renderNotificationItem = ({ item }: { item: any }) => (
    <ItemCard style={[styles.notificationCard, !item.read && styles.unreadCard]}>
      <TouchableOpacity
        onPress={() => markAsRead(item.id)}
        style={styles.notificationContent}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: getNotificationColor(item.type) + "20" },
          ]}
        >
          <MaterialCommunityIcons
            name={getNotificationIcon(item.type)}
            size={20}
            color={getNotificationColor(item.type)}
          />
        </View>

        <View style={styles.textContent}>
          <IText semiBold size={14}>
            {item.title}
          </IText>
          <IText size={12} color="#666" style={{ marginTop: 4 }}>
            {item.body}
          </IText>
          <IText size={10} color="#999" style={{ marginTop: 6 }}>
            {formatTime(item.timestamp)}
          </IText>
        </View>

        {!item.read && (
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#82CD47",
              marginLeft: 8,
            }}
          />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => deleteNotification(item.id)}
        style={styles.deleteButton}
      >
        <MaterialCommunityIcons name="close" size={18} color="#999" />
      </TouchableOpacity>
    </ItemCard>
  );

  const emptyComponent = (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons name="inbox" size={48} color="#CCCCCC" />
      <IText color="#999999" style={styles.emptyText}>
        No notifications yet
      </IText>
      <IText size={12} color="#CCCCCC" style={{ marginTop: 8 }}>
        You&apos;ll receive notifications about item expiry and meal reminders
      </IText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          {/* <IText bold size={24}>
            Notifications
          </IText> */}
          <IText size={14} color="#666" style={{ marginTop: 4 }}>
            {unreadCount > 0 ? unreadCount + " unread." : "Up to date."}
          </IText>
        </View>

        {notifications.length > 0 && (
          <IButton
            variant="secondary"
            style={styles.clearButton}
            onPress={clearAll}
          >
            <IText size={12} color="#82CD47" semiBold>
              Clear All
            </IText>
          </IButton>
        )}
      </View>

      {/* Notifications List */}
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#82CD47" />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={emptyComponent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginBottom: 0,
  },
  unreadCard: {
    backgroundColor: "#F0F9FF",
  },
  notificationContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContent: {
    flex: 1,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 12,
  },
});

