<template>
  <v-container class="pa-3">
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-data-table-virtual v-model="rowCheckedIndexes" :headers="headers" :items="notifications"
          item-key="notificationId" item-value="notificationId" show-select hover fixed-header density="compact"
          class="data-table">
          <!-- TOP -->
          <template #top>
            <v-row>
              <v-col class="mt-1">
                <div class="flex-item">
                  <v-btn @click="updateBodyCheckboxesReadUnread(false)" class="btn-style">
                    <v-icon class="icon" left>mdi-email-outline</v-icon>
                    <span class="btn-label">Mark unread</span>
                  </v-btn>
                  <v-btn @click="updateBodyCheckboxesReadUnread(true)" class="btn-style">
                    <v-icon class="icon" left>mdi-email-open-outline</v-icon>
                    <span class="btn-label">Mark read</span>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </template>
          <!-- HEADERS -->
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <th v-for="column in columns" :key="column.key" :style="{ width: column.width }"
                @click="toggleSort(column)">
                <div v-if="column.title === ''">
                  <v-checkbox v-model="headerCheckboxState"
                    :indeterminate="bodyCheckboxesSelected.length > 0 && bodyCheckboxesSelected.includes(true)"
                    hide-details density="compact" @click.stop="headerCheckboxClickHandler" />
                </div>
                <div v-else class="headers">
                  {{ column.title }}
                  <v-icon v-if="isSorted(column)" size="20" class="pa-0, ma-0">{{ getSortIcon(column) }}</v-icon>
                </div>
              </th>
            </tr>
          </template>
          <!-- BODY -->
          <template #item="{ item, index }">
            <tr :class="{ 'unread-notification': !item.isRead, 'highlighted-row': index === rowClickedIndex }"
              item-key="notificationId" @click="rowClickHandler(item, index)">
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <v-checkbox v-model="bodyCheckboxesSelected[index]" hide-details density="compact"
                  @click.stop="bodyCheckboxesClickHandler" />
              </td>
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <div class="item">{{ (item.isRead) ?
                  'Read' :
                  'Unread' }}</div>
              </td>
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <div class="item">{{ item.subject }}</div>
              </td>
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <div class="item">{{ item.dateReceived }}</div>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-col>
      <v-col cols="6">
        <!-- NOTIFICATION DETAILS -->
        <v-card v-if="notificationSelected" variant="flat">
          <v-card-title>
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <span class="font-bold">From:</span>&nbsp;Operating Funding Model Program
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
          <hr>
          <v-card-text v-html="notificationSelected.notificationContent" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useNotificationsStore } from '@/stores/notifications'

export default {
  data() {
    return {
      headerCheckboxState: false,
      bodyCheckboxesSelected: [],
      rowClickedIndex: null,
      checkBoxToggleAllState: false, // on/off state for toggle all checkbox
      rowCheckedIndexes: [], // on/off state for checkboxes in list
      checkBoxClickedState: false, // on/off state for a checkbox clicked
      notificationSelected: null,
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
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useNotificationsStore, ['notifications', 'unreadNotificationCount']),
  },
  async created() {
    this.getNotifications(this.userInfo.contactId).then(() => {
      this.initAllCheckboxState()
    })
  },
  methods: {
    ...mapActions(useNotificationsStore, ['getNotifications', 'updateNotification']),
    /**
     * Initializes the header and body/item checkboxes to false.
     */
    initAllCheckboxState() {
      this.headerCheckboxState = false
      this.bodyCheckboxesSelected = new Array(this.notifications.length).fill(false)
    },
    /**
     * Handles the header checkbox click event. When the header checkbox is clicked all body/item checkboxes are selected.
     */
    headerCheckboxClickHandler() {
      this.bodyCheckboxesSelected.fill(!this.headerCheckboxState)
    },
    /**
     *  This must exist to avoid mutation of the array
     */
    bodyCheckboxesClickHandler() { },
    /**
     * Update the body/item checkboxes to read or unread.
     */
    updateBodyCheckboxesReadUnread(isRead) {
      this.bodyCheckboxesSelected.forEach((item, index) => {
        if (item) { // jstorey can remove?
          this.notifications[index].isRead = isRead
          this.updateNotification(this.notifications[index], isRead)
        }
      })
      this.initAllCheckboxState()
    },
    /**
     * Handles the row click event. When a row is clicked the notification in context is displayed and marked as read.
     */
    rowClickHandler: function (item, index) {
      this.rowClickedIndex = index // Used for row select highlighting in template slot item
      this.notificationSelected = this.notifications.find(notification => notification.notificationId === item.notificationId)
      this.notificationSelected.isRead = true
      this.updateNotification(this.notificationSelected)
    },
    /**
     * Updates the currnetly clicked/selected notification to unread.
     */
    updateNotificationUnread() {
      this.notificationSelected.isRead = false
      this.updateNotification(this.notificationSelected)
    },
  }
};
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
  padding: 0px 6px !important;
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
  padding: 0px !important;
  margin: 0px;
  font-size: 1.5em;
}

.headers {
  padding-left: 4px !important;
  font-weight: bold !important;
  color: #878787 !important;
}

.headers:hover {
  padding-left: 4px !important;
  font-weight: bold !important;
  color: black !important;
  cursor: pointer !important;
}

.font-bold {
  font-weight: bold;
}

.subject-text {
  font-size: 18px !important;
}

.unread-notification {
  font-size: small;
  font-weight: bold;
}

.border-right {
  border-right: 2px solid #6699cc;
}

.highlighted-row {
  background-color: #D4EAFF !important;
}
</style>
  