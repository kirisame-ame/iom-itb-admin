<template>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/50" @click.self="closeModal">
    <div class="w-full max-w-[640px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl" @click.stop>
      <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
        <div>
          <h3 class="text-lg font-bold text-slate-900">Tambah Penerima</h3>
          <p class="mt-1 text-sm text-slate-500">Tambahkan satu per satu atau impor dari CSV/XLS.</p>
        </div>
        <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mode tabs -->
      <div class="flex gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
          :class="mode === 'manual' ? 'bg-[#003793] text-white' : 'text-slate-600 hover:bg-slate-200'"
          @click="mode = 'manual'"
        >
          Manual
        </button>
        <button
          type="button"
          class="rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors"
          :class="mode === 'import' ? 'bg-[#003793] text-white' : 'text-slate-600 hover:bg-slate-200'"
          @click="mode = 'import'"
        >
          Impor CSV / XLS
        </button>
      </div>

      <!-- Manual mode -->
      <form v-if="mode === 'manual'" @submit.prevent="submitManual" novalidate>
        <div class="space-y-4 px-5 py-5">
          <div>
            <label class="text-sm font-semibold text-slate-900">Nama <span class="text-red-500">*</span></label>
            <input
              v-model="form.name"
              type="text"
              class="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="mis. Budi Santoso"
            />
          </div>
          <div>
            <label class="text-sm font-semibold text-slate-900">NIM / Relasi</label>
            <input
              v-model="form.nim"
              type="text"
              class="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="mis. 13523062 atau Orang Tua Asuh"
            />
          </div>
          <div>
            <label class="text-sm font-semibold text-slate-900">No. WhatsApp</label>
            <input
              v-model="form.noWhatsapp"
              type="text"
              class="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="mis. 6281234567890"
            />
          </div>
          <div>
            <label class="text-sm font-semibold text-slate-900">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              placeholder="mis. nama@email.com"
            />
          </div>
          <p class="text-xs text-slate-400">Minimal salah satu dari No. WhatsApp atau Email wajib diisi.</p>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            Batal
          </button>
          <button type="submit" :disabled="isLoading" class="rounded-lg bg-[#003793] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 transition-all disabled:cursor-not-allowed disabled:opacity-60">
            {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>

      <!-- Import mode -->
      <form v-else @submit.prevent="submitImport" novalidate>
        <div class="space-y-4 px-5 py-5">
          <div class="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
            <p class="font-semibold text-slate-700">Format file:</p>
            <p class="mt-1">Header kolom: <span class="font-mono text-slate-900">Nama</span>, <span class="font-mono text-slate-900">NIM / Relasi</span>, <span class="font-mono text-slate-900">No. WhatsApp</span>, <span class="font-mono text-slate-900">Email</span></p>
            <p class="mt-1">Baris yang tidak memiliki Nama atau tidak memiliki WhatsApp & Email akan dilewati.</p>
          </div>
          <div>
            <label class="text-sm font-semibold text-slate-900">File <span class="text-red-500">*</span></label>
            <input
              ref="fileInput"
              type="file"
              accept=".csv,.xls,.xlsx"
              class="mt-1 block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 file:mr-3 file:rounded file:border-0 file:bg-[#003793] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-white"
              @change="onFileChange"
            />
            <p class="mt-1 text-xs text-slate-400">Maksimal 5MB. Format yang didukung: .csv, .xls, .xlsx</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            Batal
          </button>
          <button type="submit" :disabled="isLoading || !selectedFile" class="rounded-lg bg-[#003793] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 transition-all disabled:cursor-not-allowed disabled:opacity-60">
            {{ isLoading ? 'Mengimpor...' : 'Impor' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import Swal from 'sweetalert2';
import { POST_BROADCAST_MEMBER, IMPORT_BROADCAST_MEMBERS } from '@/store/broadcast.module';
import type { ApiErrorResponse, BroadcastRecipientPayload } from '@/types/domain';

interface BroadcastImportResult {
  inserted: number;
  skipped: number;
  total: number;
}

export default defineComponent({
  setup(_props, { emit }) {
    const store = useStore();
    const isLoading = ref(false);
    const mode = ref<'manual' | 'import'>('manual');
    const fileInput = ref<HTMLInputElement | null>(null);
    const selectedFile = ref<File | null>(null);

    const form = reactive<BroadcastRecipientPayload>({
      name: '',
      nim: '',
      noWhatsapp: '',
      email: '',
    });

    const closeModal = () => emit('close');

    const submitManual = async () => {
      const errors: string[] = [];
      if (!form.name.trim()) errors.push('Nama wajib diisi.');
      if (!String(form.noWhatsapp || '').trim() && !String(form.email || '').trim()) errors.push('Minimal salah satu dari No. WhatsApp atau Email wajib diisi.');
      if (errors.length) {
        Swal.fire({ title: 'Validasi', html: errors.join('<br>'), icon: 'warning', confirmButtonColor: '#003793' });
        return;
      }
      isLoading.value = true;
      try {
        await store.dispatch(POST_BROADCAST_MEMBER, { ...form });
        emit('close', { added: 1 });
      } catch (err: unknown) {
        const apiError = err as ApiErrorResponse;
        Swal.fire({ title: 'Error', text: apiError?.response?.data?.message || apiError?.message || 'Gagal menyimpan.', icon: 'error', confirmButtonColor: '#003793' });
        isLoading.value = false;
      }
    };

    const onFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      selectedFile.value = target.files && target.files[0] ? target.files[0] : null;
    };

    const submitImport = async () => {
      if (!selectedFile.value) return;
      isLoading.value = true;
      try {
        const result = await store.dispatch(IMPORT_BROADCAST_MEMBERS, selectedFile.value) as BroadcastImportResult;
        Swal.fire({
          title: 'Berhasil',
          text: `${result?.inserted ?? 0} penerima ditambahkan${result?.skipped ? `, ${result.skipped} baris dilewati` : ''}.`,
          icon: 'success',
          confirmButtonColor: '#003793',
        });
        emit('close', { added: result?.inserted ?? 0 });
      } catch (err: unknown) {
        const apiError = err as ApiErrorResponse;
        Swal.fire({ title: 'Error', text: apiError?.response?.data?.message || apiError?.message || 'Gagal mengimpor.', icon: 'error', confirmButtonColor: '#003793' });
        isLoading.value = false;
      }
    };

    return { mode, form, isLoading, fileInput, selectedFile, closeModal, submitManual, submitImport, onFileChange };
  },
});
</script>
