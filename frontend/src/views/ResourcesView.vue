<template>
  <v-container fluid>
    <h1>Resources</h1>

    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'ResourcesView',
  components: { AppBackButton },
}
</script>

<style scoped></style>
