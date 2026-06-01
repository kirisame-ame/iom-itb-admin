import ApiService from './api.service'
import type { Module } from 'vuex'

export const GET_PENDATAAN_ANGGOTA = 'GET_PENDATAAN_ANGGOTA'

interface TallySubmission {
  id: number
  tallySubmissionId: string
  submittedAt: string
  payload: { answersByLabel: Record<string, string>; [key: string]: any }
  extractedWhatsapp: string | null
  sourceType: string
}

interface Pagination {
  currentPage: number
  totalPages: number
  totalEntries: number
  perPage: number
  start: number
  end: number
}

interface State {
  list: TallySubmission[]
  pagination: Pagination
  loading: boolean
  error: string | null
}

const SET_LIST = 'SET_LIST'
const SET_PAGINATION = 'SET_PAGINATION'
const SET_LOADING = 'SET_LOADING'
const SET_ERROR = 'SET_ERROR'

const pendataanAnggotaModule: Module<State, any> = {
  namespaced: true,

  state: (): State => ({
    list: [],
    pagination: { currentPage: 1, totalPages: 1, totalEntries: 0, perPage: 10, start: 0, end: 0 },
    loading: false,
    error: null,
  }),

  getters: {
    pendataanAnggota: (s) => s.list,
    pendataanAnggotaPagination: (s) => s.pagination,
    pendataanAnggotaLoading: (s) => s.loading,
    pendataanAnggotaError: (s) => s.error,
  },

  mutations: {
    [SET_LIST](state, payload: TallySubmission[]) { state.list = payload },
    [SET_PAGINATION](state, payload: Pagination) { state.pagination = payload },
    [SET_LOADING](state, val: boolean) { state.loading = val },
    [SET_ERROR](state, msg: string | null) { state.error = msg },
  },

  actions: {
    async [GET_PENDATAAN_ANGGOTA](
      { commit },
      params: { search?: string; limit?: number; page?: number } = {},
    ) {
      commit(SET_LOADING, true)
      commit(SET_ERROR, null)
      try {
        const res = await ApiService.get<any>(
          '/tally-submissions/form/pendaftaran_anggota',
          params as any,
        )
        const { data, pagination } = res
        const p = pagination.currentPage
        const lim = pagination.perPage
        const total = pagination.totalEntries
        commit(SET_LIST, data ?? [])
        commit(SET_PAGINATION, {
          currentPage: p,
          totalPages: pagination.totalPages,
          totalEntries: total,
          perPage: lim,
          start: total === 0 ? 0 : (p - 1) * lim + 1,
          end: Math.min(p * lim, total),
        })
      } catch (err: any) {
        commit(SET_ERROR, err?.message ?? 'Gagal memuat data')
      } finally {
        commit(SET_LOADING, false)
      }
    },

  },
}

export default pendataanAnggotaModule
