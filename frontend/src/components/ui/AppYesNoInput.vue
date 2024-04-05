<template>
  <v-btn-toggle v-model="internalSelection" mandatory class="btn-toggle" @change="emitValue">
    <v-btn :value="true" class="yes-no-button">Y</v-btn>
    <v-btn :value="false" class="yes-no-button">N</v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'AppYesNoInput',
  props: ['value'], // Expect a boolean value from the parent
  data() {
    return {
      internalSelection: this.value,
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
    emitValue() {
      this.$emit('input', this.internalSelection)
    },
  },
}
</script>

<style scoped>
.yes-no-button.v-btn--active {
  background-color: #003366;
  color: white;
}

.yes-no-button {
  border: 1px solid #003366;
  min-width: 50%;
  height: 100%;
}

.v-btn-group .yes-no-button {
  border-inline-end: 1px solid #003366;
}

.v-btn-group--density-default.v-btn-group {
  height: 30px;
  width: 95px;
}
</style>
