<template>
  <v-btn :class="[isPrimary ? 'BC-Gov-PrimaryButton': 'BC-Gov-OutlinedButton']" v-bind="$attrs">
    <slot />
    <v-icon v-if="$attrs.icon">{{ $attrs.icon }}</v-icon>
  </v-btn>
</template>
<script>
export default {
  inheritAttrs: true,
  props: {
    isPrimary: {
      type: Boolean,
      default: true
    }
  },
}
</script>
<style scoped>
.BC-Gov-PrimaryButton {
  background-color: #003366;
  border: none;
  border-radius: 4px;
  color: white;
  margin: 8px;
  /* ma-2 */
  padding: 0 12px;
  /* px-3 */
  /* padding: 12px 32px;
  text-align: center;
  text-decoration: none;
  display: block;
  font-size: 18px;
  font-family:
    ‘BCSans’,
    ‘Noto Sans’,
    Verdana,
    Arial,
    sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer; */
}

.BC-Gov-PrimaryButton:hover {
  text-decoration: underline;
  opacity: 0.8;
}

:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}

.BC-Gov-PrimaryButton:active {
  opacity: 1;
}

.BC-Gov-OutlinedButton {
  background-color: white;
  border:1px solid #003366;
  color: #003366;
  margin: 8px;
  /* ma-2 */
  padding: 0 12px;
  /* px-3 */
  /* padding: 12px 32px;
  text-align: center;
  text-decoration: none;
  display: block;
  font-size: 18px;
  font-family:
    ‘BCSans’,
    ‘Noto Sans’,
    Verdana,
    Arial,
    sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer; */
}

.BC-Gov-OutlinedButton:hover {
  text-decoration: underline;
  opacity: 0.8;
}

</style>
