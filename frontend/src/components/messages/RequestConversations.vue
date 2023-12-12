<template>
  <v-container v-if="assistanceRequest">
    <v-row>
      <v-col cols="9" class="d-flex align-center pl-0 pt-0 pb-4">
        <span class="subject-header">Subject: {{ assistanceRequest.subject }}</span>
      </v-col>
      <v-col cols="3" class="d-flex flex-column align-end pa-0">
        <AppButton variant="text" width="150px" v-if="assistanceRequest.isRead" @click="this.$emit('toggleMarkUnreadButtonInConversationThread')">
          <v-icon class="icon" left>mdi-email-outline</v-icon>
          <span>Mark unread</span>
        </AppButton>
        <v-tooltip v-if="showTooltip" content-class="tooltip" :text="getReplyDisabledText()">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="reply-disabled">
              <v-icon left>mdi-reply</v-icon>
              <span>Reply</span>
            </div>
          </template>
        </v-tooltip>
        <AppButton variant="text" v-else-if="isReplyButtonEnabled" @click="toggleReplyRequestDialog" class="pr-2">
          <v-icon class="icon" left>mdi-reply</v-icon>
          <span>Reply</span>
        </AppButton>
        <div v-else class="reply-disabled">
          <v-icon left>mdi-reply</v-icon>
          <span>Reply</span>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="font-weight-bold pt-0 pl-0">Status:</v-col>
      <v-col cols="3" class="pt-0 pl-1">{{ assistanceRequest.status }}</v-col>
      <v-col cols="auto" class="font-weight-bold pt-0 pl-1">Reference#:</v-col>
      <v-col class="pt-0 pl-0">{{ assistanceRequest.referenceNumber }}</v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="font-weight-bold pt-0 pb-0 pl-0">Topic:</v-col>
      <v-col cols="3" class="pt-0 pb-0">{{ assistanceRequest.categoryName }}</v-col>
      <v-col cols="auto" class="font-weight-bold pt-0 pb-0">Facility(s):</v-col>
      <v-col class="pt-0 pb-0">{{ assistanceRequest.requestFacilities.map((facility) => facility.facilityName).join(', ') }}</v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end pt-0 pb-0 pr-0 w-100 align-center">
        <span class="font-weight-bold">Sort By:</span>
        <AppButton variant="text" @click="toggleSort()">
          <span>{{ isSortedDesc ? 'Newest' : 'Oldest' }} first</span>
          <v-icon v-if="isSortedDesc" class="icon">mdi-arrow-up</v-icon>
          <v-icon v-else class="icon">mdi-arrow-down</v-icon>
        </AppButton>
      </v-col>
    </v-row>
    <v-row v-if="showCloseRequestBanner">
      <CloseRequestBanner :assistanceRequestId="assistanceRequestId" class="pa-0 mb-4" />
    </v-row>
    <v-row v-if="assistanceRequest" class="border-top">
      <v-col cols="12" class="border-right pa-0">
        <v-skeleton-loader :loading="loading" type="table-tbody">
          <v-data-table-virtual :headers="headers" :items="assistanceRequestConversation" item-key="messageId" class="data-table">
            <template #headers></template>
            <template #item="{ item }">
              <v-row class="border-bottom ma-0">
                <v-col>
                  <div>
                    <span class="font-weight-bold">From:</span>
                    {{ deriveFromDisplay(item) }}
                  </div>
                  <div>
                    <span class="font-weight-bold">Sent:</span>
                    {{ format.formatDate(item.sentDate) }}
                  </div>
                  <div class="pt-1">{{ item.message }}</div>
                </v-col>
              </v-row>
            </template>
          </v-data-table-virtual>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <ReplyRequestDialog
      class="pa-0"
      :assistanceRequestId="assistanceRequest.assistanceRequestId"
      :referenceNumber="assistanceRequest.referenceNumber"
      :show="showReplyRequestDialog"
      @reply-success-event="replySuccessEvent"
      @close="toggleReplyRequestDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import ReplyRequestDialog from '@/components/messages/ReplyRequestDialog.vue'
import CloseRequestBanner from '@/components/messages/CloseRequestBanner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import alertMixin from '@/mixins/alertMixin'
import format from '@/utils/format'
import { ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT, ASSISTANCE_REQUEST_STATUS_CODES, OFM_PROGRAM } from '@/utils/constants'

