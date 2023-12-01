<template>
  <v-btn class="text-none" :class="buttonClass" v-bind="$attrs">
    <slot />
    <v-icon class="button-icon" v-if="$attrs.icon">{{ $attrs.icon }}</v-icon>
  </v-btn>
</template>
<script>
export default {
  inheritAttrs: true,
  computed: {
    buttonClass() {
      return {
        'BC-Gov-PrimaryButton': this.$attrs.variant === undefined && this.primary,
        'BC-Gov-SecondaryButton': this.$attrs.variant === undefined && !this.primary,
        'text-app-button': this.$attrs.variant !== '',
      }
    },
  },
  props: {
    primary: {
      type: Boolean,
      default: 'primary',
    },
  },
}
</script>
<style scoped>
.button-icon {
  font-size: 24px;
}

.text-app-button {
  color: #003366;
}

.BC-Gov-PrimaryButton {
  background-color: #003366;
  border: none;
  border-radius: 4px;
  color: white;
  margin: 8px;
  /* ma-2 */
  padding: 0 12px;
  font-size: 16px;
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

.BC-Gov-PrimaryButton:focus {
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

.BC-Gov-SecondaryButton:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}
.BC-Gov-SecondaryButton:active {
  opacity: 1;
}
</style>
