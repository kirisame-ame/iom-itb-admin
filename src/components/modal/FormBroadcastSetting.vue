<template>
  <div class="fixed z-[998] bg-black top-0 right-0 w-full h-screen opacity-[0.4]"></div>
  <div class="fixed z-[999] flex justify-center items-center w-screen h-screen top-0 right-0" @click="closeModal">
    <div ref="modalContent" @click.stop>
      <div class="w-[560px] max-w-[95vw] overflow-hidden bg-white border rounded-md shadow-md">
        <form @submit.prevent="handleSubmit" novalidate>
          <div class="flex items-center justify-between px-5 py-3 text-gray-700 border-b">
            <h3 class="text-sm font-semibold capitalize text-slate-900">{{ title }}</h3>
            <button type="button" @click="closeModal">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-5 py-5 text-gray-700 bg-gray-50 border-b max-h-[75vh] overflow-y-auto space-y-4">
            <!-- Name -->
            <div>
              <label class="block mb-1.5 text-sm font-semibold text-slate-900">Nama Setting <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="cth: Pengingat Iuran Wajib Bulanan"
              />
            </div>

            <!-- Jenis Iuran -->
            <div>
              <label class="block mb-1.5 text-sm font-semibold text-slate-900">Jenis Iuran <span class="text-red-500">*</span></label>
              <input
                v-model="form.jenisIuran"
                type="text"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="cth: Iuran Wajib Bulanan"
              />
            </div>

            <!-- Interval + Day -->
            <div class="flex gap-3">
              <div class="flex-1">
                <label class="block mb-1.5 text-sm font-semibold text-slate-900">Interval <span class="text-red-500">*</span></label>
                <select
                  v-model="form.scheduleInterval"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="" disabled>-- Pilih --</option>
                  <option value="weekly">Mingguan</option>
                  <option value="monthly">Bulanan</option>
                  <option value="3months">3 Bulanan</option>
                </select>
              </div>
              <div class="flex-1">
                <label class="block mb-1.5 text-sm font-semibold text-slate-900">
                  {{ form.scheduleInterval === 'weekly' ? 'Hari (1=Sen, 7=Min)' : 'Tanggal (1-31)' }}
                  <span class="text-red-500">*</span>
                </label>
                <input
                  v-model.number="form.scheduleDay"
                  type="number"
                  :min="1"
                  :max="form.scheduleInterval === 'weekly' ? 7 : 31"
                  class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="cth: 1"
                />
              </div>
            </div>

            <!-- Template -->
            <div>
              <label class="block mb-1.5 text-sm font-semibold text-slate-900">
                Template Pesan <span class="text-red-500">*</span>
                <span class="text-xs text-gray-400 ml-1">(gunakan &#123;&#123;name&#125;&#125; dan &#123;&#123;jenisIuran&#125;&#125;)</span>
              </label>
              <textarea
                v-model="form.template"
                rows="5"
                class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder="Halo {{name}}, ini adalah pengingat pembayaran {{jenisIuran}} IOM ITB. Mohon segera melunasi iuran Anda. Terima kasih."
              ></textarea>
            </div>

            <!-- Status -->
            <div class="flex items-center gap-3">
              <input type="checkbox" id="isActive" v-model="form.isActive" class="w-4 h-4 accent-indigo-600" />
              <label for="isActive" class="text-sm font-medium text-slate-900">Aktifkan jadwal otomatis</label>
            </div>
          </div>

          <div class="flex items-center justify-between px-5 py-3">
            <button type="button" @click="closeModal" class="px-3 py-1 text-sm text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
              Batal
            </button>
            <button type="submit" :disabled="isLoading" class="px-4 py-1.5 text-sm text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-60">
              {{ isLoading ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from 'vue';
import { useStore } from 'vuex';
import { POST_BROADCAST_SETTING, PUT_BROADCAST_SETTING } from '@/store/broadcast.module';
import Swal from 'sweetalert2';

export default defineComponent({
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
        Swal.fire('Validasi', errors.join('<br>'), 'warning');
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
        Swal.fire('Error', err?.response?.data?.message || 'Terjadi kesalahan.', 'error');
        isLoading.value = false;
      }
    };

    return { form, isLoading, modalContent, closeModal, handleSubmit };
  },
});
</script>
