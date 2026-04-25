<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[580px]" @click.stop>
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="flex items-start justify-between gap-4 bg-blue-900 px-6 py-5 text-white">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-blue-100">Form Merchandise</p>
              <h3 class="mt-1 text-xl font-bold capitalize">{{ title }}</h3>
              <p class="mt-1 text-sm text-blue-100">Lengkapi informasi produk yang akan tampil di katalog.</p>
            </div>
            <button type="button" class="rounded-full p-1.5 text-blue-100 transition hover:bg-white/10 hover:text-white" @click="closeModal">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="max-h-[75vh] space-y-4 overflow-y-auto bg-slate-50 px-6 py-6 text-slate-700">
            <InputText label="name" :value="data?.name" @update="updateValue" :required="true" />
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputNumber label="stock" :value="data?.stock" @update="updateValue" :required="true" />
              <InputPrice label="price" :value="data?.price" @update="updateValue" :required="true"/>
            </div>
            <InputTextArea label="description" :value="data?.description" @update="updateValue" :required="true" />
            <InputImageCostume label="image" :value="data?.image" @update="updateValue" />
            <InputText label="link" :value="data?.link" @update="updateValue" />
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none">
              Batal
            </button>
            <button type="submit" :disabled="isLoading" class="rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60">
              {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import InputText from '@/components/input/InputText.vue';
import InputTextArea from '@/components/input/InputTextArea.vue';
import InputNumber from '@/components/input/InputNumber.vue';
import InputPrice from '@/components/input/InputPrice.vue';
import { useStore } from 'vuex';
import { POST_MERCHANDISE, PUT_MERCHANDISE } from "@/store/merchandise.module";
import { POST_IMAGE } from "@/store/upload.module";
import InputImageCostume from '../input/InputImageCostume.vue';
import { showError } from '@/utils/swal';

export default defineComponent({
  components: {
    InputText,
    InputTextArea,
    InputNumber,
    InputPrice,
    InputImageCostume,
  },
  props: {
    title: {
      type: String,
      required: true
    },
    id:{
      type: String,
      required: false
    },
    data: {
      type: Object,
      required: false,
      default: () => ({}) // Provide a default object to prevent undefined errors
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const modalContent = ref(null);
    const isLoading = ref(false);

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const formData = {
      id: '',
      data: { ...(props.data || {}) } as Record<string, any>
    }

    const updateValue = (params: { key: string; value: any }) => {
      formData.data[params.key] = params.value;
    };

    const handleSubmit = async () => {
      isLoading.value = true;

      const errors: string[] = [];

      const requiredFields: Record<string, string> = {
        name: 'Nama',
        stock: 'Stok',
        price: 'Harga',
        description: 'Deskripsi',
      };
      for (const [field, label] of Object.entries(requiredFields)) {
        const val = formData.data[field];
        if (val === undefined || val === null || val === '') {
          errors.push(`${label} wajib diisi.`);
        }
      }

      const stockValue = Number(formData.data.stock);
      if (formData.data.stock !== undefined && formData.data.stock !== '') {
        if (stockValue < 0) {
          errors.push('Stok tidak boleh bernilai negatif.');
        } else if (!Number.isInteger(stockValue)) {
          errors.push('Stok harus berupa bilangan bulat (tidak boleh menggunakan koma).');
        }
      }

      const link = formData.data.link;
      if (link && link.trim() !== '') {
        try {
          const url = new URL(link);
          const hostname = url.hostname.toLowerCase().replace(/\.$/, '');
          const isItbPressDomain = hostname === 'itbpress.id' || hostname.endsWith('.itbpress.id');
          if (!isItbPressDomain) {
            errors.push('Link harus menggunakan domain ITB Press (itbpress.id).');
          }
        } catch {
          errors.push('Masukkan URL yang benar (contoh: https://itbpress.id/...).');
        }
      }

      if (errors.length > 0) {
        showError('Error', errors);
        isLoading.value = false;
        return;
      }
      try {
        if(formData?.data?.image){
          if(typeof formData?.data?.image !== "string") {
            const response = await store.dispatch(POST_IMAGE, formData);
            formData.data.image = response || "";
          }
          formData.data.image = formData?.data?.image || "";
        }
        if(props?.id){
          formData.id = props?.id
          await store.dispatch(PUT_MERCHANDISE, formData);
        }else{
          await store.dispatch(POST_MERCHANDISE, formData);
        }
        closeModal();
      } catch (error:any) {
        showError('Error', error?.response?.data?.message || 'Terjadi kesalahan, coba lagi.');
        isLoading.value = false;
      }
    };

    return {
      modalContent,
      closeModal,
      handleSubmit,
      updateValue,
      isLoading
    };
  },
});
</script>
