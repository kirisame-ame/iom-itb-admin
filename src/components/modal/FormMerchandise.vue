<template>
  <div class="fixed z-[998] bg-black top-0 right-0 w-full h-screen opacity-[0.4]"></div>
  <div class="fixed z-[999] flex justify-center items-center w-screen h-screen top-0 right-0" @click="closeModal">
    <div ref="modalContent" @click.stop>
      <div class="md:w-[500px] max-w-[500px] overflow-hidden bg-white border rounded-md shadow-md">
        <form @submit.prevent="handleSubmit">
          <div class="flex items-center justify-between px-5 py-3 text-gray-700 border-b">
            <h3 class="text-sm capitalize">{{ title }}</h3>
            <button type="button" @click="closeModal">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 py-6 text-gray-700 bg-gray-200 border-b max-h-[80vh] overflow-y-scroll">
            <InputText label="name" :value="data?.name" @update="updateValue" :required="true" />
            <InputNumber label="stock" :value="data?.stock" @update="updateValue" :required="true" />
            <InputPrice label="price" :value="data?.price" @update="updateValue" :required="true"/>
            <InputTextArea label="description" :value="data?.description" @update="updateValue" :required="true" />
            <InputImageCostume label="image" :value="data?.image" @update="updateValue" :required="true" />
            <InputText label="link" :value="data?.link" @update="updateValue" />

            <!-- Kategori dinamis -->
            <div class="relative mt-2 rounded-md shadow-sm">
              <label class="text-sm capitalize">Kategori</label>
              <select
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mt-1"
                :value="selectedKategori"
                @change="onKategoriChange"
              >
                <option value="">-- Pilih Kategori --</option>
                <option v-for="k in kategoriOptions" :key="k" :value="k">{{ k }}</option>
                <option value="__new__">+ Tambah Kategori Baru...</option>
              </select>
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

          <div class="flex items-center justify-between px-5 py-3">
            <button type="button" @click="closeModal" class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none">
              Cancel
            </button>
            <button type="submit" :disabled="isLoading" class="px-3 py-1 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:outline-none">
              {{ isLoading ? 'Loading...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import InputText from '@/components/input/InputText.vue';
import InputTextArea from '@/components/input/InputTextArea.vue';
import InputNumber from '@/components/input/InputNumber.vue';
import InputPrice from '@/components/input/InputPrice.vue';
import { useStore } from 'vuex';
import { POST_MERCHANDISE, PUT_MERCHANDISE } from "@/store/merchandise.module";
import { POST_IMAGE } from "@/store/upload.module";
import InputImageCostume from '../input/InputImageCostume.vue';
import ApiService from '@/store/api.service';

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

    const kategoriOptions = ref<string[]>(['Stiker', 'Busana', 'ATK']);
    const selectedKategori = ref<string>(props.data?.kategori || '');
    const showNewKategori = ref(false);
    const newKategoriInput = ref('');

    onMounted(async () => {
      try {
        const res: any = await ApiService.get('/merchandises/categories');
        if (res?.data) kategoriOptions.value = res.data;
      } catch { /* fallback ke default */ }
    });

    const onKategoriChange = (e: Event) => {
      const val = (e.target as HTMLSelectElement).value;
      if (val === '__new__') {
        showNewKategori.value = true;
        selectedKategori.value = '__new__';
        formData.data['kategori'] = '';
      } else {
        showNewKategori.value = false;
        newKategoriInput.value = '';
        selectedKategori.value = val;
        formData.data['kategori'] = val || null;
      }
    };

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const formData = {
      id: '',
      data: {} as Record<string, any>
    }

    const updateValue = (params: { key: string; value: any }) => {
      formData.data[params.key] = params.value;
    };

    const isValidUrl = (val: string): boolean => {
      try { new URL(val); return true; } catch { return false; }
    };

    const handleSubmit = async () => {
      isLoading.value = true;

      const errors: string[] = [];

      const imageVal = formData.data.image;
      if (typeof imageVal === 'string' && imageVal.trim() !== '') {
        if (!isValidUrl(imageVal)) {
          errors.push('Image URL tidak valid. Masukkan URL yang benar (contoh: https://example.com/gambar.jpg).');
        }
      }

      const link = formData.data.link;
      if (link && link.trim() !== '') {
        if (!isValidUrl(link)) {
          errors.push('Link tidak valid. Masukkan URL yang benar (contoh: https://example.com/...).');
        }
      }

      if (errors.length > 0) {
        alert(errors.join('\n'));
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
        alert(error?.response?.data?.message);
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
      selectedKategori,
      showNewKategori,
      newKategoriInput,
      onKategoriChange,
    };
  },
});
</script>
