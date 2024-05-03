<template>
  <v-btn-toggle v-model="internalSelection" @change="emitSelection" row>
    <v-btn
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :class="internalSelection === option.value ? 'active-button' : 'inactive-button'">
      {{ option.label }}
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'AppButtonRadioGroup',
  props: {
    options: {
      type: Array,
      required: true,
    },
    defaultOption: {
      type: [Number, String],
      required: false,
      default: undefined,
    },
  },
  emits: ['input'],
  data() {
    return {
      internalSelection: this.defaultOption,
    }
  },
  watch: {
    value(newValue) {
      this.internalSelection = newValue
    },
    internalSelection(newValue) {
      this.$emit('input', newValue)
    },
  },
  methods: {
    emitSelection() {
      this.$emit('input', this.internalSelection)
    },
  },
}
</script>

<style scoped>
.active-button {
  background-color: #003366;
  color: white;
  height: 39px !important;
}

.inactive-button {
  background-color: white;
  color: #003366;
  border: 1px solid #003366;
  height: 39px !important;
}
</style>