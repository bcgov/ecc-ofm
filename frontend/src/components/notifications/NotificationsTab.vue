<template>
  <v-card>
    <v-container class="pa-3" fluid>
      <v-row>
        <v-col sm="12" md="6" class="border-right pa-0">
          <v-row>
            <v-col class="mt-1">
              <div class="flex-item">
                <AppButton @click="toggleMarkUnreadButtonInNotificationTable(false)" variant="text">
                  <v-icon class="icon" left>mdi-email-outline</v-icon>
                  <span class="btn-label">Mark unread</span>
                </AppButton>
                <AppButton @click="toggleMarkReadButton(true)" variant="text">
                  <v-icon class="icon" left>mdi-email-open-outline</v-icon>
                  <span class="btn-label">Mark read</span>
                </AppButton>
              </div>
            </v-col>
          </v-row>
          <v-skeleton-loader :loading="!notifications" type="table-tbody">
            <NotificationsTable
              :markReadButtonState="markReadButtonState"
              :markUnreadButtonInNotificationTableState="markUnreadButtonInNotificationTableState"
              :markUnreadButtonInNotificationDetailsState="markUnreadButtonInNotificationDetailsState"
              @openNotificationDetails="openNotificationDetails" />
          </v-skeleton-loader>
        </v-col>
        <v-col sm="12" md="6">
          <NotificationDetails :notificationId="selectedNotificationId" @toggleMarkUnreadButtonInNotificationDetails="toggleMarkUnreadButtonInNotificationDetails" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationsTable from '@/components/notifications/NotificationsTable.vue'
import NotificationDetails from '@/components/notifications/NotificationDetails.vue'
import AppButton from '@/components/ui/AppButton.vue'

export default {
  name: 'NotificationsTab',
  components: { AppButton, NotificationsTable, NotificationDetails },
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
.flex-item {
  display: flex;
  align-items: left;
}

.btn-style:hover {
  background-color: #ffffff;
}

.btn-style:hover .btn-label {
  text-decoration: underline;
}

.btn-style .v-btn__content .icon {
  padding: 0px;
  margin: 0px;
  font-size: 1.5em;
}
</style>
