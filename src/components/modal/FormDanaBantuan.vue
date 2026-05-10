<template>
  <div class="fixed z-[998] bg-black top-0 right-0 w-full h-screen opacity-[0.4]"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[760px]" @click.stop>
      <form @submit.prevent="handleSubmit" class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
          <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
            <div>
              <h3 class="text-lg font-bold capitalize text-slate-900">{{ title }}</h3>
              <p class="mt-1 text-sm text-slate-500">Catat histori penyaluran dana bantuan kepada mahasiswa penerima manfaat.</p>
            </div>
            <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="max-h-[75vh] overflow-y-auto bg-white">
            <div class="divide-y divide-slate-100">
              <!-- Nama -->
              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[180px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Nama Lengkap <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Nama lengkap mahasiswa penerima bantuan.</p>
                </div>
                <input
                  v-model="localData.nama"
                  required
                  type="text"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="mis. Budi Santoso"
                />
              </div>

              <!-- NIM -->
              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[180px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">NIM <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Nomor Induk Mahasiswa.</p>
                </div>
                <input
                  v-model="localData.nim"
                  required
                  type="text"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="mis. 13512345"
                />
              </div>

              <!-- Prodi -->
              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[180px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Program Studi <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Fakultas atau Program Studi.</p>
                </div>
                <input
                  v-model="localData.program_studi"
                  required
                  type="text"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="mis. Teknik Informatika"
                />
              </div>

              <!-- Jenis Bantuan -->
              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[180px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Jenis Bantuan <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Kategori bantuan yang disalurkan.</p>
                </div>
                <AppSelect
                  v-model="localData.jenis_bantuan"
                  :options="['Biaya UKT', 'Biaya Hidup', 'Biaya Tugas Akhir', 'Biaya Kesehatan', 'Bantuan Orang Tua Asuh', 'Bantuan Lainnya']"
                  button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
                />
              </div>

              <!-- Periode -->
              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[180px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Periode Penyaluran <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Bulan dan tahun penyaluran.</p>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <AppSelect
                    v-model="localData.bulan"
                    :options="['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']"
                    button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
                  />
                  <input
                    v-model="localData.tahun"
                    required
                    type="text"
                    class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Tahun"
                  />
                </div>
              </div>

              <!-- Nominal -->
              <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[180px_1fr] md:items-start">
                <div>
                  <label class="text-sm font-semibold text-slate-900">Jumlah Bantuan <span class="text-red-500">*</span></label>
                  <p class="mt-0.5 text-xs text-slate-400">Total nominal dana yang disalurkan.</p>
                </div>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span class="text-sm font-bold text-slate-400">Rp</span>
                  </div>
                  <input
                    :value="formattedAmount"
                    required
                    type="text"
                    class="block w-full pl-10 pr-4 py-2 text-sm font-bold text-indigo-700 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    placeholder="0"
                    @input="onAmountInput"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
            <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
              Batal
            </button>
            <button type="submit" :disabled="isLoading" class="rounded-lg bg-[#003793] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 transition-all">
              {{ isLoading ? 'Menyimpan...' : 'Simpan Data' }}
            </button>
          </div>
        </form>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { POST_DANA_BANTUAN, PUT_DANA_BANTUAN } from "@/store/danaBantuan.module";
import AppSelect from '@/components/input/AppSelect.vue';

export default defineComponent({
  components: {
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
    const modalContent = ref(null);
    const isLoading = ref(false);

    const localData = reactive({
      nama: props.data?.penerima?.nama || props.data?.nama || '',
      nim: props.data?.penerima?.nim || props.data?.nim || '',
      program_studi: props.data?.penerima?.program_studi || props.data?.program_studi || '',
      jenis_bantuan: props.data?.jenis_bantuan || '',
      bulan: props.data?.bulan || '',
      tahun: props.data?.tahun || '',
      jumlah_donasi: props.data?.jumlah_donasi || 0,
    });

    const formattedAmount = computed(() => {
      const amount = Number(localData.jumlah_donasi || 0);
      if (!amount || Number.isNaN(amount)) return '';
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
      }).format(amount);
    });

    const onAmountInput = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const rawValue = input.value.replace(/\D/g, '');
      localData.jumlah_donasi = rawValue ? Number(rawValue) : 0;
      input.value = formattedAmount.value;
    };

    const closeModal = () => {
      isLoading.value = false;
      emit('close');
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        const payload = {
          nama: localData.nama,
          nim: localData.nim,
          program_studi: localData.program_studi,
          jenis_bantuan: localData.jenis_bantuan,
          bulan: localData.bulan,
          tahun: localData.tahun,
          jumlah_donasi: localData.jumlah_donasi,
        };

        if(props?.id){
          await store.dispatch(PUT_DANA_BANTUAN, { id: props.id, data: payload });
        }else{
          await store.dispatch(POST_DANA_BANTUAN, { data: payload });
        }
        closeModal();
      } catch (error:any) {
        alert(error?.response?.data?.message || 'Gagal menyimpan data');
        isLoading.value = false;
      }
    };

    return {
      modalContent,
      closeModal,
      handleSubmit,
      isLoading,
      localData,
      formattedAmount,
      onAmountInput
    };
  },
});
</script>
