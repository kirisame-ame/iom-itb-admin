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
            <InputText label="Nama" keyValue="name" :value="data?.name" @update="updateValue" :required="true" />
            <InputText label="Email" keyValue="email" :value="data?.email" @update="updateValue" />
            <InputText label="No WA" keyValue="noWhatsapp" :value="data?.noWhatsapp" @update="updateValue" />
            <p class="text-xs text-gray-500 -mt-1 mb-2">Email atau No WA wajib diisi salah satu.</p>

            <InputSelect
              label="Jenis Donasi"
              keyValue="donationType"
              :value="data?.donationType"
              :options="donationTypeOptions"
              @update="updateValue"
            />

            <div class="relative mt-2 rounded-md shadow-sm">
              <label class="text-sm capitalize">Fakultas</label>
              <select
                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                v-model="facultyId"
              >
                <option :value="null">- Tidak terkait fakultas -</option>
                <option v-for="f in fakultasList" :key="f.id" :value="f.id">
                  {{ f.name }} (kode unik: {{ f.kodeUnik }})
                </option>
              </select>
              <p v-if="selectedFaculty" class="text-xs text-gray-500 mt-1">
                Nominal akhir akan ditambah kode unik <b>{{ selectedFaculty.kodeUnik }}</b>.
              </p>
            </div>

            <InputPrice label="Uang yang didonasi" keyValue="amount" :value="data?.amount" @update="updateValue" :required="true" />
            <InputDate label="Tanggal uang masuk" keyValue="date" :value="data?.date" @update="updateValue" :required="true" />
            <InputText label="Bank" keyValue="bank" :value="data?.bank" @update="updateValue" />
            <InputCheckboxOptions label="Notifikasi melalui?" :options="['whatsapp', 'email']" keyValue="notification" :value="data?.notification" @update="updateValue" :required="true" />
            <InputCheckbox label="Sembunyikan nama?" keyValue="nameIsHidden" :value="data?.options?.nameIsHidden" @update="updateValue" />
            <InputCheckbox label="Hamba Allah?" keyValue="isHambaAllah" :value="data?.options?.isHambaAllah" @update="updateValue" />
            <InputImage label="Bukti Bayar" keyValue="image" :value="data?.proof" @update="updateValue" />
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
import { defineComponent, ref, computed, onMounted, watch } from 'vue';
import InputText from '@/components/input/InputText.vue';
import InputImage from '@/components/input/InputImageCostume.vue';
import InputCheckbox from '../input/InputCheckbox.vue';
import InputCheckboxOptions from '../input/InputCheckboxOptions.vue';
import InputPrice from '../input/InputPrice.vue';
import InputDate from '../input/InputDate.vue';
import InputSelect from '../input/InputSelect.vue';
import { useStore } from 'vuex';
import { POST_DONASI, PUT_DONASI } from '@/store/donasi.module';
import { POST_IMAGE } from '@/store/upload.module';
import { GET_FAKULTAS, Fakultas } from '@/store/fakultas.module';

const DONATION_TYPE_OPTIONS = [
  'iuran_sukarela',
  'kontribusi_anggota',
  'kontribusi_donatur',
  'pembelian_merchandise',
  'kontribusi_sukarela',
];

export default defineComponent({
  components: {
    InputText,
    InputImage,
    InputCheckbox,
    InputCheckboxOptions,
    InputPrice,
    InputDate,
    InputSelect,
  },
  props: {
    title: { type: String, required: true },
    id: { type: String, required: false },
    data: { type: Object, required: false, default: () => ({}) },
  },
  setup(props, { emit }) {
    const store = useStore();
    const modalContent = ref(null);
    const isLoading = ref(false);
    const facultyId = ref<number | null>(props.data?.facultyId ?? null);

    const donationTypeOptions = ref(DONATION_TYPE_OPTIONS);

    const fakultasList = computed<Fakultas[]>(() => store.getters.fakultas || []);
    const selectedFaculty = computed<Fakultas | undefined>(() =>
      fakultasList.value.find((f) => f.id === facultyId.value)
    );

    const formData = {
      id: '',
      data: {} as Record<string, any>,
    };

    const updateValue = (params: { key: string; value: any }) => {
      formData.data[params.key] = params.value;
    };

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        formData.data.facultyId = facultyId.value;

        if (formData.data.image) {
          if (typeof formData.data.image !== 'string') {
            const response = await store.dispatch(POST_IMAGE, { data: formData.data.image });
            formData.data.proof = response || '';
          } else {
            formData.data.proof = formData.data.image;
          }
          delete formData.data.image;
        }

        if (props.id) {
          formData.id = props.id;
          await store.dispatch(PUT_DONASI, formData);
        } else {
          await store.dispatch(POST_DONASI, formData);
        }
        closeModal();
      } catch (error: any) {
        alert(error?.response?.data?.message || 'Gagal menyimpan donasi');
        isLoading.value = false;
      }
    };

    watch(
      () => props.data?.facultyId,
      (v) => {
        if (v != null) facultyId.value = v;
      }
    );

    onMounted(async () => {
      try {
        if (!fakultasList.value.length) await store.dispatch(GET_FAKULTAS);
      } catch (err) {
        console.error('Failed to load fakultas list', err);
      }
    });

    return {
      modalContent,
      closeModal,
      handleSubmit,
      updateValue,
      isLoading,
      donationTypeOptions,
      fakultasList,
      facultyId,
      selectedFaculty,
    };
  },
});
</script>
