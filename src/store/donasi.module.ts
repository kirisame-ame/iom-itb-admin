import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_DONASI = "getDonasi";
export const SET_DONASI = "setDonasi";
export const POST_DONASI = "postDonasi";
export const PUT_DONASI = "putDonasi";
export const DELETE_DONASI = "deleteDonasi";

interface Donasi {
    id: number;
    name: string;
    email: string;
    noWhatsapp: string;
    amount?: number;
    grossAmount?: number;
    donationType?: string;
    facultyId?: number | null;
    faculty?: { id: number; name: string; kodeUnik: string } | null;
    kodeUnik?: string | null;
    paymentMethod?: "manual" | "midtrans";
    paymentStatus?: "pending" | "settlement" | "expired" | "failed" | "refunded";
    proof?: string;
    date?: string;
    createdAt?: string;
}

interface State {
    donasi: { data: Donasi[]; pagination?: any } | any;
}

const state: State = {
    donasi: { data: [] },
};

const getters = {
    donasi(state: State): any {
        return state.donasi;
    },
};

type VuexContext = ActionContext<State, any>;

const actions = {
    [GET_DONASI](context: VuexContext, params: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            ApiService.get<{ data: Donasi[] }>("/donations/admin", params.data)
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
    [POST_DONASI](_context: VuexContext, params: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            ApiService.post<{ data: any }>("/donations", params.data)
                .then(({ data }) => resolve(data))
                .catch((err) => {
                    console.error("Error creating donation:", err);
                    reject(err);
                });
        });
    },
    [PUT_DONASI](_context: VuexContext, params: Record<string, any>): Promise<any> {
        return new Promise((resolve, reject) => {
            ApiService.put<{ data: any }>(`/donations/${params.id}`, params.data)
                .then(({ data }) => resolve(data))
                .catch((err) => {
                    console.error("Error updating donation:", err);
                    reject(err);
                });
        });
    },
    [DELETE_DONASI](_context: VuexContext, params: Record<string, any>): Promise<void> {
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
    [SET_DONASI](state: State, data: any): void {
        state.donasi = data;
    },
};

export default {
    state,
    getters,
    actions,
    mutations,
};
