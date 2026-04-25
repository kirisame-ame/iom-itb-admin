<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[680px]" @click.stop>
      <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <form @submit.prevent="handleSubmit">
          <div class="flex items-start justify-between gap-4 bg-blue-900 px-6 py-5 text-white">
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider text-blue-100">Form Kegiatan Kemitraan</p>
              <h3 class="mt-1 text-xl font-bold capitalize">{{ title }}</h3>
              <p class="mt-1 text-sm text-blue-100">Hubungkan kegiatan dengan mitra, lokasi, periode, status, dan gambar publikasi.</p>
            </div>
            <button type="button" class="rounded-full p-1.5 text-blue-100 transition hover:bg-white/10 hover:text-white" @click="closeModal">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="max-h-[75vh] space-y-5 overflow-y-auto bg-slate-50 px-6 py-6 text-slate-700">
            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Informasi Kegiatan</p>
              <InputSelect
                label="Mitra"
                keyValue="kemitraanId"
                :value="data?.kemitraanId"
                :options="kemitraanOptions"
                @update="updateValue"
                :required="true"
              />
              <InputText label="Nama Kegiatan" keyValue="name" :value="data?.name" @update="updateValue" :required="true" />
              <InputTextArea label="Deskripsi" keyValue="description" :value="data?.description" @update="updateValue" />
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Pelaksanaan</p>
              <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InputText label="Lokasi" keyValue="location" :value="data?.location" @update="updateValue" />
                <InputSelect
                  label="Status"
                  keyValue="status"
                  :value="data?.status || 'planned'"
                  :options="statusOptions"
                  @update="updateValue"
                />
                <InputDate label="Tanggal Mulai" keyValue="startDate" :value="data?.startDate" @update="updateValue" />
                <InputDate label="Tanggal Selesai" keyValue="endDate" :value="data?.endDate" @update="updateValue" />
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Media</p>
              <InputImage label="Gambar" keyValue="image" :value="data?.image" @update="updateValue" />
            </div>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-white px-6 py-4">
            <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 focus:outline-none">
              Batal
            </button>
            <button type="submit" :disabled="isLoading" class="rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60">
              {{ isLoading ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import InputText from "@/components/input/InputText.vue";
import InputTextArea from "@/components/input/InputTextArea.vue";
import InputImage from "@/components/input/InputImage.vue";
import InputSelect from "@/components/input/InputSelect.vue";
import InputDate from "@/components/input/InputDate.vue";
import { useStore } from "vuex";
import {
  POST_KEGIATAN_KEMITRAAN,
  PUT_KEGIATAN_KEMITRAAN,
} from "@/store/kegiatanKemitraan.module";
import { GET_KEMITRAAN } from "@/store/kemitraan.module";
import { showError } from "@/utils/swal";

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
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
    data: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const store = useStore();
    const modalContent = ref(null);
    const isLoading = ref(false);

    const statusOptions = ref(["planned", "ongoing", "completed", "cancelled"]);

    const kemitraanOptions = computed<string[]>(() => {
      const list = store.getters.kemitraan || [];
      return list.map((k: any) => k?.name).filter(Boolean);
    });

    const closeModal = () => {
      isLoading.value = false;
      emit("close");
    };

    const formData = {
      id: "",
      data: {} as Record<string, any>,
    };

    const updateValue = (params: { key: string; value: any }) => {
      formData.data[params.key] = params.value;
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        if (props?.id) {
          formData.id = props?.id;
          await store.dispatch(PUT_KEGIATAN_KEMITRAAN, formData);
        } else {
          await store.dispatch(POST_KEGIATAN_KEMITRAAN, formData);
        }
        closeModal();
      } catch (error: any) {
        showError("Gagal", error?.response?.data?.message || "Gagal menyimpan kegiatan kemitraan");
        isLoading.value = false;
      }
    };

    onMounted(async () => {
      try {
        await store.dispatch(GET_KEMITRAAN, { data: { limit: 100 } });
      } catch (err) {
        showError("Gagal", err instanceof Error ? err.message : "Gagal memuat daftar kemitraan");
      }
    });

    return {
      modalContent,
      closeModal,
      handleSubmit,
      updateValue,
      isLoading,
      statusOptions,
      kemitraanOptions,
    };
  },
});
</script>
