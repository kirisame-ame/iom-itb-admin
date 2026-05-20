import { computed } from "vue";
import { useStore } from "vuex";
import { canAccess, hasAnyRole, hasRole } from "@/utils/permissions";

export function usePermissions() {
  const store = useStore();
  const roles = computed<string[]>(() => store.getters.currentRoles || []);
  const selectedRole = computed(() => store.getters["appSelector/selectedRole"] || null);
  const selectedRoleId = computed<string | null>(() => selectedRole.value?.id || null);

  return {
    roles,
    selectedRole,
    selectedRoleId,
    hasRole: (role: string) => hasRole(roles.value, role),
    hasSelectedRole: (role: string) => selectedRoleId.value === role,
    hasAnyRole: (allowedRoles?: string[]) => hasAnyRole(roles.value, allowedRoles),
    canAccess: (allowedRoles?: string[]) => canAccess(roles.value, allowedRoles),
  };
}
