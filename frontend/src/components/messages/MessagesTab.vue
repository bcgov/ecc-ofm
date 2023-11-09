<template>
  <v-container class="pa-3">
    <v-row>
      <v-col cols="6" class="border-right pa-0">
        <v-data-table-virtual
          v-if="assistanceRequests?.length > 0"
          v-model="selectedRows"
          :headers="headers"
          :items="assistanceRequests"
          item-key="assistanceRequestId"
          item-value="assistanceRequestId"
          :height="fitScreenHeight()"
          show-select
          hover
          fixed-header
          density="compact"
          @click:row="rowClickHandler(item)">
          <template #top>
            <v-row>
              <v-col class="mt-1">
                <div class="flex-item">
                  <v-btn class="btn-style" @click="toggleNewRequestDialog()">
                    <v-icon class="icon" left>mdi-email-plus-outline</v-icon>
                    <span class="btn-label">New message</span>
                  </v-btn>
                  <v-btn class="btn-style" @click="whatEver()">
                    <v-icon class="icon" left>mdi-email-outline</v-icon>
                    <span class="btn-label">Mark unread</span>
                  </v-btn>
                  <v-btn class="btn-style" @click="whatEver()">
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
              <th v-for="column in columns" :key="column.key" :style="{ width: column.width }" @click="toggleSort(column)">
                <div v-if="column.title === ''">
                  <v-checkbox
                    v-model="headerCheckboxState"
                    :indeterminate="bodyCheckboxesSelected.length > 0 && bodyCheckboxesSelected.includes(true)"
                    hide-details
                    density="compact"
                    @click.stop="headerCheckboxClickHandler" />
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
            <tr :class="{ 'unread-notification': !item.categoryName, 'highlighted-row': index === rowClickedIndex }" item-key="assistanceRequestId" @click="rowClickHandler(item, index)">
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <v-checkbox v-model="bodyCheckboxesSelected[index]" hide-details density="compact" @click.stop="bodyCheckboxesClickHandler" />
              </td>
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <div class="item">{{ item.assistanceRequestStatusName }}</div>
              </td>
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <div class="item">{{ item.subject }}</div>
              </td>
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <div class="item">{{ item.categoryName }}</div>
              </td>
              <td :class="{ 'highlighted-row': index === rowClickedIndex }">
                <div class="item">{{ item.categoryName }}</div>
              </td>
            </tr>
          </template>
        </v-data-table-virtual>
      </v-col>
      <v-col cols="6">
        <v-card v-if="true" variant="flat">
          <v-card-title class="card-title d-flex align-start flex-wrap">
            <!-- <div class="d-flex align-center justify-space-between w-100">
              <div class="d-flex align-center">
                <span class="font-bold">From:</span>
                &nbsp;Operating Funding Model Program
              </div>
              <v-icon class="icon ml-3">mdi-email-outline</v-icon>
              <span class="icon-text">Mark Unread</span>
            </div>
            <div class="mt-2 w-100">
              {{ assistanceRequestSelected.selectable.subject }}
            </div> -->
          </v-card-title>
          <hr />
          <v-card-text></v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <NewRequestDialog class="pa-0" :show="showNewRequestDialog" @close="toggleNewRequestDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'

export default {
  name: 'MessagesTab',
  components: { NewRequestDialog },
  data() {
    return {
      showNewRequestDialog: false,
      headers: [
        { title: 'Status', align: 'start', key: 'assistanceRequestStatusName', sortable: true, width: '10%' },
        { title: 'Subject', align: 'start', key: 'subject', sortable: true, width: '25%' },
        { title: 'Topic', align: 'start', key: 'categoryName', sortable: true, width: '45%' },
        { title: 'Last updated', align: 'start', key: 'dateReceived', sortable: true, width: '20%' },
      ],
      selectedRows: [],
      headerCheckboxState: false,
      bodyCheckboxesSelected: [],
      rowClickedIndex: null,
      checkBoxToggleAllState: false, // on/off state for toggle all checkbox
      rowCheckedIndexes: [], // on/off state for checkboxes in list
      checkBoxClickedState: false, // on/off state for a checkbox clicked
      assistanceRequestSelected: null,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useMessagesStore, ['assistanceRequests']),
  },
  async created() {
    this.getAssistanceRequests(this.userInfo?.contactId).then(() => {
      this.initAllCheckboxState()
    })
  },
  methods: {
    ...mapActions(useMessagesStore, ['getAssistanceRequests']),
    toggleNewRequestDialog() {
      this.showNewRequestDialog = !this.showNewRequestDialog
    },
    whatEver() {
      console.log(this.selectedRows)
    },
    /**
     * Initializes the header and body/item checkboxes to false.
     */
    initAllCheckboxState() {
      this.headerCheckboxState = false
      this.bodyCheckboxesSelected = new Array(this.assistanceRequests.length).fill(false)
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
    bodyCheckboxesClickHandler() {},
    /**
     * Update the body/item checkboxes to read or unread.
     */
    updateBodyCheckboxesReadUnread(isRead) {
      this.bodyCheckboxesSelected.forEach((item, index) => {
        if (item) {
          // jstorey can remove?
          this.assistanceRequests[index].isRead = isRead
          this.updateNotification(this.assistanceRequests[index], isRead)
        }
      })
      this.initAllCheckboxState()
    },
    /**
     * Handles the row click event. When a row is clicked the assistanceRequests in context is displayed and marked as read.
     */
    rowClickHandler(item, index) {
      console.log(item)
      console.log(item.assistanceRequestStatusName)
      this.rowClickedIndex = index // Used for row select highlighting in template slot item
      this.assistanceRequestSelected = this.assistanceRequests.find((assistanceRequest) => assistanceRequest.assistanceRequestId === item.assistanceRequestId)
      // this.assistanceRequestSelected.isRead = true
      // this.updateNotification(this.assistanceRequestSelected)
    },
    /**
     * Updates the currnetly clicked/selected notification to unread.
     */
    updateNotificationUnread() {
      this.assistanceRequestSelected.isRead = false
      this.updateNotification(this.assistanceRequestSelected)
    },
    getRowStyle() {
      console.log(' CLGVVVVVVVVVVVVVVVVVVVV ??????????????????????? ')
      return 'unread-notification'
      // console.log(assistanceRequestStatusName)
      // if (assistanceRequestStatusName) {
      //   console.log(assistanceRequestStatusName)
      //   return 'unread-notification'
      // } else return 'unread'
    },
    fitScreenHeight() {
      if (this.$vuetify.display.xs) return '67vh'
      else if (this.$vuetify.display.sm) return '82vh'
      else if (this.$vuetify.display.md) return '75vh'
      else if (this.$vuetify.display.lg) return '70vh'
      else if (this.$vuetify.display.xl) return '78vh'
      else return '70vh'
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

.unread-notification {
  font-size: small;
  font-weight: bold;
}

.border-right {
  border-right: 2px solid #6699cc;
}

.highlighted-row {
  background-color: #d4eaff !important;
}
</style>
