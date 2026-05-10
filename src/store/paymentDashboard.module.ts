import ApiService from "./api.service";
import { ActionContext } from "vuex";
import type {
  ApiActionParams,
  PaymentDashboardData,
  RootState,
} from "@/types/domain";

export const GET_PAYMENT_DASHBOARD = "getPaymentDashboard";
export const SET_PAYMENT_DASHBOARD = "setPaymentDashboard";

interface State {
  paymentDashboard: PaymentDashboardData;
}

const state: State = {
  paymentDashboard: {},
};

const getters = {
  paymentDashboard(state: State): PaymentDashboardData {
    return state.paymentDashboard;
  },
};

type VuexContext = ActionContext<State, RootState>;

const actions = {
  [GET_PAYMENT_DASHBOARD](context: VuexContext, params: ApiActionParams = {}): Promise<PaymentDashboardData> {
    return new Promise((resolve, reject) => {
      ApiService.get<PaymentDashboardData>("/dashboard/payments", params.data || {})
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
  [SET_PAYMENT_DASHBOARD](state: State, data: PaymentDashboardData): void {
    state.paymentDashboard = data || {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
