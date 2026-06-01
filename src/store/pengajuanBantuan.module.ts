import type { Module } from 'vuex'
import ApiService from './api.service'
import { STATUS_LABELS } from '@/utils/statusLabels'

export { STATUS_LABELS } from '@/utils/statusLabels'

export type StatusPengajuan =
  | 'VERIFIKASI_BERKAS'
  | 'DIPANGGIL_WAWANCARA'
  | 'KEPUTUSAN_DITERIMA'
  | 'KEPUTUSAN_DITOLAK'
  | 'TIDAK_DIKETAHUI'

const SYSTEM_ACTORS = new Set(['SYSTEM_API', 'SYSTEM_WEBHOOK', 'SYSTEM', 'SEEDER'])

export interface RiwayatItem {
  id: number
  waktu: string
  keterangan: string
  oleh: string
}

export interface PengajuanBantuan {
  id: number
  tallySubmissionId: string
  submittedAt: string
  answersByLabel: Record<string, string>
  status: StatusPengajuan
  catatan: string | null
  riwayat: RiwayatItem[]
}

export interface PengajuanBantuanState {
  list: PengajuanBantuan[]
  pagination: {
    currentPage: number
    totalPages: number
    totalEntries: number
    start: number
    end: number
  }
  loading: boolean
  error: string | null
  detail: PengajuanBantuan | null
  detailLoading: boolean
}

export const GET_PENGAJUAN_BANTUAN = 'GET_PENGAJUAN_BANTUAN'
export const GET_PENGAJUAN_BANTUAN_BY_ID = 'GET_PENGAJUAN_BANTUAN_BY_ID'
export const UPDATE_STATUS_PENGAJUAN = 'UPDATE_STATUS_PENGAJUAN'

const SET_LIST = 'SET_LIST'
const SET_PAGINATION = 'SET_PAGINATION'
const SET_LOADING = 'SET_LOADING'
const SET_ERROR = 'SET_ERROR'
const SET_DETAIL = 'SET_DETAIL'
const SET_DETAIL_LOADING = 'SET_DETAIL_LOADING'

function mapSubmission(raw: any): PengajuanBantuan {
  const answers: Record<string, string> = raw.payload?.answersByLabel ?? {}
  const history: any[] = raw.pengajuanStatusHistories ?? []

  const riwayat: RiwayatItem[] = history.map((h: any) => ({
    id: h.id,
    waktu: h.changedAt ?? h.createdAt,
    keterangan: h.newStatus
      ? `Status diubah menjadi ${STATUS_LABELS[h.newStatus] ?? h.newStatus}${h.newCatatan ? ': ' + h.newCatatan : ''}`
      : 'Dicatat',
    oleh: SYSTEM_ACTORS.has(h.changedBy) ? 'Sistem' : (h.changedBy ?? 'Sistem'),
  }))

  return {
    id: raw.id,
    tallySubmissionId: raw.tallySubmissionId,
    submittedAt: raw.submittedAt,
    answersByLabel: answers,
    status: (raw.pengajuanStatus?.currentStatus as StatusPengajuan) ?? 'TIDAK_DIKETAHUI',
    catatan: raw.pengajuanStatus?.catatan ?? null,
    riwayat,
  }
}

const pengajuanBantuanModule: Module<PengajuanBantuanState, any> = {
  namespaced: true,

  state: (): PengajuanBantuanState => ({
    list: [],
    pagination: { currentPage: 1, totalPages: 1, totalEntries: 0, start: 0, end: 0 },
    loading: false,
    error: null,
    detail: null,
    detailLoading: false,
  }),

  getters: {
    pengajuanBantuanList: (s) => s.list,
    pengajuanBantuanPagination: (s) => s.pagination,
    pengajuanBantuanLoading: (s) => s.loading,
    pengajuanBantuanError: (s) => s.error,
    pengajuanBantuanDetail: (s) => s.detail,
    pengajuanBantuanDetailLoading: (s) => s.detailLoading,
  },

  mutations: {
    [SET_LIST](state, payload: PengajuanBantuan[]) { state.list = payload },
    [SET_PAGINATION](state, payload: PengajuanBantuanState['pagination']) { state.pagination = payload },
    [SET_LOADING](state, val: boolean) { state.loading = val },
    [SET_ERROR](state, msg: string | null) { state.error = msg },
    [SET_DETAIL](state, payload: PengajuanBantuan | null) { state.detail = payload },
    [SET_DETAIL_LOADING](state, val: boolean) { state.detailLoading = val },
  },

  actions: {
    async [GET_PENGAJUAN_BANTUAN](
      { commit },
      params: { search?: string; limit?: number; page?: number; status?: string } = {},
    ) {
      commit(SET_LOADING, true)
      commit(SET_ERROR, null)
      try {
        const res = await ApiService.get<any>(
          '/tally-submissions/form/pengajuan_bantuan',
          params as any,
        )
        const { data, pagination } = res
        const p = pagination.currentPage
        const lim = pagination.perPage
        const total = pagination.totalEntries
        commit(SET_LIST, (data ?? []).map(mapSubmission))
        commit(SET_PAGINATION, {
          currentPage: p,
          totalPages: pagination.totalPages,
          totalEntries: total,
          start: total === 0 ? 0 : (p - 1) * lim + 1,
          end: Math.min(p * lim, total),
        })
      } catch (err: any) {
        commit(SET_ERROR, err?.message ?? 'Gagal memuat data')
      } finally {
        commit(SET_LOADING, false)
      }
    },

    async [GET_PENGAJUAN_BANTUAN_BY_ID]({ commit }, tallySubmissionId: string) {
      commit(SET_DETAIL_LOADING, true)
      commit(SET_DETAIL, null)
      try {
        const res = await ApiService.get<any>(
          `/tally-submissions/form/pengajuan_bantuan/${tallySubmissionId}`,
        )
        commit(SET_DETAIL, mapSubmission(res.data))
      } catch (err: any) {
        commit(SET_ERROR, err?.message ?? 'Gagal memuat detail')
      } finally {
        commit(SET_DETAIL_LOADING, false)
      }
    },

    async [UPDATE_STATUS_PENGAJUAN](
      { dispatch },
      payload: { tallySubmissionId: string; status: StatusPengajuan; keterangan: string },
    ) {
      await ApiService.patch(
        `/tally-submissions/pengajuan-bantuan/${payload.tallySubmissionId}/status`,
        { status: payload.status, catatan: payload.keterangan },
      )
      await dispatch(GET_PENGAJUAN_BANTUAN_BY_ID, payload.tallySubmissionId)
    },
  },
}

export default pengajuanBantuanModule
