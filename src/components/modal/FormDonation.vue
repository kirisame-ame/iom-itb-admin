<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[680px]" @click.stop>
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <form @submit.prevent="handleSubmit">
          <div class="flex items-start justify-between gap-4 bg-blue-900 px-6 py-5 text-white">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-blue-100">Form Donasi</p>
              <h3 class="mt-1 text-xl font-bold capitalize">{{ title }}</h3>
              <p class="mt-1 text-sm text-blue-100">Catat donasi manual, nominal, kanal notifikasi, dan bukti bayar.</p>
            </div>
            <button type="button" class="rounded-full p-1.5 text-blue-100 transition hover:bg-white/10 hover:text-white" @click="closeModal">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="max-h-[75vh] space-y-5 overflow-y-auto bg-slate-50 px-6 py-6 text-slate-700">
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Data Donatur</p>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputText label="Nama" keyValue="name" :value="data?.name" @update="updateValue" :required="true" />
                <InputText label="Email" keyValue="email" :value="data?.email" @update="updateValue" />
                <InputText label="No WA" keyValue="noWhatsapp" :value="data?.noWhatsapp" @update="updateValue" />
              </div>
              <p class="mt-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">Email atau No WA wajib diisi salah satu.</p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Detail Donasi</p>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                    class="block w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    v-model="facultyId"
                  >
                    <option :value="null">- Tidak terkait fakultas -</option>
                    <option v-for="f in fakultasList" :key="f.id" :value="f.id">
                      {{ f.name }} (kode unik: {{ f.kodeUnik }})
                    </option>
                  </select>
                  <p v-if="selectedFaculty" class="mt-1 text-xs text-slate-500">
                    Nominal akhir akan ditambah kode unik <b>{{ selectedFaculty.kodeUnik }}</b>.
                  </p>
                </div>

                <InputPrice label="Uang yang didonasi" keyValue="amount" :value="data?.amount" @update="updateValue" :required="true" />
                <InputDate label="Tanggal uang masuk" keyValue="date" :value="data?.date" @update="updateValue" :required="true" />
                <InputText label="Bank" keyValue="bank" :value="data?.bank" @update="updateValue" />
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Publikasi & Bukti</p>
              <InputCheckboxOptions label="Notifikasi melalui?" :options="['whatsapp', 'email']" keyValue="notification" :value="data?.notification" @update="updateValue" :required="true" />
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputCheckbox label="Sembunyikan nama?" keyValue="nameIsHidden" :value="data?.options?.nameIsHidden" @update="updateValue" />
                <InputCheckbox label="Hamba Allah?" keyValue="isHambaAllah" :value="data?.options?.isHambaAllah" @update="updateValue" />
              </div>
              <InputImage label="Bukti Bayar" keyValue="image" :value="data?.proof" @update="updateValue" />
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
import { showError } from '@/utils/swal';

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
        showError('Gagal', error?.response?.data?.message || 'Gagal menyimpan donasi');
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
        showError('Gagal', err instanceof Error ? err.message : 'Gagal memuat daftar fakultas');
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
