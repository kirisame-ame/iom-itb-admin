<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="kemitraan" />

    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId ? 'Edit' : 'Tambah'} Kemitraan`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
      @click="closeImageModal"
    >
      <img :src="selectedImage" alt="Logo" class="max-w-full max-h-full rounded-md shadow-lg" />
    </div>

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold md:text-4xl">Kemitraan</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">Kelola mitra institusi, kontak internal, deskripsi kerja sama, dan dokumen MoU.</p>
          </div>
          <button
            class="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl sm:w-auto"
            @click="openModal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
            Tambah Kemitraan
          </button>
        </div>
      </section>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 lg:grid-cols-3">
          <div class="lg:col-span-2">
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Cari</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400 fill-current">
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                @input="onSearch"
                placeholder="Cari nama mitra, PIC, atau nomor telepon..."
                class="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
          <div class="rounded-xl bg-slate-50 px-4 py-3">
            <p class="text-sm font-semibold text-slate-500">Kontak Internal</p>
            <p class="mt-1 text-sm text-slate-600">Nama dan telepon PIC dipakai untuk koordinasi admin.</p>
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div v-for="card in kpiCards" :key="card.title" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500">{{ card.title }}</p>
          <p class="mt-3 text-2xl font-bold text-slate-900">{{ card.value }}</p>
          <p class="mt-1 text-xs text-slate-500">{{ card.description }}</p>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 class="text-base font-bold text-slate-900">Daftar Kemitraan</h2>
            <p class="mt-1 text-xs text-slate-500">Informasi mitra dan dokumen kerja sama yang dikelola admin.</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Logo</th>
                <th class="px-4 py-3.5 text-left">
                  <SortButton label="Nama Mitra" :active="sortPriority('name') > 0" :direction="sortDirectionFor('name')" :priority="sortPriority('name')" @click="toggleSort('name', $event)" />
                </th>
                <th class="px-4 py-3.5 text-left">
                  <SortButton label="PIC" :active="sortPriority('picName') > 0" :direction="sortDirectionFor('picName')" :priority="sortPriority('picName')" @click="toggleSort('picName', $event)" />
                </th>
                <th class="px-4 py-3.5 text-left">
                  <SortButton label="Telepon PIC" :active="sortPriority('picPhone') > 0" :direction="sortDirectionFor('picPhone')" :priority="sortPriority('picPhone')" @click="toggleSort('picPhone', $event)" />
                </th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">Deskripsi</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100">MoU</th>
                <th class="px-4 py-3.5 text-left">
                  <SortButton label="Dibuat" :active="sortPriority('createdAt') > 0" :direction="sortDirectionFor('createdAt')" :priority="sortPriority('createdAt')" @click="toggleSort('createdAt', $event)" />
                </th>
                <th class="px-4 py-3.5 text-sm font-semibold text-right text-blue-100">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td v-for="c in 8" :key="c" class="px-4 py-3">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="8" class="px-5 py-12 text-sm text-center text-slate-400 italic">Belum ada data kemitraan.</td>
              </tr>
              <tr
                v-else
                v-for="(k, index) in computedData"
                :key="k.id || index"
                class="transition-colors hover:bg-blue-50/40"
              >
                <td class="px-4 py-3 align-middle">
                  <img
                    v-if="k?.image"
                    :src="k.image"
                    alt="logo"
                    class="w-10 h-10 object-cover rounded-lg border border-slate-200 cursor-pointer shadow-sm hover:opacity-80"
                    @click="openImageModal(k.image)"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center w-10 h-10 text-xs font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-lg"
                  >
                    {{ initials(k?.name) }}
                  </div>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="font-semibold text-slate-900 whitespace-nowrap">{{ k?.name || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="text-slate-700 whitespace-nowrap">{{ k?.picName || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="text-slate-700 whitespace-nowrap">{{ k?.picPhone || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle max-w-md">
                  <p class="text-slate-600 truncate" :title="k?.description || ''">{{ k?.description || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <a
                    v-if="k?.mou"
                    :href="k.mou"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                    </svg>
                    Lihat
                  </a>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-4 py-3 text-slate-500 align-middle whitespace-nowrap">{{ formatDate(k?.createdAt) }}</td>
                <td class="px-4 py-3 text-right align-middle whitespace-nowrap">
                  <button class="mr-2 rounded-lg bg-blue-50 px-2.5 py-1.5 text-sm font-semibold text-blue-700 hover:bg-blue-100" @click="editItem(k)">Edit</button>
                  <button class="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100" @click="deleteItem(k.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { GET_KEMITRAAN, DELETE_KEMITRAAN } from "@/store/kemitraan.module";
import ModalForm from "../components/modal/FormKemitraan.vue";
import { useStore } from 'vuex';
import Breadcrumb from '../components/AppBreadcrumb.vue';
import Swal from 'sweetalert2';
import type { ApiErrorResponse, EntityId, Kemitraan } from '@/types/domain';
import SortButton from '@/components/table/SortButton.vue';

type SortDirection = 'asc' | 'desc';
type KemitraanSortKey = 'name' | 'picName' | 'picPhone' | 'createdAt';
type SortRule = {
  key: KemitraanSortKey;
  direction: SortDirection;
};

const store = useStore();

const isOpened = ref(false);
const dataUpdate = ref<Partial<Kemitraan>>({});
const currentId = ref<EntityId | undefined>(undefined);
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const searchQuery = ref('');
const isLoading = ref(true);
const sortRules = ref<SortRule[]>([{ key: 'createdAt', direction: 'desc' }]);

const openModal = () => {
  dataUpdate.value = {};
  currentId.value = undefined;
  isOpened.value = true;
};

const handleModalClose = async () => {
  isOpened.value = false;
  dataUpdate.value = {};
  currentId.value = undefined;
  await getData();
};

const computedData = computed<Kemitraan[]>(() => {
  const list = store.getters.kemitraan;
  const items = Array.isArray(list) ? list : list?.data || [];
  return [...items].sort((a, b) => compareKemitraan(a, b, sortRules.value));
});

const kpiCards = computed(() => {
  const items = computedData.value;
  const withPic = items.filter((item) => item?.picName || item?.picPhone).length;
  const withMou = items.filter((item) => item?.mou).length;
  const withLogo = items.filter((item) => item?.image).length;

  return [
    {
      title: 'Total Mitra',
      value: String(items.length),
      description: 'Mitra yang tampil pada daftar',
    },
    {
      title: 'Kontak PIC',
      value: String(withPic),
      description: 'Mitra dengan kontak internal',
    },
    {
      title: 'Dokumen MoU',
      value: String(withMou),
      description: 'Mitra dengan dokumen kerja sama',
    },
    {
      title: 'Logo Mitra',
      value: String(withLogo),
      description: 'Mitra dengan logo terunggah',
    },
  ];
});

const getData = async () => {
  isLoading.value = true;
  try {
    await store.dispatch(GET_KEMITRAAN, {
      data: { limit: 50, search: searchQuery.value || undefined },
    });
  } finally {
    isLoading.value = false;
  }
};

let searchTimer: ReturnType<typeof setTimeout> | null = null;
const onSearch = () => {
  if (searchTimer) clearTimeout(searchTimer);
  searchTimer = setTimeout(getData, 350);
};

const normalizeText = (value: unknown) => String(value ?? '').toLowerCase();

const normalizeDate = (value: unknown) => {
  if (!value) return 0;
  const timestamp = new Date(String(value)).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const compareValue = (left: string | number, right: string | number) => {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), 'id', { numeric: true, sensitivity: 'base' });
};

const compareKemitraan = (
  left: Kemitraan,
  right: Kemitraan,
  rules: SortRule[],
) => {
  const getValue = (item: Kemitraan, key: KemitraanSortKey) => {
    if (key === 'createdAt') return normalizeDate(item?.createdAt);
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

const defaultSortDirection = (key: KemitraanSortKey): SortDirection =>
  key === 'createdAt' ? 'desc' : 'asc';

const sortPriority = (key: KemitraanSortKey) => {
  const index = sortRules.value.findIndex((rule) => rule.key === key);
  return index === -1 ? 0 : index + 1;
};

const sortDirectionFor = (key: KemitraanSortKey): SortDirection => {
  return sortRules.value.find((rule) => rule.key === key)?.direction || defaultSortDirection(key);
};

const toggleSort = (key: KemitraanSortKey, event?: MouseEvent) => {
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

onMounted(getData);

const openImageModal = (imageUrl: string) => {
  selectedImage.value = imageUrl;
  isImageModalOpen.value = true;
};
const closeImageModal = () => {
  isImageModalOpen.value = false;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  return `${String(date.getDate()).padStart(2, '0')} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

const initials = (name?: string) => {
  if (!name) return '—';
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

const editItem = (item: Kemitraan) => {
  dataUpdate.value = { ...item };
  currentId.value = item.id;
  isOpened.value = true;
};

const deleteItem = async (id: EntityId) => {
  const result = await Swal.fire({
    title: 'Hapus kemitraan?',
    text: 'Data ini tidak bisa dikembalikan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  });
  if (!result.isConfirmed) return;
  try {
    await store.dispatch(DELETE_KEMITRAAN, { id });
    await Swal.fire({
      title: 'Terhapus',
      text: 'Data kemitraan telah dihapus.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
    });
    await getData();
  } catch (err: unknown) {
    const apiError = err as ApiErrorResponse;
    Swal.fire({ icon: 'error', title: 'Gagal', text: apiError?.message || 'Gagal menghapus.' });
  }
};
</script>
