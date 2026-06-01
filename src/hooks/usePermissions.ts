import { computed } from "vue";
import { useStore } from "vuex";
import { canAccess } from "@/utils/permissions";

export function usePermissions() {
  const store = useStore();

  const roles = computed<string[]>(() => store.getters.currentRoles || []);
  const selectedRole = computed(() => store.getters["appSelector/selectedRole"]);
  const selectedRoleId = computed<string | null>(() => selectedRole.value?.id || null);

  const hasRole = (role: string): boolean => roles.value.includes(role);
  const hasAnyRole = (allowedRoles: string[]): boolean =>
    allowedRoles.some((role) => roles.value.includes(role));
  const hasSelectedRole = (role: string): boolean => selectedRoleId.value === role;
  const canAccessWithSelectedRole = (allowedRoles?: string[]): boolean =>
    canAccess(allowedRoles, selectedRoleId.value);

  return {
    roles,
    selectedRole,
    selectedRoleId,
    hasRole,
    hasAnyRole,
    hasSelectedRole,
    canAccess: canAccessWithSelectedRole,
  };
}
