<template>
  <v-container v-if="assistanceRequest" class="pa-3">
    <v-row>
      <v-col cols="10" class="d-flex align-center pl-0 pt-0 pb-0">
        <span class="subject-header">Subject: {{ assistanceRequest.subject }}</span>
      </v-col>
      <v-col cols="2" class="d-flex flex-column align-start pb-0 pt-0">
        <v-btn v-if="assistanceRequest.lastOpenedTime"
          @click="this.$emit('toggleMarkUnreadButtonInConversationThread')" class="btn-style">
          <v-icon class="icon" left>mdi-email-open-outline</v-icon>
          <span class="btn-label">Mark unread</span>
        </v-btn>
        <v-tooltip v-if="isReplyDisabled" content-class="tooltip"
          :text="getReplyDisabledText()">
          <template v-slot:activator="{ props }">
            <div v-bind="props" class="reply-disabled">
              <v-icon left>mdi-reply</v-icon>
              <span>Reply</span>
            </div>
          </template>
        </v-tooltip>
        <v-btn v-else @click="toggleReplyRequestDialog" class="btn-style pl-0 pr-15">
          <v-icon class="icon" left>mdi-reply</v-icon>
          <span class="btn-label">Reply</span>
        </v-btn>
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
      <v-col class="pt-0 pb-0">{{ assistanceRequest.requestFacilities.map(facility =>
        facility.facilityName).join(', ') }}</v-col>
    </v-row>
    <v-row class="border-bottom">
      <v-col class="d-flex justify-end pt-0 pb-0 pr-0 w-100 align-center"><span class="font-weight-bold">Sort
          By:</span>
        <v-btn class="btn-style" @click="toggleSort()">
          <span class="btn-label">{{ isSortedDesc ? 'Newest' : 'Oldest' }} first</span>
          <v-icon v-if="isSortedDesc" class="icon">mdi-arrow-up</v-icon>
          <v-icon v-else class="icon">mdi-arrow-down</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row v-if="assistanceRequest">
      <v-col cols="12" class="border-right pa-0">
        <v-skeleton-loader :loading="loading" type="table-tbody">
          <v-data-table-virtual :headers="headers" :items="assistanceRequestConversation" item-key="messageId"
            class="data-table">
            <template #headers>
            </template>
            <template #item="{ item }">
              <v-row class="border-bottom mr-0">
                <v-col>
                  <div><span class="font-weight-bold">From:</span> {{ deriveFromDisplay(item) }}</div>
                  <div><span class="font-weight-bold">Sent:</span> {{ format.formatDate(item.sentDate) }}</div>
                  <div class="pt-1">{{ item.message }}</div>
                </v-col>
              </v-row>
            </template>
          </v-data-table-virtual>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <ReplyRequestDialog class="pa-0"
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
import alertMixin from '@/mixins/alertMixin'
import format from '@/utils/format'
import { ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT, ASSISTANCE_REQUEST_STATUS_CODES, OFM_PROGRAM } from '@/utils/constants'

export default {
  mixins: [alertMixin],
  format: [format],
  components: { ReplyRequestDialog },
  props: {
    assistanceRequestId: {
      type: [String, null],
      required: true,
      default: ''
    }
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
          sortable: true
        }
      ],
    }
  },
  computed: {
    ...mapState(useMessagesStore, ['assistanceRequests', 'assistanceRequestConversation']),
    ...mapState(useAuthStore, ['userInfo']),
    isReplyDisabled() {
      return this.assistanceRequest &&
        (this.assistanceRequest.statusCode !== ASSISTANCE_REQUEST_STATUS_CODES.WITH_PROVIDER &&
          this.assistanceRequest.statusCode !== ASSISTANCE_REQUEST_STATUS_CODES.READY_TO_RESOLVE);
    }
  },
  watch: {
    // When assistanceRequestId changes, get the conversation for the new assistance request.
    assistanceRequestId: async function (newVal) {
      this.loading = true
      await this.getAssistanceRequestConversation(this.assistanceRequestId)
      this.loading = false
      this.assistanceRequest = this.assistanceRequests.find(item => item.assistanceRequestId === newVal)
    },
  },
  methods: {
    ...mapActions(useMessagesStore, ['getAssistanceRequestConversation']),

    /**
     * Sorts the conversation by date received based on isSortedDesc.
     */
    sortConversation() {
      this.assistanceRequestConversation.sort((a, b) => {
        if (this.isSortedDesc) {
          return (a.dateReceived < b.dateReceived) ? 1 : -1;
        } else {
          return (a.dateReceived > b.dateReceived) ? 1 : -1;
        }
      });
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
        await this.getAssistanceRequestConversation(this.assistanceRequestId);
        this.sortConversation();
        this.setSuccessAlert('Reply sent successfully');
      }
    },

    /**
     * Returns the text to display in the tooltip for the reply button when it is disabled.
     */
    getReplyDisabledText() {
      return ASSISTANCE_REQUEST_REPLY_DISABLED_TEXT;
    },

    /**
     * Returns the sent by value for the conversation depending on the source system.
     */
    deriveFromDisplay(item) {
      return (item.ofmSourceSystem) ? `${this.userInfo?.firstName} ${this.userInfo?.lastName}` : OFM_PROGRAM;
    }

  }
}
</script>
  
<style scoped>
.data-table {
  max-height: 635px;
}

.subject-header {
  font-size: 20px;
  font-weight: bold;
  color: #003466;
}

.btn-style .v-btn__content .icon {
  padding: 0px;
  margin: 0px;
  font-size: 1.5em;
}

.btn-style {
  padding: 0px 6px;
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

.border-bottom {
  padding: 0px;
  border-bottom: 1px solid #E0E0E0;
}

.reply-disabled {
  padding-right: 17px;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1.25px;
  color: #C0C0C0;
  font-family: BCSans, veranda, arial, sans-serif;
}
</style>
  