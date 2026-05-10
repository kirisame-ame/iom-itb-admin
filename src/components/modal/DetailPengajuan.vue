<template>
  <Teleport to="body">
  <Transition name="popup">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="doClose"
    >
      <div
        class="bg-white rounded-2xl w-full max-w-[580px] shadow-2xl flex flex-col max-h-[90vh]"
        @click.stop
      >
        <div class="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl">
          <div>
            <p class="text-[13px] font-bold text-blue-600 mb-0.5">Data Pengajuan</p>
            <h2 class="text-[17px] font-bold text-slate-900">#{{ item?.id }}</h2>
          </div>
          <button
            @click="doClose"
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

          <section>
            <h3 class="text-sm font-semibold text-slate-500 mb-3">Data Pengajuan</h3>
            <div class="bg-slate-50 rounded-xl border border-slate-100 divide-y divide-slate-100">
              <div
                v-for="[label, value] in Object.entries(item?.answersByLabel ?? {})"
                :key="label"
                class="px-4 py-3"
              >
                <p class="text-xs font-medium text-slate-500 mb-1">{{ label }}</p>
                <a
                  v-if="isUrl(value)"
                  :href="value"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-900 hover:underline"
                >
                  {{ label }}
                  <svg class="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                </a>
                <p v-else class="text-sm text-slate-800 leading-relaxed break-words whitespace-pre-wrap">{{ value }}</p>
              </div>
              <div v-if="!Object.keys(item?.answersByLabel ?? {}).length" class="px-4 py-6 text-sm text-slate-400 italic text-center">
                Tidak ada data tersedia.
              </div>
            </div>
          </section>

          <section>
            <h3 class="text-sm font-semibold text-slate-500 mb-3">Riwayat Status</h3>
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

        </div>
      </div>
    </div>
  </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import type { PengajuanBantuan } from '@/store/pengajuanBantuan.module'

const props = defineProps<{
  modelValue: boolean
  item: PengajuanBantuan | null
  loading?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void
}>()

const doClose = () => emit('update:modelValue', false)

function isUrl(val?: string): boolean {
  return typeof val === 'string' && /^https?:\/\//.test(val)
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
