<template>
  <v-container fluid>
    <AppAlertBanner type="error">You do not have required role to perform the requested action.</AppAlertBanner>
  </v-container>
</template>

<script>
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'

export default {
  components: { AppAlertBanner },
}
</script>
