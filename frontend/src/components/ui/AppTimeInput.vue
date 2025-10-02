<template>
  <v-text-field v-model="updatedTime" type="time" />
</template>

<script>
import format from '@/utils/format'

export default {
  name: 'AppTimeInput',
  inheritAttrs: true,
  props: { modelValue: { type: String, default: '' } },
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
    this.updatedTime = this.modelValue ? format.formatTime12to24(this.modelValue) : null
  },
}
</script>

<style>
input[type='time']::-webkit-datetime-edit-hour-field:focus,
input[type='time']::-webkit-datetime-edit-minute-field:focus,
input[type='time']::-webkit-datetime-edit-second-field:focus,
input[type='time']::-webkit-datetime-edit-ampm-field:focus {
  background-color: #3367d1;
}
</style>
