<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[580px]" @click.stop>
      <div class="overflow-hidden rounded-2xl border-2 border-slate-200 bg-white shadow-2xl">
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="flex items-start justify-between gap-4 bg-blue-900 px-6 py-5 text-white">
            <div>
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
            <InputText label="Nama Produk" key-value="name" :value="data?.name" @update="updateValue" :required="true" />
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <InputNumber label="Stok" key-value="stock" :value="data?.stock" @update="updateValue" :required="true" />
              <InputPrice label="Harga" key-value="price" :value="data?.price" @update="updateValue" :required="true"/>
            </div>
            <InputTextArea label="Deskripsi" key-value="description" :value="data?.description" @update="updateValue" :required="true" />
            <InputImageCostume label="Gambar Produk" key-value="image" :value="data?.image" @update="updateValue" />
            <InputText label="Link Pembelian" key-value="link" :value="data?.link" @update="updateValue" />

            <!-- Kategori dinamis -->
            <div class="relative mt-2 rounded-md shadow-sm">
              <label class="text-sm font-semibold text-slate-700">Kategori</label>
              <AppSelect
                class="mt-1"
                :model-value="selectedKategori"
                :options="kategoriSelectOptions"
                button-class="bg-gray-50 border-gray-300 text-gray-900"
                @change="onKategoriChange"
              />
              <input
                v-if="showNewKategori"
                v-model="newKategoriInput"
                type="text"
                placeholder="Nama kategori baru"
                class="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                @input="updateValue({ key: 'kategori', value: newKategoriInput })"
              />
            </div>
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
import { defineComponent, ref, onMounted, computed } from 'vue';
import InputText from '@/components/input/InputText.vue';
import InputTextArea from '@/components/input/InputTextArea.vue';
import InputNumber from '@/components/input/InputNumber.vue';
import InputPrice from '@/components/input/InputPrice.vue';
import { useStore } from 'vuex';
import { POST_MERCHANDISE, PUT_MERCHANDISE } from "@/store/merchandise.module";
import { POST_IMAGE } from "@/store/upload.module";
import InputImageCostume from '../input/InputImageCostume.vue';
import { showError } from '@/utils/swal';
import ApiService from '@/store/api.service';
import AppSelect from '@/components/input/AppSelect.vue';
import type { ApiDataResponse, ApiErrorResponse, MerchandisePayload } from '@/types/domain';

type CategoryResponse = ApiDataResponse<string[]> | string[];

export default defineComponent({
  components: {
    InputText,
    InputTextArea,
    InputNumber,
    InputPrice,
    InputImageCostume,
    AppSelect,
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
    const initialData = props.data as MerchandisePayload;
    const modalContent = ref(null);
    const isLoading = ref(false);

    const kategoriOptions = ref<string[]>(['Stiker', 'Busana', 'ATK']);
    const selectedKategori = ref<string>(String(initialData.kategori || ''));
    const showNewKategori = ref(false);
    const newKategoriInput = ref('');
    const kategoriSelectOptions = computed(() => [
      { value: '', label: '-- Pilih Kategori --' },
      ...kategoriOptions.value.map((kategori) => ({ value: kategori, label: kategori })),
      { value: '__new__', label: '+ Tambah Kategori Baru...' },
    ]);

    onMounted(async () => {
      try {
        const res = await ApiService.get<CategoryResponse>('/merchandises/categories');
        const categories = Array.isArray(res) ? res : res.data;
        if (Array.isArray(categories)) kategoriOptions.value = categories;
      } catch { /* fallback ke default */ }
    });

    const onKategoriChange = (value: string | number | boolean | null | undefined) => {
      const val = String(value || '');
      if (val === '__new__') {
        showNewKategori.value = true;
        selectedKategori.value = '__new__';
        formData.data['kategori'] = '';
      } else {
        showNewKategori.value = false;
        newKategoriInput.value = '';
        selectedKategori.value = val;
        formData.data['kategori'] = val || '';
      }
    };

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const formData = {
      id: '',
      data: { ...initialData } as MerchandisePayload,
    }

    const updateValue = (params: { key: string; value: unknown }) => {
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

      const link = typeof formData.data.link === 'string' ? formData.data.link : '';
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
      } catch (error: unknown) {
        const apiError = error as ApiErrorResponse;
        showError('Error', apiError?.response?.data?.message || apiError?.message || 'Terjadi kesalahan, coba lagi.');
        isLoading.value = false;
      }
    };

    return {
      modalContent,
      closeModal,
      handleSubmit,
      updateValue,
      isLoading,
      kategoriOptions,
      kategoriSelectOptions,
      selectedKategori,
      showNewKategori,
      newKategoriInput,
      onKategoriChange,
    };
  },
});
</script>
