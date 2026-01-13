import { notificationService } from "@/services/notifications/notificationService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useNotifications = () => {
  const queryClient = useQueryClient();

  const {
    data: notifications = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationService.getNotifications(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const markAsRead = useCallback(
    async (notificationId: string) => {
      await notificationService.markAsRead(notificationId);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    [queryClient]
  );

  const deleteNotification = useCallback(
    async (notificationId: string) => {
      await notificationService.deleteNotification(notificationId);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    [queryClient]
  );

  const clearAll = useCallback(async () => {
    await notificationService.clearAll();
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
  }, [queryClient]);

  return {
    notifications: notifications.sort((a, b) => b.timestamp - a.timestamp),
    isLoading,
    refetch,
    markAsRead,
    deleteNotification,
    clearAll,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};
