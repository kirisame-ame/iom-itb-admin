<template>
  <Teleport to="body">
    <div class="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium min-w-[280px] max-w-[360px]"
          :class="toast.type === 'success'
            ? 'bg-green-50 text-green-800 border border-green-200'
            : 'bg-red-50 text-red-800 border border-red-200'"
        >
          <!-- Icon -->
          <svg v-if="toast.type === 'success'" class="w-5 h-5 text-green-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <svg v-else class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span class="flex-1">{{ toast.message }}</span>
          <button @click="remove(toast.id)" class="text-current opacity-50 hover:opacity-100 transition-opacity">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </transition-group>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

const toasts = ref<Toast[]>([]);
let counter = 0;

const add = (type: 'success' | 'error', message: string, duration = 4000) => {
  const id = ++counter;
  toasts.value.push({ id, type, message });
  setTimeout(() => remove(id), duration);
};

const remove = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};

defineExpose({ add });
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(20px); }
.toast-leave-to { opacity: 0; transform: translateX(20px); }
</style>