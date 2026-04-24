<template>
  <div class="fixed inset-0 z-[998] bg-black/40"></div>
  <div
    class="fixed inset-0 z-[999] flex items-center justify-center w-screen h-screen px-4"
    @click="closeModal"
  >
    <div ref="modalContent" @click.stop class="w-full max-w-lg">
      <form
        @submit.prevent="handleSubmit"
        class="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-xl"
      >
        <div class="flex items-center justify-between px-5 py-3 border-b border-gray-200">
          <h3 class="text-sm font-semibold text-gray-800 capitalize">{{ title }}</h3>
          <button type="button" @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="px-5 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div>
            <label class="block mb-1 text-xs font-medium text-gray-600">
              Nama Mitra <span class="text-red-500">*</span>
            </label>
            <input
              v-model="form.name"
              type="text"
              required
              class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="mis. PT Example"
            />
          </div>

          <div>
            <label class="block mb-1 text-xs font-medium text-gray-600">Deskripsi</label>
            <textarea
              v-model="form.description"
              rows="4"
              class="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              placeholder="Deskripsi singkat tentang mitra..."
            ></textarea>
          </div>

          <div>
            <label class="block mb-1 text-xs font-medium text-gray-600">Logo</label>
            <div class="flex items-center gap-3">
              <div class="flex items-center justify-center w-14 h-14 overflow-hidden bg-gray-100 border border-gray-200 rounded">
                <img v-if="logoPreview" :src="logoPreview" class="object-cover w-full h-full" />
                <span v-else class="text-xs text-gray-400">No logo</span>
              </div>
              <input
                type="file"
                accept="image/*"
                @change="onLogoChange"
                class="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
              />
            </div>
          </div>

          <div>
            <label class="block mb-1 text-xs font-medium text-gray-600">MoU (PDF)</label>
            <input
              type="file"
              accept="application/pdf"
              @change="onMouChange"
              class="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <p v-if="mouName" class="mt-1 text-xs text-gray-500">File: {{ mouName }}</p>
            <a
              v-else-if="form.mou"
              :href="form.mou"
              target="_blank"
              rel="noopener"
              class="inline-block mt-1 text-xs text-indigo-600 hover:underline"
            >Lihat file saat ini</a>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            @click="closeModal"
            class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-60"
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
        alert(error?.response?.data?.message || error?.message || 'Gagal menyimpan');
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
