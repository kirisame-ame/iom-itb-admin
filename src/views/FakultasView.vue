<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="fakultas" />

    <div v-if="isModalOpen" class="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/50" @click.self="closeModal">
      <div class="w-full max-w-[760px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900">{{ editingId ? 'Edit' : 'Tambah' }} Fakultas</h3>
            <p class="mt-1 text-sm text-slate-500">Kode unik dipakai pada pembayaran donasi dan iuran manual.</p>
          </div>
          <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit">
          <div class="max-h-[75vh] overflow-y-auto bg-white">
            <div class="divide-y divide-slate-100">
              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Nama Fakultas <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Nama lengkap atau singkatan fakultas/prodi.</p>
                </div>
                <input
                  v-model="form.name"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="mis. FTI"
                  required
                />
              </div>

              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Kode Unik <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Maksimal 3 digit angka unik.</p>
                </div>
                <input
                  v-model="form.kodeUnik"
                  maxlength="3"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm font-bold text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="001"
                  required
                />
              </div>

              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Visibilitas</label>
                  <p class="mt-0.5 text-xs text-slate-400">Tampilkan sebagai pilihan aktif di form donasi.</p>
                </div>
                <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
                  <input type="checkbox" v-model="form.isActive" class="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500" />
                  Status Aktif
                </label>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
            <button type="button" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors" @click="closeModal">Batal</button>
            <button type="submit" class="rounded-lg bg-[#003793] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 transition-all disabled:cursor-not-allowed disabled:opacity-60" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : editingId ? 'Simpan Perubahan' : 'Tambah Fakultas' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-8 space-y-5">
      <!-- ── Page Header ─────────────────────────────────────────── -->
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-4 text-white shadow-sm sm:p-6">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 class="text-2xl font-bold md:text-4xl">Fakultas</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">
              Kelola daftar kode unik fakultas untuk referensi donasi dan iuran orang tua mahasiswa.
            </p>
          </div>
          <button class="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/70 sm:w-auto" @click="openCreate">
            <IcPlus class="w-4 h-4"/>
            Tambah Fakultas
          </button>
        </div>
      </section>

      <!-- ── KPI Cards ─────────────────────────────────────────── -->
      <section class="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Fakultas</p>
          <p class="mt-3 text-3xl font-bold text-slate-900">{{ fakultasList.length }}</p>
          <p class="mt-1 text-xs text-slate-500">Seluruh data terdaftar</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Aktif</p>
          <p class="mt-3 text-3xl font-bold text-emerald-600">{{ activeCount }}</p>
          <p class="mt-1 text-xs text-slate-500">Tampil sebagai opsi</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-wider">Nonaktif</p>
          <p class="mt-3 text-3xl font-bold text-slate-400">{{ inactiveCount }}</p>
          <p class="mt-1 text-xs text-slate-500">Disembunyikan dari opsi</p>
        </div>
      </section>

      <!-- ── Filter Card ─────────────────────────────────────────── -->
      <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Cari Data</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg viewBox="0 0 24 24" class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                v-model="search"
                placeholder="Nama atau kode unik..."
                class="block w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          </div>
          <div>
            <label class="block mb-1.5 text-sm font-semibold text-slate-900">Status</label>
            <AppSelect
              v-model="statusFilter"
              :options="statusFilterOptions"
            />
          </div>
        </div>
      </div>

      <!-- ── Table Card ─────────────────────────────────────────── -->
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col gap-3 border-b border-slate-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div>
            <h2 class="text-base font-bold text-slate-900">Daftar Fakultas</h2>
            <p class="mt-1 text-xs text-slate-500">List referensi kode unik per fakultas.</p>
          </div>
          <span class="text-xs text-slate-500">Menampilkan {{ filteredFakultasList.length }} dari {{ fakultasList.length }} data</span>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">Nama Fakultas</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">Kode Unik</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-left text-blue-100 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3.5 text-sm font-semibold text-center text-blue-100 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="isLoading">
                <td v-for="c in 4" :key="c" class="px-4 py-8">
                  <div class="h-4 w-full animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="filteredFakultasList.length === 0">
                <td colspan="4" class="px-5 py-12 text-sm text-center text-slate-400 italic">Belum ada data fakultas.</td>
              </tr>
              <tr v-else v-for="item in filteredFakultasList" :key="item.id" class="transition-colors hover:bg-blue-50/40">
                <td class="px-4 py-4 font-bold text-slate-900">{{ item.name }}</td>
                <td class="px-4 py-4">
                  <span class="font-mono text-sm font-bold bg-slate-100 px-2 py-1 rounded border border-slate-200 text-slate-600">
                    {{ item.kodeUnik }}
                  </span>
                </td>
                <td class="px-4 py-4">
                  <span :class="item.isActive ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'" class="rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase">
                    {{ item.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-4 py-4 text-center">
                  <div class="flex items-center justify-center gap-1">
                    <button class="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Edit" @click="openEdit(item)">
                      <IcEdit class="w-4 h-4"/>
                    </button>
                    <button class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Hapus" @click="handleDelete(item)">
                      <IcTrash class="w-4 h-4"/>
                    </button>
                  </div>
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
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import Breadcrumb from '@/components/AppBreadcrumb.vue';
import AppSelect from '@/components/input/AppSelect.vue';
import IcEdit from '@/assets/svg/ic-edit.vue';
import IcTrash from '@/assets/svg/ic-trash.vue';
import IcPlus from '@/assets/svg/ic-plus.vue';
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
