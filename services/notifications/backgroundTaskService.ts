import { notificationService } from "@/services/notifications/notificationService";
import { Platform } from "react-native";

// Lazy load on native platforms
let TaskManager: any = null;
let BackgroundFetch: any = null;
let isInitialized = false;

const MEAL_REMINDER_TASK = "meal-reminder-task";

const initializeBackgroundModules = async () => {
  if (isInitialized || Platform.OS === "web") return;
  
  try {
    if (!TaskManager) {
      const TM = await import("expo-task-manager");
      TaskManager = TM.default;
    }
    if (!BackgroundFetch) {
      const BF = await import("expo-background-fetch");
      BackgroundFetch = BF.default;
    }

    // Define the task
    await TaskManager.defineTask(MEAL_REMINDER_TASK, async () => {
      try {
        const now = new Date();
        const hours = now.getHours();

        // Check if current time matches a reminder time
        const reminderHours = [8, 11, 18, 22]; // 8 AM, 11 AM, 6 PM, 10 PM
        if (reminderHours.includes(hours)) {
          // Determine meal type based on hour
          let mealType = "";
          switch (hours) {
            case 8:
              mealType = "breakfast";
              break;
            case 11:
              mealType = "lunch";
              break;
            case 18:
              mealType = "dinner";
              break;
            case 22:
              mealType = "snacks";
              break;
          }

          if (mealType) {
            // Send meal reminder
            await notificationService.sendMealReminder(mealType, 0);
          }
        }

        return BackgroundFetch.BackgroundFetchResult.NewData;
      } catch (error) {
        console.error("Meal reminder task failed:", error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });

    isInitialized = true;
  } catch (error) {
    console.error("Failed to load background modules:", error);
  }
};

export const backgroundTaskService = {
  /**
   * Register background fetch for meal reminders
   */
  async registerMealReminderTask() {
    try {
      // Skip on web platform
      if (Platform.OS === "web") {
        console.log("Background tasks not supported on web");
        return;
      }

      await initializeBackgroundModules();

      if (!BackgroundFetch) {
        console.warn("BackgroundFetch not available");
        return;
      }

      await BackgroundFetch.registerTaskAsync(MEAL_REMINDER_TASK, {
        minimumInterval: 60 * 10, // Check every 10 minutes
        stopOnTerminate: false,
        startOnBoot: true,
      });
      console.log("Meal reminder task registered");
    } catch (error) {
      console.error("Failed to register meal reminder task:", error);
    }
  },

  /**
   * Unregister background fetch task
   */
  async unregisterMealReminderTask() {
    try {
      if (Platform.OS === "web") {
        return;
      }

      await initializeBackgroundModules();

      if (!BackgroundFetch) {
        console.warn("BackgroundFetch not available");
        return;
      }

      await BackgroundFetch.unregisterTaskAsync(MEAL_REMINDER_TASK);
      console.log("Meal reminder task unregistered");
    } catch (error) {
      console.error("Failed to unregister meal reminder task:", error);
    }
  },

  /**
   * Check if background tasks are available
   */
  async isBackgroundTaskAvailable() {
    try {
      if (Platform.OS === "web") {
        return false;
      }

      await initializeBackgroundModules();

      if (!BackgroundFetch) {
        return false;
      }

      const status = await BackgroundFetch.getStatusAsync();
      return status === BackgroundFetch.BackgroundFetchStatus.Available;
    } catch (error) {
      console.error("Failed to check background task status:", error);
      return false;
    }
  },
};
