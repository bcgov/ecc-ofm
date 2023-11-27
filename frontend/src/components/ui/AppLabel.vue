<template>
  <label :class="labelClass">
    <slot></slot>
  </label>
</template>
<script>
export default {
  inheritAttrs: true,
  props: {
    variant: {
      // plain/modal
      type: String,
      default: 'plain',
    },
  },
  computed: {
    labelClass() {
      return {
        'modal-label': this.variant === 'modal',
        'plain-label': this.variant === 'plain',
      }
    },
  },
}
</script>

<style scoped>
.plain-label {
  color: #000000;
  font-size: 1.1em;
  font-weight: 800;
}
.modal-label {
  color: #003366;
  font-size: 1.1em;
  font-weight: 800;
}
</style>
