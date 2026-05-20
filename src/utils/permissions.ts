export const ROLES = {
  Admin: "admin",
  PengurusBidang1: "pengurus-bidang-1",
  PengurusBidang2: "pengurus-bidang-2",
  Mahasiswa: "mahasiswa",
  OrangTuaAsuh: "orang-tua-asuh",
  VolunteerPewawancara: "volunteer-pewawancara",
  Sekretariat: "sekretariat",
  Bendahara: "bendahara",
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES] | string;

export function uniqueRoles(roles: Array<string | null | undefined> = []): string[] {
  return [...new Set(roles.filter((role): role is string => !!role))];
}

export function hasAnyRole(userRoles: string[] = [], allowedRoles?: string[]): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.some((role) => userRoles.includes(role));
}

export function hasRole(userRoles: string[] = [], role: string): boolean {
  return userRoles.includes(role);
}

export function canAccess(userRoles: string[] = [], allowedRoles?: string[]): boolean {
  return hasAnyRole(uniqueRoles(userRoles), allowedRoles);
}
