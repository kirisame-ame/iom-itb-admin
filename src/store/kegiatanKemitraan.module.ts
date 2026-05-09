import ApiService from "./api.service";
import { ActionContext, ActionTree, GetterTree, MutationTree, Module } from "vuex";

export const GET_KEGIATAN_KEMITRAAN = "getKegiatanKemitraan";
export const SET_KEGIATAN_KEMITRAAN = "setKegiatanKemitraan";
export const POST_KEGIATAN_KEMITRAAN = "postKegiatanKemitraan";
export const PUT_KEGIATAN_KEMITRAAN = "putKegiatanKemitraan";
export const DELETE_KEGIATAN_KEMITRAAN = "deleteKegiatanKemitraan";

interface KegiatanKemitraan {
  id: number;
  kemitraanId?: number;
  name: string;
  description?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  image?: string;
  file?: string;
  status?: string;
  options?: Record<string, any>;
}

interface State {
  kegiatanKemitraan: KegiatanKemitraan[];
}

const state: State = {
  kegiatanKemitraan: [],
};

const getters: GetterTree<State, State> = {
  kegiatanKemitraan(state): KegiatanKemitraan[] {
    return state.kegiatanKemitraan;
  },
};

type VuexContext = ActionContext<State, State>;

const actions: ActionTree<State, State> = {
  [GET_KEGIATAN_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<KegiatanKemitraan[]> {
    return new Promise((resolve, reject) => {
      ApiService.get<{ data: KegiatanKemitraan[] }>("/kegiatan-kemitraan", params?.data)
        .then((response) => {
          const { data } = response;
          context.commit(SET_KEGIATAN_KEMITRAAN, data);
          resolve(data);
        })
        .catch((err) => {
          console.error("Error fetching kegiatan kemitraan:", err);
          reject(err);
        });
    });
  },
  [POST_KEGIATAN_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<KegiatanKemitraan[]> {
    return new Promise((resolve, reject) => {
      ApiService.post<{ data: KegiatanKemitraan[] }>("/kegiatan-kemitraan", params.data)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  [PUT_KEGIATAN_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<KegiatanKemitraan[]> {
    return new Promise((resolve, reject) => {
      ApiService.put<{ data: KegiatanKemitraan[] }>(`/kegiatan-kemitraan/${params.id}`, params.data)
        .then(({ data }) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  [DELETE_KEGIATAN_KEMITRAAN](context: VuexContext, params: Record<string, any>): Promise<void> {
    return new Promise((resolve, reject) => {
      ApiService.delete(`/kegiatan-kemitraan/${params.id}`)
        .then(() => {
          resolve();
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

const mutations: MutationTree<State> = {
  [SET_KEGIATAN_KEMITRAAN](state, data: KegiatanKemitraan[]): void {
    state.kegiatanKemitraan = data;
  },
};

const kegiatanKemitraan: Module<State, any> = {
  state,
  getters,
  actions,
  mutations,
};

export default kegiatanKemitraan;
