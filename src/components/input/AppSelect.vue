<template>
  <div ref="rootRef" class="relative">
    <button
      ref="buttonRef"
      type="button"
      :disabled="disabled"
      :aria-expanded="isOpen"
      class="inline-flex min-h-[38px] w-full items-center justify-between gap-3 rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
      :class="buttonClass"
      @click="toggle"
      @keydown="onButtonKeydown"
    >
      <span class="min-w-0 flex-1 truncate text-left">{{ selectedLabel || placeholder }}</span>
      <svg
        class="h-5 w-5 shrink-0 text-slate-700 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="3.25"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="m6 9 6 6 6-6" />
      </svg>
    </button>

    <Teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        class="fixed z-[1200] max-h-64 overflow-y-auto rounded-xl border-2 border-slate-200 bg-white shadow-xl ring-1 ring-black/5"
        :style="menuStyle"
      >
        <button
          v-for="(option, index) in normalizedOptions"
          :key="`${String(option.value)}-${index}`"
          type="button"
          :disabled="option.disabled"
          class="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:text-slate-300"
          :class="[
            isSelected(option.value) ? 'bg-blue-50 font-semibold text-blue-800' : 'font-medium text-slate-700 hover:bg-slate-50',
            activeIndex === index && !option.disabled ? 'bg-slate-100' : '',
          ]"
          @click="selectOption(option)"
          @mouseenter="activeIndex = index"
        >
          <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
          <svg
            v-if="isSelected(option.value)"
            class="h-4 w-4 shrink-0 text-blue-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="3"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

type SelectValue = string | number | boolean | null | undefined;
type SelectOption =
  | SelectValue
  | {
      label?: string | number;
      name?: string | number;
      value?: SelectValue;
      id?: SelectValue;
      disabled?: boolean;
    };

const props = withDefaults(defineProps<{
  modelValue?: SelectValue;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  buttonClass?: string;
}>(), {
  modelValue: '',
  placeholder: 'Pilih',
  disabled: false,
  buttonClass: '',
});

const emit = defineEmits<{
  (event: 'update:modelValue', value: SelectValue): void;
  (event: 'change', value: SelectValue): void;
}>();

const rootRef = ref<HTMLElement | null>(null);
const buttonRef = ref<HTMLElement | null>(null);
const menuRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const activeIndex = ref(-1);
const menuStyle = ref<Record<string, string>>({});

const normalizedOptions = computed(() =>
  props.options.map((option) => {
    if (option && typeof option === 'object') {
      const value = option.value ?? option.id ?? '';
      return {
        value,
        label: String(option.label ?? option.name ?? value),
        disabled: Boolean(option.disabled),
      };
    }

    return {
      value: option,
      label: String(option ?? ''),
      disabled: false,
    };
  })
);

const selectedLabel = computed(() => {
  const selected = normalizedOptions.value.find((option) => isSelected(option.value));
  return selected?.label || '';
});

const isSelected = (value: SelectValue) => Object.is(value, props.modelValue);

const updateMenuPosition = () => {
  const button = buttonRef.value;
  if (!button) return;

  const rect = button.getBoundingClientRect();
  const menuHeight = Math.min(256, Math.max(40, normalizedOptions.value.length * 38));
  const gap = 6;
  const hasBottomSpace = rect.bottom + gap + menuHeight <= window.innerHeight - 12;
  const top = hasBottomSpace ? rect.bottom + gap : Math.max(12, rect.top - gap - menuHeight);

  menuStyle.value = {
    left: `${rect.left}px`,
    top: `${top}px`,
    width: `${rect.width}px`,
  };
};

const open = async () => {
  if (props.disabled) return;
  isOpen.value = true;
  activeIndex.value = Math.max(
    0,
    normalizedOptions.value.findIndex((option) => isSelected(option.value))
  );
  await nextTick();
  updateMenuPosition();
};

const close = () => {
  isOpen.value = false;
};

const toggle = () => {
  if (isOpen.value) close();
  else open();
};

const selectOption = (option: { value: SelectValue; disabled: boolean }) => {
  if (option.disabled) return;
  emit('update:modelValue', option.value);
  emit('change', option.value);
  close();
};

const moveActive = (direction: 1 | -1) => {
  const enabled = normalizedOptions.value
    .map((option, index) => ({ option, index }))
    .filter(({ option }) => !option.disabled);
  if (!enabled.length) return;

  const currentPosition = enabled.findIndex(({ index }) => index === activeIndex.value);
  const nextPosition = currentPosition === -1
    ? 0
    : (currentPosition + direction + enabled.length) % enabled.length;
  activeIndex.value = enabled[nextPosition].index;
};

const onButtonKeydown = (event: KeyboardEvent) => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault();
    if (!isOpen.value) open();
    else moveActive(event.key === 'ArrowDown' ? 1 : -1);
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (!isOpen.value) open();
    else {
      const option = normalizedOptions.value[activeIndex.value];
      if (option) selectOption(option);
    }
    return;
  }

  if (event.key === 'Escape') close();
};

const onDocumentPointerDown = (event: PointerEvent) => {
  const target = event.target as Node;
  if (rootRef.value?.contains(target) || menuRef.value?.contains(target)) return;
  close();
};

watch(isOpen, (openState) => {
  if (openState) {
    document.addEventListener('pointerdown', onDocumentPointerDown);
    window.addEventListener('resize', updateMenuPosition);
    window.addEventListener('scroll', updateMenuPosition, true);
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown);
    window.removeEventListener('resize', updateMenuPosition);
    window.removeEventListener('scroll', updateMenuPosition, true);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', onDocumentPointerDown);
  window.removeEventListener('resize', updateMenuPosition);
  window.removeEventListener('scroll', updateMenuPosition, true);
});
</script>
