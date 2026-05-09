<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
    :class="badgeClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const STATUS_LABELS: Record<string, string> = {
  TIDAK_DIKETAHUI: 'Status Tidak Diketahui',
  VERIFIKASI_BERKAS: 'Verifikasi Berkas',
  DIPANGGIL_WAWANCARA: 'Dipanggil Wawancara',
  KEPUTUSAN_DITERIMA: 'Keputusan Diterima',
  KEPUTUSAN_DITOLAK: 'Keputusan Ditolak',
}

const props = defineProps<{ status: string }>()

const label = computed(() => STATUS_LABELS[props.status] ?? props.status)

const badgeClass = computed(() => ({
  'bg-yellow-100 text-yellow-700': props.status === 'VERIFIKASI_BERKAS',
  'bg-blue-100 text-blue-700':     props.status === 'DIPANGGIL_WAWANCARA',
  'bg-green-100 text-green-700':   props.status === 'KEPUTUSAN_DITERIMA',
  'bg-red-100 text-red-700':       props.status === 'KEPUTUSAN_DITOLAK',
  'bg-slate-100 text-slate-500':   props.status === 'TIDAK_DIKETAHUI' || !STATUS_LABELS[props.status],
}))
</script>
