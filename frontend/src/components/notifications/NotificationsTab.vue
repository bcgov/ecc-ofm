<template>
  <v-container class="pa-3">
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-data-table :headers="headers" :items="notifications" item-key="notificationId" hover single-select
          height="500px" density="compact">
          <template v-slot:top>
            <div class="slot-top">
              <div class="flex-container">
                <!--div class="flex-item">
                  <v-icon class="icon">mdi-email-plus-outline</v-icon><span class="icon-text">New
                  Message</span>
                </div-->
                <div @click="updateCheckedReadUnread(false)" class="flex-item">
                  <v-icon class="icon">mdi-email-outline</v-icon><span class="icon-text">Mark
                    Unread</span>
                </div>
                <div @click="updateCheckedReadUnread(true)" class="flex-item">
                  <v-icon class="icon">mdi-email-open-outline</v-icon><span class="icon-text">Mark
                    Read</span>
                </div>
              </div>
            </div>
          </template>
          <template #headers="{ columns, isSorted, getSortIcon, toggleSort }">
            <tr>
              <th v-for="column  in  columns" :key="column.key" @click="toggleSort(column)"
                :style="{ width: column.width }">
                <div v-if="column.title === null">
                  <v-checkbox v-model="checkBoxToggleAllState" @click="toggleAllCheckBoxHandler" hide-details
                    density="compact"></v-checkbox>
                </div>
                <div v-else>
                  {{ column.title }}
                  <v-icon v-if="isSorted(column)">{{ getSortIcon(column) }}</v-icon>
                </div>
              </th>
            </tr>
          </template>
          <template #item="{ item, index }">
            <tr @click="rowClickHandler(item, index)"
              :class="{ 'unread-notification': !item.selectable.isRead, 'highlighted': index === rowClickedIndex }">
              <td :class="{ 'highlighted': index === rowClickedIndex }">
                <v-checkbox @click="checkBoxClickHandler" v-model="checkBoxListState[index]" hide-details
                  density="compact"></v-checkbox>
              </td>
              <td :class="{ 'highlighted': index === rowClickedIndex }">{{ (item.selectable.isRead) ? 'Read' : 'Unread' }}
              </td>
              <td :class="{ 'highlighted': index === rowClickedIndex }">{{ item.selectable.subject }}</td>
              <td :class="{ 'highlighted': index === rowClickedIndex }">{{ item.selectable.dateReceived }}</td>
            </tr>
          </template>
          <template v-slot:bottom></template>
        </v-data-table>
      </v-col>
      <v-col cols="6">
        <v-card v-if="notificationSelected" variant="flat">
          <v-card-title class="card-title d-flex align-start flex-wrap">
            <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <span class="font-bold">From:</span>&nbsp;Operating Funding Model Program
              </div>
              <div v-if="notificationSelected.selectable.isRead" @click="updateNotificationUnread(notificationSelected)"
                class="d-flex align-center">
                <v-icon class="icon ml-3">mdi-email-outline</v-icon>
                <span class="icon-text">Mark Unread</span>
              </div>
            </div>
            <div class="mt-2 w-100">
              {{ notificationSelected.selectable.subject }}
            </div>
          </v-card-title>
          <hr>
          <v-card-text v-html="notificationSelected.selectable.notificationContent"></v-card-text>
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
      checkBoxToggleAllState: false, // on/off state for toggle all checkbox
      checkBoxListState: [], // on/off state for checkboxes in list
      rowClickedIndex: null,
      checkBoxClickedState: false, // on/off state for a checkbox clicked
      notificationSelected: null,
      headers: [
        { title: null, align: 'start', key: 'name', sortable: false, width: '8%' },
        { title: 'Read/Unread', align: 'start', key: 'isRead', sortable: true, width: '20%' },
        { title: 'Subject', align: 'start', key: 'subject', sortable: false, width: '50%' },
        { title: 'Date Received', align: 'start', key: 'dateReceived', sortable: true, width: '22%' },
      ],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useNotificationsStore, ['notifications', 'unreadNotificationCount']),
  },
  async created() {
    this.getNotifications(this.userInfo.contactId)
    this.initCheckBoxState()
  },
  methods: {
    ...mapActions(useNotificationsStore, ['getNotifications', 'updateNotification']),
    /**
     * Initializes the toggle all checkbox and checkbox list state.
     */
    initCheckBoxState() {
      this.checkBoxListState = Array(this.notifications.length).fill(false)
      this.checkBoxToggleAllState = false
    },
    /**
     * Toggles all the notifications checked or unchecked.
     */
    toggleAllCheckBoxHandler() {
      this.checkBoxListState.fill(!this.checkBoxToggleAllState)
    },
    /**
     * Flags a list item has been checked.
     */
    checkBoxClickHandler() {
      this.checkBoxClickedState = true
    },
    /**
     * Handles the row click event. When a row is clicked the notification is displayed and marked as read.
     */
    rowClickHandler(item, index) {
      if (!this.checkBoxClickedState) {
        this.notificationSelected = item
        this.rowClickedIndex = index // Used for row select highlighting in template slot item
        this.notifications[index].isRead = true
        this.updateNotification(this.notifications[index], true)
      } else {
        this.checkBoxClickedState = false
      }
    },
    /**
     * Updates all checked notifications to read or unread.
     */
    updateCheckedReadUnread(isRead) {
      this.checkBoxListState.forEach((item, index) => {
        if (item) {
          this.notifications[index].isRead = isRead
          this.updateNotification(this.notifications[index], isRead)
        }
      })
      this.initCheckBoxState()
    },
    /**
     * Updates a notification to unread.
     */
    updateNotificationUnread(item) {
      item.selectable.isRead = false
      this.updateNotification(item.selectable, false)
    },
  }
};
</script>
  
<style scoped>
.flex-container {
  display: flex;
  justify-content: space-evenly;
}

.flex-item {
  display: flex;
  align-items: left;
}

.icon {
  font-size: 24px;
  padding-right: 2px;
  color: #6699cc;
  cursor: pointer;
}

.icon:hover {
  color: #6699cc;
}

.icon-text {
  color: #6699cc;
  cursor: pointer;
  transition: color 0.3s ease;
}

.icon-text:hover {
  color: #6699cc;
}

.font-bold {
  font-weight: bold;
}

.slot-top {
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: thin solid rgba(var(--v-border-color), var(--v-border-opacity))
}

.unread-notification {
  font-size: small;
  font-weight: bold;
}

.border-right {
  border-right: 2px solid #6699cc;
}

hr {
  border: 0;
  height: 1px;
  background: #6699cc;
  background-image: linear-gradient(to right, #6699cc, #6699cc, #6699cc);
}

.card-title {
  font-size: medium;
  padding-left: 0px !important;
}

.highlighted {
  background-color: #D4EAFF !important;
}
</style>
  