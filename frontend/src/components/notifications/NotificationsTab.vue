<template>
  <v-container class="pa-3" fluid>
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-row>
          <v-col class="mt-1">
            <div class="flex-item">
              <v-btn class="btn-style" @click="toggleMarkUnreadButtonInNotificationTable(false)">
                <v-icon class="icon" left>mdi-email-outline</v-icon>
                <span class="btn-label">Mark unread</span>
              </v-btn>
              <v-btn class="btn-style" @click="toggleMarkReadButton(true)">
                <v-icon class="icon" left>mdi-email-open-outline</v-icon>
                <span class="btn-label">Mark read</span>
              </v-btn>
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
      <v-col cols="6">
        <NotificationDetails :notificationId="selectedNotificationId" @toggleMarkUnreadButtonInNotificationDetails="toggleMarkUnreadButtonInNotificationDetails" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationsTable from '@/components/notifications/NotificationsTable.vue'
import NotificationDetails from '@/components/notifications/NotificationDetails.vue'

export default {
  name: 'NotificationsTab',
  components: { NotificationsTable, NotificationDetails },
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

.btn-style {
  padding: 0px 6px;
  margin: 0px;
  font-size: 14px;
  background-color: #ffffff;
  color: #6699cc;
  font-weight: bold;
  text-transform: none;
  max-height: 28px;
  border: none;
  box-shadow: none;
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

.border-right {
  border-right: 2px solid #6699cc;
}
</style>
