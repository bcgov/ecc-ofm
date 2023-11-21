<template>
  <v-container>
    <AppDialog v-model="isDisplayed" :title="`Request ${referenceNumber}`" persistent max-width="50%"
      @close="closeReplyRequestDialog">
      <template #content>
        <v-form ref="replyRequestForm" v-model="isFormComplete" class="px-12 mx-8">
          <v-row no-gutters class="mt-2">
            <v-col class="v-col-12 blue-text pb-0">
              <strong>Reply to request:</strong>
            </v-col>
            <v-col class="v-col-12">
              <v-textarea v-model="message" placeholder="Enter message text" counter
                maxlength="1000" variant="outlined" :rules="rules.required" :rows="6"></v-textarea>
            </v-col>
          </v-row>
          <v-row class="d-flex justify-end mt-0">
            <AppButton id="upload-document" :primary="false" @click="false" class="mt-0">
              <v-icon class="mr-3">mdi-tray-arrow-up</v-icon>
              Add files (optional)
            </AppButton>
          </v-row>
        </v-form>
      </template>
      <template #button>
        <v-row class="mt-6" justify="space-around">
          <AppButton id="cancel-reply-request" :primary="false" size="large" width="200px"
            @click="closeReplyRequestDialog()"
            :loading="isLoading">Cancel</AppButton>
          <AppButton id="submit-reply-request" size="large" width="200px" @click="submit()" :loading="isLoading">Submit
          </AppButton>
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
import rules from '@/utils/rules'

export default {
  name: 'ReplyRequestDialog',
  components: { AppButton, AppDialog },
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
    ...mapActions(useMessagesStore, ['replyToAssistanceRequest']),

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
     * Create the reply and emit success event.
     */
    async submit() {
      this.$refs.replyRequestForm?.validate()
      if (this.isFormComplete) {
        try {
          this.isLoading = true
          const payload = {
            assistanceRequestId: this.assistanceRequestId,
            message: this.message,
          }
          await this.replyToAssistanceRequest(payload)
          this.$emit('reply-success-event', true) // emit success to flag showing success message
        } catch (error) {
          console.log(`Failed to create a reply for Assistance Request - ${error}`)
          throw error
        } finally {
          this.closeReplyRequestDialog()
          this.isLoading = false
        }
      }
    },
  },
}
</script>

<style scoped>
.blue-text {
  color: #003366;
  font-size: 1.25em;
}
</style>