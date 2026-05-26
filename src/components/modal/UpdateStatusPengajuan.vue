<template>
  <Teleport to="body">
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
        <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
          <div>
            <p class="text-[13px] font-bold text-blue-600 mb-0.5">Update Status</p>
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

        <div v-if="loading" class="flex items-center justify-center py-16">
          <div class="w-8 h-8 rounded-full border-[3px] border-slate-200 border-t-blue-800 animate-spin" />
        </div>

        <div v-else class="overflow-y-auto px-6 py-5 flex flex-col gap-5">

          <!-- Notification warning -->
          <div class="flex items-start gap-3 rounded-xl border px-4 py-3"
            :class="recipientEmail ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'"
          >
            <svg class="w-5 h-5 flex-shrink-0 mt-0.5" :class="recipientEmail ? 'text-amber-500' : 'text-slate-400'" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
            </svg>
            <div class="text-sm">
              <p v-if="recipientEmail" class="font-semibold text-amber-800">Pemohon akan dinotifikasi via email</p>
              <p v-else class="font-semibold text-slate-600">Tidak ada email pemohon</p>
              <p class="mt-0.5" :class="recipientEmail ? 'text-amber-700' : 'text-slate-500'">
                <template v-if="recipientEmail">
                  Setelah disimpan, notifikasi dikirim ke <strong>{{ recipientEmail }}</strong> berisi status terbaru dan catatan yang Anda isi.
                </template>
                <template v-else>
                  Tidak ada email yang ditemukan pada data pengajuan ini. Perubahan status akan disimpan tanpa notifikasi.
                </template>
              </p>
            </div>
          </div>

          <!-- Status form -->
          <section>
            <h3 class="text-sm font-semibold text-slate-500 mb-3">Perubahan Status</h3>
            <div class="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col gap-3">
              <div class="flex items-center gap-3">
                <span class="text-xs font-medium text-slate-500 w-20 flex-shrink-0">Status</span>
                <AppSelect
                  v-model="formStatus"
                  :options="statusOptions"
                  class="flex-1"
                />
              </div>

              <div class="flex items-start gap-3">
                <span class="text-xs font-medium text-slate-500 w-20 flex-shrink-0 pt-2">Catatan</span>
                <textarea
                  v-model="formKeterangan"
                  rows="3"
                  placeholder="Tambahkan catatan (opsional)..."
                  class="flex-1 px-3 py-2 text-sm text-slate-700 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none placeholder-slate-400"
                />
              </div>

              <div class="flex justify-end pt-1">
                <button
                  type="button"
                  @click="showEmailPreview = true"
                  :disabled="!recipientEmail"
                  class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-all"
                  :class="recipientEmail
                    ? 'text-slate-600 bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    : 'text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed'"
                >
                  <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                  </svg>
                  Preview Email
                  <span v-if="!recipientEmail" class="text-slate-400">(tidak ada email)</span>
                </button>
              </div>
            </div>
          </section>

          <!-- Riwayat -->
          <section>
            <h3 class="text-sm font-semibold text-slate-500 mb-3">Riwayat Perubahan</h3>
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
                    {{ formatDateTime(rw.waktu) }} &middot; oleh <span class="font-medium text-slate-500">{{ rw.oleh }}</span>
                  </p>
                </div>
              </div>
            </div>
          </section>

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

        </div>
      </div>
    </div>
  </Transition>
  </Teleport>

  <!-- Email preview overlay -->
  <Teleport to="body">
  <Transition name="popup">
    <div
      v-if="showEmailPreview"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
      @click="showEmailPreview = false"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-[620px] shadow-2xl flex flex-col max-h-[90vh]"
        @click.stop
      >
        <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
          <div>
            <p class="text-[13px] font-bold text-slate-400 mb-0.5">Pratinjau</p>
            <h3 class="text-[16px] font-bold text-slate-900">Email yang Akan Dikirim</h3>
          </div>
          <button
            @click="showEmailPreview = false"
            class="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="overflow-y-auto bg-slate-100 px-6 py-6">
          <iframe
            :srcdoc="emailPreviewIframeHtml"
            class="w-full border-0"
            style="height: 650px;"
            sandbox="allow-same-origin"
          />
          <p class="mt-4 text-xs text-center text-slate-400">
            * Logo dan waktu pengiriman yang tepat dapat berbeda pada email sebenarnya.
          </p>
        </div>
      </div>
    </div>
  </Transition>
  </Teleport>

  <ConfirmDialog
    v-model="showSimpanConfirm"
    title="Simpan Perubahan?"
    :message="simpanConfirmMessage"
    confirm-label="Ya, Simpan"
    cancel-label="Batal"
    variant="primary"
    icon-variant="info"
    @confirm="doSimpan"
    @cancel="showSimpanConfirm = false"
  />

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
import { ref, watch, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'
import Swal from 'sweetalert2'
import { UPDATE_STATUS_PENGAJUAN } from '@/store/pengajuanBantuan.module'
import type { PengajuanBantuan, StatusPengajuan } from '@/store/pengajuanBantuan.module'
import { STATUS_LABELS } from '@/utils/statusLabels'
import AppSelect from '@/components/input/AppSelect.vue'
import ConfirmDialog from '@/components/modal/ConfirmDialog.vue'
import { buildEmailPreviewDocument } from '@/utils/emailPreviewRenderer'
import logoBlueUrl from '@/assets/image/IOM-ITB-PrimaryLogo-blue.png'
import logoWhiteUrl from '@/assets/image/IOM-ITB-PrimaryLogo-white.png'

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000'

const EMAIL_STATUS_LABELS: Record<string, string> = {
  VERIFIKASI_BERKAS: 'Sedang Dalam Proses Verifikasi Berkas',
  DIPANGGIL_WAWANCARA: 'Dipanggil Wawancara',
  KEPUTUSAN_DITERIMA: 'Keputusan Akhir Diterima',
  KEPUTUSAN_DITOLAK: 'Keputusan Akhir Ditolak',
  TIDAK_DIKETAHUI: 'Tidak Diketahui',
}

// Fetched from the DB template so preview stays in sync with what is actually sent
const emailTemplateBody    = ref('')
const emailTemplateSubject = ref('')

onMounted(async () => {
  try {
    const res       = await axios.get(`${API_URL}/email-templates`)
    const templates = Array.isArray(res.data) ? res.data : []
    const t         = templates.find((x: any) => x.key === 'pengajuan_bantuan_status_update')
    if (t) {
      emailTemplateBody.value    = t.body    || ''
      emailTemplateSubject.value = t.subject || ''
    }
  } catch {
    // fail silently, preview falls back to inline default
  }
})

const statusOptions = [
  { value: 'TIDAK_DIKETAHUI',    label: 'Status Tidak Diketahui' },
  { value: 'VERIFIKASI_BERKAS',  label: 'Verifikasi Berkas' },
  { value: 'DIPANGGIL_WAWANCARA', label: 'Dipanggil Wawancara' },
  { value: 'KEPUTUSAN_DITERIMA', label: 'Keputusan Diterima' },
  { value: 'KEPUTUSAN_DITOLAK',  label: 'Keputusan Ditolak' },
]

const props = defineProps<{
  modelValue: boolean
  item: PengajuanBantuan | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
  (e: 'saved'): void
}>()

const store = useStore()

const formStatus     = ref<StatusPengajuan>('TIDAK_DIKETAHUI')
const formKeterangan = ref('')
const showEmailPreview = ref(false)

watch(
  () => props.item,
  (val) => {
    if (val) {
      formStatus.value     = val.status
      formKeterangan.value = val.catatan ?? ''
    }
  },
  { immediate: true },
)

const recipientEmail = computed(() => props.item?.answersByLabel?.Email ?? '')
const recipientName  = computed(() => props.item?.answersByLabel?.Nama  ?? '')

const hasChanges = computed(() => {
  if (!props.item) return false
  return (
    formStatus.value !== props.item.status ||
    formKeterangan.value !== (props.item.catatan ?? '')
  )
})

const simpanConfirmMessage = computed(() => {
  const label = STATUS_LABELS[formStatus.value] ?? formStatus.value
  if (recipientEmail.value) {
    return `Status pengajuan #${props.item?.id} akan diubah menjadi "${label}" dan notifikasi email dikirim ke ${recipientEmail.value}. Lanjutkan?`
  }
  return `Status pengajuan #${props.item?.id} akan diubah menjadi "${label}". Tidak ada email pemohon, perubahan disimpan tanpa notifikasi. Lanjutkan?`
})

const FALLBACK_EMAIL_BODY = `Halo {{name}},

Status pengajuan bantuan Anda telah diperbarui. Berikut detail terbaru:

ID Pengajuan: {{submission_id}}
Status: {{status}}
{{catatan_line}}
Waktu Update: {{updated_at}}

Silakan login ke sistem untuk melihat detail pengajuan Anda.

Terima kasih,
Tim Pengajuan Bantuan IOM ITB`

const emailPreviewIframeHtml = computed(() => {
  const statusLabel  = EMAIL_STATUS_LABELS[formStatus.value] ?? formStatus.value ?? 'Tidak Diketahui'
  const nowStr       = new Date().toLocaleString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta',
  })
  const catatanLine  = formKeterangan.value ? `Catatan: ${formKeterangan.value}` : ''

  const vars: Record<string, string> = {
    name:         recipientName.value || '-',
    submission_id: props.item?.tallySubmissionId || '-',
    status:       statusLabel,
    catatan_line: catatanLine,
    updated_at:   nowStr,
  }

  let body = emailTemplateBody.value || FALLBACK_EMAIL_BODY
  for (const [k, v] of Object.entries(vars)) {
    body = body.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v)
  }

  return buildEmailPreviewDocument({
    title: 'Update Status Pengajuan Bantuan',
    bodyText: body,
    logoBlueUrl,
    logoWhiteUrl,
  })
})

