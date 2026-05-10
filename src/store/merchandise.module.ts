import ApiService from "./api.service";
import { ActionContext } from "vuex";
import type {
    ApiActionParams,
    ApiDataResponse,
    Merchandise,
    MerchandisePayload,
    PaginatedData,
    RootState,
} from "@/types/domain";

export type { Merchandise } from "@/types/domain";

export const GET_MERCHANDISES = "getMerchandises";
export const SET_MERCHANDISES = "setMerchandises";
export const POST_MERCHANDISE = "postMerchandise";
export const PUT_MERCHANDISE = "putMerchandise";
export const DELETE_MERCHANDISE = "deleteMerchandise";

// Definisikan tipe untuk state
interface State {
    merchandises: PaginatedData<Merchandise>;
}

// Definisikan state awal
const state: State = {
    merchandises: { data: [] },
};

// Definisikan getters
const getters = {
    merchandises(state: State): PaginatedData<Merchandise> {
        return state.merchandises; // Mengembalikan data merchandise
    },
};

// Definisikan tipe VuexContext
type VuexContext = ActionContext<State, RootState>;

const actions = {
    [GET_MERCHANDISES](context: VuexContext, params: ApiActionParams = {}): Promise<PaginatedData<Merchandise>> {
        return new Promise((resolve, reject) => {
            ApiService.get<PaginatedData<Merchandise>>("/merchandises", params.data || {})
                .then(response => {
                    context.commit(SET_MERCHANDISES, response);
                    resolve(response);
                })
                .catch(err => {
                    console.error("Error fetching jobs:", err);
                    reject(err);
                });
        });
    },
    [POST_MERCHANDISE](context: VuexContext, params: ApiActionParams<MerchandisePayload>): Promise<Merchandise>{
        return new Promise((resolve, reject) => {
          ApiService.post<ApiDataResponse<Merchandise>>("/merchandises", params.data || {})
            .then(async ({ data }) => {
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
    [PUT_MERCHANDISE](context: VuexContext, params: ApiActionParams<MerchandisePayload>): Promise<Merchandise>{
        return new Promise((resolve, reject) => {
          ApiService.put<ApiDataResponse<Merchandise>>(`/merchandises/${params.id}`, params.data || {})
            .then(async ({ data }) => {
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        });
      },
      [DELETE_MERCHANDISE](context: VuexContext, params: ApiActionParams): Promise<void> {
        return new Promise((resolve, reject) => {
          ApiService.delete(`/merchandises/${params.id}`)
            .then(() => resolve())
            .catch((err) => reject(err));
        });
      },
};

const mutations = {
    [SET_MERCHANDISES](state: State, data: PaginatedData<Merchandise>): void {
        state.merchandises = data; // Pastikan data yang dikirim sesuai dengan format yang diharapkan
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
