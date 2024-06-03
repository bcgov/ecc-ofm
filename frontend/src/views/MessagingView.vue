<template>
  <OrganizationHeader />
  <v-container fluid v-bind="$attrs">
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366">
        <v-tab value="notifications">
          Notifications
          <div v-if="unreadNotificationCount > 0">&nbsp;({{ unreadNotificationCount }})</div>
        </v-tab>
        <v-tab value="messages">
          Messages
          <div v-if="unreadMessageCount > 0">&nbsp;({{ unreadMessageCount }})</div>
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="notifications">
            <NotificationsTab />
          </v-window-item>
          <v-window-item value="messages">
            <MessagesTab />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>
<script>
import { mapState } from 'pinia'
import MessagesTab from '@/components/messages/MessagesTab.vue'
import NotificationsTab from '@/components/notifications/NotificationsTab.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  components: { AppBackButton, MessagesTab, NotificationsTab, OrganizationHeader },
  data() {
    return {
      tab: null,
    }
  },
  computed: {
    ...mapState(useNotificationsStore, ['unreadNotificationCount']),
    ...mapState(useMessagesStore, ['unreadMessageCount']),
  },
}
</script>
