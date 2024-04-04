<!-- YesNoInput.vue -->
<template>
  <v-btn-toggle v-model="internalSelection" mandatory class="btn-toggle" @change="emitValue">
    <v-btn
      :value="true"
      :class="{ 'selected': internalSelection === true }"
      class="yes-no-button">
      Y
    </v-btn>
    <v-btn
      :value="false"
      :class="{ 'selected': internalSelection === false }"
      class="yes-no-button">
      N
    </v-btn>
  </v-btn-toggle>
</template>

<script>
export default {
  name: 'AppYesNoInput',
  props: ['value'], // Expect a boolean value from the parent
  data() {
    return {
      // Internal representation of the selection, derived from the prop.
      internalSelection: this.value,
    };
  },
  watch: {
    // Watch for external changes to the prop and update the internal state accordingly.
    value(newValue) {
      this.internalSelection = newValue;
    },
    // Watch the internal selection state to emit changes to the parent.
    internalSelection(newValue) {
      this.$emit('input', newValue);
    }
  },
  methods: {
    emitValue() {
      // Emit the current value to the parent component whenever it changes.
      this.$emit('input', this.internalSelection);
    },
  },
};
</script>

<style scoped>
.selected {
  background-color: #003366 !important;
  color: white !important;
}

.yes-no-button {
  min-width: 50% !important;
  height: 100% !important;
}

.v-btn-group--density-default.v-btn-group {
  height: 30px;
}
</style>
