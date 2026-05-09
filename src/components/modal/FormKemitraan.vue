<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" @click.stop class="w-full max-w-[760px]">
      <form @submit.prevent="handleSubmit" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 class="text-lg font-bold capitalize text-slate-900">{{ title }}</h3>
            <p class="mt-1 text-sm text-slate-500">Kelola profil mitra, kontak internal, logo, dan dokumen MoU.</p>
          </div>
          <button type="button" @click="closeModal" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="max-h-[75vh] overflow-y-auto bg-white">
          <div class="divide-y divide-slate-100">
            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Nama Mitra <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Nama institusi atau organisasi mitra.</p>
              </div>
              <input
                v-model="form.name"
                type="text"
                required
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. PT Example"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Nama PIC</label>
                <p class="mt-0.5 text-xs text-slate-400">Kontak internal, tidak tampil di publik.</p>
              </div>
              <input
                v-model="form.picName"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. Budi Santoso"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Telepon PIC</label>
                <p class="mt-0.5 text-xs text-slate-400">Nomor yang dapat dihubungi admin.</p>
              </div>
              <input
                v-model="form.picPhone"
                type="tel"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. 08123456789"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-start">
              <div class="md:pt-2">
                <label class="text-sm font-semibold text-slate-700">Deskripsi</label>
                <p class="mt-0.5 text-xs text-slate-400">Ringkasan kerja sama dengan mitra.</p>
              </div>
              <textarea
                v-model="form.description"
                rows="3"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Deskripsi singkat tentang mitra..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Logo</label>
                <p class="mt-0.5 text-xs text-slate-400">Gambar logo mitra.</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <img v-if="logoPreview" :src="logoPreview" alt="Preview logo" class="h-full w-full object-cover" />
                  <span v-else class="text-xs text-slate-400">Kosong</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="onLogoChange"
                  class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-700">MoU (PDF)</label>
                <p class="mt-0.5 text-xs text-slate-400">Dokumen kerja sama yang tersimpan.</p>
              </div>
              <div>
                <input
                  type="file"
                  accept="application/pdf"
                  @change="onMouChange"
                  class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
                <p v-if="mouName" class="mt-1 text-xs text-slate-500">File: {{ mouName }}</p>
                <a
                  v-else-if="form.mou"
                  :href="form.mou"
                  target="_blank"
                  rel="noopener"
                  class="mt-1 inline-block text-xs font-semibold text-blue-600 hover:underline"
                >Lihat file saat ini</a>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Batal
          </button>
          <button type="submit" :disabled="isLoading" class="rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { POST_KEMITRAAN, PUT_KEMITRAAN } from '@/store/kemitraan.module';
import { showError } from '@/utils/swal';

interface KemitraanFormData {
  name?: string;
  picName?: string;
  picPhone?: string;
  description?: string;
  image?: string;
  mou?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export default defineComponent({
  props: {
    title: { type: String, required: true },
    id: { type: [String, Number], required: false },
    data: { type: Object, required: false, default: () => ({}) },
  },
  setup(props, { emit }) {
    const store = useStore();
    const modalContent = ref(null);
    const isLoading = ref(false);

    const initialData = props.data as KemitraanFormData;
    const form = reactive({
      name: initialData.name || '',
      picName: initialData.picName || '',
      picPhone: initialData.picPhone || '',
      description: initialData.description || '',
      image: initialData.image || '',
      mou: initialData.mou || '',
    });

    const logoFile = ref<File | null>(null);
    const mouFile = ref<File | null>(null);
    const logoPreviewLocal = ref<string>('');
    const mouName = ref<string>('');

    const logoPreview = computed(() => logoPreviewLocal.value || form.image);

    const onLogoChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      logoFile.value = file;
      if (file) {
        const reader = new FileReader();
        reader.onload = () => { logoPreviewLocal.value = (reader.result as string) || ''; };
        reader.readAsDataURL(file);
      }
    };
    const onMouChange = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      mouFile.value = file;
      mouName.value = file?.name || '';
    };

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const buildPayload = (): FormData | Record<string, string> => {
      if (logoFile.value || mouFile.value) {
        const fd = new FormData();
        fd.append('name', form.name || '');
        fd.append('picName', form.picName || '');
        fd.append('picPhone', form.picPhone || '');
        fd.append('description', form.description || '');
        if (logoFile.value) fd.append('logo', logoFile.value);
        if (mouFile.value) fd.append('file', mouFile.value);
        return fd;
      }
      return {
        name: form.name,
        picName: form.picName,
        picPhone: form.picPhone,
        description: form.description,
      };
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        const payload = buildPayload();
        if (props?.id) {
          await store.dispatch(PUT_KEMITRAAN, { id: props.id, data: payload });
        } else {
          await store.dispatch(POST_KEMITRAAN, { data: payload });
        }
        closeModal();
      } catch (error: unknown) {
        const apiError = error as ApiError;
        showError('Gagal', apiError?.response?.data?.message || apiError?.message || 'Gagal menyimpan');
        isLoading.value = false;
      }
    };

    return {
      modalContent,
      form,
      logoPreview,
      mouName,
      isLoading,
      onLogoChange,
      onMouChange,
      closeModal,
      handleSubmit,
    };
  },
});
</script>
