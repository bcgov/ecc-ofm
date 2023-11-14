<template>
  <v-data-table-virtual
    v-if="assistanceRequests?.length > 0"
    v-model="bodyCheckboxesSelected"
    :headers="headers"
    :items="assistanceRequests"
    item-key="assistanceRequestId"
    item-value="assistanceRequestId"
    height="65vh"
    show-select
    hover
    fixed-header
    density="compact">
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
      <tr
        :class="{
          'unread-message': !item.lastOpenedTime,
          'highlighted-row': index === rowClickedIndex,
        }"
        @click="rowClickHandler(item, index)">
        <td>
          <v-checkbox v-model="bodyCheckboxesSelected[index]" hide-details density="compact" @click.stop="bodyCheckboxesClickHandler" />
        </td>
        <td>
          <div class="item" :class="{ 'action-required-message': isActionRequiredMessage(item) }">{{ item.status }}</div>
        </td>
        <td>
          <div class="item" :class="{ 'action-required-message': isActionRequiredMessage(item) }">{{ item.subject }}</div>
        </td>
        <td>
          <div class="item" :class="{ 'action-required-message': isActionRequiredMessage(item) }">{{ item.categoryName }}</div>
        </td>
        <td>
          <div class="item" :class="{ 'action-required-message': isActionRequiredMessage(item) }">{{ item.lastUpdatedTime }}</div>
        </td>
      </tr>
    </template>
  </v-data-table-virtual>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useMessagesStore } from '@/stores/messages'

export default {
  name: 'AssistanceRequestTable',
  props: {
    markReadButtonState: {
      type: Boolean,
      default: false,
    },
    markUnreadButtonInMessageTableState: {
      type: Boolean,
      default: false,
    },
    markUnreadButtonInConversationThreadState: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['openRequestConversation'],
  data() {
    return {
      headers: [
        { title: 'Status', align: 'start', key: 'status', sortable: true, width: '15%' },
        { title: 'Subject', align: 'start', key: 'subject', sortable: true, width: '40%' },
        { title: 'Topic', align: 'start', key: 'categoryName', sortable: true, width: '25%' },
        { title: 'Last updated', align: 'start', key: 'lastUpdatedTime', sortable: true, width: '20%' },
      ],
      headerCheckboxState: false, // Manages state of checkbox in custom header
      bodyCheckboxesSelected: [], // Manages state of checkboxes in custom body
      rowClickedIndex: null, // Used for row select highlighting in template slot item
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests']),
  },
  watch: {
    markReadButtonState: {
      handler() {
        console.log('Mark Read Button is Clicked')
        this.updateBodyCheckboxesReadUnread(true)
      },
    },
    markUnreadButtonInMessageTableState: {
      handler() {
        console.log('Mark Unread Button In Message List is Clicked')
        this.updateBodyCheckboxesReadUnread(false)
      },
    },
    markUnreadButtonInConversationThreadState: {
      async handler() {
        console.log('Mark Unread Button In Conversation Thread is Clicked')
        await this.updateMessageLastOpenedTime(false, this.assistanceRequests[this.rowClickedIndex]?.assistanceRequestId)
      },
    },
  },
  created() {
    this.initAllCheckboxState()
  },
  methods: {
    ...mapActions(useMessagesStore, ['createNewAssistanceRequest', 'updateAssistanceRequest']),

    /**
     * Initializes the header and body/item checkboxes to false.
     */
    initAllCheckboxState() {
      this.headerCheckboxState = false
      this.bodyCheckboxesSelected = new Array(this.assistanceRequests.length).fill(false)
      console.log(`bodyCheckboxesSelected (${this.bodyCheckboxesSelected.length}) = ${this.bodyCheckboxesSelected}`)
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
    bodyCheckboxesClickHandler(item) {
      console.log(`bodyCheckboxesSelected (${item.assistanceRequestId}) = ${this.bodyCheckboxesSelected}`)
      console.log(`bodyCheckboxesSelected (${this.bodyCheckboxesSelected.length}) = ${this.bodyCheckboxesSelected}`)
    },
    /**
     * Update the body/item checkboxes to read or unread.
     */
    async updateBodyCheckboxesReadUnread(isRead) {
      await Promise.all(
        this.bodyCheckboxesSelected.map(async (checkbox, index) => {
          if (checkbox === true) {
            await this.updateMessageLastOpenedTime(isRead, this.assistanceRequests[index]?.assistanceRequestId)
          }
        }),
      )
      this.initAllCheckboxState()
    },
    /**
     * Handles the row click event. When a row is clicked the assistanceRequests in context is displayed and marked as read.
     */
    async rowClickHandler(item, index) {
      this.rowClickedIndex = index // Used for row select highlighting in template slot item
      this.$emit('openRequestConversation', item.assistanceRequestId)
      await this.updateMessageLastOpenedTime(true, item.assistanceRequestId)
    },
    async updateMessageLastOpenedTime(isRead, assistanceRequestId) {
      this.selectedAssistanceRequest = this.assistanceRequests?.find((item) => item.assistanceRequestId === assistanceRequestId)
      this.selectedAssistanceRequest.lastOpenedTime = isRead ? new Date().toISOString() : null
      let payload = {
        lastOpenedTime: this.selectedAssistanceRequest.lastOpenedTime,
      }
      console.log(`${assistanceRequestId} ---> ${isRead}`)
      await this.updateAssistanceRequest(assistanceRequestId, payload)
    },
    isActionRequiredMessage(item) {
      return item.status === 'Action required'
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
.item {
  padding-left: 30px;
  font-size: small;
}
.headers {
  padding-left: 30px;
  font-weight: bold;
  color: #878787;
}
.headers:hover {
  padding-left: 30px;
  font-weight: bold;
  color: black;
  cursor: pointer;
}
.unread-message {
  font-size: small;
  font-weight: bold;
}
.action-required-message {
  color: red;
  font-size: small;
}
.highlighted-row {
  background-color: #d4eaff;
}
</style>
