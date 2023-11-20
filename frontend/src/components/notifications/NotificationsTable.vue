<template>
  <v-data-table-virtual
    v-if="notifications"
    v-model="bodyCheckboxesSelected"
    :headers="headers"
    :items="notifications"
    item-key="notificationId"
    item-value="notificationId"
    height="65vh"
    show-select
    hover
    fixed-header
    class="tableText"
    density="compact"
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
        {{ formatDate(item.dateReceived) }}
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useNotificationsStore } from '@/stores/notifications'
import moment from 'moment'

export default {
  name: 'NotificationsTable',
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
    ...mapActions(useNotificationsStore, ['getNotifications', 'updateNotification']),

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
     * Include lastOpenedTime in the payload if the notification is "Marked as Read" or "Opened"
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
      await this.updateNotification(notificationId, payload)
    },
    getItemClass(item) {
      return {
        'unread-notification': !item?.isRead,
        'highlighted-row': this.selectedNotificationId === item?.notificationId,
      }
    },
    formatDate(date) {
      return moment(date).format('YYYY-MMM-DD')
    },
  },
}
</script>

<style scoped>
.tableText {
  font-size: small;
}
:deep(.v-data-table-header__content:hover) {
  font-weight: bold;
  color: black;
  cursor: pointer;
}
.unread-notification {
  font-weight: bold;
}
.highlighted-row {
  display: flex;
  align-items: center;
  background: #d4eaff;
  height: 100%;
}
:deep(.v-data-table__td) {
  padding: 0 !important;
}
</style>
