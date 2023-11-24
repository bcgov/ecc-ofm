<template>
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
      <v-tab value="archive">Archive</v-tab>
    </v-tabs>
    <v-card-text>
      <v-window v-model="tab">
        <v-window-item value="notifications">
          <NotificationsTab />
        </v-window-item>
        <v-window-item value="messagestwo">
          <MessagesTab />
        </v-window-item>
        <v-window-item value="archive">Archive</v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'pinia'
import MessagesTab from '@/components/messages/MessagesTab.vue'
import NotificationsTab from '@/components/notifications/NotificationsTab.vue'
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  components: { MessagesTab, NotificationsTab },
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

<style scoped></style>
