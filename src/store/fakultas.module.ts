import ApiService from "./api.service";
import { ActionContext } from "vuex";
import type {
    ApiActionParams,
    ApiDataResponse,
    Fakultas,
    FakultasPayload,
    RootState,
} from "@/types/domain";

export type { Fakultas } from "@/types/domain";

export const GET_FAKULTAS = "getFakultas";
export const SET_FAKULTAS = "setFakultas";
export const POST_FAKULTAS = "postFakultas";
export const PUT_FAKULTAS = "putFakultas";
export const DELETE_FAKULTAS = "deleteFakultas";

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

type VuexContext = ActionContext<State, RootState>;

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
    [POST_FAKULTAS](_context: VuexContext, params: ApiActionParams<FakultasPayload>): Promise<Fakultas> {
        return new Promise((resolve, reject) => {
            ApiService.post<ApiDataResponse<Fakultas>>("/faculties", params.data || {})
                .then(({ data }) => resolve(data))
                .catch((err) => reject(err));
        });
    },
    [PUT_FAKULTAS](_context: VuexContext, params: ApiActionParams<Partial<FakultasPayload>>): Promise<Fakultas> {
        return new Promise((resolve, reject) => {
            ApiService.put<ApiDataResponse<Fakultas>>(`/faculties/${params.id}`, params.data || {})
                .then(({ data }) => resolve(data))
                .catch((err) => reject(err));
        });
    },
    [DELETE_FAKULTAS](_context: VuexContext, params: ApiActionParams): Promise<void> {
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
