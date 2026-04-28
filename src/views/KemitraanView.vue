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
            <p class="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">Relasi IOM ITB</p>
            <h1 class="text-2xl font-bold tracking-tight md:text-4xl">Kemitraan</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">Kelola mitra institusi, deskripsi kerja sama, dan dokumen MoU.</p>
          </div>
        <button
          class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl"
          @click="openModal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          Tambah Kemitraan
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
                placeholder="Cari nama mitra..."
                class="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Logo</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Nama Mitra</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Deskripsi</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">MoU</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Dibuat</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-right text-blue-100 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td v-for="c in 6" :key="c" class="px-5 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="6" class="px-5 py-12 text-sm text-center text-slate-400 italic">Belum ada data kemitraan.</td>
              </tr>
              <tr
                v-else
                v-for="(k, index) in computedData"
                :key="k.id || index"
                class="transition-colors hover:bg-blue-50/40"
              >
                <td class="px-5 py-4 align-middle">
                  <img
                    v-if="k?.image"
                    :src="k.image"
                    alt="logo"
                    class="w-12 h-12 object-cover rounded-xl border border-slate-200 cursor-pointer shadow-sm hover:opacity-80"
                    @click="openImageModal(k.image)"
                  />
                  <div
                    v-else
                    class="flex items-center justify-center w-12 h-12 text-xs font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-xl"
                  >
                    {{ initials(k?.name) }}
                  </div>
                </td>
                <td class="px-5 py-4 align-middle">
                  <p class="font-semibold text-slate-900 whitespace-nowrap">{{ k?.name || '-' }}</p>
                </td>
                <td class="px-5 py-4 align-middle max-w-md">
                  <p class="text-slate-600 truncate" :title="k?.description || ''">{{ k?.description || '-' }}</p>
                </td>
                <td class="px-5 py-4 align-middle">
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
                <td class="px-5 py-4 text-slate-500 align-middle whitespace-nowrap">{{ formatDate(k?.createdAt) }}</td>
                <td class="px-5 py-4 text-right align-middle whitespace-nowrap">
                  <button class="mr-3 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100" @click="editItem(k)">Edit</button>
                  <button class="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100" @click="deleteItem(k.id)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex items-center justify-between border-t border-slate-100 px-6 py-4">
          <span class="text-xs text-slate-500">Total: {{ computedData.length }} kemitraan</span>
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
