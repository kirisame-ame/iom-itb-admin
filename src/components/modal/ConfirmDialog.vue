<template>
  <Transition name="popup">
    <div
      v-if="modelValue"
      class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100]"
      @click="$emit('cancel')"
    >
      <div
        class="bg-white rounded-2xl px-7 pt-8 pb-6 w-[380px] max-w-[calc(100vw-32px)] shadow-2xl"
        @click.stop
      >
        <!-- Icon slot -->
        <div
          class="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
          :class="iconVariant === 'danger' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'"
        >
          <svg v-if="iconVariant === 'danger'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-[17px] font-bold text-slate-900 mb-2 text-center">{{ title }}</h3>

        <!-- Message -->
        <p class="text-[13.5px] text-slate-500 mb-6 leading-relaxed text-center">{{ message }}</p>

        <!-- Actions -->
        <div class="flex gap-2.5">
          <button
            class="flex-1 py-2.5 rounded-[10px] border border-slate-200 bg-white text-slate-600 text-[13.5px] font-semibold transition-all duration-150 hover:bg-slate-50 hover:border-slate-300"
            @click="$emit('cancel')"
          >
            {{ cancelLabel ?? 'Batal' }}
          </button>
          <button
            class="flex-1 py-2.5 rounded-[10px] border-none text-white text-[13.5px] font-semibold transition-opacity duration-150 hover:opacity-90"
            :class="variant === 'danger' ? 'bg-red-600' : 'bg-blue-800'"
            @click="$emit('confirm')"
          >
            {{ confirmLabel ?? 'Ya' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'primary'   // controls confirm button color
  iconVariant?: 'danger' | 'info'  // controls icon
}>()

defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:modelValue', val: boolean): void
}>()
</script>

<style scoped>
.popup-enter-active { animation: popup-in 0.22s cubic-bezier(0.34, 1.56, 0.64, 1); }
.popup-leave-active { animation: popup-out 0.18s ease; }
@keyframes popup-in  { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }
@keyframes popup-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(0.95); } }
</style>