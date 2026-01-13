import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  type: "expiry" | "meal_reminder";
  timestamp: number;
  read: boolean;
  data?: Record<string, any>;
}

const NOTIFICATIONS_KEY = "app_push_notifications";
const NOTIFICATION_SETTINGS_KEY = "app_notification_settings";

// Lazy load notifications on native platforms
let NotificationsModule: any = null;
let isInitialized = false;

const initializeNotifications = async () => {
  if (isInitialized || Platform.OS === "web") return;
  
  try {
    const NotifModule = await import("expo-notifications");
    NotificationsModule = NotifModule.default;
    
    NotificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    
    isInitialized = true;
  } catch (error) {
    console.error("Failed to load expo-notifications:", error);
  }
};

export const notificationService = {
  /**
   * Initialize notification system
   */
  async init() {
    try {
      // Skip on web platform
      if (Platform.OS === "web") {
        return true;
      }

      await initializeNotifications();
      
      if (!NotificationsModule) {
        console.warn("Notifications module not available");
        return false;
      }

      const { status } = await NotificationsModule.requestPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Failed to initialize notifications:", error);
      return false;
    }
  },

  /**
   * Send a local notification
   */
  async sendNotification(notification: Omit<PushNotification, "id" | "timestamp" | "read">) {
    try {
      // Add to stored notifications
      const notifications = await this.getNotifications();
      const newNotification: PushNotification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
      };

      await AsyncStorage.setItem(
        NOTIFICATIONS_KEY,
        JSON.stringify([newNotification, ...notifications])
      );

      // Show local notification (skip on web)
      if (Platform.OS !== "web") {
        await initializeNotifications();
        
        if (NotificationsModule) {
          await NotificationsModule.scheduleNotificationAsync({
            content: {
              title: notification.title,
              body: notification.body,
              sound: true,
              badge: 1,
              data: notification.data || {},
            },
            trigger: null,
          });
        }
      }

      return newNotification;
    } catch (error) {
      console.error("Failed to send notification:", error);
      return null;
    }
  },

  /**
   * Get all stored notifications
   */
  async getNotifications(): Promise<PushNotification[]> {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Failed to get notifications:", error);
      return [];
    }
  },

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string) {
    try {
      const notifications = await this.getNotifications();
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  },

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string) {
    try {
      const notifications = await this.getNotifications();
      const filtered = notifications.filter((n) => n.id !== notificationId);
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  },

  /**
   * Clear all notifications
   */
  async clearAll() {
    try {
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify([]));
    } catch (error) {
      console.error("Failed to clear notifications:", error);
    }
  },

  /**
   * Get notification settings
   */
  async getSettings() {
    try {
      const data = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
      if (!data) {
        const defaults = {
          expiryReminders: true,
          mealReminders: true,
          enabled: true,
        };
        await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(defaults));
        return defaults;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to get notification settings:", error);
      return {
        expiryReminders: true,
        mealReminders: true,
        enabled: true,
      };
    }
  },

  /**
   * Update notification settings
   */
  async updateSettings(settings: {
    expiryReminders?: boolean;
    mealReminders?: boolean;
    enabled?: boolean;
  }) {
    try {
      const current = await this.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    } catch (error) {
      console.error("Failed to update notification settings:", error);
      return null;
    }
  },

  /**
   * Send expiry notification for fridge items
   */
  async sendExpiryNotification(itemName: string, daysUntilExpiry: number) {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.expiryReminders) return;

    const title =
      daysUntilExpiry < 0
        ? "Item Expired"
        : daysUntilExpiry <= 1
          ? "Item Expiring Soon"
          : "Expiry Reminder";
    const body =
      daysUntilExpiry < 0
        ? `${itemName} has expired`
        : daysUntilExpiry === 0
          ? `${itemName} expires today`
          : daysUntilExpiry === 1
            ? `${itemName} expires tomorrow`
            : `${itemName} expires in ${daysUntilExpiry} days`;

    return this.sendNotification({
      title,
      body,
      type: "expiry",
      data: { itemName },
    });
  },

  /**
   * Send meal reminder notification
   */
  async sendMealReminder(mealType: string, itemCount: number) {
    const settings = await this.getSettings();
    if (!settings.enabled || !settings.mealReminders) return;

    const timeMap: Record<string, string> = {
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snacks: "Snacks",
    };

    const mealName = timeMap[mealType] || mealType;
    const title = `${mealName} Time`;
    const body = `You have ${itemCount} item${itemCount !== 1 ? "s" : ""} for ${mealName}`;

    return this.sendNotification({
      title,
      body,
      type: "meal_reminder",
      data: { mealType, itemCount },
    });
  },
};
