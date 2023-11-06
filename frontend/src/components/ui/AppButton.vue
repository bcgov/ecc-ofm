<template>
  <v-btn :class="[primary ? 'BC-Gov-PrimaryButton' : 'BC-Gov-SecondaryButton']" v-bind="$attrs">
    <slot />
    <v-icon v-if="$attrs.icon">{{ $attrs.icon }}</v-icon>
  </v-btn>
</template>
<script>
export default {
  inheritAttrs: true,
  props: {
    primary: {
      type: Boolean,
      default: true,
    },
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

.BC-Gov-SecondaryButton {
  background: none;
  border-radius: 4px;
  border: 2px solid #003366;
  margin: 8px;
  padding: 0 12px;
  /* text-align: center;
  text-decoration: none;
  display: block;
  font-size: 18px;
  Font-family: ‘BCSans’, ‘Noto Sans’, Verdana, Arial, sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: pointer; */
  color: #003366;
}
.BC-Gov-SecondaryButton:hover {
  opacity: 0.8;
  text-decoration: underline;
  background-color: #003366;
  color: #ffffff;
}
.BC-Gov-SecondaryButton:active {
  opacity: 1;
}
</style>
