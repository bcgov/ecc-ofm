<template>
  <v-text-field v-number="format" variant="outlined" density="compact" @input="input" @blur="blur"></v-text-field>
</template>
<script>
import { directive as VNumber } from '@coders-tm/vue-number-format'

export default {
  name: 'AppNumberInput',
  directives: {
    number: VNumber,
  },
  inheritAttrs: true,
  props: {
    format: {
      type: Object,
      default: () => {
        return {
          decimal: '.',
          separator: ',',
          precision: 2,
        }
      },
    },
  },
  emits: ['update:modelValue'],
  methods: {
    input(value) {
      if (typeof value?.target?.oldValue === 'number') return
      this.$emit('update:modelValue', value?.target?.oldValue?.replace(/,/g, ''))
    },
    blur(value) {
      this.$emit('update:modelValue', Number(value?.target?.unmasked).toFixed(2))
    },
  },
}
</script>
