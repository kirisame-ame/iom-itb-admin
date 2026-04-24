<template>
  <div>
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
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">Kemitraan</h2>
          <p class="mt-0.5 text-sm text-gray-500">Kelola mitra institusi, beserta deskripsi dan dokumen MoU.</p>
        </div>
        <button
          class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
          @click="openModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          Tambah Kemitraan
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
                placeholder="Cari nama mitra..."
                class="block w-full py-2 pl-8 pr-3 text-sm text-gray-700 placeholder-gray-400 bg-white border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden bg-white border border-gray-200 rounded-md">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Logo</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Nama Mitra</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Deskripsi</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">MoU</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">Dibuat</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
              <tr v-if="isLoading">
                <td colspan="6" class="px-4 py-6 text-sm text-center text-gray-500">Memuat data...</td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="6" class="px-4 py-10 text-sm text-center text-gray-500">Belum ada data kemitraan.</td>
              </tr>
              <tr
                v-else
                v-for="(k, index) in computedData"
                :key="k.id || index"
                class="transition-colors hover:bg-gray-50"
              >
                <td class="px-4 py-3 align-middle">
                  <img
                    v-if="k?.image"
                    :src="k.image"
                    alt="logo"
                    class="w-10 h-10 object-cover rounded border border-gray-200 cursor-pointer hover:opacity-80"
                    @click="openImageModal(k.image)"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center w-10 h-10 text-xs font-medium text-gray-400 bg-gray-100 border border-gray-200 rounded"
                  >
                    {{ initials(k?.name) }}
                  </div>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="font-medium text-gray-900 whitespace-nowrap">{{ k?.name || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle max-w-md">
                  <p class="text-gray-600 truncate" :title="k?.description || ''">{{ k?.description || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <a
                    v-if="k?.mou"
                    :href="k.mou"
                    target="_blank"
                    rel="noopener"
                    class="inline-flex items-center gap-1 text-indigo-600 hover:underline"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
                    </svg>
                    Lihat
                  </a>
                  <span v-else class="text-gray-400">—</span>
                </td>
                <td class="px-4 py-3 text-gray-500 align-middle whitespace-nowrap">{{ formatDate(k?.createdAt) }}</td>
                <td class="px-4 py-3 text-right align-middle whitespace-nowrap">
                  <button class="mr-4 text-sm font-medium text-indigo-600 hover:underline" @click="editItem(k)">Edit</button>
                  <button class="text-sm font-medium text-red-600 hover:underline" @click="deleteItem(k.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
          <span class="text-xs text-gray-500">Total: {{ computedData.length }} kemitraan</span>
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

const store = useStore();

const isOpened = ref(false);
const dataUpdate = ref<Record<string, any>>({});
const currentId = ref<string | undefined>(undefined);
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const searchQuery = ref('');
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
  const list = store.getters.kemitraan;
  if (Array.isArray(list)) return list;
  return list?.data || [];
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

const editItem = (item: any) => {
  dataUpdate.value = { ...item };
  currentId.value = item.id;
  isOpened.value = true;
};

const deleteItem = async (id: number) => {
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
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: err?.message || 'Gagal menghapus.' });
  }
};
</script>
