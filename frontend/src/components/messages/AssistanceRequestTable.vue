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
    <template #item.lastConversationTime="{ item }">
      <div :class="getItemClass(item)">
        {{ formatDate(item.lastConversationTime) }}
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useMessagesStore } from '@/stores/messages'
import moment from 'moment'

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
      handler() {
        this.updateBodyCheckboxesReadUnread(true)
      },
    },
    markUnreadButtonInMessageTableState: {
      handler() {
        this.updateBodyCheckboxesReadUnread(false)
      },
    },
    markUnreadButtonInConversationThreadState: {
      async handler() {
        await this.updateMessageReadUnread(false, this.selectedRequestId)
      },
    },
  },
  methods: {
    ...mapActions(useMessagesStore, ['updateAssistanceRequest']),

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
    async updateMessageReadUnread(isRead, assistanceRequestId) {
      this.selectedAssistanceRequest = this.assistanceRequests?.find((item) => item.assistanceRequestId === assistanceRequestId)
      let payload = {}
      if (isRead) {
        this.selectedAssistanceRequest.lastOpenedTime = new Date().toUTCString()
        payload.lastOpenedTime = this.selectedAssistanceRequest.lastOpenedTime
      }
      if (this.selectedAssistanceRequest.isRead != isRead) {
        this.selectedAssistanceRequest.isRead = isRead
        payload.isRead = isRead
      }
      await this.updateAssistanceRequest(assistanceRequestId, payload)
    },
    isActionRequiredMessage(item) {
      return item?.status === 'Action required'
    },
    getItemClass(item) {
      return {
        'action-required-message': this.isActionRequiredMessage(item),
        'unread-message': !item?.isRead,
        'highlighted-row': this.selectedRequestId === item?.assistanceRequestId,
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

.unread-message {
  font-weight: bold;
}

.action-required-message {
  color: red;
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
