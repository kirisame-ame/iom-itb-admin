<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div
    class="fixed inset-0 z-[999] flex items-center justify-center p-4"
    @click="closeModal"
  >
    <div ref="modalContent" @click.stop class="w-full max-w-[620px]">
      <form
        @submit.prevent="handleSubmit"
        class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <div class="flex items-start justify-between gap-4 bg-blue-900 px-6 py-5 text-white">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-100">Form Kemitraan</p>
            <h3 class="mt-1 text-xl font-bold capitalize">{{ title }}</h3>
            <p class="mt-1 text-sm text-blue-100">Kelola profil mitra, logo, dan dokumen MoU.</p>
          </div>
          <button type="button" @click="closeModal" class="rounded-full p-1.5 text-blue-100 transition hover:bg-white/10 hover:text-white">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="max-h-[75vh] space-y-5 overflow-y-auto bg-slate-50 px-6 py-6">
          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Profil Mitra</p>
            <label class="block mb-1 text-xs font-medium text-slate-600">
              Nama Mitra <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="mis. PT Example"
            />

            <label class="mt-4 block mb-1 text-xs font-medium text-slate-600">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Deskripsi singkat tentang mitra..."
            ></textarea>
          </div>

          <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Aset Mitra</p>
            <label class="block mb-1 text-xs font-medium text-slate-600">Logo</label>
            <div class="flex items-center gap-3">
              <div class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                <img v-if="logoPreview" :src="logoPreview" class="object-cover w-full h-full" />
                <span v-else class="text-xs text-slate-400">No logo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                @change="onLogoChange"
                class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <label class="mt-4 block mb-1 text-xs font-medium text-slate-600">MoU (PDF)</label>
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

        <div class="flex items-center justify-end gap-2 border-t border-slate-100 bg-white px-6 py-4">
          <button
            type="button"
            @click="closeModal"
            class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
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

    const form = reactive({
      name: (props.data as any)?.name || '',
      description: (props.data as any)?.description || '',
      image: (props.data as any)?.image || '',
      mou: (props.data as any)?.mou || '',
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

    const buildPayload = (): FormData | Record<string, any> => {
      if (logoFile.value || mouFile.value) {
        const fd = new FormData();
        fd.append('name', form.name || '');
        if (form.description) fd.append('description', form.description);
        if (logoFile.value) fd.append('logo', logoFile.value);
        if (mouFile.value) fd.append('file', mouFile.value);
        return fd;
      }
      return {
        name: form.name,
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
      } catch (error: any) {
        showError('Gagal', error?.response?.data?.message || error?.message || 'Gagal menyimpan');
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
