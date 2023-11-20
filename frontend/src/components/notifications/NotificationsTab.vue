<template>
  <v-container class="pa-3" fluid>
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-row>
          <v-col class="mt-1">
            <div class="flex-item">
              <v-btn @click="toggleMarkUnreadButtonInNotificationTableState(false)" class="btn-style">
                <v-icon class="icon" left>mdi-email-outline</v-icon>
                <span class="btn-label">Mark unread</span>
              </v-btn>
              <v-btn @click="toggleMarkReadButton(true)" class="btn-style">
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
        This is selected Assistance Request ID for conversation thread
        {{ selectedNotificationId }}
        <!-- NOTIFICATION DETAILS -->
        <!-- <v-card v-if="notificationSelected" variant="flat">
          <v-card-title>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <span class="font-bold">From:</span>
                &nbsp;Operating Funding Model Program
              </div>
              <v-btn v-if="notificationSelected.isRead" class="btn-style" @click="updateNotificationUnread">
                <v-icon class="icon" left>mdi-email-open-outline</v-icon>
                <span class="btn-label">Mark Unread</span>
              </v-btn>
            </div>
            <div class="subject-text">
              {{ notificationSelected.subject }}
            </div>
          </v-card-title>
          <hr />
          <v-card-text v-html="notificationSelected.notificationContent" />
        </v-card> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationsTable from '@/components/notifications/NotificationsTable.vue'

export default {
  name: 'NotificationsTab',
  components: { NotificationsTable },
  data() {
    return {
      selectedNotificationId: null,
      markReadButtonState: false,
      markUnreadButtonInNotificationTableState: false,
      markUnreadButtonInNotificationDetailsState: false,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useNotificationsStore, ['notifications', 'unreadNotificationCount']),
  },
  // async created() {
  //   if (!this.notifications) await this.getNotifications(this.userInfo?.contactId)
  // },
  methods: {
    ...mapActions(useNotificationsStore, ['getNotifications', 'updateNotification']),
    toggleMarkReadButton() {
      this.markReadButtonState = !this.markReadButtonState
    },
    toggleMarkUnreadButtonInNotificationTableState() {
      this.markUnreadButtonInNotificationTableState = !this.markUnreadButtonInNotificationTableState
    },
    toggleMarkUnreadButtonInNotificationDetailsState() {
      this.markUnreadButtonInNotificationDetailsState = !this.markUnreadButtonInNotificationDetailsState
    },
    openNotificationDetails(notificationId) {
      this.selectedNotificationId = notificationId
    },
  },
}
</script>

<style scoped>
th {
  padding: 0px 0px 0px 4px !important;
}

td {
  padding: 0px 3px 0px 4px !important;
}

hr {
  border: 0;
  height: 1px;
  background: #6699cc;
  background-image: linear-gradient(to right, #6699cc, #6699cc, #6699cc);
}

.data-table {
  height: 524px;
}

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

.item {
  padding-left: 4px;
}

.btn-style .v-btn__content .icon {
  padding: 0px;
  margin: 0px;
  font-size: 1.5em;
}

.headers {
  padding-left: 4px;
  font-weight: bold;
  color: #878787;
}

.headers:hover {
  padding-left: 4px;
  font-weight: bold;
  color: black;
  cursor: pointer;
}

.font-bold {
  font-weight: bold;
}

.subject-text {
  font-size: 18px;
}

.unread-notification {
  font-size: small;
  font-weight: bold;
}

.border-right {
  border-right: 2px solid #6699cc;
}

.highlighted-row {
  background-color: #d4eaff;
}
</style>
