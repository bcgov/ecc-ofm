<template>
  <v-btn class="text-none px-2" :class="buttonClass" v-bind="$attrs">
    <span class="button-text overflow-hidden"><slot /></span>
    <v-icon class="button-icon" v-if="$attrs.icon">{{ $attrs.icon }}</v-icon>
  </v-btn>
</template>
<script>
export default {
  inheritAttrs: true,
  computed: {
    buttonClass() {
      return {
        'BC-Gov-PrimaryButton': !this.$attrs.disabled && this.$attrs.variant === undefined && this.primary,
        'BC-Gov-PrimaryButton-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && this.primary,
        'BC-Gov-SecondaryButton': !this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary,
        'BC-Gov-SecondaryButton-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary,
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
  font-size: 1rem;
}

.BC-Gov-PrimaryButton {
  background-color: #003366;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 10px 32px;
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
  cursor: pointer;
}

.BC-Gov-PrimaryButton:hover {
  opacity: 0.8;
}

.BC-Gov-PrimaryButton:hover .button-text {
  text-decoration: underline;
}

.BC-Gov-PrimaryButton:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}

.BC-Gov-PrimaryButton:active {
  opacity: 1;
}

.BC-Gov-SecondaryButton {
  background-color: #ffffff;
  border-radius: 4px;
  border: 2px solid #003366;
  padding: 10px 32px;
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
  cursor: pointer;
  color: #003366;
}
.BC-Gov-SecondaryButton:hover {
  opacity: 0.8;
  text-decoration: underline;
  background-color: #003366;
  color: #ffffff;
}

.BC-Gov-SecondaryButton:hover .button-text {
  text-decoration: underline;
}

.BC-Gov-SecondaryButton:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}
.BC-Gov-SecondaryButton:active {
  opacity: 1;
}

.BC-Gov-PrimaryButton-disabled {
  background-color: #003366;
  opacity: 0.3;
  border: none;
  border-radius: 4px;
  color: white;
  padding: 12px 32px;
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
  /* cursor: not-allowed; */
}

.BC-Gov-SecondaryButton-disabled {
  background-color: white;
  opacity: 0.3;
  border: 2px solid #003366;
  border-radius: 4px;
  color: #003366;
  padding: 10px 30px;
  text-align: center;
  text-decoration: none;
  display: block;
  font-size: 18px;
  font-family:
    ‘Noto Sans’,
    Verdana,
    Arial,
    sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  cursor: not-allowed;
}
</style>
