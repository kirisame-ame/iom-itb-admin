<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="fakultas" />

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" @click.self="closeModal">
      <div class="w-full max-w-[640px] overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-700">Fakultas</p>
            <h3 class="mt-1 text-lg font-bold text-slate-900">{{ editingId ? 'Edit' : 'Tambah' }} Fakultas</h3>
            <p class="mt-1 text-sm text-slate-500">Kode unik dipakai pada pembayaran donasi dan iuran manual.</p>
          </div>
          <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="divide-y divide-slate-100 bg-white">
            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[150px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Nama Fakultas</label>
                <p class="mt-0.5 text-xs text-slate-400">Nama atau singkatan fakultas.</p>
              </div>
              <input
                v-model="form.name"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. FTI"
                required
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[150px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Kode Unik</label>
                <p class="mt-0.5 text-xs text-slate-400">Maksimal 3 digit.</p>
              </div>
              <input
                v-model="form.kodeUnik"
                maxlength="3"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="001"
                required
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[150px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Status</label>
                <p class="mt-0.5 text-xs text-slate-400">Tampilkan sebagai pilihan aktif.</p>
              </div>
              <label class="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                <input type="checkbox" v-model="form.isActive" class="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500" />
                Aktif
              </label>
            </div>
          </div>

          <div class="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
            <button type="button" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100" @click="closeModal">Batal</button>
            <button type="submit" class="rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-6 space-y-4">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight md:text-4xl">Fakultas</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Kelola kode unik fakultas untuk pembayaran donasi dan iuran manual.
            </p>
          </div>
          <button class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto" @click="openCreate">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
            Tambah Fakultas
          </button>
        </div>
      </section>

      <section class="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div class="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Fakultas</p>
          <p class="mt-2 text-2xl font-bold text-blue-900">{{ fakultasList.length }}</p>
        </div>
        <div class="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Aktif</p>
          <p class="mt-2 text-2xl font-bold text-green-700">{{ activeCount }}</p>
        </div>
        <div class="rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-semibold uppercase tracking-wider text-slate-400">Nonaktif</p>
          <p class="mt-2 text-2xl font-bold text-slate-700">{{ inactiveCount }}</p>
        </div>
      </section>

      <section>
        <div class="grid gap-3 md:grid-cols-[1fr_220px]">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              v-model="search"
              placeholder="Cari nama fakultas atau kode unik..."
              class="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
          <AppSelect
            v-model="statusFilter"
            :options="statusFilterOptions"
          />
        </div>
      </section>

      <div class="overflow-hidden rounded-lg border-2 border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200 bg-slate-50">
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-slate-500 uppercase">Nama</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-slate-500 uppercase">Kode Unik</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-slate-500 uppercase">Status</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-right text-slate-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="isLoading">
                <td v-for="c in 4" :key="c" class="px-4 py-3">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="filteredFakultasList.length === 0">
                <td colspan="4" class="px-5 py-12 text-sm text-center text-slate-400 italic">Belum ada fakultas yang cocok.</td>
              </tr>
              <tr v-else v-for="item in filteredFakultasList" :key="item.id" class="transition-colors hover:bg-blue-50/40">
                <td class="px-4 py-3 font-semibold text-slate-900">{{ item.name }}</td>
                <td class="px-4 py-3 font-mono text-sm text-slate-600">{{ item.kodeUnik }}</td>
                <td class="px-4 py-3">
                  <span :class="item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'" class="rounded-full px-2.5 py-1 text-xs font-semibold">
                    {{ item.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <button class="mr-3 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100" @click="openEdit(item)">Edit</button>
                  <button class="rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100" @click="handleDelete(item)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border-t border-slate-100 px-4 py-3">
          <span class="text-xs text-slate-500">Menampilkan {{ filteredFakultasList.length }} dari {{ fakultasList.length }} fakultas</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import AppSelect from '@/components/input/AppSelect.vue';
import {
  GET_FAKULTAS,
  POST_FAKULTAS,
  PUT_FAKULTAS,
  DELETE_FAKULTAS,
  Fakultas,
} from '@/store/fakultas.module';
import type { ApiErrorResponse } from '@/types/domain';

const store = useStore();
const isLoading = ref(true);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const editingId = ref<number | null>(null);
const form = ref({ name: '', kodeUnik: '', isActive: true });
const search = ref('');
const statusFilter = ref('');
const statusFilterOptions = [
  { value: '', label: 'Semua status' },
  { value: 'active', label: 'Aktif' },
  { value: 'inactive', label: 'Nonaktif' },
];

const fakultasList = computed<Fakultas[]>(() => store.getters.fakultas || []);
const activeCount = computed(() => fakultasList.value.filter((item) => item.isActive).length);
const inactiveCount = computed(() => fakultasList.value.length - activeCount.value);
const filteredFakultasList = computed(() => {
  const keyword = search.value.trim().toLowerCase();

  return fakultasList.value.filter((item) => {
    const matchKeyword = keyword
      ? `${item.name} ${item.kodeUnik}`.toLowerCase().includes(keyword)
      : true;
    const matchStatus = statusFilter.value === 'active'
      ? item.isActive
      : statusFilter.value === 'inactive'
        ? !item.isActive
        : true;

    return matchKeyword && matchStatus;
  });
});

const load = async () => {
  isLoading.value = true;
  try {
    await store.dispatch(GET_FAKULTAS);
  } finally {
    isLoading.value = false;
  }
};

onMounted(load);

const openCreate = () => {
  editingId.value = null;
  form.value = { name: '', kodeUnik: '', isActive: true };
  isModalOpen.value = true;
};

const openEdit = (item: Fakultas) => {
  editingId.value = item.id;
  form.value = { name: item.name, kodeUnik: item.kodeUnik, isActive: item.isActive };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  try {
    if (editingId.value) {
      await store.dispatch(PUT_FAKULTAS, { id: editingId.value, data: form.value });
    } else {
      await store.dispatch(POST_FAKULTAS, { data: form.value });
    }
    closeModal();
    await load();
  } catch (err: unknown) {
    const apiError = err as ApiErrorResponse;
    Swal.fire({ icon: 'error', title: 'Gagal', text: apiError?.message || 'Gagal menyimpan fakultas' });
  } finally {
    isSubmitting.value = false;
  }
};

const handleDelete = async (item: Fakultas) => {
  const result = await Swal.fire({
    title: `Hapus ${item.name}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
  });
  if (!result.isConfirmed) return;
  try {
    await store.dispatch(DELETE_FAKULTAS, { id: item.id });
    await load();
  } catch (err: unknown) {
    const apiError = err as ApiErrorResponse;
    Swal.fire({ icon: 'error', title: 'Gagal', text: apiError?.message || 'Gagal menghapus fakultas' });
  }
};
</script>
