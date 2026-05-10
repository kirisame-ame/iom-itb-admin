<template>
  <div class="min-h-screen">
    <Breadcrumb :breadcrumb="title" />

    <!-- Modal -->
    <ModalForm
      v-if="isOpened"
      :id="currentId"
      :title="`${currentId? 'Edit' : 'Tambah'} ${title}`"
      :data="dataUpdate"
      @close="handleModalClose"
    />

    <div v-if="isImageModalOpen" @click="closeImageModal" class="fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-6">
      <img :src="selectedImage" alt="Payment Image" class="max-w-full max-h-full rounded-lg shadow-xl"/>
    </div>

    <div class="mt-8 space-y-5">
      <!-- ── Page Header ─────────────────────────────────────────── -->
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold md:text-4xl">{{ title }}</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Kelola pencatatan penyaluran dana bantuan kepada mahasiswa penerima manfaat.
            </p>
          </div>
          <button
            class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto"
            @click="openModal"
          >
            <IcPlus class="w-4 h-4"/>
            Tambah {{ title }}
          </button>
        </div>
      </section>

      <!-- ── Filter Card ─────────────────────────────────────────── -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Per halaman</label>
            <AppSelect
              v-model="limit"
              :options="pageLimitOptions"
              @change="() => { page = 1; getData() }"
            />
          </div>

          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Cari Penerima</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="search"
                @input="() => { page = 1; getData() }"
                placeholder="Nama atau NIM..."
                class="block w-full rounded-lg border border-slate-200 bg-white px-10 py-2 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- ── Table Card ─────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 class="text-base font-bold text-slate-900">Daftar {{ title }}</h2>
            <p class="mt-1 text-xs text-slate-500">Menampilkan histori penyaluran dana bantuan.</p>
          </div>
          <span class="text-xs text-slate-500">Halaman {{ pagination?.currentPage || page }} dari {{ pagination?.totalPages || 1 }}</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">No</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">Penerima</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">NIM / Prodi</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">Jenis Bantuan</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">Periode</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-right text-blue-100 uppercase tracking-wider">Nominal</th>
                <th class="px-6 py-3.5 text-sm font-semibold text-center text-blue-100 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-100">
              <tr v-if="isLoading">
                <td colspan="7" class="px-6 py-10 text-center">
                  <div class="flex flex-col items-center justify-center gap-2">
                    <div class="h-6 w-6 animate-spin rounded-full border-2 border-[#003793] border-t-transparent"></div>
                    <p class="text-sm font-medium text-slate-500">Memuat data...</p>
                  </div>
                </td>
              </tr>
              <tr v-else-if="computedData.length === 0">
                <td colspan="7" class="px-6 py-12 text-sm text-center text-slate-400 italic">
                  Belum ada data {{ title.toLowerCase() }}.
                </td>
              </tr>
              <tr v-else v-for="(u, index) in computedData" :key="u.id || index" class="transition-colors hover:bg-blue-50/40">
                <td class="px-4 py-3 text-slate-500 align-middle">{{ ((pagination?.currentPage - 1) * limit) + (index + 1) }}</td>
                <td class="px-4 py-3 align-middle">
                  <p class="font-bold text-slate-900">{{ u?.penerima?.nama || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="text-sm text-slate-600 font-medium">{{ u?.penerima?.nim || '-' }}</p>
                  <p class="text-[11px] text-slate-400">{{ u?.penerima?.program_studi || '-' }}</p>
                </td>
                <td class="px-4 py-3 align-middle">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-100 uppercase">
                    {{ u?.jenis_bantuan }}
                  </span>
                </td>
                <td class="px-4 py-3 align-middle">
                  <p class="text-sm text-slate-700 font-medium whitespace-nowrap">{{ u?.bulan }} {{ u?.tahun }}</p>
                </td>
                <td class="px-4 py-3 align-middle text-right">
                  <p class="text-sm font-bold text-indigo-700">{{ formattedPrice(u?.jumlah_donasi) }}</p>
                </td>
                <td class="px-4 py-3 align-middle text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button 
                      class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" 
                      title="Edit"
                      @click.prevent="editItem(u)"
                    >
                      <IcEdit class="w-4 h-4"/>
                    </button>
                    <button 
                      class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Hapus"
                      @click.prevent="deleteItem(u.id)"
                    >
                      <IcTrash class="w-4 h-4"/>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row">
          <span class="text-xs font-medium text-slate-500 xs:text-sm">
            Menampilkan <span class="text-slate-900 font-bold">{{ pagination?.start || 0 }}</span> sampai <span class="text-slate-900 font-bold">{{ pagination?.end || 0 }}</span> dari <span class="text-slate-900 font-bold">{{ pagination?.totalEntries || 0 }}</span> data
          </span>
          <div class="inline-flex gap-2">
            <button
              class="inline-flex items-center px-4 py-1.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              :disabled="page <= 1"
              @click="()=>{page = (pagination?.currentPage || 1) - 1; getData()}"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Sebelumnya
            </button>
            <button
              class="inline-flex items-center px-4 py-1.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              :disabled="page >= (pagination?.totalPages || 1)"
              @click="()=>{page = (pagination?.currentPage || 1) + 1; getData()}"
            >
              Berikutnya
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import { GET_DANA_BANTUAN, DELETE_DANA_BANTUAN } from "@/store/danaBantuan.module";
import ModalForm from "../components/modal/FormDanaBantuan.vue";
import { formattedPrice } from '@/utils';
import IcTrash from '@/assets/svg/ic-trash.vue';
import IcEdit from '@/assets/svg/ic-edit.vue';
import IcPlus from '@/assets/svg/ic-plus.vue';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import AppSelect from '@/components/input/AppSelect.vue';

const store = useStore();

const title = ref("Dana Bantuan");
const isLoading = ref(true);
const isOpened = ref(false);
const currentId = ref<string | undefined>(undefined);
const dataUpdate = ref<any>([]);
const isImageModalOpen = ref(false);
const selectedImage = ref('');
const page = ref(1);
const limit = ref(10);
const search = ref("");

const pageLimitOptions = [
  { value: 5, label: '5' },
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
];

const openModal = () => {
  currentId.value = undefined;
  dataUpdate.value = [];
  isOpened.value = true;
};

const handleModalClose = async () => {
  isOpened.value = false;
  currentId.value = undefined;
  dataUpdate.value = [];
  await getData();
};

const computedData = computed(() => {
  const data = store.getters.danaBantuan;
  return data.data || [];
});

const pagination = computed(() => {
  const data = store.getters.danaBantuan;
  return data?.pagination || {};
});

const getData = async () => {
  isLoading.value = true;
  try {
    const params = {
      data: {
        search: search.value,
        limit: limit.value,
        page: page.value,
      }
    };
    await store.dispatch(GET_DANA_BANTUAN, params);
  } finally {
    isLoading.value = false;
  }
};

onMounted(getData);

const closeImageModal = () => {
  isImageModalOpen.value = false;
};

const editItem = (item: any) => {
  dataUpdate.value = { ...item };
  currentId.value = item.id;
  isOpened.value = true;
};

const deleteItem = async (id: number) => {
  const result = await Swal.fire({
    title: 'Hapus data?',
    text: "Data yang dihapus tidak dapat dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#8c8c94',
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  });

  if (result.isConfirmed) {
    try {
      await store.dispatch(DELETE_DANA_BANTUAN, { id });
      await Swal.fire({
        title: "Terhapus!",
        text: "Data dana bantuan berhasil dihapus.",
        icon: "success",
        confirmButtonColor: '#003793',
      });
      await getData();
    } catch (err: any) {
      console.error(err);
      Swal.fire('Gagal', 'Gagal menghapus data', 'error');
    }
  }
};
</script>