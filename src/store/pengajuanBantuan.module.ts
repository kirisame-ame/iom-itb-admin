// store/pengajuanBantuan.module.ts
import type { Module } from 'vuex'

// ─── Types ────────────────────────────────────────────────────────────────────

export type StatusPengajuan = 'Menunggu' | 'Disetujui' | 'Ditolak' | 'Gagal'

export interface RiwayatItem {
  id: number
  waktu: string          // ISO string
  keterangan: string
  oleh: string           // nama / role yang mengubah
}

export interface PengajuanBantuan {
  id: number
  nim: string
  nama: string
  jenisBantuan: string
  alasanPengajuan: string
  filePengajuan: string  // URL / filename
  tanggalKirim: string   // ISO string
  status: StatusPengajuan
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

// ─── Action constants ──────────────────────────────────────────────────────────

export const GET_PENGAJUAN_BANTUAN    = 'GET_PENGAJUAN_BANTUAN'
export const GET_PENGAJUAN_BANTUAN_BY_ID = 'GET_PENGAJUAN_BANTUAN_BY_ID'
export const UPDATE_STATUS_PENGAJUAN  = 'UPDATE_STATUS_PENGAJUAN'

// ─── Mutation constants ────────────────────────────────────────────────────────

const SET_LIST       = 'SET_LIST'
const SET_PAGINATION = 'SET_PAGINATION'
const SET_LOADING    = 'SET_LOADING'
const SET_ERROR      = 'SET_ERROR'
const SET_DETAIL     = 'SET_DETAIL'
const SET_DETAIL_LOADING = 'SET_DETAIL_LOADING'

// ─── Module ───────────────────────────────────────────────────────────────────

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
    [SET_LIST](state, payload: PengajuanBantuan[]) {
      state.list = payload
    },
    [SET_PAGINATION](state, payload: PengajuanBantuanState['pagination']) {
      state.pagination = payload
    },
    [SET_LOADING](state, val: boolean) {
      state.loading = val
    },
    [SET_ERROR](state, msg: string | null) {
      state.error = msg
    },
    [SET_DETAIL](state, payload: PengajuanBantuan | null) {
      state.detail = payload
    },
    [SET_DETAIL_LOADING](state, val: boolean) {
      state.detailLoading = val
    },
  },

  actions: {
    // GET list dengan search, limit, page
    async [GET_PENGAJUAN_BANTUAN]({ commit }, params: { search?: string; limit?: number; page?: number } = {}) {
      commit(SET_LOADING, true)
      commit(SET_ERROR, null)
      try {
        // TODO: ganti dengan API call yang sesungguhnya
        // const res = await ApiService.get('/api/pengajuan-bantuan', { params })
        // const { data, pagination } = res.data

        // ── Placeholder data ──────────────────────────────────────────────
        const placeholder: PengajuanBantuan[] = [
          {
            id: 1, nim: '13523777', nama: 'Jonatan Levi',
            jenisBantuan: 'UKT', alasanPengajuan: 'Alasan placeholder...',
            filePengajuan: 'pengajuan.pdf', tanggalKirim: '2025-04-01T00:00:00.000Z',
            status: 'Menunggu',
            riwayat: [
              { id: 1, waktu: '2025-04-01T08:00:00.000Z', keterangan: 'Pengajuan terdaftar', oleh: 'Sistem' },
              { id: 2, waktu: '2025-04-01T08:05:00.000Z', keterangan: 'Status diubah menjadi Menunggu', oleh: 'Sistem' },
            ],
          },
          {
            id: 2, nim: '13521234', nama: 'Max Verstappen',
            jenisBantuan: 'Tugas Akhir', alasanPengajuan: 'Alasan placeholder...',
            filePengajuan: 'pengajuan_max.pdf', tanggalKirim: '2025-04-01T00:00:00.000Z',
            status: 'Menunggu', riwayat: [],
          },
          {
            id: 3, nim: '13520001', nama: 'Windy',
            jenisBantuan: 'Biaya Hidup', alasanPengajuan: 'Alasan placeholder...',
            filePengajuan: 'pengajuan_windy.pdf', tanggalKirim: '2025-04-01T00:00:00.000Z',
            status: 'Gagal', riwayat: [],
          },
        ]

        const page = params.page ?? 1
        const limit = params.limit ?? 10
        const search = (params.search ?? '').toLowerCase()
        const filtered = placeholder.filter(
          (p) => p.nama.toLowerCase().includes(search) || p.nim.includes(search),
        )
        const start = (page - 1) * limit
        const end = Math.min(start + limit, filtered.length)
        const data = filtered.slice(start, end)
        // ─────────────────────────────────────────────────────────────────

        commit(SET_LIST, data)
        commit(SET_PAGINATION, {
          currentPage: page,
          totalPages: Math.ceil(filtered.length / limit),
          totalEntries: filtered.length,
          start: filtered.length === 0 ? 0 : start + 1,
          end,
        })
      } catch (err: any) {
        commit(SET_ERROR, err?.message ?? 'Gagal memuat data')
      } finally {
        commit(SET_LOADING, false)
      }
    },

    // GET single by id
    async [GET_PENGAJUAN_BANTUAN_BY_ID]({ commit }, id: number) {
      commit(SET_DETAIL_LOADING, true)
      commit(SET_DETAIL, null)
      try {
        // TODO: const res = await ApiService.get(`/api/pengajuan-bantuan/${id}`)
        // commit(SET_DETAIL, res.data)

        // ── Placeholder ───────────────────────────────────────────────────
        await new Promise((r) => setTimeout(r, 400))
        const placeholder: PengajuanBantuan = {
          id,
          nim: '13523777',
          nama: 'Jonatan Levi',
          jenisBantuan: 'UKT',
          alasanPengajuan:
            'Alasan Saya mengajukan bantuan UKT adalah karena kondisi finansial keluarga yang sedang mengalami kesulitan pasca pandemi. Orang tua saya mengalami penurunan penghasilan yang signifikan sehingga tidak mampu membayar UKT secara penuh pada semester ini.',
          filePengajuan: 'pengajuan.pdf',
          tanggalKirim: '2026-04-01T00:00:00.000Z',
          status: 'Menunggu',
          riwayat: [
            { id: 1, waktu: '2026-04-01T08:00:00.000Z', keterangan: 'Pengajuan terdaftar', oleh: 'Sistem' },
            { id: 2, waktu: '2026-04-01T08:05:00.000Z', keterangan: 'Status diubah menjadi Menunggu', oleh: 'Sistem' },
          ],
        }
        commit(SET_DETAIL, placeholder)
        // ─────────────────────────────────────────────────────────────────
      } catch (err: any) {
        commit(SET_ERROR, err?.message ?? 'Gagal memuat detail')
      } finally {
        commit(SET_DETAIL_LOADING, false)
      }
    },

    // UPDATE status + keterangan
    async [UPDATE_STATUS_PENGAJUAN](
      { commit, dispatch },
      payload: { id: number; status: StatusPengajuan; keterangan: string },
    ) {
      try {
        // TODO: await ApiService.patch(`/api/pengajuan-bantuan/${payload.id}`, {
        //   status: payload.status,
        //   keterangan: payload.keterangan,
        // })

        // Placeholder: re-fetch detail after update
        await new Promise((r) => setTimeout(r, 500))
        await dispatch(GET_PENGAJUAN_BANTUAN_BY_ID, payload.id)
      } catch (err: any) {
        throw new Error(err?.message ?? 'Gagal memperbarui status')
      }
    },
  },
}

export default pengajuanBantuanModule