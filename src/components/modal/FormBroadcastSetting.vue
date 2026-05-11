<template>
  <div class="fixed inset-0 z-[999] flex items-center justify-center p-4 backdrop-blur-sm bg-slate-900/50" @click.self="closeModal">
    <div ref="modalContent" class="w-full max-w-[760px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl" @click.stop>
      <form @submit.prevent="handleSubmit" novalidate>
        <div class="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
          <div>
            <h3 class="text-lg font-bold capitalize text-slate-900">{{ title }}</h3>
            <p class="mt-1 text-sm text-slate-500">Konfigurasi pesan pengingat otomatis via WhatsApp & Email.</p>
          </div>
          <button type="button" class="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" @click="closeModal">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="max-h-[75vh] overflow-y-auto bg-white">
          <div class="divide-y divide-slate-100">
            <!-- Name -->
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">Nama Pengaturan <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Judul internal untuk membedakan broadcast.</p>
              </div>
              <input
                v-model="form.name"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. Pengingat Iuran Wajib Bulanan"
              />
            </div>

            <!-- Jenis Iuran -->
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">Jenis Iuran <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Variabel {{jenisIuran}} pada pesan.</p>
              </div>
              <input
                v-model="form.jenisIuran"
                type="text"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="mis. Iuran Wajib Bulanan"
              />
            </div>

            <!-- Interval & Schedule -->
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">Jadwal Pengiriman <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Interval dan waktu eksekusi otomatis.</p>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <AppSelect
                  v-model="form.scheduleInterval"
                  :options="[
                    { value: 'weekly', label: 'Mingguan' },
                    { value: 'monthly', label: 'Bulanan' },
                    { value: '3months', label: '3 Bulanan' }
                  ]"
                  button-class="bg-slate-50 text-slate-800 focus:ring-blue-500/20"
                />
                <input
                  v-model.number="form.scheduleDay"
                  type="number"
                  :min="1"
                  :max="form.scheduleInterval === 'weekly' ? 7 : 31"
                  class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  :placeholder="form.scheduleInterval === 'weekly' ? 'Hari ke- (1-7)' : 'Tanggal (1-31)'"
                />
              </div>
            </div>

            <!-- Template -->
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">Template Pesan <span class="text-red-500">*</span></label>
                <p class="mt-0.5 text-xs text-slate-400">Gunakan {{name}} dan {{jenisIuran}} sebagai variabel dinamis.</p>
              </div>
              <textarea
                v-model="form.template"
                rows="5"
                class="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Halo {{name}}, ini adalah pengingat pembayaran {{jenisIuran}} IOM ITB. Mohon segera melunasi iuran Anda. Terima kasih."
              ></textarea>
            </div>

            <!-- Status -->
            <div class="grid grid-cols-1 gap-3 px-5 py-4 md:grid-cols-[200px_1fr] md:items-start">
              <div>
                <label class="text-sm font-semibold text-slate-900">Status Aktif</label>
                <p class="mt-0.5 text-xs text-slate-400">Pesan akan dikirim otomatis jika aktif.</p>
              </div>
              <label class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer w-fit">
                <input type="checkbox" v-model="form.isActive" class="h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-500" />
                Jadwal Aktif
              </label>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4">
          <button type="button" @click="closeModal" class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
            Batal
          </button>
          <button type="submit" :disabled="isLoading" class="rounded-lg bg-[#003793] px-6 py-2 text-sm font-bold text-white shadow-sm hover:bg-blue-800 transition-all disabled:cursor-not-allowed disabled:opacity-60">
            {{ isLoading ? 'Menyimpan...' : 'Simpan Pengaturan' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { POST_BROADCAST_SETTING, PUT_BROADCAST_SETTING } from '@/store/broadcast.module';
import Swal from 'sweetalert2';
import AppSelect from '@/components/input/AppSelect.vue';

export default defineComponent({
  components: {
    AppSelect,
  },
  props: {
    title: { type: String, required: true },
    id: { type: Number, required: false },
    data: { type: Object, required: false, default: () => ({}) },
  },
  setup(props, { emit }) {
    const store = useStore();
    const isLoading = ref(false);
    const modalContent = ref(null);

    const form = reactive({
      name: props.data?.name || '',
      jenisIuran: props.data?.jenisIuran || '',
      scheduleInterval: props.data?.scheduleInterval || '',
      scheduleDay: props.data?.scheduleDay || 1,
      template: props.data?.template || 'Halo {{name}}, ini adalah pengingat pembayaran {{jenisIuran}} IOM ITB. Mohon segera melunasi iuran Anda. Terima kasih.',
      isActive: props.data?.isActive !== undefined ? props.data.isActive : true,
    });

    const closeModal = () => {
      emit('close');
    };

    const handleSubmit = async () => {
      const errors: string[] = [];
      if (!form.name.trim()) errors.push('Nama setting wajib diisi.');
      if (!form.jenisIuran.trim()) errors.push('Jenis iuran wajib diisi.');
      if (!form.scheduleInterval) errors.push('Interval wajib dipilih.');
      if (!form.scheduleDay || form.scheduleDay < 1) errors.push('Hari/tanggal tidak valid.');
      if (form.scheduleInterval === 'weekly' && form.scheduleDay > 7) errors.push('Hari harus antara 1-7.');
      if (['monthly', '3months'].includes(form.scheduleInterval) && form.scheduleDay > 31) errors.push('Tanggal harus antara 1-31.');
      if (!form.template.trim()) errors.push('Template pesan wajib diisi.');

      if (errors.length) {
        Swal.fire({
          title: 'Validasi',
          html: errors.join('<br>'),
          icon: 'warning',
          confirmButtonColor: '#003793',
        });
        return;
      }

      isLoading.value = true;
      try {
        if (props.id) {
          await store.dispatch(PUT_BROADCAST_SETTING, { id: props.id, data: { ...form } });
        } else {
          await store.dispatch(POST_BROADCAST_SETTING, { ...form });
        }
        closeModal();
      } catch (err: any) {
        Swal.fire({
          title: 'Error',
          text: err?.response?.data?.message || 'Terjadi kesalahan.',
          icon: 'error',
          confirmButtonColor: '#003793',
        });
        isLoading.value = false;
      }
    };

    return { form, isLoading, modalContent, closeModal, handleSubmit };
  },
});
</script>