<template>
  <div v-if="isAuthenticated && userInfo">
    <v-navigation-drawer style="z-index: 0" permanent="true">
      <AppMenuItem icon="mdi-home-outline" :to="{ name: 'home' }">Home</AppMenuItem>
      <AppMenuItem>
        <v-badge color="red" :content="unreadMessageCount" offset-x="14" offset-y="20">
          <v-icon class="menu-email-icon" aria-hidden="false" icon="mdi-email-outline" size="30" />
        </v-badge>
        Messaging
      </AppMenuItem>
      <AppMenuItem icon="mdi-text-box-outline">Reporting</AppMenuItem>
      <AppMenuItem icon="mdi-currency-usd">Funding</AppMenuItem>
      <AppMenuItem icon="mdi-account-group-outline">Enrollment</AppMenuItem>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import AppMenuItem from '@/components/ui/AppMenuItem.vue'
export default {
  components: { AppMenuItem },
  computed: {
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated']),
    unreadMessageCount() {
      return Math.floor(Math.random() * 10)
    },
  },
}
</script>

<style scoped>
.menu-email-icon {
  color: #003366;
  margin-right: 11px;
}
</style>
