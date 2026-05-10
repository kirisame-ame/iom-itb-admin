<template>
  <div class="space-y-1.5">
    <label class="block text-sm font-bold text-slate-700 capitalize">{{ label.replace(/_/g, " ") }} {{ required ? "*" : "" }}</label>
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <span class="text-sm font-bold text-slate-400">Rp</span>
      </div>
      <input
        type="text"
        class="block w-full pl-10 pr-4 py-2.5 text-sm font-bold text-indigo-700 bg-white border border-[#8c8c94] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
        :value="formattedValueWithoutSymbol"
        @input="onInput"
        :required="required"
        placeholder="0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

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
      type: [String, Number],
      required: false,
      default: ''
    }
  },
  computed: {
    formattedValueWithoutSymbol(): string {
      const numberValue = parseInt(this.value.toString());
      if (isNaN(numberValue)) return '';

      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0
      }).format(numberValue);
    }
  },
  methods: {
    onInput(event: Event) {
      const input = event.target as HTMLInputElement;
      let rawValue = input.value.replace(/\D/g, ''); // Remove all non-digit characters

      if (rawValue === '') {
        this.$emit('update', {  key:this.keyValue || this.label, value: 0 });
        return;
      }
      
      const numericValue = parseInt(rawValue, 10);
      this.$emit('update', { key: this.keyValue || this.label, value: numericValue });

      // Reformat the input value display
      input.value = new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0
      }).format(numericValue);
    }
  }
});
</script>
