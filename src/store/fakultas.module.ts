import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_FAKULTAS = "getFakultas";
export const SET_FAKULTAS = "setFakultas";
export const POST_FAKULTAS = "postFakultas";
export const PUT_FAKULTAS = "putFakultas";
export const DELETE_FAKULTAS = "deleteFakultas";

export interface Fakultas {
    id: number;
    name: string;
    kodeUnik: string;
    isActive: boolean;
}

interface State {
    fakultas: Fakultas[];
}

const state: State = {
    fakultas: [],
};

const getters = {
    fakultas(state: State): Fakultas[] {
        return state.fakultas;
    },
};

type VuexContext = ActionContext<State, any>;

const actions = {
    [GET_FAKULTAS](context: VuexContext): Promise<Fakultas[]> {
        return new Promise((resolve, reject) => {
            ApiService.get<{ data: Fakultas[] }>("/faculties")
                .then((response) => {
                    const list = response?.data || [];
                    context.commit(SET_FAKULTAS, list);
                    resolve(list);
                })
                .catch((err) => reject(err));
        });
    },
    [POST_FAKULTAS](_context: VuexContext, params: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            ApiService.post<{ data: any }>("/faculties", params.data)
                .then(({ data }) => resolve(data))
                .catch((err) => reject(err));
        });
    },
    [PUT_FAKULTAS](_context: VuexContext, params: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            ApiService.put<{ data: any }>(`/faculties/${params.id}`, params.data)
                .then(({ data }) => resolve(data))
                .catch((err) => reject(err));
        });
    },
    [DELETE_FAKULTAS](_context: VuexContext, params: Record<string, any>): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/faculties/${params.id}`)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    },
};

const mutations = {
    [SET_FAKULTAS](state: State, data: Fakultas[]): void {
        state.fakultas = data;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
