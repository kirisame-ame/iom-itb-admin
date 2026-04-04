<template>
  <Transition name="popup">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="handleClose"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-[540px] shadow-2xl flex flex-col max-h-[90vh]"
        @click.stop
      >

        <!-- Sticky header -->
        <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white rounded-t-2xl">
          <div>
            <p class="text-[13px] font-bold text-blue-600 uppercase tracking-widest mb-0.5">Detail Pengajuan</p>
            <h2 class="text-[17px] font-bold text-slate-900">#{{ item?.id }}</h2>
          </div>
          <button
            @click="handleClose"
            class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-blue-800 animate-spin" />
        </div>

        <!-- Scrollable body -->
        <div v-else class="overflow-y-auto px-6 py-5 flex flex-col gap-5">

          <!-- Informasi Dasar -->
          <section>
            <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Informasi Dasar</h3>
            <div class="bg-slate-50 rounded-xl p-4 flex flex-col gap-2.5 border border-slate-100">
              <!-- Nama -->
                <div class="flex items-start gap-3">
                <span class="text-xs font-medium text-slate-500 w-28 flex-shrink-0">Nama</span>
                <span class="text-sm text-slate-800 font-medium">{{ item?.nama ?? '—' }}</span>
                </div>

                <!-- NIM -->
                <div class="flex items-start gap-3">
                <span class="text-xs font-medium text-slate-500 w-28 flex-shrink-0">NIM</span>
                <span class="text-sm text-slate-800 font-medium">{{ item?.nim ?? '—' }}</span>
                </div>

                <!-- Jenis Bantuan -->
                <div class="flex items-start gap-3">
                <span class="text-xs font-medium text-slate-500 w-28 flex-shrink-0">Jenis Bantuan</span>
                <span class="text-sm text-slate-800 font-medium">{{ item?.jenisBantuan ?? '—' }}</span>
                </div>

                <!-- Tanggal Kirim -->
                <div class="flex items-start gap-3">
                <span class="text-xs font-medium text-slate-500 w-28 flex-shrink-0">Tanggal Kirim</span>
                <span class="text-sm text-slate-800 font-medium">{{ formatDate(item?.tanggalKirim) }}</span>
                </div>
              <div class="flex items-center gap-3">
                <span class="text-xs font-medium text-slate-500 w-28 flex-shrink-0">File Pengajuan</span>
                <a
                  href="#"
                  class="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1"
                >
                  {{ item?.filePengajuan }}
                  <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <!-- Alasan Pengajuan -->
          <section>
            <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Alasan Pengajuan</h3>
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p class="text-sm text-slate-700 leading-relaxed">{{ item?.alasanPengajuan }}</p>
            </div>
          </section>

          <!-- Pembaruan Status -->
          <section>
            <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Pembaruan Status</h3>
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-medium text-slate-500 w-24 flex-shrink-0">Status</span>
                <div class="relative flex-1">
                  <select
                    v-model="formStatus"
                    class="w-full appearance-none pl-3 pr-8 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Disetujui">Disetujui</option>
                    <option value="Ditolak">Ditolak</option>
                    <option value="Gagal">Gagal</option>
                  </select>
                  <svg class="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-xs font-medium text-slate-500 w-24 flex-shrink-0 pt-2">Keterangan</span>
                <textarea
                  v-model="formKeterangan"
                  rows="3"
                  placeholder="Tambahkan keterangan (opsional)..."
                  class="flex-1 px-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none placeholder-slate-400"
                />
              </div>
            </div>
          </section>

          <!-- Riwayat Perubahan -->
          <section>
            <h3 class="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Riwayat Perubahan</h3>

            <div v-if="!item?.riwayat?.length" class="text-sm text-slate-400 italic text-center py-4">
              Belum ada riwayat perubahan.
            </div>

            <div v-else class="flex flex-col">
              <div
                v-for="(rw, idx) in item.riwayat"
                :key="rw.id"
                class="flex gap-4 relative"
              >
                <div class="flex flex-col items-center flex-shrink-0" style="width: 20px;">
                  <div class="w-3 h-3 rounded-full bg-blue-800 ring-2 ring-blue-100 flex-shrink-0 mt-0.5 z-10" />
                  <div
                    v-if="idx < item.riwayat.length - 1"
                    class="flex-1 border-l-2 border-dashed border-slate-200 mt-1"
                    style="min-height: 32px;"
                  />
                </div>
                <div class="pb-5 flex-1">
                  <p class="text-sm font-semibold text-slate-800">{{ rw.keterangan }}</p>
                  <p class="text-xs text-slate-400 mt-0.5">
                    {{ formatDateTime(rw.waktu) }} · oleh <span class="font-medium text-slate-500">{{ rw.oleh }}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

          <!-- Simpan button -->
          <div class="pt-1 pb-1">
            <button
              @click="handleSimpan"
              :disabled="isSaving"
              class="w-full py-3 rounded-xl text-sm font-bold text-white bg-blue-800 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span v-if="isSaving" class="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
              {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>

        </div><!-- /scrollable body -->
      </div>
    </div>
  </Transition>

  <!-- Confirm: Simpan -->
  <ConfirmDialog
    v-model="showSimpanConfirm"
    title="Simpan Perubahan?"
    :message="`Anda akan mengubah status pengajuan #${item?.id} menjadi &quot;${formStatus}&quot;. Lanjutkan?`"
    confirm-label="Ya, Simpan"
    cancel-label="Batal"
    variant="primary"
    icon-variant="info"
    @confirm="doSimpan"
    @cancel="showSimpanConfirm = false"
  />

  <!-- Confirm: Tutup dengan unsaved changes -->
  <ConfirmDialog
    v-model="showCloseConfirm"
    title="Buang Perubahan?"
    message="Ada perubahan yang belum disimpan. Jika Anda menutup dialog ini, perubahan akan hilang."
    confirm-label="Ya, Tutup"
    cancel-label="Tetap di sini"
    variant="danger"
    icon-variant="danger"
    @confirm="doClose"
    @cancel="showCloseConfirm = false"
  />
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import { UPDATE_STATUS_PENGAJUAN } from '@/store/pengajuanBantuan.module'
import type { PengajuanBantuan, StatusPengajuan } from '@/store/pengajuanBantuan.module'
import ConfirmDialog from '@/components/modal/ConfirmDialog.vue'

// ─── props & emits ────────────────────────────────────────────────────────────
const props = defineProps<{
  modelValue: boolean
  item: PengajuanBantuan | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'saved'): void
}>()

