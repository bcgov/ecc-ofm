<template>
  <v-text-field v-model="updatedTime" :active="menu" :focused="menu" readonly>
    <v-menu v-model="menu" :close-on-content-click="false" activator="parent" transition="scale-transition">
      <v-time-picker v-if="menu" v-model="updatedTime" :min="minTime" :max="maxTime" :allowed-minutes="allowedMinutes" color="primary" ampm-in-title full-width />
    </v-menu>
  </v-text-field>
</template>

<script>
import format from '@/utils/format'

export default {
  name: 'AppTimeInput',
  inheritAttrs: true,
  props: {
    time: {
      type: String,
      default: '',
    },
    min: {
      type: String,
      default: '',
    },
    max: {
      type: String,
      default: '',
    },
    allowedMinutes: {
      type: Array,
      default: () => undefined,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      updatedTime: null,
      minTime: null,
      maxTime: null,
      menu: false,
    }
  },
  watch: {
    min: {
      handler(value) {
        this.minTime = format.formatTime12to24(value)
      },
    },
    max: {
      handler(value) {
        this.maxTime = format.formatTime12to24(value)
      },
    },
    updatedTime: {
      handler(value) {
        this.$emit('update:modelValue', format.formatTime24to12(value))
      },
    },
  },
  created() {
    this.updatedTime = format.formatTime12to24(this.time)
  },
}
</script>
