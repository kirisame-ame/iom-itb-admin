<template>
  <div class="min-h-screen font-inter">

    <!-- ── Page Header ─────────────────────────────────────────── -->
    <div class="px-8 pt-8 pb-4">
      <h1 class="text-2xl font-bold text-blue-900 tracking-tight">Pengajuan Bantuan</h1>
      <p class="text-sm text-slate-500 mt-0.5">Kelola dan tinjau semua pengajuan bantuan mahasiswa</p>
    </div>

    <!-- ── Table Card ──────────────────────────────────────────── -->
    <div class="mx-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      <!-- Toolbar -->
      <div class="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-100">
        <div class="flex items-center gap-3">
          <div class="relative">
            <select
              v-model="limit"
              @change="getData"
              class="appearance-none pl-3 pr-8 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            >
              <option :value="5">5 baris</option>
              <option :value="10">10 baris</option>
              <option :value="20">20 baris</option>
              <option :value="100">Semua</option>
            </select>
            <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>

          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            <input
              v-model="search"
              @input="getData"
              placeholder="Cari nama atau NIM..."
              class="pl-9 pr-4 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400"
            />
          </div>
        </div>

        <a
          href="https://docs.google.com/spreadsheets/d/1fX-pGRaiVNo37gx5YdIWZ4DTpp_RyZ1kYmL2dSeaHQ8/edit?usp=sharing"
          target="_blank"
          class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg hover:bg-emerald-500 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          </svg>
          Export Excel
        </a>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr class="bg-blue-900">
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider w-12">No</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider">Nama</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider">Jenis Bantuan</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider">Status</th>
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider">Last Update</th>
              <th class="px-5 py-3.5 text-center text-xs font-semibold text-blue-100 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="isLoading">
              <tr v-for="i in limit" :key="i" class="border-b border-slate-100">
                <td v-for="c in 6" :key="c" class="px-5 py-4">
                  <div class="h-4 bg-slate-100 rounded animate-pulse" :class="c === 1 ? 'w-6' : c === 6 ? 'w-20 mx-auto' : 'w-full max-w-[140px]'" />
                </td>
              </tr>
            </template>

            <template v-else-if="!computedData.length">
              <tr>
                <td colspan="6" class="px-5 py-12 text-center text-sm text-slate-400 italic">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="(item, index) in computedData"
                :key="item.id"
                class="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
              >
                <td class="px-5 py-4 text-sm text-slate-500">
                  {{ getRowNumber(Number(index)) }}.
                </td>
                <td class="px-5 py-4">
                  <p class="text-sm font-medium text-slate-800">{{ item.nama }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">{{ item.nim }}</p>
                </td>
                <td class="px-5 py-4 text-sm text-slate-700">{{ item.jenisBantuan }}</td>
                <td class="px-5 py-4">
                  <StatusBadge :status="item.status" />
                </td>
                <td class="px-5 py-4 text-sm text-slate-500">{{ formatDate(item.tanggalKirim) }}</td>
                <td class="px-5 py-4 text-center">
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
              </tr>
            </template>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <span class="text-xs text-slate-500">
          Showing
          <span class="font-semibold text-slate-700">{{ pagination.start }}</span>
          to
          <span class="font-semibold text-slate-700">{{ pagination.end }}</span>
          of
          <span class="font-semibold text-slate-700">{{ pagination.totalEntries }}</span>
          entries
        </span>
        <div class="flex gap-2">
          <button
            class="px-3.5 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            :disabled="page <= 1"
            @click="() => { page = pagination.currentPage - 1; getData() }"
          >
            ← Sebelumnya
          </button>
          <button
            class="px-3.5 py-1.5 text-sm font-medium rounded-lg border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            :disabled="page >= pagination.totalPages"
            @click="() => { page = pagination.currentPage + 1; getData() }"
          >
            Selanjutnya →
          </button>
        </div>
      </div>
    </div>

    <!-- ── Detail Modal ─────────────────────────────────────────── -->
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

// ─── table state ──────────────────────────────────────────────────────────────
const isLoading = ref(true)
const page      = ref(1)
const limit     = ref(10)
const search    = ref('')

const computedData = computed(() => store.getters['pengajuanBantuan/pengajuanBantuanList'] ?? [])
const pagination   = computed(() => store.getters['pengajuanBantuan/pengajuanBantuanPagination'])

const getData = async () => {
  isLoading.value = true
  await store.dispatch(`pengajuanBantuan/${GET_PENGAJUAN_BANTUAN}`, {
    search: search.value,
    limit: limit.value,
    page: page.value,
  })
  isLoading.value = false
}

const getRowNumber = (index: number): number => {
  return (Number(pagination.value.start) - 1) + Number(index) + 1
}

onMounted(getData)

// ─── detail modal state ───────────────────────────────────────────────────────
const detailOpen    = ref(false)
const detailLoading = ref(false)
const selectedItem  = computed<PengajuanBantuan | null>(
  () => store.getters['pengajuanBantuan/pengajuanBantuanDetail']
)

const openDetail = async (item: PengajuanBantuan) => {
  detailOpen.value    = true
  detailLoading.value = true
  await store.dispatch(`pengajuanBantuan/${GET_PENGAJUAN_BANTUAN_BY_ID}`, item.id)
  detailLoading.value = false
}

const onSaved = async () => {
  // re-fetch detail supaya riwayat perubahan terupdate
  if (selectedItem.value) {
    detailLoading.value = true
    await store.dispatch(`pengajuanBantuan/${GET_PENGAJUAN_BANTUAN_BY_ID}`, selectedItem.value.id)
    detailLoading.value = false
  }
  // refresh tabel juga kalau status berubah
  await getData()
}

// ─── utils ────────────────────────────────────────────────────────────────────
const formatDate = (iso?: string) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
.font-inter { font-family: 'Inter', sans-serif; }
</style>