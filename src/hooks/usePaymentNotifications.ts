import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import {
  fetchPaymentNotifications,
  markPaymentNotificationsRead,
} from "@/services/paymentNotification.service";
import type { ComputedRef, Ref } from "vue";
import type {
  PaymentNotificationItem,
  PaymentNotificationSummary,
  PaymentNotificationTone,
} from "@/types/notification";

const REFRESH_INTERVAL_MS = 60_000;

interface UsePaymentNotificationsReturn {
  isOpen: Ref<boolean>;
  isLoading: Ref<boolean>;
  errorMessage: Ref<string>;
  items: Ref<PaymentNotificationItem[]>;
  summary: Ref<PaymentNotificationSummary>;
  unreadCount: Ref<number>;
  badgeLabel: ComputedRef<string>;
  refresh: () => Promise<void>;
  toggle: () => void;
  close: () => void;
  markAsRead: () => Promise<void>;
  isUnread: (item: PaymentNotificationItem) => boolean;
  iconClass: (tone: PaymentNotificationTone) => string;
}

const notificationIconClasses: Record<PaymentNotificationTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  blue: "bg-blue-50 text-blue-700",
  amber: "bg-amber-50 text-amber-700",
};

export function usePaymentNotifications(): UsePaymentNotificationsReturn {
  const isOpen = ref(false);
  const isLoading = ref(false);
  const errorMessage = ref("");
  const items = ref<PaymentNotificationItem[]>([]);
  const unreadCount = ref(0);
  const summary = ref<PaymentNotificationSummary>({
    donationCount: 0,
    merchandiseCount: 0,
  });
  let timer: ReturnType<typeof setInterval> | null = null;

  const badgeLabel = computed(() => {
    const count = unreadCount.value;
    if (count === 0) return "";
    return count > 9 ? "9+" : String(count);
  });

  const refresh = async (): Promise<void> => {
    if (isLoading.value) return;

    isLoading.value = true;
    errorMessage.value = "";

    try {
      const result = await fetchPaymentNotifications();
      
      // If we are currently open, we might have optimistically marked as read.
      // So if the server returns unread items but we already marked them read locally
      // while the dropdown is open, we can force them to be read.
      if (isOpen.value && result.unreadCount > 0) {
        items.value = result.items.map(item => ({ ...item, read: true }));
        summary.value = result.summary;
        unreadCount.value = 0;
      } else {
        items.value = result.items;
        summary.value = result.summary;
        unreadCount.value = result.unreadCount;
      }
    } catch {
      errorMessage.value = "Notifikasi belum bisa dimuat. Coba muat ulang.";
    } finally {
      isLoading.value = false;
    }
  };

  const markAsRead = async (): Promise<void> => {
    if (unreadCount.value === 0) return;

    // Optimistic UI update
    unreadCount.value = 0;
    items.value = items.value.map((item) => ({ ...item, read: true }));

    try {
      const result = await markPaymentNotificationsRead();
      unreadCount.value = result.unreadCount;
    } catch {
      errorMessage.value = "Status baca notifikasi belum bisa disimpan.";
    }
  };

  const toggle = (): void => {
    isOpen.value = !isOpen.value;
    if (isOpen.value) {
      // Mark as read immediately for snappy UI
      if (unreadCount.value > 0) {
        markAsRead().finally(() => {
          refresh();
        });
      } else {
        refresh();
      }
    }
  };

  const close = (): void => {
    isOpen.value = false;
  };

  const isUnread = (item: PaymentNotificationItem): boolean => {
    return !item.read;
  };

  const iconClass = (tone: PaymentNotificationTone): string => notificationIconClasses[tone];

  onMounted(() => {
    refresh();
    timer = setInterval(refresh, REFRESH_INTERVAL_MS);
  });

  onBeforeUnmount(() => {
    if (timer) {
      clearInterval(timer);
    }
  });

  return {
    isOpen,
    isLoading,
    errorMessage,
    items,
    summary,
    unreadCount,
    badgeLabel,
    refresh,
    toggle,
    close,
    markAsRead,
    isUnread,
    iconClass,
  };
}
