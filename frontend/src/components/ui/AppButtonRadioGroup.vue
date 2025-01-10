<template>
  <v-btn-toggle v-model="internalSelection" mandatory @change="emitSelection">
    <v-btn
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :class="{
        'active-button': internalSelection === option.value,
        'inactive-button': internalSelection !== option.value,
      }">
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
      validator: function (array) {
        return array.every(
          (item) =>
            Object.prototype.hasOwnProperty.call(item, 'value') && Object.prototype.hasOwnProperty.call(item, 'label'),
        )
      },
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
    defaultOption(newValue) {
      this.internalSelection = newValue
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
