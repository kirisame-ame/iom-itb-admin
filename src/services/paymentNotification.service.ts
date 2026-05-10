import ApiService from "@/store/api.service";
import type {
  MarkPaymentNotificationsReadResult,
  PaymentNotificationResult,
} from "@/types/notification";

export const fetchPaymentNotifications = (): Promise<PaymentNotificationResult> => {
  return ApiService.get<PaymentNotificationResult>("/notifications/payments");
};

export const markPaymentNotificationsRead = (): Promise<MarkPaymentNotificationsReadResult> => {
  return ApiService.post<MarkPaymentNotificationsReadResult>("/notifications/payments/read", {});
};

