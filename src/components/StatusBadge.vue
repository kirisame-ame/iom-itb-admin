<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
    :class="badgeClass"
  >
    {{ status }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StatusPengajuan } from '@/store/pengajuanBantuan.module'

const props = defineProps<{ status: string }>()

const badgeClass = computed(() => ({
  'bg-slate-100 text-slate-600': props.status === 'Menunggu',
  'bg-green-100 text-green-700': props.status === 'Disetujui',
  'bg-red-100 text-red-700':     props.status === 'Gagal' || props.status === 'Ditolak',
}))
</script>