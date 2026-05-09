<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="fakultas" />

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" @click.self="closeModal">
      <div class="w-full max-w-[640px] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
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
      <section class="flex flex-col gap-3 border-b border-slate-200 pb-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Fakultas</h1>
          <p class="mt-1 max-w-2xl text-sm leading-relaxed text-slate-500">Kelola kode unik fakultas untuk pembayaran donasi dan iuran manual.</p>
        </div>
        <button class="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700" @click="openCreate">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-4 w-4">
            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
          </svg>
          Tambah Fakultas
        </button>
      </section>

      <div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
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
              <tr v-else-if="fakultasList.length === 0">
                <td colspan="4" class="px-5 py-12 text-sm text-center text-slate-400 italic">Belum ada fakultas.</td>
              </tr>
              <tr v-else v-for="item in fakultasList" :key="item.id" class="transition-colors hover:bg-blue-50/40">
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
          <span class="text-xs text-slate-500">Total: {{ fakultasList.length }} fakultas</span>
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
import {
  GET_FAKULTAS,
  POST_FAKULTAS,
  PUT_FAKULTAS,
  DELETE_FAKULTAS,
  Fakultas,
} from '@/store/fakultas.module';

const store = useStore();
const isLoading = ref(true);
const isModalOpen = ref(false);
const isSubmitting = ref(false);
const editingId = ref<number | null>(null);
const form = ref({ name: '', kodeUnik: '', isActive: true });

const fakultasList = computed<Fakultas[]>(() => store.getters.fakultas || []);

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
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: err?.message || 'Gagal menyimpan fakultas' });
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
  } catch (err: any) {
    Swal.fire({ icon: 'error', title: 'Gagal', text: err?.message || 'Gagal menghapus fakultas' });
  }
};
</script>
