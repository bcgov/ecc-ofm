<template>
  <v-data-table-virtual
    v-if="notifications"
    id="notifications-table"
    v-model="bodyCheckboxesSelected"
    :headers="headers"
    :items="notifications"
    item-key="notificationId"
    item-value="notificationId"
    show-select
    hover
    fixed-header
    class="table"
    density="compact"
    :mobile="null"
    mobile-breakpoint="md"
    @click:row="rowClickHandler">
    <template #item.isRead="{ item }">
      <div :class="getItemClass(item)">
        {{ item.isRead ? 'Read' : 'Unread' }}
      </div>
    </template>
    <template #item.subject="{ item }">
      <div :class="getItemClass(item)">
        {{ item.subject }}
      </div>
    </template>
    <template #item.dateReceived="{ item }">
      <div :class="getItemClass(item)">
        {{ format.formatDate(item.dateReceived) }}
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script>
import { mapState } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import NotificationService from '@/services/notificationService'
import format from '@/utils/format'

export default {
  name: 'NotificationsTable',
  format: [format],
  props: {
    markReadButtonState: {
      type: Boolean,
      default: false,
    },
    markUnreadButtonInNotificationTableState: {
      type: Boolean,
      default: false,
    },
    markUnreadButtonInNotificationDetailsState: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['openNotificationDetails'],
  data() {
    return {
      format,
      headers: [
        {
          title: 'Read/Unread',
          align: 'start',
          key: 'isRead',
          sortable: true,
          width: '22%',
        },
        {
          title: 'Subject',
          align: 'start',
          key: 'subject',
          sortable: true,
          width: '50%',
        },
        {
          title: 'Date Received',
          align: 'start',
          key: 'dateReceived',
          sortable: true,
          width: '23%',
        },
      ],
      bodyCheckboxesSelected: [],
      selectedNotificationId: null, // Used for displaying notification details
    }
  },
  computed: {
    ...mapState(useNotificationsStore, ['notifications']),
  },
  watch: {
    markReadButtonState: {
      async handler() {
        await this.updateBodyCheckboxesReadUnread(true)
      },
    },
    markUnreadButtonInNotificationTableState: {
      async handler() {
        await this.updateBodyCheckboxesReadUnread(false)
      },
    },
    markUnreadButtonInNotificationDetailsState: {
      async handler() {
        await this.updateNotificationReadUnread(false, this.selectedNotificationId)
      },
    },
  },
  methods: {
    resetAllCheckboxes() {
      this.bodyCheckboxesSelected = []
    },
    /**
     * Update the body/item checkboxes to read or unread.
     */
    async updateBodyCheckboxesReadUnread(isRead) {
      const selectedNotificationIds = this.bodyCheckboxesSelected
      this.resetAllCheckboxes()
      await Promise.all(
        selectedNotificationIds.map(async (notificationId) => {
          await this.updateNotificationReadUnread(isRead, notificationId)
        }),
      )
    },
    /**
     * Handles the row click event. When a row is clicked the notification in context is displayed and marked as read.
     */
    async rowClickHandler(item, row) {
      this.selectedNotificationId = row?.item?.notificationId
      this.$emit('openNotificationDetails', this.selectedNotificationId)
      await this.updateNotificationReadUnread(true, this.selectedNotificationId)
    },
    /**
     * Include lastOpenedTime in the payload if the email/notification is "Marked as Read" or "Opened"
     * Include isRead in the payload if its value changes
     */
    async updateNotificationReadUnread(isRead, notificationId) {
      let selectedNotification = this.notifications?.find((item) => item.notificationId === notificationId)
      let payload = {}
      if (selectedNotification && isRead) {
        selectedNotification.lastOpenedTime = new Date().toUTCString()
        payload.lastOpenedTime = selectedNotification.lastOpenedTime
      }
      if (selectedNotification?.isRead != isRead) {
        selectedNotification.isRead = isRead
        payload.isRead = isRead
      }
      await NotificationService.updateNotification(notificationId, payload)
    },
    getItemClass(item) {
      return {
        'unread-notification': !item?.isRead,
        'highlighted-row': this.selectedNotificationId === item?.notificationId,
      }
    },
  },
}
</script>

<style scoped>
.table {
  margin-left: 1px;
  max-height: 62vh;
  min-height: 45vh;
}
.unread-notification {
  font-weight: bold;
}
.highlighted-row {
  display: flex;
  align-items: center;
  background: #eeeeee;
  height: 100%;
}
:deep(.v-data-table__td) {
  padding: 0 !important;
}
</style>
