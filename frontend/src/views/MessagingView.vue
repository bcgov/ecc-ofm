<template>
  <v-container fluid>
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366">
        <v-tab id="notifications-tab" value="notifications">
          Notifications
          <div id="unread-notifications-count" v-if="unreadNotificationCount > 0">&nbsp;({{ unreadNotificationCount }})</div>
        </v-tab>
        <v-tab id="messages-tab" value="messages">
          Messages
          <div id="unread-messages-count" v-if="unreadMessageCount > 0">&nbsp;({{ unreadMessageCount }})</div>
        </v-tab>
        <v-tab value="archive">Archive</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="notifications">
            <NotificationsTab />
          </v-window-item>
          <v-window-item value="messages">
            <MessagesTab />
          </v-window-item>
          <v-window-item value="archive">Archive</v-window-item>
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
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  components: { AppBackButton, MessagesTab, NotificationsTab },
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
