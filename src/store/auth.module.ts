import ApiService from "./api.service";
import { ActionContext } from "vuex";
import KeycloakService from "@/services/keycloak";

// Action Types
export const INIT_AUTH = "initAuth";
export const LOGIN = "login";
export const LOGOUT = "logout";
export const FETCH_JWT = "fetchJwt";

// Mutation Types
export const SET_USER = "setUser";
export const SET_AUTH = "setAuth";
export const SET_ROLES = "setRoles";
export const SET_APPS = "setApps";
export const SET_ERROR = "setError";

// State Type
interface User {
  sub?: string;
  email?: string;
  name?: string;
  preferredUsername?: string;
}

interface State {
  isAuthenticated: boolean;
  user: User | null;
  roles: string[];
  apps: Record<string, any>[];
  accessToken: string | null;
  error: string | null;
}

// Initial State
const state: State = {
  isAuthenticated: false,
  user: null,
  roles: [],
  apps: [],
  accessToken: null,
  error: null,
};

// Getters
const getters = {
  isAuthenticated(state: State): boolean {
    return state.isAuthenticated;
  },
  currentUser(state: State): User | null {
    return state.user;
  },
  currentRoles(state: State): string[] {
    return state.roles;
  },
  accessibleApps(state: State): Record<string, any>[] {
    return state.apps;
  },
};

// Define Vuex Context Type
type VuexContext = ActionContext<State, any>;

const extractResponseData = (response: Record<string, any>) => {
  if (!response) return null;
  return response.data ?? response;
};

// Actions
const actions = {
  async [INIT_AUTH](context: VuexContext): Promise<any> {
    const isAuthenticated = KeycloakService.isAuthenticated();
    const token = isAuthenticated ? await KeycloakService.getValidToken() : null;
    const parsed = KeycloakService.getParsedToken();

    context.commit(SET_AUTH, {
      isAuthenticated,
      accessToken: token,
    });

    if (!isAuthenticated || !parsed) {
      context.commit(SET_USER, null);
      context.commit(SET_ROLES, []);
      context.commit(SET_APPS, []);
      return null;
    }

    const roles = [
      ...(parsed.realm_access?.roles || []),
      ...Object.values(parsed.resource_access || {}).flatMap((entry: any) => entry?.roles || []),
    ];

    context.commit(SET_USER, {
      sub: parsed.sub,
      email: parsed.email,
      name: parsed.name,
      preferredUsername: parsed.preferred_username,
    });
    context.commit(SET_ROLES, [...new Set(roles)]);

    return parsed;
  },

  [LOGIN](): Promise<void> {
    return KeycloakService.login();
  },

  [LOGOUT](): Promise<void> {
    return KeycloakService.logout();
  },

  [FETCH_JWT](context: VuexContext): Promise<any> {
    return new Promise((resolve, reject) => {
      ApiService.get<{ data: any }>("/auth/me")
        .then((response: any) => {
          const payload = extractResponseData(response);
          const user = payload?.user || null;
          const roles = payload?.roles || [];
          const apps = payload?.apps || [];

          context.commit(SET_USER, user);
          context.commit(SET_ROLES, roles);
          context.commit(SET_APPS, apps);
          context.commit(SET_ERROR, null);
          context.commit(SET_AUTH, {
            isAuthenticated: true,
            accessToken: KeycloakService.getToken(),
          });

          resolve(payload);
        })
        .catch((err: any) => {
          context.commit(SET_ERROR, err?.response?.data?.message || err?.message || "Unauthorized");
          reject(err);
        });
    });
  },
};

// Mutations
const mutations = {
  [SET_USER](state: State, data: User | null) {
    state.user = data;
  },
  [SET_AUTH](state: State, payload: { isAuthenticated: boolean; accessToken: string | null }) {
    state.isAuthenticated = payload.isAuthenticated;
    state.accessToken = payload.accessToken;
  },
  [SET_ROLES](state: State, roles: string[]) {
    state.roles = roles;
  },
  [SET_APPS](state: State, apps: Record<string, any>[]) {
    state.apps = apps;
  },
  [SET_ERROR](state: State, message: string | null) {
    state.error = message;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
