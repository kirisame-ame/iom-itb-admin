<template>
  <div class="fixed inset-0 z-[998] bg-slate-900/50 backdrop-blur-sm"></div>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4" @click="closeModal">
    <div ref="modalContent" class="w-full max-w-[760px]" @click.stop>
      <form @submit.prevent="handleSubmit" class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wider text-blue-700">Kegiatan Kemitraan</p>
            <h3 class="mt-1 text-lg font-bold capitalize text-slate-900">{{ title }}</h3>
            <p class="mt-1 text-sm text-slate-500">Lengkapi informasi utama, jadwal, dan gambar publikasi kegiatan.</p>
          </div>
          <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="max-h-[75vh] overflow-y-auto bg-white">
          <div class="divide-y divide-slate-100">
            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Mitra <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Pilih mitra yang terkait.</p>
              </div>
              <AppSelect
                v-model="formData.data.kemitraanId"
                :options="kemitraanSelectOptions"
                button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Nama Kegiatan <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Judul kegiatan yang tampil di publik.</p>
              </div>
              <input
                v-model="formData.data.name"
                required
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. Workshop Karier Bersama Mitra"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-start">
              <div class="md:pt-2">
                <label class="text-sm font-semibold text-slate-700">Deskripsi</label>
                <p class="mt-0.5 text-xs text-slate-400">Ringkasan singkat kegiatan.</p>
              </div>
              <textarea
                v-model="formData.data.description"
                rows="3"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Deskripsi kegiatan..."
              ></textarea>
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Lokasi</label>
                <p class="mt-0.5 text-xs text-slate-400">Lokasi atau kanal pelaksanaan.</p>
              </div>
              <input
                v-model="formData.data.location"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. Aula Barat ITB"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Status</label>
                <p class="mt-0.5 text-xs text-slate-400">Tahap pelaksanaan kegiatan.</p>
              </div>
              <AppSelect
                v-model="formData.data.status"
                :options="statusOptions"
                button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
              />
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Periode</label>
                <p class="mt-0.5 text-xs text-slate-400">Tanggal mulai dan selesai.</p>
              </div>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  v-model="formData.data.startDate"
                  type="date"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
                <input
                  v-model="formData.data.endDate"
                  type="date"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 gap-3 px-5 py-3 md:grid-cols-[170px_1fr] md:items-center">
              <div>
                <label class="text-sm font-semibold text-slate-700">Gambar</label>
                <p class="mt-0.5 text-xs text-slate-400">Poster atau dokumentasi kegiatan.</p>
              </div>
              <div class="flex items-center gap-3">
                <div class="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <img v-if="imagePreview" :src="imagePreview" alt="Preview gambar" class="h-full w-full object-cover" />
                  <span v-else class="text-xs text-slate-400">Kosong</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  @change="onImageChange"
                  class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 px-5 py-3">
          <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Batal
          </button>
          <button type="submit" :disabled="isLoading" class="rounded-lg bg-blue-800 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            {{ isLoading ? "Menyimpan..." : "Simpan" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed, reactive, watch } from "vue";
import { useStore } from "vuex";
import {
  POST_KEGIATAN_KEMITRAAN,
  PUT_KEGIATAN_KEMITRAAN,
} from "@/store/kegiatanKemitraan.module";
import { GET_KEMITRAAN } from "@/store/kemitraan.module";
import { showError } from "@/utils/swal";
import AppSelect from "@/components/input/AppSelect.vue";

interface KemitraanOption {
  id?: number | string;
  name?: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

type KegiatanKemitraanFormValue = string | number | File | null | undefined;

const toInputDate = (value: unknown) => {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default defineComponent({
  components: {
    AppSelect,
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
    const imageFile = ref<File | null>(null);
    const imagePreviewLocal = ref("");

    const statusOptions = ref([
      { value: "planned", label: "Direncanakan" },
      { value: "ongoing", label: "Berlangsung" },
      { value: "completed", label: "Selesai" },
      { value: "cancelled", label: "Dibatalkan" },
    ]);

    const kemitraanOptions = computed(() => {
      const list = (store.getters.kemitraan || []) as KemitraanOption[];
      return list
        .filter((k) => k?.id && k?.name)
        .map((k) => ({
          label: k.name,
          value: Number(k.id),
        }));
    });
    const kemitraanSelectOptions = computed(() => [
      { value: "", label: "Pilih mitra", disabled: true },
      ...kemitraanOptions.value,
    ]);

    const closeModal = () => {
      isLoading.value = false;
      emit("close");
    };

    const formData = reactive({
      id: "",
      data: {
        ...props.data,
        status: props.data?.status || "planned",
        kemitraanId: props.data?.kemitraanId ? Number(props.data.kemitraanId) : "",
        startDate: toInputDate(props.data?.startDate),
        endDate: toInputDate(props.data?.endDate),
      } as Record<string, unknown>,
    });

    const imagePreview = computed(() => {
      if (imagePreviewLocal.value) return imagePreviewLocal.value;
      return typeof formData.data.image === "string" ? formData.data.image : "";
    });

    const onImageChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0] || null;
      imageFile.value = file;
      if (!file) {
        imagePreviewLocal.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        imagePreviewLocal.value = (reader.result as string) || "";
      };
      reader.readAsDataURL(file);
      formData.data.image = file;
    };

    const buildPayload = () => {
      if (!imageFile.value) return formData.data;

      const payload = new FormData();
      Object.entries(formData.data).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "image") return;
        payload.append(key, String(value as KegiatanKemitraanFormValue));
      });
      payload.append("image", imageFile.value);
      return payload;
    };

    const handleSubmit = async () => {
      isLoading.value = true;
      try {
        if (!Number.isInteger(Number(formData.data.kemitraanId)) || Number(formData.data.kemitraanId) <= 0) {
          throw new Error("Mitra wajib dipilih dari daftar yang tersedia");
        }
        formData.data.kemitraanId = Number(formData.data.kemitraanId);
        const payload = buildPayload();
        if (props?.id) {
          formData.id = props?.id;
          await store.dispatch(PUT_KEGIATAN_KEMITRAAN, { id: formData.id, data: payload });
        } else {
          await store.dispatch(POST_KEGIATAN_KEMITRAAN, { data: payload });
        }
        closeModal();
      } catch (error: unknown) {
        const apiError = error as ApiError;
        showError("Gagal", apiError?.response?.data?.message || (error instanceof Error ? error.message : "Gagal menyimpan kegiatan kemitraan"));
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

    watch(kemitraanOptions, (options) => {
      if (!formData.data.kemitraanId && options.length) {
        formData.data.kemitraanId = options[0].value;
      }
    }, { immediate: true });

    return {
      modalContent,
      formData,
      imagePreview,
      closeModal,
      handleSubmit,
      buildPayload,
      onImageChange,
      isLoading,
      statusOptions,
      kemitraanOptions,
      kemitraanSelectOptions,
    };
  },
});
</script>
