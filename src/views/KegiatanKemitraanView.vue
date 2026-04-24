<template>
  <div>
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
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Kegiatan Kemitraan</h2>
          <p class="mt-0.5 text-sm text-gray-500">Daftar kegiatan yang terhubung dengan mitra institusi.</p>
        </div>
        <button
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          @click="openModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          Tambah Kegiatan
        </button>
      </div>

      <div class="p-3 bg-white border border-gray-200 rounded-md">
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex-1 min-w-[220px]">
            <label class="block mb-1 text-xs text-gray-500">Cari</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-2.5">
                <svg viewBox="0 0 24 24" class="w-4 h-4 text-gray-400 fill-current">
                  <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
                </svg>
              </span>
              <input
                v-model="searchQuery"
                @input="onSearch"
                placeholder="Cari nama kegiatan..."
                class="block w-full py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div class="min-w-[160px]">
            <label class="block mb-1 text-xs text-gray-500">Status</label>
            <select
              v-model="statusFilter"
              class="block w-full px-3 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
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

      <div class="overflow-hidden bg-white border border-gray-200 rounded-md">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Gambar</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Kegiatan</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Mitra</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Lokasi</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Periode</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Status</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-if="isLoading">
                <td colspan="7" class="px-4 py-6 text-sm text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="filteredData.length === 0">
                <td colspan="7" class="px-4 py-10 text-sm text-center text-gray-500">Belum ada kegiatan.</td>
              </tr>
              <tr
                v-else
                v-for="(k, index) in filteredData"
                :key="k.id || index"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="px-4 py-3 align-middle">
                  <img
                    v-if="k?.image"
                    :src="k.image"
                    alt="gambar"
                    class="w-10 h-10 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80"
                    @click="openImageModal(k.image)"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center w-10 h-10 text-xs text-gray-400 bg-gray-100 border border-gray-200 rounded"
                  >
                    —
                  </div>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="font-medium text-gray-900 whitespace-nowrap">{{ k?.name || '-' }}</p>
                  <p v-if="k?.description" class="max-w-xs mt-0.5 text-xs text-gray-500 truncate" :title="k.description">{{ k.description }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <span class="text-gray-700 whitespace-nowrap">{{ k?.kemitraan?.name || '-' }}</span>
                </td>
                <td class="px-4 py-3 text-gray-600 align-middle whitespace-nowrap">{{ k?.location || '-' }}</td>
                <td class="px-4 py-3 align-middle whitespace-nowrap">
                  <p class="text-gray-900">{{ formatDate(k?.startDate) }}</p>
                  <p class="text-xs text-gray-500">s/d {{ formatDate(k?.endDate) }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <span :class="statusClass(k?.status)" class="inline-block px-2 py-0.5 text-xs font-medium rounded-full capitalize">
                    {{ k?.status || '—' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right align-middle whitespace-nowrap">
                  <button class="mr-4 text-sm font-medium text-indigo-600 hover:underline" @click="editItem(k)">Edit</button>
                  <button class="text-sm font-medium text-red-600 hover:underline" @click="deleteItem(k.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span class="text-xs text-gray-500">Total: {{ filteredData.length }} kegiatan</span>
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
import { confirmDelete, successAlert } from '@/utils/swal';

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
    console.log(err);
  }
};
</script>
