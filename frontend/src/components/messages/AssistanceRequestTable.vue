<template>
  <v-data-table-virtual
    v-if="assistanceRequests"
    v-model="bodyCheckboxesSelected"
    :headers="headers"
    :items="assistanceRequests"
    item-key="assistanceRequestId"
    item-value="assistanceRequestId"
    show-select
    hover
    fixed-header
    class="table"
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
    <template #item.lastConversationTime="{ item }">
      <div :class="getItemClass(item)">
        {{ format.formatDate(item.lastConversationTime) }}
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script>
import { mapState } from 'pinia'
import { useMessagesStore } from '@/stores/messages'
import MessageService from '@/services/messageService'
import format from '@/utils/format'

export default {
  name: 'AssistanceRequestTable',
  format: [format],
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
      format,
      headers: [
        { title: 'Status', align: 'start', key: 'status', sortable: true, width: '15%' },
        { title: 'Subject', align: 'start', key: 'subject', sortable: true, width: '40%' },
        { title: 'Topic', align: 'start', key: 'categoryName', sortable: true, width: '25%' },
        { title: 'Last updated', align: 'start', key: 'lastConversationTime', sortable: true, width: '20%' },
      ],
      bodyCheckboxesSelected: [],
      selectedRequestId: null,
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests']),
  },
  watch: {
    markReadButtonState: {
      async handler() {
        await this.updateBodyCheckboxesReadUnread(true)
      },
    },
    markUnreadButtonInMessageTableState: {
      async handler() {
        await this.updateBodyCheckboxesReadUnread(false)
      },
    },
    markUnreadButtonInConversationThreadState: {
      async handler() {
        await this.updateMessageReadUnread(false, this.selectedRequestId)
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
      const selectedAssistanceRequestIds = this.bodyCheckboxesSelected
      this.resetAllCheckboxes()
      await Promise.all(
        selectedAssistanceRequestIds.map(async (assistanceRequestId) => {
          await this.updateMessageReadUnread(isRead, assistanceRequestId)
        }),
      )
    },
    /**
     * Handles the row click event. When a row is clicked the assistanceRequests in context is displayed and marked as read.
     */
    async rowClickHandler(item, row) {
      this.selectedRequestId = row?.item?.assistanceRequestId
      this.$emit('openRequestConversation', this.selectedRequestId)
      await this.updateMessageReadUnread(true, this.selectedRequestId)
    },
    /**
     * Include isRead in the payload if its value changes
     */
    async updateMessageReadUnread(isRead, assistanceRequestId) {
      let selectedAssistanceRequest = this.assistanceRequests?.find((item) => item.assistanceRequestId === assistanceRequestId)
      let payload = {}
      if (selectedAssistanceRequest?.isRead != isRead) {
        selectedAssistanceRequest.isRead = isRead
        payload.isRead = isRead
        await MessageService.updateAssistanceRequest(assistanceRequestId, payload)
      }
    },
    isActionRequiredMessage(item) {
      return item?.status === 'Action required'
    },
    getItemClass(item) {
      return {
        'error-message': this.isActionRequiredMessage(item),
        'unread-message': !item?.isRead,
        'highlighted-row': this.selectedRequestId === item?.assistanceRequestId,
      }
    },
  },
}
</script>

<style scoped>
.table {
  padding-left: 1px;
  margin-bottom: 12px;
  max-height: 62vh;
  min-height: 45vh;
}

.unread-message {
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
