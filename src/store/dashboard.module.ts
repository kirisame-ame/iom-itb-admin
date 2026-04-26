import type { Module } from 'vuex'
import ApiService from './api.service'

export const GET_DASHBOARD_STATS = 'GET_DASHBOARD_STATS'
export const GET_DASHBOARD_CHARTS = 'GET_DASHBOARD_CHARTS'
export const GET_DASHBOARD_RECENT = 'GET_DASHBOARD_RECENT'

const SET_STATS = 'SET_STATS'
const SET_CHARTS = 'SET_CHARTS'
const SET_RECENT = 'SET_RECENT'
const SET_LOADING = 'SET_LOADING'

export interface DashboardState {
  stats: any
  charts: any
  recent: any
  loading: boolean
}

const dashboardModule: Module<DashboardState, any> = {
  namespaced: true,

  state: (): DashboardState => ({
    stats: {},
    charts: {},
    recent: {
      submissions: [],
      logs: []
    },
    loading: false
  }),

  getters: {
    dashboardStats: (s) => s.stats,
    dashboardCharts: (s) => s.charts,
    dashboardRecent: (s) => s.recent,
    dashboardLoading: (s) => s.loading
  },

  mutations: {
    [SET_STATS](state, payload) {
      state.stats = payload
    },
    [SET_CHARTS](state, payload) {
      state.charts = payload
    },
    [SET_RECENT](state, payload) {
      state.recent = payload
    },
    [SET_LOADING](state, val: boolean) {
      state.loading = val
    }
  },

  actions: {
    async [GET_DASHBOARD_STATS]({ commit }) {
      commit(SET_LOADING, true)
      try {
        const res = await ApiService.get<any>('/dashboard/stats')
        commit(SET_STATS, res.data)
      } finally {
        commit(SET_LOADING, false)
      }
    },

    async [GET_DASHBOARD_CHARTS]({ commit }) {
      const res = await ApiService.get<any>('/dashboard/charts')
      commit(SET_CHARTS, res.data)
    },

    async [GET_DASHBOARD_RECENT]({ commit }) {
      const res = await ApiService.get<any>('/dashboard/recent')
      commit(SET_RECENT, res.data)
    }
  }
}

export default dashboardModule