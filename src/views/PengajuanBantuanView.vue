<template>
  <div class="min-h-screen">

    <div class="pb-4">
      <h1 class="text-3xl font-bold text-blue-900 tracking-tight">Pengajuan Bantuan</h1>
      <p class="text-sm text-slate-500 mt-2">Kelola dan tinjau semua pengajuan bantuan mahasiswa</p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-slate-100">
      <div class="flex flex-wrap items-center gap-3">

        <!-- Rows per page -->
        <div class="relative">
          <select
            v-model="limit"
            @change="() => { page = 1; getData() }"
            class="appearance-none pl-3 pr-8 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="100">Semua</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        <!-- Search -->
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
          <input
            v-model="search"
            @input="onSearchInput"
            placeholder="Cari..."
            class="pl-9 pr-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400"
          />
        </div>

        <!-- Status filter -->
        <div class="relative">
          <select
            v-model="statusFilter"
            @change="() => { page = 1; getData() }"
            class="appearance-none pl-3 pr-8 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          >
            <option value="">Semua Status</option>
            <option value="TIDAK_DIKETAHUI">Status Tidak Diketahui</option>
            <option value="VERIFIKASI_BERKAS">Verifikasi Berkas</option>
            <option value="DIPANGGIL_WAWANCARA">Dipanggil Wawancara</option>
            <option value="KEPUTUSAN_DITERIMA">Keputusan Diterima</option>
            <option value="KEPUTUSAN_DITOLAK">Keputusan Ditolak</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

        <!-- Sort -->
        <div class="relative">
          <select
            v-model="sortOrder"
            @change="() => { page = 1; getData() }"
            class="appearance-none pl-3 pr-8 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          >
            <option value="DESC">Terbaru</option>
            <option value="ASC">Terlama</option>
          </select>
          <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>

      </div>

      <a
        href="https://docs.google.com/spreadsheets/d/1fX-pGRaiVNo37gx5YdIWZ4DTpp_RyZ1kYmL2dSeaHQ8/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
        </svg>
        Lihat di Spreadsheet
      </a>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-4">
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-blue-900">
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider w-10 whitespace-nowrap">No</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider whitespace-nowrap">Tanggal Kirim</th>
              <th class="px-5 py-3.5 text-center text-xs font-semibold text-blue-100 uppercase tracking-wider whitespace-nowrap">Aksi</th>
              <th
                v-for="col in columns"
                :key="col"
                class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider whitespace-nowrap"
              >
                {{ col }}
              </th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr v-for="i in limit" :key="i" class="border-b border-slate-100">
                <td v-for="c in columns.length + 4" :key="c" class="px-5 py-4">
                  <div class="h-4 bg-slate-100 rounded animate-pulse w-full max-w-[120px]" />
                </td>
              </tr>
            </template>

            <template v-else-if="!computedData.length">
              <tr>
                <td :colspan="columns.length + 4" class="px-5 py-12 text-center text-sm text-slate-400 italic">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="(item, idx) in computedData"
                :key="item.id"
                class="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
              >
                <td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                  {{ pagination.start + idx }}.
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <StatusBadge :status="item.status" />
                </td>
                <td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">
                  {{ formatDate(item.submittedAt) }}
                </td>
                <td class="px-5 py-4 text-center whitespace-nowrap">
                  <button
                    @click="openDetail(item)"
                    class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-800 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                  >
                    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                    </svg>
                    Detail
                  </button>
                </td>
                <td
                  v-for="col in columns"
                  :key="col"
                  class="px-5 py-4 text-sm text-slate-700 max-w-[220px]"
                >
                  <a
                    v-if="isUrl(item.answersByLabel?.[col])"
                    :href="item.answersByLabel[col]"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 hover:underline whitespace-nowrap"
                  >
                    Lihat
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                  <div v-else class="max-h-24 overflow-y-auto break-words whitespace-pre-wrap pr-1 text-sm">{{ item.answersByLabel?.[col] ?? '' }}</div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100">
        <span class="text-xs text-slate-500">
          Menampilkan
          <span class="font-semibold text-slate-700">{{ pagination.start }}</span>
          -
          <span class="font-semibold text-slate-700">{{ pagination.end }}</span>
          dari
          <span class="font-semibold text-slate-700">{{ pagination.totalEntries }}</span>
          entri
        </span>

        <div class="flex items-center gap-2">
          <span class="text-xs text-slate-500">Halaman</span>
          <input
            type="number"
            :min="1"
            :max="pagination.totalPages || 1"
            :value="page"
            @change="e => jumpToPage((e.target as HTMLInputElement).value)"
            class="w-14 px-2 py-1.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <span class="text-xs text-slate-500">dari {{ pagination.totalPages || 1 }}</span>
        </div>

        <div class="flex gap-2">
          <button
            class="px-3.5 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            :disabled="pagination.currentPage <= 1"
            @click="() => { page = pagination.currentPage - 1; getData() }"
          >
            Sebelumnya
          </button>
          <button
            class="px-3.5 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            :disabled="pagination.currentPage >= pagination.totalPages"
            @click="() => { page = pagination.currentPage + 1; getData() }"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <DetailPengajuanModal
      v-model="detailOpen"
      :item="selectedItem"
      :loading="detailLoading"
      @saved="onSaved"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  GET_PENGAJUAN_BANTUAN,
  GET_PENGAJUAN_BANTUAN_BY_ID,
} from '@/store/pengajuanBantuan.module'
import type { PengajuanBantuan } from '@/store/pengajuanBantuan.module'
import StatusBadge from '@/components/StatusBadge.vue'
import DetailPengajuanModal from '@/components/modal/DetailPengajuan.vue'

