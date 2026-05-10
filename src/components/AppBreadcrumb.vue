<template>
  <nav class="mb-6 text-sm font-semibold" aria-label="Breadcrumb">
    <ol class="inline-flex list-none items-center p-0">
      <li class="flex items-center">
        <router-link to="/dashboard" class="text-slate-500 transition hover:text-blue-700">
          Dashboard
        </router-link>
        <svg
          class="mx-3 h-3 w-3 fill-current text-slate-300"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
          aria-hidden="true"
        >
          <path
            d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"
          />
        </svg>
      </li>
      <li class="flex min-w-0 items-center" aria-current="page">
        <span class="truncate text-slate-800">
          {{ breadcrumbName }}
        </span>
      </li>
    </ol>
  </nav>
</template>
<script lang="ts" setup>
import { defineProps, computed } from 'vue'
const props = defineProps<{ breadcrumb: string }>()

const breadcrumbLabels: Record<string, string> = {
  'dashboard-pembayaran': 'Dashboard Pembayaran',
  'fakultas': 'Fakultas',
  'kemitraan': 'Kemitraan',
  'kegiatan-kemitraan': 'Kegiatan Kemitraan',
  'transaksi-merchandise': 'Transaksi Merchandise',
  'merchandise-dashboard': 'Dashboard Merchandise',
}

const breadcrumbName = computed(() => {
  const value = props.breadcrumb.trim()
  if (breadcrumbLabels[value]) return breadcrumbLabels[value]

  return value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
})
</script>
