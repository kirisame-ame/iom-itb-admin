import { ActionContext } from "vuex";
import ApiService from "./api.service";

export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface App {
  id: string;
  name: string;
  description: string;
  url: string;           // URL tujuan setelah user pilih app + role
  color: string;         // warna aksen app
  colorLight: string;    // warna background light
  iconKey: string;       // key untuk icon (lihat AppSelectorView)
  roles: Role[];
}
export const FETCH_APPS = "fetchApps";
export const SET_SELECTED_APP = "setSelectedApp";
export const SET_SELECTED_ROLE = "setSelectedRole";
export const SET_APPS = "setApps";
export const SET_APPS_LOADING = "setAppsLoading";
export const SET_APPS_ERROR = "setAppsError";

const SELECTED_APP_STORAGE_KEY = "sso_selected_app";
const SELECTED_ROLE_STORAGE_KEY = "sso_selected_role";

const getStoredSelection = () => ({
  appId: window.localStorage.getItem(SELECTED_APP_STORAGE_KEY),
  roleId: window.localStorage.getItem(SELECTED_ROLE_STORAGE_KEY),
});

const persistSelection = (appId: string | null, roleId: string | null) => {
  if (appId) {
    window.localStorage.setItem(SELECTED_APP_STORAGE_KEY, appId);
  } else {
    window.localStorage.removeItem(SELECTED_APP_STORAGE_KEY);
  }

  if (roleId) {
    window.localStorage.setItem(SELECTED_ROLE_STORAGE_KEY, roleId);
  } else {
    window.localStorage.removeItem(SELECTED_ROLE_STORAGE_KEY);
  }
};

interface AppSelectorState {
  apps: App[];
  selectedApp: App | null;
  selectedRole: Role | null;
  loading: boolean;
  error: string | null;
}

const state: AppSelectorState = {
  apps: [],
  selectedApp: null,
  selectedRole: null,
  loading: false,
  error: null,
};

const getters = {
  allApps: (s: AppSelectorState) => s.apps,
  selectedApp: (s: AppSelectorState) => s.selectedApp,
  selectedRole: (s: AppSelectorState) => s.selectedRole,
  appsLoading: (s: AppSelectorState) => s.loading,
  appsError: (s: AppSelectorState) => s.error,
  canEnter: (s: AppSelectorState) => !!s.selectedApp && !!s.selectedRole,
};

type Ctx = ActionContext<AppSelectorState, any>;

const actions = {
  async [FETCH_APPS](context: Ctx) {
    context.commit(SET_APPS_LOADING, true);
    context.commit(SET_APPS_ERROR, null);
    try {
      const response: any = await ApiService.get("/auth/apps");
      const payload = response?.data || response;
      const apps = payload?.apps || [];

      context.commit(SET_APPS, apps);

      const { appId, roleId } = getStoredSelection();
      const selectedApp = appId ? apps.find((item: App) => item.id === appId) : null;

      if (selectedApp) {
        context.commit(SET_SELECTED_APP, selectedApp);
        const selectedRole = roleId ? selectedApp.roles.find((item: Role) => item.id === roleId) : null;

        if (selectedRole) {
          context.commit(SET_SELECTED_ROLE, selectedRole);
        } else if (selectedApp.roles.length === 1) {
          context.commit(SET_SELECTED_ROLE, selectedApp.roles[0]);
        }
      } else if (apps.length === 1) {
        context.commit(SET_SELECTED_APP, apps[0]);
        if (apps[0].roles.length === 1) {
          context.commit(SET_SELECTED_ROLE, apps[0].roles[0]);
        }
      }
    } catch (err: any) {
      context.commit(SET_APPS_ERROR, err?.message ?? "Gagal memuat daftar aplikasi");
    } finally {
      context.commit(SET_APPS_LOADING, false);
    }
  },

  [SET_SELECTED_APP](context: Ctx, app: App | null) {
    context.commit(SET_SELECTED_APP, app);
    if (app?.roles.length === 1) {
      context.commit(SET_SELECTED_ROLE, app.roles[0]);
      return;
    }

    context.commit(SET_SELECTED_ROLE, null);
  },

  [SET_SELECTED_ROLE](context: Ctx, role: Role | null) {
    context.commit(SET_SELECTED_ROLE, role);
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Mutations
// ─────────────────────────────────────────────────────────────────────────────
const mutations = {
  [SET_APPS](state: AppSelectorState, apps: App[]) {
    state.apps = apps;
  },
  [SET_SELECTED_APP](state: AppSelectorState, app: App | null) {
    state.selectedApp = app;
    persistSelection(app?.id || null, state.selectedRole?.id || null);
  },
  [SET_SELECTED_ROLE](state: AppSelectorState, role: Role | null) {
    state.selectedRole = role;
    persistSelection(state.selectedApp?.id || null, role?.id || null);
  },
  [SET_APPS_LOADING](state: AppSelectorState, val: boolean) {
    state.loading = val;
  },
  [SET_APPS_ERROR](state: AppSelectorState, msg: string | null) {
    state.error = msg;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};