<template>
  <v-container>
    <AppDialog v-model="isDisplayed" :title="`Request ${referenceNumber}`" :isLoading="isLoading" persistent max-width="60%" @close="closeReplyRequestDialog">
      <template #content>
        <v-form ref="replyRequestForm" v-model="isFormComplete" class="px-4">
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12">
              <AppLabel variant="modal">Reply to request:</AppLabel>
            </v-col>
            <v-col class="v-col-12">
              <v-textarea v-model="message" placeholder="Enter message text" counter maxlength="1000" variant="outlined" :rules="rules.required" :rows="6" :disabled="isLoading"></v-textarea>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <div class="mr-8">
              <AppLabel variant="modal">Supporting documents (optional):</AppLabel>
            </div>
            <AppDocumentUpload entityName="ofm_assistance_requests" :loading="isLoading" @updateDocuments="updateDocuments"></AppDocumentUpload>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row class="mt-6" justify="space-around">
          <AppButton id="cancel-reply-request" :primary="false" size="large" width="200px" @click="closeReplyRequestDialog()" :loading="isLoading">Cancel</AppButton>
          <AppButton id="submit-reply-request" size="large" width="200px" @click="submit()" :loading="isLoading">Submit</AppButton>
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
import rules from '@/utils/rules'
import { ASSISTANCE_REQUEST_STATUS_CODES } from '@/utils/constants'
import DocumentService from '@/services/documentService'

export default {
  name: 'ReplyRequestDialog',
  components: { AppButton, AppDialog, AppDocumentUpload, AppLabel },
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
      uploadedDocuments: [],
      areValidFilesUploaded: true,
    }
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      },
    },
  },
  methods: {
    ...mapActions(useMessagesStore, ['replyToAssistanceRequest', 'updateAssistanceRequest', 'updateAssistanceRequestInStore']),

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
          await this.createReply(this.assistanceRequestId)
          await DocumentService.createDocuments(this.uploadedDocuments, this.assistanceRequestId)
          await this.updateStatusToAssigned(this.assistanceRequestId)
          await this.updateStoredAssistanceRequest(this.assistanceRequestId)
          this.$emit('reply-success-event', true) // emit success to flag showing success message
        } catch (error) {
          console.log(`Submit processing for reply failed  - ${error}`)
          throw error
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
        await this.replyToAssistanceRequest(payload)
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
        await this.updateAssistanceRequest(assistanceRequestId, payload)
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

    updateDocuments({ documents, areValidFilesUploaded }) {
      this.uploadedDocuments = documents
      this.areValidFilesUploaded = areValidFilesUploaded
    },
  },
}
</script>
