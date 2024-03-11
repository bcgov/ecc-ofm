<template>
  <OrganizationHeader />
  <v-container fluid v-bind="$attrs">
    <h1>Resources</h1>
    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'ResourcesView',
  components: { AppBackButton, OrganizationHeader },
}
</script>

<style scoped></style>
