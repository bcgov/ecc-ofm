<template>
  <v-navigation-drawer style="width: 200px; z-index: 0" permanent>
    <AppMenuItem icon="mdi-home-outline" :to="{ name: 'home' }">Home</AppMenuItem>
    <AppMenuItem icon="mdi-email-outline">Messaging</AppMenuItem>
    <AppMenuItem icon="mdi-text-box-outline">Reporting</AppMenuItem>
    <AppMenuItem icon="mdi-currency-usd">Funding</AppMenuItem>
    <AppMenuItem icon="mdi-account-group-outline">Enrollment</AppMenuItem>
  </v-navigation-drawer>
</template>

<script>
import AppMenuItem from '@/components/ui/AppMenuItem.vue'
export default {
  components: { AppMenuItem },
}
</script>

<style scoped></style>
