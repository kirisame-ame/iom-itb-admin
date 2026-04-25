<template>
  <div class="min-h-screen">
    <Breadcrumb breadcrumb="fakultas" />

    <div v-if="isModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" @click.self="closeModal">
      <div class="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div class="bg-blue-900 px-6 py-5 text-white">
          <p class="text-xs font-semibold uppercase tracking-wider text-blue-100">Form Fakultas</p>
          <h3 class="mt-1 text-xl font-bold">{{ editingId ? 'Edit' : 'Tambah' }} Fakultas</h3>
          <p class="mt-1 text-sm text-blue-100">Kode unik dipakai pada pembayaran donasi/iuran manual.</p>
        </div>
        <form @submit.prevent="handleSubmit" class="space-y-4 bg-slate-50 px-6 py-6">
          <div>
            <label class="block text-sm font-medium text-slate-600">Nama Fakultas</label>
            <input v-model="form.name" class="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="mis. FTI" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-600">Kode Unik (3 digit)</label>
            <input v-model="form.kodeUnik" maxlength="3" class="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30" placeholder="001" required />
          </div>
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="form.isActive" class="mr-2" />
            <span class="text-sm text-slate-700">Aktif</span>
          </label>
          <div class="flex justify-end gap-2 border-t border-slate-100 bg-white -mx-6 -mb-6 mt-2 px-6 py-4">
            <button type="button" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" @click="closeModal">Batal</button>
            <button type="submit" class="rounded-lg bg-blue-800 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-8 space-y-5">
      <section class="relative overflow-hidden rounded-2xl bg-[#003793] p-6 text-white shadow-sm">
        <div class="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white opacity-10"></div>
        <div class="absolute bottom-0 right-20 h-24 w-24 rounded-full bg-blue-300 opacity-10"></div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p class="mb-2 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">Master Data</p>
            <h1 class="text-3xl font-bold tracking-tight md:text-4xl">Fakultas</h1>
            <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100">Kelola kode unik fakultas untuk pembayaran donasi dan iuran manual.</p>
          </div>
          <button class="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#003793] shadow-lg transition-all hover:-translate-y-px hover:shadow-xl" @click="openCreate">
            + Tambah Fakultas
          </button>
        </div>
      </section>

      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead>
              <tr class="bg-blue-900">
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Nama</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Kode Unik</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-left text-blue-100 uppercase">Status</th>
                <th class="px-5 py-3.5 text-xs font-semibold tracking-wider text-right text-blue-100 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="isLoading">
                <td v-for="c in 4" :key="c" class="px-5 py-4">
                  <div class="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100"></div>
                </td>
              </tr>
              <tr v-else-if="fakultasList.length === 0">
                <td colspan="4" class="px-5 py-12 text-sm text-center text-slate-400 italic">Belum ada fakultas.</td>
              </tr>
              <tr v-else v-for="item in fakultasList" :key="item.id" class="transition-colors hover:bg-blue-50/40">
                <td class="px-5 py-4 font-semibold text-slate-900">{{ item.name }}</td>
                <td class="px-5 py-4 font-mono text-sm text-slate-600">{{ item.kodeUnik }}</td>
                <td class="px-5 py-4">
                  <span :class="item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'" class="rounded-full px-2.5 py-1 text-xs font-semibold">
                    {{ item.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-5 py-4 text-right">
                  <button class="mr-3 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100" @click="openEdit(item)">Edit</button>
                  <button class="rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100" @click="handleDelete(item)">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="border-t border-slate-100 px-6 py-4">
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
