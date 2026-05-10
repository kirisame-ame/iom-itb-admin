export type PaymentNotificationKind = "donation-paid" | "merchandise-paid";
export type PaymentNotificationTone = "emerald" | "blue" | "amber";

export interface PaymentNotificationItem {
  id: string;
  kind: PaymentNotificationKind;
  tone: PaymentNotificationTone;
  title: string;
  subject: string;
  description: string;
  route: string;
  relativeTime: string;
  amountLabel?: string;
  timestamp?: string;
  read: boolean;
}

export interface PaymentNotificationSummary {
  donationCount: number;
  merchandiseCount: number;
}

export interface PaymentNotificationResult {
  items: PaymentNotificationItem[];
  summary: PaymentNotificationSummary;
  unreadCount: number;
  lastReadAt?: string;
}

export interface MarkPaymentNotificationsReadResult {
  unreadCount: number;
  lastReadAt: string;
}
