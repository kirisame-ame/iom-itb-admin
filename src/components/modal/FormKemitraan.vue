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
            <InputText label="Nama Mitra" keyValue="name" :value="data?.name" @update="updateValue" :required="true" />
            <InputSelect label="Jenis Kemitraan" keyValue="type" :value="data?.type" :options="typeOptions" @update="updateValue" />
            <InputTextArea label="Deskripsi" keyValue="description" :value="data?.description" @update="updateValue" />
            <InputText label="Nama Narahubung" keyValue="contactName" :value="data?.contactName" @update="updateValue" />
            <InputText label="Email Narahubung" keyValue="contactEmail" :value="data?.contactEmail" @update="updateValue" />
            <InputText label="Telepon Narahubung" keyValue="contactPhone" :value="data?.contactPhone" @update="updateValue" />
            <InputText label="Website" keyValue="website" :value="data?.website" @update="updateValue" />
            <InputDate label="Tanggal Mulai" keyValue="startDate" :value="data?.startDate" @update="updateValue" />
            <InputDate label="Tanggal Selesai" keyValue="endDate" :value="data?.endDate" @update="updateValue" />
            <InputSelect label="Status" keyValue="status" :value="data?.status || 'active'" :options="statusOptions" @update="updateValue" />
            <InputImage label="Logo" keyValue="logo" :value="data?.logo" @update="updateValue" />
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
import { defineComponent, ref } from 'vue';
import InputText from '@/components/input/InputText.vue';
import InputTextArea from '@/components/input/InputTextArea.vue';
import InputImage from '@/components/input/InputImage.vue';
import InputSelect from '@/components/input/InputSelect.vue';
import InputDate from '@/components/input/InputDate.vue';
import { useStore } from 'vuex';
import { POST_KEMITRAAN, PUT_KEMITRAAN } from "@/store/kemitraan.module";

export default defineComponent({
  components: {
    InputText,
    InputTextArea,
    InputImage,
    InputSelect,
    InputDate,
  },
  props: {
    title: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: false
    },
    data: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const store = useStore();
    const modalContent = ref(null);
    const isLoading = ref(false);

    const typeOptions = ref(['sponsor', 'academic', 'industry', 'media', 'ngo', 'other']);
    const statusOptions = ref(['active', 'inactive', 'pending', 'expired']);

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const formData = {
      id: '',
      data: {} as Record<string, any>
    };

    const updateValue = (params: { key: string; value: any }) => {
      formData.data[params.key] = params.value;
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        if (props?.id) {
          formData.id = props?.id;
          await store.dispatch(PUT_KEMITRAAN, formData);
        } else {
          await store.dispatch(POST_KEMITRAAN, formData);
        }
        closeModal();
      } catch (error: any) {
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
      typeOptions,
      statusOptions,
    };
  },
});
</script>
