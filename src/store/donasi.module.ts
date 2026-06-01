import ApiService from "./api.service";
import { ActionContext } from "vuex";
import type {
    ApiActionParams,
    ApiDataResponse,
    Donation,
    DonationPayload,
    PaginatedData,
    RootState,
} from "@/types/domain";

export const GET_DONASI = "getDonasi";
export const SET_DONASI = "setDonasi";
export const POST_DONASI = "postDonasi";
export const PUT_DONASI = "putDonasi";
export const DELETE_DONASI = "deleteDonasi";

interface State {
    donasi: PaginatedData<Donation>;
}

const state: State = {
    donasi: { data: [] },
};

const getters = {
    donasi(state: State): PaginatedData<Donation> {
        return state.donasi;
    },
};

type VuexContext = ActionContext<State, RootState>;

const actions = {
    [GET_DONASI](context: VuexContext, params: ApiActionParams = {}): Promise<PaginatedData<Donation>> {
        return new Promise((resolve, reject) => {
            ApiService.get<PaginatedData<Donation>>("/donations/admin", params.data || {})
                .then(response => {
                    context.commit(SET_DONASI, response);
                    resolve(response);
                })
                .catch(err => {
                    console.error("Error fetching donasi:", err);
                    reject(err);
                });
        });
    },
    [POST_DONASI](_context: VuexContext, params: ApiActionParams<DonationPayload>): Promise<Donation> {
        return new Promise((resolve, reject) => {
            ApiService.post<ApiDataResponse<Donation>>("/donations", params.data || {})
                .then(({ data }) => resolve(data))
                .catch((err) => {
                    console.error("Error creating donation:", err);
                    reject(err);
                });
        });
    },
    [PUT_DONASI](_context: VuexContext, params: ApiActionParams<DonationPayload>): Promise<Donation> {
        return new Promise((resolve, reject) => {
            ApiService.put<ApiDataResponse<Donation>>(`/donations/${params.id}`, params.data || {})
                .then(({ data }) => resolve(data))
                .catch((err) => {
                    console.error("Error updating donation:", err);
                    reject(err);
                });
        });
    },
    [DELETE_DONASI](_context: VuexContext, params: ApiActionParams): Promise<void> {
        return new Promise((resolve, reject) => {
            ApiService.delete(`/donations/${params.id}`)
                .then(() => resolve())
                .catch((err) => {
                    console.error("Error deleting donation:", err);
                    reject(err);
                });
        });
    },
};

const mutations = {
    [SET_DONASI](state: State, data: PaginatedData<Donation>): void {
        state.donasi = data;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
