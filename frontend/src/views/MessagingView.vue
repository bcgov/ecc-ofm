<template>
  <v-card class="messaging-card" variant="flat" max-width="100%">
    <v-tabs v-model="tab" bg-color="none" class="messaging-tabs" density="compact">
      <div v-if="showUnreadNotificationCount">
        <v-badge color="red" :content="unreadNotificationCount" offset-x="9" offset-y="9">
          <v-tab class="messaging-tab" selected-class="messaging-tab-selected" value="one">Notifications</v-tab>
        </v-badge>
      </div>
      <div v-else>
        <v-tab class="messaging-tab" selected-class="messaging-tab-selected" value="one">Notifications</v-tab>
      </div>
      <div v-if="unreadMessageCount > 0">
        <v-badge color="red" :content="unreadMessageCount" offset-x="9" offset-y="9">
          <v-tab class="messaging-tab" selected-class="messaging-tab-selected" value="two">Messages</v-tab>
        </v-badge>
      </div>
      <div v-else>
        <v-tab class="messaging-tab" selected-class="messaging-tab-selected" value="two">Messages</v-tab>
      </div>
      <v-tab class="messaging-tab" selected-class="messaging-tab-selected" value="three">Archive</v-tab>
    </v-tabs>
    <v-card-text class="messaging-card-text">
      <v-window v-model="tab" direction="vertical" class="messaging-window">
        <v-window-item value="one" class="messaging-window-item">
          <NotificationsTab />
        </v-window-item>
        <v-window-item value="two" class="messaging-window-item">
          <MessagesTab />
        </v-window-item>
        <v-window-item value="three" class="messaging-window-item">Three</v-window-item>
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
  data: () => ({
    tab: null,
  }),
  computed: {
    ...mapState(useNotificationsStore, ['notifications', 'unreadNotificationCount']),
    ...mapState(useMessagesStore, ['unreadMessageCount']),
    showUnreadNotificationCount() {
      return this.unreadNotificationCount > 0 ? true : false
    },
  },
}
</script>

<style scoped>
.messaging-card {
  max-width: 1300px;
}

.messaging-tab {
  border: 2px solid #6699cc;
  border-bottom: 0px;
  border-top-left-radius: 10px !important;
  border-top-right-radius: 10px !important;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  color: #336699;
  font-weight: bold;
}

.messaging-tab-selected {
  background-color: #6699cc;
  color: white;
}

.messaging-card-text {
  padding: 0px;
}

.messaging-window {
  border: 2px solid #6699cc;
  border-top-left-radius: 0px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  min-height: 300px;
  box-shadow:
    0px 2px 1px -1px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)),
    0px 1px 1px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)),
    0px 1px 3px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  margin-bottom: 20px;
}

.messaging-window-item {
  padding: 0px;
}

:deep(.v-badge__badge) {
  font-size: 0.75rem !important;
  min-width: 18px !important;
  padding: 2px 3px !important;
}
</style>
