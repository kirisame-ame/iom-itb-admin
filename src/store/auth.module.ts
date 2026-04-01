import ApiService from "./api.service";
import JwtService from "./jwt.service";
import { ActionContext } from "vuex";

// Action Types
export const POST_LOGIN = "postLogin";
export const FETCH_JWT = "fetchJwt";

// Mutation Types
export const SET_USER = "setUser";

// State Type
interface User {
  email?: string;
  shortName?: string;
}

interface State {
  isAuthenticated: boolean;
  user: User | null;
  userJson: Record<string, any>;
  sessionId: string | null | undefined;  // Allow undefined
}

// Initial State
const state: State = {
  isAuthenticated: !!JwtService.getToken(),
  user: {}, // Ensure it's a User object
  userJson: {},
  sessionId: JwtService.getSession() || null,
};

// Getters
const getters = {
  isAuthenticated(state: State): boolean {
    return state.isAuthenticated;
  },
  currentUser(state: State): User | null {
    return state.user;
  },
  currentSession(state: State): string | null {
    return state.sessionId ?? null;  // Convert undefined to null
  },
};

// Define Vuex Context Type
type VuexContext = ActionContext<State, any>;

// Actions
const actions = {
  [POST_LOGIN](context: VuexContext, params: Record<string, any>): Promise<any> {
    return new Promise((resolve, reject) => {
        ApiService.post<{ data: any }>("/auth/login", params.data)
            .then(({ data }) => {
                resolve(data);
            })
            .catch(err => {
                reject(err?.response?.data);
            });
    });
},


  [FETCH_JWT](context: VuexContext): Promise<any> {
    return new Promise((resolve, reject) => {
      ApiService.get<{ data: any }>("/auth/me")
        .then(({ data }) => { 
          context.commit(SET_USER, data);
          resolve(data);
        })
        .catch((err: any) => {
          reject(err);
        });
    });
  },
};

// Mutations
const mutations = {
  [SET_USER](state: State, data: User) {
    state.user = data;
  },
};

export default {
  state,
  actions,
  mutations,
  getters,
};
