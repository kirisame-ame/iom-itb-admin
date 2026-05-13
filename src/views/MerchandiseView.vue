<template>
  <div class="min-h-screen">
    <Breadcrumb :breadcrumb="title" />

    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId ? 'Edit' : 'Tambah'} ${title}`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div v-if="isManageOpened" class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
    <div v-if="isManageOpened" class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeManageModal">
      <div class="w-full max-w-[680px]" @click.stop>
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
          <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Kelola Merchandise</h3>
              <p class="mt-1 text-sm text-slate-500">Kelola kategori merchandise yang dipakai pada katalog produk.</p>
            </div>
            <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeManageModal">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 py-4">
            <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h4 class="text-sm font-bold text-slate-900">Kategori Merchandise</h4>
                <p class="mt-1 text-xs text-slate-500">Menghapus kategori akan mengosongkan kategori pada produk terkait. Produk tidak ikut dihapus.</p>
              </div>
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                :disabled="isLoadingCategories"
                @click="loadCategories"
              >
                Refresh
              </button>
            </div>

            <div class="mt-4">
              <div v-if="isLoadingCategories" class="space-y-2">
                <div v-for="i in 3" :key="i" class="h-11 w-full animate-pulse rounded-lg bg-slate-100"></div>
              </div>
              <p v-else-if="!categoryOptions.length" class="rounded-lg border border-dashed border-slate-200 px-4 py-3 text-sm text-slate-400">
                Belum ada kategori merchandise.
              </p>
              <div v-else class="overflow-hidden rounded-lg border border-slate-200">
                <div
                  v-for="category in categoryOptions"
                  :key="category"
                  class="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0"
                >
                  <span class="text-sm font-semibold text-slate-700">{{ category }}</span>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    :disabled="deletingCategory === category"
                    @click="deleteCategory(category)"
                  >
                    <IcTrash class="h-3.5 w-3.5" />
                    {{ deletingCategory === category ? 'Menghapus...' : 'Hapus' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end border-t border-slate-100 bg-slate-50 px-5 py-4">
            <button type="button" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100" @click="closeManageModal">
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold md:text-4xl">{{ title }}</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Kelola produk merchandise, stok, harga, dan tautan pembelian yang tampil pada halaman publik.
            </p>
          </div>
          <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <button
              class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/60 bg-transparent px-5 py-2.5 text-sm font-bold text-white transition-all hover:-translate-y-px hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
              @click="openManageModal"
            >
              Kelola Merchandise
            </button>
            <button
              class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
              @click="openModal"
            >
              <IcPlus />
              Tambah Merchandise
            </button>
          </div>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">Total Produk</p>
          <p class="mt-2 text-2xl font-bold text-blue-900">{{ pagination?.totalEntries || computedData.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">Stok Rendah</p>
          <p class="mt-2 text-2xl font-bold text-amber-700">{{ lowStockCount }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">Stok Habis</p>
          <p class="mt-2 text-2xl font-bold text-red-700">{{ emptyStockCount }}</p>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-[160px_1fr] lg:max-w-2xl lg:grid-cols-[160px_320px]">
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Per Halaman</label>
            <AppSelect
              v-model="limit"
              :options="pageLimitOptions"
              @change="() => { page = 1; getData() }"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Cari</label>
            <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              v-model="search"
              placeholder="Cari merchandise..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#8c8c94]/20"
              @input="onSearchInput"
            />
            </div>
          </div>
        </div>
      </section>

      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-blue-900">
                <th class="w-20 whitespace-nowrap px-5 py-3.5 text-left text-sm font-semibold text-blue-100">Gambar</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left">
                  <SortButton label="Produk" :active="sortPriority('name') > 0" :direction="sortDirectionFor('name')" :priority="sortPriority('name')" @click="toggleSort('name', $event)" />
                </th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left">
                  <SortButton label="Harga" :active="sortPriority('price') > 0" :direction="sortDirectionFor('price')" :priority="sortPriority('price')" @click="toggleSort('price', $event)" />
                </th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left">
                  <SortButton label="Stok" :active="sortPriority('stock') > 0" :direction="sortDirectionFor('stock')" :priority="sortPriority('stock')" @click="toggleSort('stock', $event)" />
                </th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left">
                  <SortButton label="Kategori" :active="sortPriority('kategori') > 0" :direction="sortDirectionFor('kategori')" :priority="sortPriority('kategori')" @click="toggleSort('kategori', $event)" />
                </th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-sm font-semibold text-blue-100">Deskripsi</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-sm font-semibold text-blue-100">Link</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left">
                  <SortButton label="Diperbarui" :active="sortPriority('updatedAt') > 0" :direction="sortDirectionFor('updatedAt')" :priority="sortPriority('updatedAt')" @click="toggleSort('updatedAt', $event)" />
                </th>
                <th class="whitespace-nowrap px-5 py-3.5 text-right text-sm font-semibold text-blue-100">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="isLoading">
                <tr v-for="i in limit" :key="i" class="border-b border-slate-100">
                  <td v-for="c in 9" :key="c" class="px-5 py-4">
                    <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                  </td>
                </tr>
              </template>

              <template v-else-if="!computedData.length">
                <tr>
                  <td colspan="9" class="px-5 py-12 text-center text-sm italic text-slate-400">
                    Tidak ada merchandise ditemukan.
                  </td>
                </tr>
              </template>

              <template v-else>
                <tr
                  v-for="u in computedData"
                  :key="u?.id"
                  class="border-b border-slate-100 transition-colors hover:bg-blue-50/40"
                >
                  <td class="px-5 py-4 align-middle">
                    <img
                      class="h-14 w-14 rounded-xl border border-slate-200 object-cover shadow-sm"
                      :src="u?.image || require('@/assets/image/default.png')"
                      :alt="u?.name || 'Merchandise'"
                    />
                  </td>
                  <td class="px-5 py-4 align-middle">
                    <p class="font-semibold text-slate-900 whitespace-nowrap">{{ u?.name || '-' }}</p>
                    <p class="mt-1 text-xs text-slate-400">Dibuat {{ formatDate(u?.createdAt) }}</p>
                  </td>
                  <td class="px-5 py-4 text-sm font-semibold text-blue-900 whitespace-nowrap align-middle">
                    {{ formattedPrice(u?.price) }}
                  </td>
                  <td class="px-5 py-4 align-middle">
                    <span :class="[stockBadgeClass(u?.stock), 'inline-flex rounded-full px-2.5 py-1 text-xs font-semibold']">
                      {{ u?.stock ?? 0 }} stok
                    </span>
                  </td>
                  <td class="px-5 py-4 align-middle">
                    <span class="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {{ u?.kategori || 'Tanpa kategori' }}
                    </span>
                  </td>
                  <td class="max-w-[260px] px-5 py-4 text-sm text-slate-600 align-middle">
                    <p class="max-h-10 overflow-hidden whitespace-pre-line" :title="u?.description || ''">{{ u?.description || '-' }}</p>
                  </td>
                  <td class="px-5 py-4 align-middle">
                    <a
                      v-if="u?.link"
                      :href="u.link"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      Lihat
                      <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <span v-else class="text-sm text-slate-400">-</span>
                  </td>
                  <td class="px-5 py-4 text-sm text-slate-500 whitespace-nowrap align-middle">
                    {{ formatDate(u?.updatedAt) }}
                  </td>
                  <td class="px-5 py-4 text-right align-middle whitespace-nowrap">
                    <button
                      class="mr-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                      @click.prevent="editItem(u)"
                    >
                      <IcEdit />
                      Edit
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                      @click.prevent="deleteItem(u.id)"
                    >
                      <IcTrash />
                      Hapus
                    </button>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
          <span class="text-xs text-slate-500">
            Menampilkan
            <span class="font-semibold text-slate-700">{{ pagination?.start || 0 }}</span>
            -
            <span class="font-semibold text-slate-700">{{ pagination?.end || 0 }}</span>
            dari
            <span class="font-semibold text-slate-700">{{ pagination?.totalEntries || 0 }}</span>
            entri
          </span>

          <div class="flex items-center gap-2">
            <button
              class="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page <= 1"
              @click="() => { page = pagination?.currentPage - 1; getData() }"
            >
              Sebelumnya
            </button>
            <span class="text-xs text-slate-500">Halaman {{ pagination?.currentPage || 1 }} dari {{ pagination?.totalPages || 1 }}</span>
            <button
              class="rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-600 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              :disabled="page >= pagination?.totalPages"
              @click="() => { page = pagination?.currentPage + 1; getData() }"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  GET_MERCHANDISES,
  DELETE_MERCHANDISE,
  GET_MERCHANDISE_CATEGORIES,
  DELETE_MERCHANDISE_CATEGORY,
} from "@/store/merchandise.module";
import ModalForm from "../components/modal/FormMerchandise.vue";
import { useStore } from 'vuex';
import Breadcrumb from '../components/AppBreadcrumb.vue';
import Swal from 'sweetalert2';
import { formattedPrice } from '@/utils';
import IcTrash from '@/assets/svg/ic-trash.vue';
import IcEdit from '@/assets/svg/ic-edit.vue';
import IcPlus from '@/assets/svg/ic-plus.vue';
import AppSelect from '@/components/input/AppSelect.vue';
import SortButton from '@/components/table/SortButton.vue';

type SortDirection = 'asc' | 'desc';
type MerchandiseSortKey = 'name' | 'price' | 'stock' | 'kategori' | 'updatedAt';
type SortRule = {
  key: MerchandiseSortKey;
  direction: SortDirection;
};

type MerchandiseItem = {
  id: number;
  name?: string;
  image?: string;
  price?: number | string;
  stock?: number | string;
  description?: string;
  link?: string;
  kategori?: string;
  createdAt?: string;
  updatedAt?: string;
};

const store = useStore();

const isOpened = ref(false); 
const isManageOpened = ref(false);
const isLoading = ref(true); 
const isLoadingCategories = ref(false);
const dataUpdate = ref<Partial<MerchandiseItem>>({}); 
const currentId = ref<string | undefined>(undefined); 
const page = ref(1);
const limit = ref(5);
const search = ref(""); 
const title = ref("Merchandise"); 
const sortRules = ref<SortRule[]>([{ key: 'updatedAt', direction: 'desc' }]);
const categoryOptions = ref<string[]>([]);
const deletingCategory = ref<string | null>(null);
let searchTimer: ReturnType<typeof setTimeout> | null = null;
const pageLimitOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 100, label: 'Semua' },
];

const openModal = () => {
  isOpened.value = true;
};

const openManageModal = async () => {
  isManageOpened.value = true;
  await loadCategories();
};

const closeManageModal = () => {
  isManageOpened.value = false;
};

const handleModalClose = async () => {
  isOpened.value = false;
  dataUpdate.value = {};
  currentId.value = undefined
  await getData();
};

const computedData = computed<MerchandiseItem[]>(() => {
  const merchandises = store.getters.merchandises;
  const items = merchandises?.data || [];
  return [...items].sort((a, b) => compareMerchandise(a, b, sortRules.value));
});

const pagination = computed(() => {
  const merchandises = store.getters.merchandises;
  return merchandises?.pagination || [];
});

const lowStockCount = computed(() => computedData.value.filter((item) => {
  const stock = Number(item?.stock || 0);
  return stock > 0 && stock <= 5;
}).length);
const emptyStockCount = computed(() => computedData.value.filter((item) => Number(item?.stock || 0) <= 0).length);

const normalizeText = (value: unknown) => String(value ?? '').toLowerCase();

const normalizeNumber = (value: unknown) => {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
};

const normalizeDate = (value: unknown) => {
  if (!value) return 0;
  const timestamp = new Date(String(value)).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const compareValue = (left: string | number, right: string | number) => {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), 'id', { numeric: true, sensitivity: 'base' });
};

const compareMerchandise = (
  left: MerchandiseItem,
  right: MerchandiseItem,
  rules: SortRule[],
) => {
  const getValue = (item: MerchandiseItem, key: MerchandiseSortKey) => {
    if (key === 'price' || key === 'stock') return normalizeNumber(item?.[key]);
    if (key === 'updatedAt') return normalizeDate(item?.updatedAt);
    return normalizeText(item?.[key]);
  };

  for (const rule of rules) {
    const result = compareValue(getValue(left, rule.key), getValue(right, rule.key));
    if (result !== 0) {
      return result * (rule.direction === 'asc' ? 1 : -1);
    }
  }

  return 0;
};

const defaultSortDirection = (key: MerchandiseSortKey): SortDirection =>
  key === 'name' || key === 'kategori' ? 'asc' : 'desc';

const sortPriority = (key: MerchandiseSortKey) => {
  const index = sortRules.value.findIndex((rule) => rule.key === key);
  return index === -1 ? 0 : index + 1;
};

const sortDirectionFor = (key: MerchandiseSortKey): SortDirection => {
  return sortRules.value.find((rule) => rule.key === key)?.direction || defaultSortDirection(key);
};

const toggleSort = (key: MerchandiseSortKey, event?: MouseEvent) => {
  const currentRule = sortRules.value.find((rule) => rule.key === key);
  const nextRule: SortRule = {
    key,
    direction: currentRule?.direction === 'asc' ? 'desc' : 'asc',
  };

  if (event?.shiftKey) {
    sortRules.value = currentRule
      ? sortRules.value.map((rule) => (rule.key === key ? nextRule : rule))
      : [...sortRules.value, { key, direction: defaultSortDirection(key) }];
    return;
  }

  sortRules.value = currentRule ? [nextRule] : [{ key, direction: defaultSortDirection(key) }];
};

const getData = async () => {
  isLoading.value = true;
  const params = {
    data:{
      search: search.value,
      limit: limit.value,
      page: page.value,
    } 
  };
  const data = await store.dispatch(GET_MERCHANDISES, params);
  isLoading.value = false;
  return data;
};

const loadCategories = async () => {
  isLoadingCategories.value = true;
  try {
    categoryOptions.value = await store.dispatch(GET_MERCHANDISE_CATEGORIES);
  } finally {
    isLoadingCategories.value = false;
  }
};

const onSearchInput = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    page.value = 1;
    getData();
  }, 350);
};

onMounted(async () => {
  await getData();
});

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';

  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };
  
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '-';

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const formattedDate = date.toLocaleDateString('en-US', options)
    .replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/g, (matched) => monthNames[new Date(`${matched} 1`).getMonth()]);

  return formattedDate.replace('AM', 'AM').replace('PM', 'PM');
};

const stockBadgeClass = (stock: number | string | undefined) => {
  const value = Number(stock || 0);
  if (value <= 0) return 'bg-red-100 text-red-700';
  if (value <= 5) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};

const editItem = (item: MerchandiseItem) => {
  dataUpdate.value = { ...item };
  currentId.value = String(item.id); 
  isOpened.value = true;
};

const deleteItem = async (id: number) => {
   await Swal.fire({
    title: 'Hapus merchandise?',
    text: "Data ini tidak bisa dikembalikan.",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
          if (result.isConfirmed) {
            const params = { id: id };
            try {
              await store.dispatch(DELETE_MERCHANDISE, params);
              Swal.fire({
                title: "Terhapus",
                text: "Merchandise telah dihapus.",
                icon: "success",
                confirmButtonColor: '#1e40af',
                confirmButtonText: "OK"
              }).then(async () => {
                await getData();
              });
            } catch (err) {
              Swal.fire({
                icon: "error",
                title: "Gagal",
                text: err instanceof Error ? err.message : "Gagal menghapus merchandise.",
                confirmButtonColor: '#1e40af',
              });
            }
          }
        });
};

const deleteCategory = async (category: string) => {
  const result = await Swal.fire({
    title: 'Hapus kategori merch?',
    text: `Kategori "${category}" akan dilepas dari semua produk yang memakainya. Produk tidak akan dihapus.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus kategori',
    cancelButtonText: 'Batal'
  });

  if (!result.isConfirmed) return;

  deletingCategory.value = category;
  try {
    await store.dispatch(DELETE_MERCHANDISE_CATEGORY, category);
    await Promise.all([getData(), loadCategories()]);
    Swal.fire({
      title: "Terhapus",
      text: "Kategori merchandise telah dihapus.",
      icon: "success",
      confirmButtonColor: '#1e40af',
      confirmButtonText: "OK"
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Gagal",
      text: err instanceof Error ? err.message : "Gagal menghapus kategori merchandise.",
      confirmButtonColor: '#1e40af',
    });
  } finally {
    deletingCategory.value = null;
  }
};
</script>