const store = useStore()

const isLoading    = ref(true)
const page         = ref(1)
const limit        = ref(5)
const search       = ref('')
const statusFilter = ref('')
const sortOrder    = ref('DESC')

const computedData = computed(() => store.getters['pengajuanBantuan/pengajuanBantuanList'] ?? [])
const pagination   = computed(() => store.getters['pengajuanBantuan/pengajuanBantuanPagination'])

const columns = computed<string[]>(() => {
  const keys = new Set<string>()
  for (const item of computedData.value) {
    for (const k of Object.keys(item.answersByLabel ?? {})) {
      keys.add(k)
    }
  }
  return Array.from(keys)
})

let searchDebounce: ReturnType<typeof setTimeout> | null = null
function onSearchInput() {
  if (searchDebounce) clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    page.value = 1
    getData()
  }, 400)
}

const getData = async () => {
  isLoading.value = true
  await store.dispatch(`pengajuanBantuan/${GET_PENGAJUAN_BANTUAN}`, {
    search: search.value || undefined,
    limit: limit.value,
    page: page.value,
    status: statusFilter.value || undefined,
    sortOrder: sortOrder.value,
  })
  isLoading.value = false
}

function jumpToPage(val: string) {
  const n = parseInt(val, 10)
  const max = pagination.value.totalPages || 1
  if (!isNaN(n)) {
    page.value = Math.max(1, Math.min(n, max))
    getData()
  }
}

function isUrl(val?: string): boolean {
  return typeof val === 'string' && /^https?:\/\//.test(val)
}

function formatDate(iso?: string): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

onMounted(getData)

const detailOpen    = ref(false)
const detailLoading = ref(false)
const selectedItem  = computed<PengajuanBantuan | null>(
  () => store.getters['pengajuanBantuan/pengajuanBantuanDetail'],
)

const openDetail = async (item: PengajuanBantuan) => {
  detailOpen.value    = true
  detailLoading.value = true
  await store.dispatch(`pengajuanBantuan/${GET_PENGAJUAN_BANTUAN_BY_ID}`, item.tallySubmissionId)
  detailLoading.value = false
}

const onSaved = async () => {
  if (selectedItem.value) {
    detailLoading.value = true
    await store.dispatch(`pengajuanBantuan/${GET_PENGAJUAN_BANTUAN_BY_ID}`, selectedItem.value.tallySubmissionId)
    detailLoading.value = false
  }
  await getData()
}
</script>
