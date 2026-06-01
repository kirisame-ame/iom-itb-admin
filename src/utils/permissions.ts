export const ROLES = {
  Admin: "admin",
  PengurusBidang1: "pengurus-bidang-1",
  Sekretariat: "sekretariat",
  Bendahara: "bendahara",
  PenulisKonten: "penulis-konten",
} as const;

export const ADMIN_FULL_ROLES = [
  ROLES.Admin,
  ROLES.PengurusBidang1,
];

export const ALL_ADMIN_WEB_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.Sekretariat,
  ROLES.Bendahara,
  ROLES.PenulisKonten,
];

export const DASHBOARD_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.Sekretariat,
  ROLES.Bendahara,
];

export const CONTENT_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.PenulisKonten,
];

export const SECRETARIAT_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.Sekretariat,
];

export const FINANCE_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.Bendahara,
];

export const COMMUNICATION_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.Sekretariat,
  ROLES.Bendahara,
];

export const KEMITRAAN_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.Sekretariat,
  ROLES.Bendahara,
];

export const BANTUAN_ROLES = ADMIN_FULL_ROLES;
export const DANA_BANTUAN_ROLES = FINANCE_ROLES;
export const SUBMISSION_ROLES = [
  ...ADMIN_FULL_ROLES,
  ROLES.Sekretariat,
];

export const ROLE_DASHBOARD_TITLES: Record<string, string> = {
  [ROLES.Admin]: "Dashboard Admin",
  [ROLES.PengurusBidang1]: "Dashboard Pengurus Bidang 1",
  [ROLES.Sekretariat]: "Dashboard Sekretariat",
  [ROLES.Bendahara]: "Dashboard Bendahara",
  [ROLES.PenulisKonten]: "Ruang Penulis Konten",
};

export const FINANCE_TEMPLATE_KEYS = new Set([
  "donation_payment_confirmation",
  "transaction_payment_confirmation",
  "donation_payment_whatsapp",
  "transaction_payment_whatsapp",
]);

const FINANCE_TEMPLATE_PATTERNS = [
  /donation/i,
  /donasi/i,
  /payment/i,
  /pembayaran/i,
  /transaction/i,
  /transaksi/i,
  /merchandise/i,
];

export const canAccess = (
  allowedRoles: string[] | undefined,
  selectedRoleId?: string | null,
): boolean => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!selectedRoleId) return false;
  return allowedRoles.includes(selectedRoleId);
};

export const canAccessTemplate = (
  template: { key?: string; title?: string; subject?: string | null },
  selectedRoleId?: string | null,
): boolean => {
  if (!selectedRoleId) return false;

  if (([
    ROLES.Admin,
    ROLES.PengurusBidang1,
    ROLES.Sekretariat,
  ] as string[]).includes(selectedRoleId)) {
    return true;
  }

  if (selectedRoleId !== ROLES.Bendahara) return false;
  if (template.key && FINANCE_TEMPLATE_KEYS.has(template.key)) return true;

  const haystack = [template.key, template.title, template.subject].filter(Boolean).join(" ");
  return FINANCE_TEMPLATE_PATTERNS.some((pattern) => pattern.test(haystack));
};
