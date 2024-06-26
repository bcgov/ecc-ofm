<template>
  <v-container fluid v-bind="$attrs">
    <h1>Help Centre</h1>
    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'HelpView',
  components: { AppBackButton },
}
</script>
