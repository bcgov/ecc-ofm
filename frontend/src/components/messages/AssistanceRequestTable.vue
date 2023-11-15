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
    class="tableText"
    density="compact"
    @click:row="rowClickHandler">
    <template #item.status="{ item }">
      <div :class="getItemClass(item)">
        {{ item.status }}
      </div>
    </template>
    <template #item.subject="{ item }">
      <div :class="getItemClass(item)">
        {{ item.subject }}
      </div>
    </template>
    <template #item.categoryName="{ item }">
      <div :class="getItemClass(item)">
        {{ item.categoryName }}
      </div>
    </template>
    <template #item.lastUpdatedTime="{ item }">
      <div :class="getItemClass(item)">
        {{ item.lastUpdatedTime }}
      </div>
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
      bodyCheckboxesSelected: [], // Manages state of checkboxes in custom body\
      selectedRequestId: null,
      selectedRowIndex: null,
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
        await this.updateMessageLastOpenedTime(false, this.selectedRequestId)
      },
    },
  },
  methods: {
    ...mapActions(useMessagesStore, ['createNewAssistanceRequest', 'updateAssistanceRequest']),

    resetAllCheckboxes() {
      this.bodyCheckboxesSelected = []
    },
    /**
     * Update the body/item checkboxes to read or unread.
     */
    async updateBodyCheckboxesReadUnread(isRead) {
      await Promise.all(
        this.bodyCheckboxesSelected.map(async (assistanceRequestId) => {
          await this.updateMessageLastOpenedTime(isRead, assistanceRequestId)
        }),
      )
      this.resetAllCheckboxes()
    },
    /**
     * Handles the row click event. When a row is clicked the assistanceRequests in context is displayed and marked as read.
     */
    async rowClickHandler(item, row) {
      this.selectedRowIndex = this.selectedRowIndex === row?.internalItem?.index + 1 ? 0 : row?.internalItem?.index + 1
      this.selectedRequestId = row?.item?.assistanceRequestId
      this.$emit('openRequestConversation', this.selectedRequestId)
      await this.updateMessageLastOpenedTime(true, this.selectedRequestId)
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
      return item?.status === 'Action required'
    },
    getItemClass(item) {
      let result = ''
      if (this.isActionRequiredMessage(item)) result += 'action-required-message '
      if (!item?.lastOpenedTime) result += 'unread-message '
      if (this.selectedRequestId === item.assistanceRequestId) result += 'highlighted-row '
      return result
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
.tableText {
  font-size: small;
}
:deep(.v-data-table-header__content:hover) {
  font-weight: bold;
  color: black;
  cursor: pointer;
}
.unread-message {
  font-weight: bold;
}
.action-required-message {
  color: red;
}
.highlighted-row {
  display: flex;
  align-items: center;
  background: #d4eaff !important;
  height: 100%;
}
:deep(.v-data-table__td) {
  padding: 0 !important;
}
</style>
