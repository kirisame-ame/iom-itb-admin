<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="kegiatan-kemitraan" />

    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId ? 'Edit' : 'Tambah'} Kegiatan Kemitraan`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div
      v-if="isImageModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60"
      @click="closeImageModal"
    >
      <img :src="selectedImage" alt="Gambar" class="max-w-full max-h-full rounded-md shadow-lg" />
    </div>

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">Program Mitra</p>
            <h1 class="text-2xl font-bold tracking-tight md:text-4xl">Kegiatan Kemitraan</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">Daftar kegiatan yang terhubung dengan mitra institusi.</p>
          </div>
        <button
          class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl"
          @click="openModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          Tambah Kegiatan
        </button>
      </div>
      </section>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex-1 min-w-[220px]">
            <label class="block mb-1 text-xs text-slate-500">Cari</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400 fill-current">
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                @input="onSearch"
                placeholder="Cari nama kegiatan..."
                class="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>

          <div class="min-w-[160px]">
            <label class="block mb-1 text-xs text-slate-500">Status</label>
            <select
              v-model="statusFilter"
              class="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Semua</option>
              <option value="planned">Planned</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Gambar</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Kegiatan</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Mitra</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Lokasi</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Periode</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Status</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-right text-blue-100 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td v-for="c in 7" :key="c" class="px-5 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="filteredData.length === 0">
                <td colspan="7" class="px-5 py-12 text-sm text-center text-slate-400 italic">Belum ada kegiatan.</td>
              </tr>
              <tr
                v-else
                v-for="(k, index) in filteredData"
                :key="k.id || index"
                class="transition-colors hover:bg-blue-50/40"
              >
                <td class="px-5 py-4 align-middle">
                  <img
                    v-if="k?.image"
                    :src="k.image"
                    alt="gambar"
                    class="w-12 h-12 object-cover rounded-xl border border-slate-200 cursor-pointer shadow-sm hover:opacity-80"
                    @click="openImageModal(k.image)"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center w-12 h-12 text-xs text-slate-400 bg-slate-100 border border-slate-200 rounded-xl"
                  >
                    —
                  </div>
                </td>
                <td class="px-5 py-4 align-middle">
                  <p class="font-semibold text-slate-900 whitespace-nowrap">{{ k?.name || '-' }}</p>
                  <p v-if="k?.description" class="max-w-xs mt-0.5 text-xs text-slate-500 truncate" :title="k.description">{{ k.description }}</p>
                </td>
                <td class="px-5 py-4 align-middle">
                  <span class="text-slate-700 whitespace-nowrap">{{ k?.kemitraan?.name || '-' }}</span>
                </td>
                <td class="px-5 py-4 text-slate-600 align-middle whitespace-nowrap">{{ k?.location || '-' }}</td>
                <td class="px-5 py-4 align-middle whitespace-nowrap">
                  <p class="text-slate-900">{{ formatDate(k?.startDate) }}</p>
                  <p class="text-xs text-slate-500">s/d {{ formatDate(k?.endDate) }}</p>
                </td>
                <td class="px-5 py-4 align-middle">
                  <span :class="statusClass(k?.status)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize">
                    {{ k?.status || '—' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right align-middle whitespace-nowrap">
                  <button class="mr-3 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100" @click="editItem(k)">Edit</button>
                  <button class="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100" @click="deleteItem(k.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <span class="text-xs text-slate-500">Total: {{ filteredData.length }} kegiatan</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  GET_KEGIATAN_KEMITRAAN,
  DELETE_KEGIATAN_KEMITRAAN,
} from '@/store/kegiatanKemitraan.module';
import ModalForm from '../components/modal/FormKegiatanKemitraan.vue';
import { useStore } from 'vuex';
import Breadcrumb from '../components/AppBreadcrumb.vue';
import { confirmDelete, errorAlert, successAlert } from '@/utils/swal';

const store = useStore();

const isOpened = ref(false);
const dataUpdate = ref<Record<string, any>>({});
const currentId = ref<string | undefined>(undefined);
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const searchQuery = ref('');
const statusFilter = ref('');
const isLoading = ref(true);

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

const computedData = computed<any[]>(() => {
  const list = store.getters.kegiatanKemitraan;
  return Array.isArray(list) ? list : list?.data || [];
});

const filteredData = computed(() =>
  computedData.value.filter((k) => !statusFilter.value || k?.status === statusFilter.value)
);

const getData = async () => {
  isLoading.value = true;
  try {
    await store.dispatch(GET_KEGIATAN_KEMITRAAN, {
      data: { limit: 100, search: searchQuery.value || undefined },
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

const statusClass = (status?: string) => {
  switch ((status || '').toLowerCase()) {
    case 'ongoing':
      return 'bg-blue-100 text-blue-700';
    case 'completed':
      return 'bg-green-100 text-green-700';
    case 'planned':
      return 'bg-yellow-100 text-yellow-700';
    case 'cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const editItem = (item: any) => {
  dataUpdate.value = { ...item };
  currentId.value = item.id;
  isOpened.value = true;
};

const deleteItem = async (id: number) => {
  const result = await confirmDelete();
  if (!result.isConfirmed) return;
  try {
    await store.dispatch(DELETE_KEGIATAN_KEMITRAAN, { id });
    await successAlert('Kegiatan telah dihapus.');
    await getData();
  } catch (err) {
    await errorAlert(err instanceof Error ? err.message : 'Gagal menghapus kegiatan.');
  }
};
</script>