// ─── store ────────────────────────────────────────────────────────────────────
const store = useStore()

// ─── form state ───────────────────────────────────────────────────────────────
const formStatus     = ref<StatusPengajuan>('Menunggu')
const formKeterangan = ref('')

// sync form ketika item berubah (modal dibuka dengan item baru)
watch(
  () => props.item,
  (val) => {
    if (val) {
      formStatus.value     = val.status
      formKeterangan.value = ''
    }
  },
  { immediate: true },
)

const hasChanges = computed(() => {
  if (!props.item) return false
  return (
    formStatus.value !== props.item.status ||
    formKeterangan.value.trim() !== ''
  )
})

// ─── close logic ──────────────────────────────────────────────────────────────
const showCloseConfirm = ref(false)

const handleClose = () => {
  if (hasChanges.value) {
    showCloseConfirm.value = true
  } else {
    doClose()
  }
}

const doClose = () => {
  showCloseConfirm.value = false
  formStatus.value       = 'Menunggu'
  formKeterangan.value   = ''
  emit('update:modelValue', false)
}

// ─── save logic ───────────────────────────────────────────────────────────────
const showSimpanConfirm = ref(false)
const isSaving          = ref(false)

const handleSimpan = () => {
  showSimpanConfirm.value = true
}

const doSimpan = async () => {
  showSimpanConfirm.value = false
  isSaving.value          = true
  try {
    await store.dispatch(`pengajuanBantuan/${UPDATE_STATUS_PENGAJUAN}`, {
      id: props.item!.id,
      status: formStatus.value,
      keterangan: formKeterangan.value,
    })
    formKeterangan.value = ''
    emit('saved')
  } catch (e) {
    console.error(e)
  } finally {
    isSaving.value = false
  }
}

// ─── utils ────────────────────────────────────────────────────────────────────
const formatDate = (iso?: string) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

const formatDateTime = (iso?: string) => {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}
</script>

<style scoped>
.popup-enter-active { animation: popup-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1); }
.popup-leave-active { animation: popup-out 0.18s ease; }
@keyframes popup-in  { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes popup-out { from { opacity: 1; transform: scale(1); }   to { opacity: 0; transform: scale(0.95); } }
</style>