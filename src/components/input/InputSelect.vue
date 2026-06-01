<template>
    <div class="space-y-1.5">
        <label class="block text-sm font-bold text-slate-700 capitalize">{{ label.replace(/_/g, " ") }} {{ required ? '*' : '' }}</label>
        <AppSelect
          v-model="inputValue"
          :options="selectOptions"
          :placeholder="`Pilih ${label.toLowerCase()}...`"
          @change="updateValue"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import AppSelect from './AppSelect.vue';

export default defineComponent({
  components: {
    AppSelect,
  },
  props: {
    keyValue: {
      type: String,
      required: false
    },
    label: {
      type: String,
      required: true
    },
    required:{
      type: Boolean,
      required: false,
    },
    value: {
      type: [String, Number, Boolean],
      required: false,
      default: ''  // Menyediakan nilai default jika tidak ada value
    },
    options: {
      type: Array,
      required: false,
      default: () => []  // Menyediakan array kosong sebagai default
    }
  },
  setup(props, { emit }) {
    const inputValue = ref(props.value);

    // Watch props.value to reactively update inputValue
    watch(() => props.value, (newValue) => {
      inputValue.value = newValue;
    });

    // Initialize inputValue when the component is first mounted
    onMounted(() => {
      inputValue.value = props.value;
    });

    const updateValue = () => {
      emit('update', { key:  props.keyValue || props.label, value: inputValue.value });
    };

    const optionLabel = (option: unknown) => {
      if (option && typeof option === 'object') {
        const record = option as Record<string, unknown>;
        return record.label ?? record.name ?? record.value ?? '';
      }
      return option;
    };

    const optionValue = (option: unknown) => {
      if (option && typeof option === 'object') {
        const record = option as Record<string, unknown>;
        return record.value ?? record.id ?? '';
      }
      return option;
    };

    const selectOptions = computed(() => props.options.map((option) => ({
      value: optionValue(option),
      label: optionLabel(option),
    })));

    return {
      inputValue,
      updateValue,
      selectOptions,
      optionLabel,
      optionValue
    };
  }
});
</script>
