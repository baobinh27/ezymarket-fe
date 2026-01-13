import { notificationService } from "@/services/notifications/notificationService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useNotificationSettings = () => {
  const queryClient = useQueryClient();

  const { data: settings = { enabled: true, expiryReminders: true, mealReminders: true }, isLoading } = useQuery({
    queryKey: ["notificationSettings"],
    queryFn: async () => {
      const result = await notificationService.getSettings();
      return typeof result === "string" ? JSON.parse(result) : result;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const updateSettings = useCallback(
    async (newSettings: { enabled?: boolean; expiryReminders?: boolean; mealReminders?: boolean }) => {
      await notificationService.updateSettings(newSettings);
      queryClient.invalidateQueries({ queryKey: ["notificationSettings"] });
    },
    [queryClient]
  );

  const toggleEnabled = useCallback(async () => {
    await updateSettings({ enabled: !settings.enabled });
  }, [settings.enabled, updateSettings]);

  const toggleExpiryReminders = useCallback(async () => {
    await updateSettings({ expiryReminders: !settings.expiryReminders });
  }, [settings.expiryReminders, updateSettings]);

  const toggleMealReminders = useCallback(async () => {
    await updateSettings({ mealReminders: !settings.mealReminders });
  }, [settings.mealReminders, updateSettings]);

  return {
    settings,
    isLoading,
    updateSettings,
    toggleEnabled,
    toggleExpiryReminders,
    toggleMealReminders,
  };
};

