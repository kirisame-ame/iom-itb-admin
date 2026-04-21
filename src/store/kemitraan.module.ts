import ApiService from "./api.service";
import { ActionContext, ActionTree, GetterTree, MutationTree, Module } from "vuex";

// Action type constants
export const GET_KEMITRAAN = "getKemitraan";
export const SET_KEMITRAAN = "setKemitraan";
export const POST_KEMITRAAN = "postKemitraan";
export const PUT_KEMITRAAN = "putKemitraan";
export const DELETE_KEMITRAAN = "deleteKemitraan";

// Define the Kemitraan type
interface Kemitraan {
    id: number;
    name: string;
    type?: string;
    description?: string;
    logo?: string;
    file?: string;
    contactName?: string;
    contactEmail?: string;
    contactPhone?: string;
    website?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
    options?: Record<string, any>;
}

// Define the state type
interface State {
    kemitraan: Kemitraan[];
}

// Define initial state
const state: State = {
    kemitraan: [],
};

// Define getters
const getters: GetterTree<State, State> = {
    kemitraan(state): Kemitraan[] {
        return state.kemitraan;
    },
};

// Define the Vuex context type
type VuexContext = ActionContext<State, State>;

// Define actions
const actions: ActionTree<State, State> = {
    [GET_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<Kemitraan[]> {
        return new Promise((resolve, reject) => {
            ApiService.get<{ data: Kemitraan[] }>("/kemitraan", params?.data)
                .then(response => {
                    const { data } = response;
                    context.commit(SET_KEMITRAAN, data);
                    resolve(data);
                })
                .catch(err => {
                    console.error("Error fetching kemitraan:", err);
                    reject(err);
                });
        });
    },
    [POST_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<Kemitraan[]> {
        return new Promise((resolve, reject) => {
            ApiService.post<{ data: Kemitraan[] }>("/kemitraan", params.data)
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    [PUT_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<Kemitraan[]> {
        return new Promise((resolve, reject) => {
            ApiService.put<{ data: Kemitraan[] }>(`/kemitraan/${params.id}`, params.data)
                .then(({ data }) => {
                    resolve(data);
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
    [DELETE_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/kemitraan/${params.id}`)
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    reject(err);
                });
        });
    },
};

// Define mutations
const mutations: MutationTree<State> = {
    [SET_KEMITRAAN](state, data: Kemitraan[]): void {
        state.kemitraan = data;
    },
};

// Export the Vuex module
const kemitraan: Module<State, any> = {
    state,
    getters,
    actions,
    mutations,
};

export default kemitraan;
