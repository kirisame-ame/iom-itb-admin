<template>
  <div class="min-h-screen">

    <div class="pb-4">
      <h1 class="text-3xl font-bold text-blue-900 tracking-tight">Pendataan Anggota</h1>
      <p class="text-sm text-slate-500 mt-2">Data pendaftaran anggota IOM ITB</p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center justify-between gap-3 py-4 border-b border-slate-100">
      <div class="flex flex-wrap items-center gap-3">
        <div class="relative">
          <select
            v-model="limit"
            @change="() => { page = 1; getData() }"
            class="appearance-none pl-3 pr-8 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="100">100</option>
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
            @input="onSearchInput"
            placeholder="Cari..."
            class="pl-9 pr-4 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg w-52 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all placeholder-slate-400"
          />
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
        href="https://docs.google.com/spreadsheets/d/1mVubMxL8uhQ8_Fk-9nLMivMKccCMpFiG1-gCDOkZuD4/edit?usp=sharing"
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
              <th class="px-5 py-3.5 text-left text-xs font-semibold text-blue-100 uppercase tracking-wider whitespace-nowrap">Tanggal Kirim</th>
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
                <td v-for="c in columns.length + 2" :key="c" class="px-5 py-4">
                  <div class="h-4 bg-slate-100 rounded animate-pulse w-full max-w-[140px]" />
                </td>
              </tr>
            </template>

            <template v-else-if="!rows.length">
              <tr>
                <td :colspan="columns.length + 2" class="px-5 py-12 text-center text-sm text-slate-400 italic">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            </template>

            <template v-else>
              <tr
                v-for="(row, idx) in rows"
                :key="row.id"
                class="border-b border-slate-100 hover:bg-blue-50/40 transition-colors"
              >
                <td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{{ pagination.start + idx }}.</td>
                <td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{{ formatDate(row.submittedAt) }}</td>
                <td
                  v-for="col in columns"
                  :key="col"
                  class="px-5 py-4 text-sm text-slate-700 max-w-[260px]"
                >
                  <a
                    v-if="isUrl(row.payload?.answersByLabel?.[col])"
                    :href="row.payload.answersByLabel[col]"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1 text-blue-600 hover:underline break-all"
                  >
                    Lihat
                    <svg class="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                    </svg>
                  </a>
                  <div v-else class="max-h-24 overflow-y-auto break-words whitespace-pre-wrap pr-1">{{ row.payload?.answersByLabel?.[col] ?? '' }}</div>
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

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { GET_PENDATAAN_ANGGOTA } from '@/store/pendataanAnggota.module'

const store = useStore()

const isLoading  = ref(true)
const page       = ref(1)
const limit      = ref(5)
const search     = ref('')
const sortOrder  = ref('DESC')

const rows       = computed(() => store.getters['pendataanAnggota/pendataanAnggota'] ?? [])
const pagination = computed(() => store.getters['pendataanAnggota/pendataanAnggotaPagination'])

const columns = computed<string[]>(() => {
  const keys = new Set<string>()
  for (const row of rows.value) {
    for (const k of Object.keys(row.payload?.answersByLabel ?? {})) {
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

function isUrl(val?: string): boolean {
  return typeof val === 'string' && /^https?:\/\//.test(val)
}

function formatDate(iso?: string): string {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

function jumpToPage(val: string) {
  const n = parseInt(val, 10)
  const max = pagination.value.totalPages || 1
  if (!isNaN(n)) {
    page.value = Math.max(1, Math.min(n, max))
    getData()
  }
}

const getData = async () => {
  isLoading.value = true
  await store.dispatch(`pendataanAnggota/${GET_PENDATAAN_ANGGOTA}`, {
    search: search.value || undefined,
    limit: limit.value,
    page: page.value,
    sortOrder: sortOrder.value,
  })
  isLoading.value = false
}

onMounted(getData)
</script>