export default {
  mixins: [alertMixin],
  format: [format],
  components: { AppButton, ReplyRequestDialog, CloseRequestBanner },
  props: {
    assistanceRequestId: {
      type: String,
      required: true,
      default: '',
    },
  },
  emits: ['toggleMarkUnreadButtonInConversationThread'],
  data() {
    return {
      format,
      showReplyRequestDialog: false,
      isSortedDesc: true,
      assistanceRequest: null,
      loading: false,
      headers: [
        {
          title: 'dateReceived',
          key: 'dateReceived',
          sortable: true,
        },
      ],
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests', 'assistanceRequestConversation']),
    ...mapState(useAuthStore, ['userInfo']),
    showTooltip() {
      return !this.isReplyButtonEnabled && !this.isStatusClosed
    },
    showCloseRequestBanner() {
      const assistanceRequest = this.assistanceRequests.find((item) => item.assistanceRequestId === this.assistanceRequestId)
      return assistanceRequest?.statusCode === ASSISTANCE_REQUEST_STATUS_CODES.READY_TO_RESOLVE
    },
    isReplyButtonEnabled() {
      const assistanceRequest = this.assistanceRequests.find((item) => item.assistanceRequestId === this.assistanceRequestId)
      return [ASSISTANCE_REQUEST_STATUS_CODES.WITH_PROVIDER, ASSISTANCE_REQUEST_STATUS_CODES.READY_TO_RESOLVE].includes(assistanceRequest?.statusCode)
    },
    isStatusClosed() {
      const assistanceRequest = this.assistanceRequests.find((item) => item.assistanceRequestId === this.assistanceRequestId)
      return [ASSISTANCE_REQUEST_STATUS_CODES.CLOSED_COMPLETE, ASSISTANCE_REQUEST_STATUS_CODES.CLOSED_CANCELLED].includes(assistanceRequest?.statusCode)
    },
  },
  watch: {
    // When assistanceRequestId changes, get the conversation for the new assistance request.
    assistanceRequestId: async function (newVal) {
      this.loading = true
      await this.getAssistanceRequestConversation(this.assistanceRequestId)
      this.sortConversation()
      this.loading = false
      this.assistanceRequest = this.assistanceRequests.find((item) => item.assistanceRequestId === newVal)
    },
  },
  methods: {
    ...mapActions(useMessagesStore, ['getAssistanceRequestConversation']),

    /**
     * Sorts the conversation by sent date.
     */
    sortConversation() {
      this.assistanceRequestConversation.sort((a, b) => {
        if (this.isSortedDesc) {
          return a.sentDate < b.sentDate ? 1 : -1
        } else {
          return a.sentDate > b.sentDate ? 1 : -1
        }
      })
    },

    /**
     * Toggles the sort order of the conversation.
     */
    toggleSort() {
      this.isSortedDesc = !this.isSortedDesc
      this.sortConversation()
    },

    /**
     * Toggles the reply request dialog opened/closed.
     */
    toggleReplyRequestDialog() {
      this.showReplyRequestDialog = !this.showReplyRequestDialog
    },

    /**
     * Called when the reply request dialog emits a reply-success-event. Gets the conversation for the
     * assistance request and sorts them.
     */
    async replySuccessEvent(isSuccess) {
      if (isSuccess) {
        // Assistance request status has been updated as part of reply, get the latest from store.
        this.assistanceRequest = this.assistanceRequests.find((item) => item.assistanceRequestId === this.assistanceRequestId)
        await this.getAssistanceRequestConversation(this.assistanceRequestId)
        this.sortConversation()
        this.setSuccessAlert('Reply sent successfully')
      }
    },

    /**
     * Returns the text to display in the tooltip for the reply button when it is disabled.
     */
    getReplyDisabledText() {
      return ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT
    },

    /**
     * Returns the sent by value for the conversation depending on the source system.
     */
    deriveFromDisplay(item) {
      return item.ofmSourceSystem ? `${this.userInfo?.firstName} ${this.userInfo?.lastName}` : OFM_PROGRAM
    },
  },
}
</script>

<style scoped>
.data-table {
  max-height: 48vh;
}

.subject-header {
  font-size: 20px;
  font-weight: bold;
  color: #003466;
}

.border-top {
  border-top: 1px solid #e0e0e0;
}

.border-bottom {
  border-top: 1px solid #e0e0e0;
}

.reply-disabled {
  padding-right: 10px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1.25px;
  color: #c0c0c0;
  font-family: BCSans, veranda, arial, sans-serif;
}
</style>
