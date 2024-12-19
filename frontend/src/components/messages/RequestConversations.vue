<!-- eslint-disable vue/no-v-html -->
<template>
  <v-container v-if="assistanceRequest">
    <v-row>
      <v-col cols="7" lg="9" class="d-flex align-center pl-0 pt-0 pb-4">
        <span class="subject-header">Subject: {{ assistanceRequest.subject }}</span>
      </v-col>
      <v-col cols="5" lg="3" class="d-flex flex-column align-end pa-0">
        <AppButton v-if="assistanceRequest.isRead" size="small" min-width="155px" :primary="false" class="conversations-button" @click="$emit('toggleMarkUnreadButtonInConversationThread')">
          <v-icon left class="mr-1">mdi-email-outline</v-icon>
          <span>Mark unread</span>
        </AppButton>
        <v-tooltip
          :disabled="!showTooltip"
          class="ma-1"
          content-class="tooltip"
          text="Your request is still in the queue. If this is an urgent request, you can call the program at 1-888-338-6622 (Option 7).">
          <template #activator="{ props }">
            <div v-bind="props">
              <AppButton class="reply-button my-1" :disabled="!isReplyButtonEnabled" size="small" min-width="155px" @click="toggleReplyRequestDialog">
                <v-icon left class="mr-1">mdi-reply</v-icon>
                <span>Reply</span>
              </AppButton>
            </div>
          </template>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="font-weight-bold pt-0 pl-0">Status:</v-col>
      <v-col cols="3" class="pt-0 pl-1" data-cy="status">{{ assistanceRequest.status }}</v-col>
      <v-col cols="auto" class="font-weight-bold pt-0 pl-1">Reference#:</v-col>
      <v-col class="pt-0 pl-0" data-cy="referenceNo">{{ assistanceRequest.referenceNumber }}</v-col>
    </v-row>
    <v-row>
      <v-col cols="auto" class="font-weight-bold pt-0 pb-0 pl-0">Topic:</v-col>
      <v-col cols="3" class="pt-0 pb-0" data-cy="topic">{{ assistanceRequest.categoryName }}</v-col>
      <v-col cols="auto" class="font-weight-bold pt-0 pb-0">Facility(s):</v-col>
      <v-col class="pt-0 pb-0">{{ assistanceRequest.requestFacilities.map((facility) => facility.facilityName).join(', ') }}</v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex justify-end pt-0 pb-0 pr-0 w-100 align-center">
        <span class="font-weight-bold">Sort By:</span>
        <AppButton variant="text" @click="toggleSort()">
          <span>{{ isSortedDesc ? 'Newest' : 'Oldest' }} first</span>
          <v-icon v-if="isSortedDesc">mdi-arrow-up</v-icon>
          <v-icon v-else>mdi-arrow-down</v-icon>
        </AppButton>
      </v-col>
    </v-row>
    <v-row v-if="showCloseRequestBanner">
      <CloseRequestBanner :assistance-request-id="assistanceRequestId" class="pa-0 mb-4" />
    </v-row>
    <v-row v-if="assistanceRequest" class="border-top">
      <v-col cols="12" class="border-right pa-0">
        <v-skeleton-loader :loading="loading" type="table-tbody">
          <v-data-table-virtual :headers="headers" :items="assistanceRequestConversation" item-key="messageId" class="data-table" data-cy="conversations-table">
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
                  <div class="pt-1" @click.capture="handlePdf" v-html="item.message" />
                </v-col>
              </v-row>
            </template>
          </v-data-table-virtual>
        </v-skeleton-loader>
      </v-col>
    </v-row>
    <ReplyRequestDialog
      class="pa-0"
      :assistance-request-id="assistanceRequest.assistanceRequestId"
      :reference-number="assistanceRequest.referenceNumber"
      :show="showReplyRequestDialog"
      @reply-success-event="replySuccessEvent"
      @close="toggleReplyRequestDialog" />
  </v-container>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import CloseRequestBanner from '@/components/messages/CloseRequestBanner.vue'
import ReplyRequestDialog from '@/components/messages/ReplyRequestDialog.vue'
import AppButton from '@/components/ui/AppButton.vue'
import alertMixin from '@/mixins/alertMixin'
import FileService from '@/services/fileService'
import { useAuthStore } from '@/stores/auth'
import { useMessagesStore } from '@/stores/messages'
import { ASSISTANCE_REQUEST_STATUS_CODES, OFM_PROGRAM } from '@/utils/constants'
import { deriveImageType } from '@/utils/file'
import format from '@/utils/format'

const ID_REGEX = /\(([^)]+)\)/

export default {
  components: { AppButton, ReplyRequestDialog, CloseRequestBanner },
  mixins: [alertMixin],
  props: {
    assistanceRequestId: {
      type: String,
      required: true,
      default: '',
    },
  },
  format: [format],
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
      await this.formatConversation()
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
     * Returns the sent by value for the conversation depending on the source system.
     */
    deriveFromDisplay(item) {
      return item.ofmSourceSystem ? `${this.userInfo?.firstName ?? ''} ${this.userInfo?.lastName}` : OFM_PROGRAM
    },
    handlePdf(event) {
      console.log(event.target)
      if (event.target.classList.contains('conversation-pdf')) {
        fetch(event.target.dataset.link)
          .then((res) => res.blob())
          .then((blob) => {
            const blobUrl = URL.createObjectURL(blob)
            window.open(blobUrl)
          })
      }
    },
    async formatConversation() {
      const parser = new DOMParser()
      for (const conversation of this.assistanceRequestConversation) {
        const document = parser.parseFromString(conversation.message, 'text/html')
        // Update CRM img tags to load correctly
        for (const img of document.querySelectorAll('img[src*="/api/data"]')) {
          const matches = ID_REGEX.exec(img.getAttribute('src'))
          if (matches) {
            const fileId = matches[1]
            const imageFile = await FileService.getFile(fileId, true)
            const imageType = deriveImageType(imageFile.fileData)
            img.setAttribute('src', `data:image/${imageType};base64,${imageFile.fileData}`)
          } else {
            img.remove()
          }
        }

        // Remove CRM links for now until we can support them
        const fileLinks = document.querySelectorAll('a[href*="/api/data"]')

        for (const fileLink of fileLinks) {
          const matches = ID_REGEX.exec(fileLink.dataset.value)
          if (matches) {
            const fileId = matches[1]
            const file = await FileService.getFile(fileId)
            const dataLink = `data:${file.mimetype};base64,${file.fileData}`

            if (file.mimetype === 'application/pdf') {
              fileLink.setAttribute('href', '#')
              fileLink.classList.add('conversation-pdf')
              fileLink.setAttribute('data-link', dataLink)
            } else {
              fileLink.setAttribute('href', dataLink)
              fileLink.setAttribute('download', file.filename)
            }
          } else {
            fileLink.remove()
          }
        }

        // Update the message content
        conversation.message = document.documentElement.innerHTML
      }
    },
  },
}
</script>

<style scoped>
.reply-button {
  width: 155px;
}

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
</style>
