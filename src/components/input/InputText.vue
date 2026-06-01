<template>
    <div class="space-y-1.5">
        <label class="block text-sm font-bold text-slate-700 capitalize">{{ label.replace(/_/g, " ") }} {{ required ? '*' : '' }}</label>
        <input
            type="text"
            class="block w-full px-4 py-2.5 text-sm font-medium text-slate-900 bg-white border border-[#8c8c94] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-slate-400"
            v-model="inputValue"
            :required="required"
            :placeholder="`Masukkan ${label.toLowerCase()}...`"
            @input="updateValue"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
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
      type: String,
      required: false
    }
  },
  setup(props, { emit }) {
    const inputValue = ref(props.value);

    watch(() => props.value, (newValue) => {
      inputValue.value = newValue;
    });

    const updateValue = () => {
      emit('update', { key:  props.keyValue || props.label, value: inputValue.value });
    };

    return {
      inputValue,
      updateValue
    };
  }
});
</script>
