<template>
  <button
    type="button"
    class="inline-flex items-center gap-2 text-left text-sm font-semibold text-blue-100 transition hover:text-white focus:outline-none focus:ring-0 active:outline-none"
    :aria-label="`Urutkan berdasarkan ${label}`"
    @click="$emit('click', $event)"
  >
    <span>{{ label }}</span>
    <span
      v-if="active && priority && priority > 1"
      class="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-white/15 px-1 text-[10px] font-bold leading-none text-white"
    >
      {{ priority }}
    </span>
    <svg
      class="h-4 w-4 shrink-0 transition-transform"
      :class="[
        active ? 'text-white' : 'text-blue-200/70',
        active && direction === 'asc' ? 'rotate-180' : '',
      ]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="3.25"
      aria-hidden="true"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  active?: boolean;
  direction?: 'asc' | 'desc';
  priority?: number;
}>();

defineEmits<{
  (event: 'click', mouseEvent: MouseEvent): void;
}>();
</script>
