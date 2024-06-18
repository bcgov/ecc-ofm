<template>
  <v-btn class="px-2" :class="buttonClass" :size="btnSize" v-bind="$attrs">
    <span class="overflow-hidden"><slot /></span>
    <v-icon v-if="$attrs.icon" class="button-icon">{{ $attrs.icon }}</v-icon>
  </v-btn>
</template>

<script>
import { isEmpty } from 'lodash'

export default {
  inheritAttrs: true,
  props: {
    primary: {
      type: Boolean,
      default: true,
    },
    btnSize: {
      type: String,
      default: '',
    },
  },
  computed: {
    buttonClass() {
      return {
        'BC-Gov-PrimaryButton': !this.$attrs.disabled && this.$attrs.variant === undefined && this.primary && isEmpty(this.btnSize),
        'BC-Gov-PrimaryButton-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && this.primary && isEmpty(this.btnSize),
        'BC-Gov-PrimaryButton-small': !this.$attrs.disabled && this.$attrs.variant === undefined && this.primary && this.btnSize === 'small',
        'BC-Gov-PrimaryButton-small-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && this.primary && this.btnSize === 'small',
        'BC-Gov-SecondaryButton': !this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary,
        'BC-Gov-SecondaryButton-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary,
        'BC-Gov-SecondaryButton-small': !this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary && this.btnSize === 'small',
        'BC-Gov-SecondaryButton-small-disabled': this.$attrs.disabled && this.$attrs.variant === undefined && !this.primary && this.btnSize === 'small',
        'text-app-button': this.$attrs.variant !== '',
        small: this.$attrs.size === 'small',
      }
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

.BC-Gov-PrimaryButton,
.BC-Gov-PrimaryButton-small,
.BC-Gov-PrimaryButton-disabled,
.BC-Gov-PrimaryButton-small-disabled {
  background-color: #003366;
  border: none;
  border-radius: 4px;
  color: white;
  text-align: center;
  text-decoration: none;
  display: block;
  font-family:
    ‘BCSans’,
    ‘Noto Sans’,
    Verdana,
    Arial,
    sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.BC-Gov-SecondaryButton,
.BC-Gov-SecondaryButton-small,
.BC-Gov-SecondaryButton-disabled,
.BC-Gov-SecondaryButton-small-disabled {
  background-color: #ffffff;
  border: 2px solid #003366;
  border-radius: 4px;
  color: #003366;
  text-align: center;
  text-decoration: none;
  display: block;
  font-family:
    ‘BCSans’,
    ‘Noto Sans’,
    Verdana,
    Arial,
    sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
}

.BC-Gov-PrimaryButton,
.BC-Gov-PrimaryButton-disabled,
.BC-Gov-SecondaryButton,
.BC-Gov-SecondaryButton-disabled {
  padding: 10px 32px;
  font-size: 18px;
}

/* .BC-Gov-PrimaryButton-small,
.BC-Gov-PrimaryButton-small-disabled,
.BC-Gov-SecondaryButton-small,
.BC-Gov-SecondaryButton-small-disabled {
  font-size: 14px;
} */

.BC-Gov-PrimaryButton-disabled,
.BC-Gov-PrimaryButton-small-disabled,
.BC-Gov-SecondaryButton-disabled,
.BC-Gov-SecondaryButton-small-disabled {
  opacity: 0.3;
}

.BC-Gov-PrimaryButton:hover,
.BC-Gov-PrimaryButton-small:hover,
.BC-Gov-SecondaryButton:hover,
.BC-Gov-SecondaryButton-small:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.BC-Gov-SecondaryButton:hover,
.BC-Gov-SecondaryButton-small:hover {
  background-color: #003366;
  color: #ffffff;
}

.BC-Gov-PrimaryButton:focus,
.BC-Gov-PrimaryButton-small:focus,
.BC-Gov-SecondaryButton:focus,
.BC-Gov-SecondaryButton-small:focus {
  outline: 4px solid #3b99fc;
  outline-offset: 1px;
}

.small {
  font-size: 14px;
  padding: 0px;
}
</style>
