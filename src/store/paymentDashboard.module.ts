import ApiService from "./api.service";
import { ActionContext } from "vuex";

export const GET_PAYMENT_DASHBOARD = "getPaymentDashboard";
export const SET_PAYMENT_DASHBOARD = "setPaymentDashboard";

interface State {
  paymentDashboard: Record<string, any>;
}

const state: State = {
  paymentDashboard: {},
};

const getters = {
  paymentDashboard(state: State): Record<string, any> {
    return state.paymentDashboard;
  },
};

type VuexContext = ActionContext<State, any>;

const actions = {
  [GET_PAYMENT_DASHBOARD](context: VuexContext, params: Record<string, any> = {}): Promise<any> {
    return new Promise((resolve, reject) => {
      ApiService.get<any>("/dashboard/payments", params.data)
        .then((response) => {
          context.commit(SET_PAYMENT_DASHBOARD, response);
          resolve(response);
        })
        .catch((err) => {
          console.error("Error fetching payment dashboard:", err);
          reject(err);
        });
    });
  },
};

const mutations = {
  [SET_PAYMENT_DASHBOARD](state: State, data: Record<string, any>): void {
    state.paymentDashboard = data || {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
