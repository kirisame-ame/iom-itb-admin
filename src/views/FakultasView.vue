<template>
  <div>
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50" @click.self="closeModal">
      <div class="bg-white rounded-md shadow-lg w-full max-w-md p-6">
        <h3 class="text-lg font-semibold mb-4">{{ editingId ? 'Edit' : 'Tambah' }} Fakultas</h3>
        <form @submit.prevent="handleSubmit" class="space-y-3">
          <div>
            <label class="block text-sm text-gray-600">Nama Fakultas</label>
            <input v-model="form.name" class="mt-1 block w-full px-3 py-2 border rounded" placeholder="mis. FTI" required />
          </div>
          <div>
            <label class="block text-sm text-gray-600">Kode Unik (3 digit)</label>
            <input v-model="form.kodeUnik" maxlength="3" class="mt-1 block w-full px-3 py-2 border rounded font-mono" placeholder="001" required />
          </div>
          <label class="inline-flex items-center">
            <input type="checkbox" v-model="form.isActive" class="mr-2" />
            <span class="text-sm text-gray-700">Aktif</span>
          </label>
          <div class="flex justify-end gap-2 pt-2">
            <button type="button" class="px-4 py-2 bg-gray-200 rounded" @click="closeModal">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded" :disabled="isSubmitting">
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="mt-8">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-700">Fakultas</h2>
        <button class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500" @click="openCreate">+ Tambah</button>
      </div>
      <p class="text-sm text-gray-500 mt-1">
        Kode unik fakultas dipakai sebagai kode unik pembayaran donasi/iuran manual.
      </p>

      <div class="px-4 py-4 -mx-4 overflow-x-auto sm:-mx-8 sm:px-8">
        <div class="inline-block min-w-full overflow-hidden rounded-lg shadow">
          <table class="min-w-full leading-normal">
            <thead>
              <tr>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Nama</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Kode Unik</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Status</th>
                <th class="px-4 py-3 text-xs font-semibold tracking-wider text-right text-gray-600 uppercase bg-gray-100 border-b-2 border-gray-200">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="isLoading">
                <td colspan="4" class="px-5 py-5 text-sm bg-white border-b border-gray-200">Loading...</td>
              </tr>
              <tr v-else-if="fakultasList.length === 0">
                <td colspan="4" class="px-5 py-5 text-sm bg-white border-b border-gray-200 text-center text-gray-500">Belum ada fakultas.</td>
              </tr>
              <tr v-else v-for="item in fakultasList" :key="item.id">
                <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">{{ item.name }}</td>
                <td class="px-4 py-3 text-sm bg-white border-b border-gray-200 font-mono">{{ item.kodeUnik }}</td>
                <td class="px-4 py-3 text-sm bg-white border-b border-gray-200">
                  <span :class="item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'" class="px-2 py-1 rounded text-xs">
                    {{ item.isActive ? 'Aktif' : 'Nonaktif' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm bg-white border-b border-gray-200 text-right">
                  <button class="text-blue-600 hover:underline mr-3" @click="openEdit(item)">Edit</button>
                  <button class="text-red-600 hover:underline" @click="handleDelete(item)">Hapus</button>
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
