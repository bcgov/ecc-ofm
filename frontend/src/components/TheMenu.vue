<template>
  <div>
    <AppMenuItem icon="mdi-home-outline" :to="{ name: 'home' }">Home</AppMenuItem>
    <AppMenuItem :to="{ name: 'messaging' }">
      <div class="badge-wrapper">
        <v-badge v-if="messageNotificationCount > 0" :content="messageNotificationCount" color="red" offset-x="18" offset-y="17">
          <v-icon class="badge-icon" aria-hidden="false" icon="mdi-email-outline" size="30" />
        </v-badge>
        <v-icon v-else class="badge-icon" aria-hidden="false" icon="mdi-email-outline" size="30" />
        Messaging
      </div>
    </AppMenuItem>
    <AppMenuItem icon="mdi-text-box-outline" :to="{ name: 'reporting' }">Reporting</AppMenuItem>
    <AppMenuItem icon="mdi-currency-usd" :to="{ name: 'funding' }">Funding</AppMenuItem>
    <AppMenuItem icon="mdi-folder-outline" :to="{ name: 'documents' }">Documents</AppMenuItem>
    <AppMenuItem icon="mdi-file-document-edit-outline" :to="{ name: 'applications' }">Applications</AppMenuItem>
    <AppMenuItem icon="mdi-help" :to="{ name: 'resources' }">Resources</AppMenuItem>
    <AppMenuItem icon="mdi-cog-outline" :to="{ name: 'settings' }">Settings</AppMenuItem>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAppStore } from '@/stores/app'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'
import AppMenuItem from '@/components/ui/AppMenuItem.vue'

export default {
  components: { AppMenuItem },
  computed: {
    ...mapState(useAppStore, ['showMenu']),
    ...mapState(useAuthStore, ['userInfo', 'isAuthenticated']),
    ...mapState(useMessagesStore, ['assistanceRequests', 'unreadMessageCount']),
    ...mapState(useNotificationsStore, ['unreadNotificationCount']),
    messageNotificationCount() {
      return this.getMessageCount + this.unreadNotificationCount
    },
    // count of requests that are unread or are in the status of “Action required”
    getMessageCount() {
      const readActionRequiredMessagesCount = this.assistanceRequests?.filter((message) => message.status === 'Action required' && message.isRead)?.length
      return this.unreadMessageCount + readActionRequiredMessagesCount
    },
  },
  async created() {
    try {
      await this.getNotifications(this.userInfo.contactId)
      await this.getAssistanceRequests(this.userInfo?.contactId)
    } catch (error) {
      console.info(error)
    }
  },
  methods: {
    ...mapActions(useMessagesStore, ['getAssistanceRequests']),
    ...mapActions(useNotificationsStore, ['getNotifications']),
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
