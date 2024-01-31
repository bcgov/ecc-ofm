<template>
  <AppButton class="mt-2" :primary="false" size="large">
    <v-icon class="pb-1">mdi-arrow-left</v-icon>
    Back to
    <slot></slot>
  </AppButton>
</template>
<script>
import AppButton from '@/components/ui/AppButton.vue'

export default {
  components: { AppButton },
  inheritAttrs: true,
}
</script>
