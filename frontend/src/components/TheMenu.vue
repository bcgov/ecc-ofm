<template>
  <AppMenuItem icon="mdi-home-outline" :to="{ name: 'home' }">Home</AppMenuItem>
  <AppMenuItem :to="{ name: 'messaging' }">
    <div class="badge-wrapper">
      <v-badge color="red" :content="unreadMessageCount" offset-x="18" offset-y="17">
        <v-icon class="badge-icon" aria-hidden="false" icon="mdi-email-outline" size="30" />
      </v-badge>
      Messaging
    </div>
  </AppMenuItem>
  <AppMenuItem icon="mdi-text-box-outline">Reporting</AppMenuItem>
  <AppMenuItem icon="mdi-currency-usd">Funding</AppMenuItem>
  <AppMenuItem icon="mdi-folder-outline">Documents</AppMenuItem>
  <AppMenuItem icon="mdi-file-document-edit-outline">Applications</AppMenuItem>
  <AppMenuItem icon="mdi-help" :to="{ name: 'resources' }">Resources</AppMenuItem>
  <AppMenuItem icon="mdi-cog-outline">Settings</AppMenuItem>
</template>

<script>
import { mapState } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import AppMenuItem from '@/components/ui/AppMenuItem.vue'
export default {
  components: { AppMenuItem },
  computed: {
    ...mapState(useAppStore, ['showMenu']),
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated']),
    unreadMessageCount() {
      return Math.floor(Math.random() * 10)
    },
    unreadReplyCount() {
      return Math.floor(Math.random() * 10)
    },
  },
}
</script>

<style scoped>
.badge-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}
.badge-icon {
  color: #003366;
  margin-right: 15px;
}
</style>
