<template>
  <OrganizationHeader />
  <v-container fluid v-bind="$attrs">
    <v-card>
      <v-tabs v-model="tab" bg-color="#ffffff" density="compact" color="#003366">
        <v-tab value="notifications">
          Notifications
          <template v-if="unreadNotificationCount > 0">({{ unreadNotificationCount }} unread)</template>
        </v-tab>
        <v-tab value="messages">
          Messages
          <template v-if="unreadMessageCount > 0">({{ unreadMessageCount }} unread)</template>
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
import alertMixin from '@/mixins/alertMixin'
import MessagesTab from '@/components/messages/MessagesTab.vue'
import NotificationsTab from '@/components/notifications/NotificationsTab.vue'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import { useMessagesStore } from '@/stores/messages'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  name: 'MessagingView',
  components: { AppBackButton, MessagesTab, NotificationsTab, OrganizationHeader },
  mixins: [alertMixin],
  data() {
    return {
      tab: null,
      applications: undefined,
    }
  },
  computed: {
    ...mapState(useNotificationsStore, ['unreadNotificationCount']),
    ...mapState(useMessagesStore, ['unreadMessageCount']),
  },
}
</script>
