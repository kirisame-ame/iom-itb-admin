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

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">
              Katalog IOM ITB
            </p>
            <h1 class="text-2xl font-bold tracking-tight md:text-4xl">{{ title }}</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Kelola produk merchandise, stok, harga, dan tautan pembelian yang tampil pada halaman publik.
            </p>
          </div>
          <button
            class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
            @click="openModal"
          >
            <IcPlus />
            Tambah Merchandise
          </button>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Produk</p>
          <p class="mt-2 text-2xl font-bold text-blue-900">{{ pagination?.totalEntries || computedData.length }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Stok Terlihat</p>
          <p class="mt-2 text-2xl font-bold text-blue-900">{{ totalStock }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Halaman</p>
          <p class="mt-2 text-2xl font-bold text-blue-900">{{ pagination?.currentPage || 1 }} / {{ pagination?.totalPages || 1 }}</p>
        </div>
      </section>

      <section class="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div class="grid w-full grid-cols-1 gap-3 sm:grid-cols-[auto,1fr] lg:w-auto lg:flex lg:flex-wrap lg:items-center">
          <div class="relative">
            <select
              v-model="limit"
              @change="() => { page = 1; getData() }"
              class="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option :value="5">5</option>
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="100">Semua</option>
            </select>
            <svg class="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              v-model="search"
              placeholder="Cari merchandise..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 lg:w-64"
              @input="onSearchInput"
            />
          </div>
        </div>

        <p class="text-xs text-slate-500">
          Menampilkan
          <span class="font-semibold text-slate-700">{{ pagination?.start || 0 }}</span>
          -
          <span class="font-semibold text-slate-700">{{ pagination?.end || 0 }}</span>
          dari
          <span class="font-semibold text-slate-700">{{ pagination?.totalEntries || 0 }}</span>
          entri
        </p>
      </section>

      <section class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="bg-blue-900">
                <th class="w-20 whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-100">Gambar</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-100">Produk</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-100">Harga</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-100">Stok</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-100">Deskripsi</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-100">Link</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-100">Diperbarui</th>
                <th class="whitespace-nowrap px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-blue-100">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <template v-if="isLoading">
                <tr v-for="i in limit" :key="i" class="border-b border-slate-100">
                  <td v-for="c in 8" :key="c" class="px-5 py-4">
                    <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                  </td>
                </tr>
              </template>

              <template v-else-if="!computedData.length">
                <tr>
                  <td colspan="8" class="px-5 py-12 text-center text-sm italic text-slate-400">
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
                      class="mr-3 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
                      @click.prevent="editItem(u)"
                    >
                      <IcEdit />
                      Edit
                    </button>
                    <button
                      type="button"
                      class="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
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
import { GET_MERCHANDISES, DELETE_MERCHANDISE } from "@/store/merchandise.module";
import ModalForm from "../components/modal/FormMerchandise.vue";
import { useStore } from 'vuex';
import Breadcrumb from '../components/AppBreadcrumb.vue';
import Swal from 'sweetalert2';
import { formattedPrice } from '@/utils';
import IcTrash from '@/assets/svg/ic-trash.vue';
import IcEdit from '@/assets/svg/ic-edit.vue';
import IcPlus from '@/assets/svg/ic-plus.vue';

type MerchandiseItem = {
  id: number;
  name?: string;
  image?: string;
  price?: number | string;
  stock?: number | string;
  description?: string;
  link?: string;
  createdAt?: string;
  updatedAt?: string;
};

const store = useStore();

const isOpened = ref(false); 
const isLoading = ref(true); 
const dataUpdate = ref<Partial<MerchandiseItem>>({}); 
const currentId = ref<string | undefined>(undefined); 
const page = ref(1);
const limit = ref(5);
const search = ref(""); 
const title = ref("Merchandise"); 
let searchTimer: ReturnType<typeof setTimeout> | null = null;

const openModal = () => {
  isOpened.value = true;
};

const handleModalClose = async () => {
  isOpened.value = false;
  dataUpdate.value = {};
  currentId.value = undefined
  await getData();
};

const computedData = computed<MerchandiseItem[]>(() => {
  const merchandises = store.getters.merchandises;
  return merchandises?.data || [];
});

const pagination = computed(() => {
  const merchandises = store.getters.merchandises;
  return merchandises?.pagination || [];
});

const totalStock = computed(() => {
  return computedData.value.reduce((total, item) => total + Number(item?.stock || 0), 0);
});

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
</script>
