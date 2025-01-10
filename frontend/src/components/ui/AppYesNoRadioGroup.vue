<template>
  <v-radio-group v-model="updatedValue" inline color="primary">
    <v-radio label="Yes" :value="1" class="mr-12" />
    <v-radio label="No" :value="0" class="mr-12" />
    <v-radio v-if="allowNotApplicable" label="N/A" :value="2" />
  </v-radio-group>
</template>

<script>
export default {
  name: 'AppYesNoRadioGroup',
  inheritAttrs: true,
  props: {
    modelValue: {
      type: Number,
      default: null
    },
    allowNotApplicable: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue'],
  data() {
    return {
      updatedValue: null
    }
  },
  watch: {
    updatedValue: {
      handler(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  created() {
    this.updatedValue = this.modelValue
  }
}
</script>
<style scoped>
:deep(.v-label) {
  opacity: 1;
}
</style>
