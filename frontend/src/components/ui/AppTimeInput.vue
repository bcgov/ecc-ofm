<template>
  <v-text-field v-model="updatedTime" type="time" />
</template>

<script>
import format from '@/utils/format'

export default {
  name: 'AppTimeInput',
  inheritAttrs: true,
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      updatedTime: null,
    }
  },
  watch: {
    updatedTime: {
      handler(value) {
        this.$emit('update:modelValue', value)
      },
    },
  },
  created() {
    this.updatedTime = format.formatTime12to24(this.modelValue)
  },
}
</script>
