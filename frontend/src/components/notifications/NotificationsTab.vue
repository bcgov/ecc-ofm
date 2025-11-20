<template>
  <v-row>
    <v-col cols="12" md="6" class="border-right pa-0" :class="borderClass">
      <v-row>
        <v-col class="mt-3 ml-3">
          <div>
            <AppButton class="mx-1 notifications-button" size="small" :primary="false" :disabled="!canModifyMessages" @click="toggleMarkUnreadButtonInNotificationTable(false)">
              <v-icon class="mr-1" left>mdi-email-outline</v-icon>
              <span>Mark unread</span>
            </AppButton>
            <AppButton class="mx-1 notifications-button" size="small" :primary="false" :disabled="!canModifyMessages" @click="toggleMarkReadButton(true)">
              <v-icon class="mr-1" left>mdi-email-open-outline</v-icon>
              <span>Mark read</span>
            </AppButton>
          </div>
        </v-col>
      </v-row>
      <v-skeleton-loader :loading="!notifications" type="table-tbody">
        <NotificationsTable
          :mark-read-button-state="markReadButtonState"
          :mark-unread-button-in-notification-table-state="markUnreadButtonInNotificationTableState"
          :mark-unread-button-in-notification-details-state="markUnreadButtonInNotificationDetailsState"
          @open-notification-details="openNotificationDetails" />
      </v-skeleton-loader>
    </v-col>
    <v-col cols="12" md="6">
      <NotificationDetails :notification-id="selectedNotificationId" @toggle-mark-unread-button-in-notification-details="toggleMarkUnreadButtonInNotificationDetails" />
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationsTable from '@/components/notifications/NotificationsTable.vue'
import NotificationDetails from '@/components/notifications/NotificationDetails.vue'
import AppButton from '@/components/ui/AppButton.vue'
import permissionsMixin from '@/mixins/permissionsMixin'

export default {
  name: 'NotificationsTab',
  components: { AppButton, NotificationsTable, NotificationDetails },
  mixins: [permissionsMixin],
  data() {
    return {
      selectedNotificationId: '',
      markReadButtonState: false,
      markUnreadButtonInNotificationTableState: false,
      markUnreadButtonInNotificationDetailsState: false,
    }
  },
  computed: {
    ...mapState(useNotificationsStore, ['notifications']),
    canModifyMessages() {
      return this.hasPermission(this.PERMISSIONS.MANAGE_NOTIFICATIONS)
    },
    borderClass() {
      return this.$vuetify.display.xs || this.$vuetify.display.sm ? 'border-bottom' : 'border-right'
    },
  },
  methods: {
    ...mapActions(useNotificationsStore, ['getNotifications']),
    toggleMarkReadButton() {
      this.markReadButtonState = !this.markReadButtonState
    },
    toggleMarkUnreadButtonInNotificationTable() {
      this.markUnreadButtonInNotificationTableState = !this.markUnreadButtonInNotificationTableState
    },
    toggleMarkUnreadButtonInNotificationDetails() {
      this.markUnreadButtonInNotificationDetailsState = !this.markUnreadButtonInNotificationDetailsState
    },
    openNotificationDetails(notificationId) {
      this.selectedNotificationId = notificationId
    },
  },
}
</script>

<style scoped>
.border-bottom {
  border-bottom: 2px solid #003366;
}
.border-right {
  border-right: 2px solid #003366;
}
.notifications-button {
  display: inline-block;
}

.notifications-button:focus {
  outline: 0px !important;
  outline-offset: none !important;
}
</style>