const showCloseConfirm  = ref(false)
const showSimpanConfirm = ref(false)
const isSaving          = ref(false)

const handleClose = () => {
  if (hasChanges.value) {
    showCloseConfirm.value = true
  } else {
    doClose()
  }
}

const doClose = () => {
  showCloseConfirm.value = false
  showEmailPreview.value = false
  formStatus.value       = 'TIDAK_DIKETAHUI'
  formKeterangan.value   = ''
  emit('update:modelValue', false)
}

const handleSimpan = () => {
  showSimpanConfirm.value = true
}

const doSimpan = async () => {
  showSimpanConfirm.value = false
  if (!props.item) return

  isSaving.value = true
  try {
    await store.dispatch(`pengajuanBantuan/${UPDATE_STATUS_PENGAJUAN}`, {
      tallySubmissionId: props.item.tallySubmissionId,
      status: formStatus.value,
      keterangan: formKeterangan.value,
    })
    emit('update:modelValue', false)
    emit('saved')
  } catch (error: unknown) {
    await Swal.fire({
      icon: 'error',
      title: 'Gagal menyimpan',
      text: error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan perubahan.',
      confirmButtonColor: '#2563eb',
    })
  } finally {
    isSaving.value = false
  }
}

const formatDateTime = (iso?: string) => {
  if (!iso) return '-'
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
