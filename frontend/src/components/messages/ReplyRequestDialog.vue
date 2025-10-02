<template>
  <v-container>
    <AppDialog v-model="isDisplayed" :title="`Request ${referenceNumber}`" :is-loading="isLoading" persistent max-width="60%" @close="closeReplyRequestDialog">
      <template #content>
        <v-form ref="replyRequestForm" v-model="isFormComplete" class="px-4">
          <v-row no-gutters class="mt-2">
            <v-col cols="12">
              <AppLabel variant="modal">Reply to request:</AppLabel>
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="message" placeholder="Enter message text" counter maxlength="1000" variant="outlined" :rules="rules.required" :rows="6" :disabled="isLoading"></v-textarea>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <div class="mr-8">
              <AppLabel variant="modal">Supporting documents (optional):</AppLabel>
            </div>
            <AppDocumentUpload
              v-model="documentsToUpload"
              :document-type="DOCUMENT_TYPES.ASSISTANCE_REQUEST"
              entity-name="ofm_assistance_requests"
              :loading="isLoading"
              @validate-documents-to-upload="validateDocumentsToUpload"></AppDocumentUpload>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row class="mt-1" justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="cancel-reply-request" :primary="false" size="large" width="200px" :loading="isLoading" @click="closeReplyRequestDialog()">Cancel</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="submit-reply-request" size="large" width="200px" :loading="isLoading" @click="submit()">Submit</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import { mapActions } from 'pinia'
import { useMessagesStore } from '@/stores/messages'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import alertMixin from '@/mixins/alertMixin'
import rules from '@/utils/rules'
import { ASSISTANCE_REQUEST_STATUS_CODES, VIRUS_SCAN_ERROR_MESSAGE, DOCUMENT_TYPES } from '@/utils/constants'
import DocumentService from '@/services/documentService'
import MessageService from '@/services/messageService'

export default {
  name: 'ReplyRequestDialog',
  components: { AppButton, AppDialog, AppDocumentUpload, AppLabel },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    assistanceRequestId: {
      type: String,
      required: true,
      default: '',
    },
    referenceNumber: {
      type: String,
      required: true,
      default: '',
    },
  },
  emits: ['close', 'reply-success-event'],
  data() {
    return {
      isFormComplete: false,
      message: null,
      rules,
      isDisplayed: false,
      isLoading: false,
      showReplyRequestConfirmationDialog: false,
      areValidFilesUploaded: true,
      documentsToUpload: [],
    }
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  created() {
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
  },
  methods: {
    ...mapActions(useMessagesStore, ['updateAssistanceRequestInStore']),

    /**
     * Reset the form and initialize the reply request model.
     */
    resetForm() {
      this.$refs.replyRequestForm?.reset()
    },

    /**
     * Close the reply request dialog.
     */
    closeReplyRequestDialog() {
      this.resetForm()
      this.$emit('close')
    },

    /**
     * Create the reply, update status to assigned, and emit success event.
     */
    async submit() {
      this.$refs.replyRequestForm?.validate()
      if (this.isFormComplete && this.areValidFilesUploaded) {
        try {
          this.isLoading = true
          await DocumentService.createDocuments(this.documentsToUpload, this.assistanceRequestId)
          await this.createReply(this.assistanceRequestId)
          await this.updateStatusToAssigned(this.assistanceRequestId)
          await this.updateStoredAssistanceRequest(this.assistanceRequestId)
          this.$emit('reply-success-event', true) // emit success to flag showing success message
        } catch (error) {
          if (error?.response?.data?.status === 422) {
            this.setFailureAlert(VIRUS_SCAN_ERROR_MESSAGE, error)
          } else {
            this.setFailureAlert('Submit reply failed', error)
          }
        } finally {
          this.closeReplyRequestDialog()
          this.isLoading = false
        }
      }
    },

    /**
     * Create a reply for the assistance request.
     */
    async createReply(assistanceRequestId) {
      try {
        const payload = {
          assistanceRequestId: assistanceRequestId,
          message: this.message,
        }
        await MessageService.createAssistanceRequestConversation(payload)
      } catch (error) {
        console.log(`Failed to create a reply for Assistance Request - ${error}`)
        throw error
      }
    },

    /**
     * Update the status of the assistance request to assigned, update the assistance request in the store.
     */
    async updateStatusToAssigned(assistanceRequestId) {
      try {
        const payload = {
          statusCode: ASSISTANCE_REQUEST_STATUS_CODES.ASSIGNED,
        }
        await MessageService.updateAssistanceRequest(assistanceRequestId, payload)
      } catch (error) {
        console.log(`Failed to update status to assigned for Assistance Request - ${error}`)
        throw error
      }
    },

    /**
     * Update the assistance request in the store.
     */
    async updateStoredAssistanceRequest(assistanceRequestId) {
      try {
        await this.updateAssistanceRequestInStore(assistanceRequestId)
      } catch (error) {
        console.log(`Failed to update Assistance Request in store - ${error}`)
        throw error
      }
    },

    validateDocumentsToUpload(value) {
      this.areValidFilesUploaded = value
    },
  },
}
</script>
