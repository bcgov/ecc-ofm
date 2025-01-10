<template>
  <v-container>
    <v-alert icon="mdi-information-slab-circle-outline" density="compact" prominent variant="outlined">
      <v-row no-gutters align="center">
        <v-col cols="12" lg="8" xl="9">
          <div class="text-body-1">Has this request been resolved?</div>
          <div class="text-body-2">After 21 days of inactivity, this request will be closed automatically.</div>
        </v-col>
        <v-col cols="12" lg="4" xl="3" align="right">
          <AppButton id="banner-close-request" size="large" @click="toggleConfirmDialog">Close request</AppButton>
        </v-col>
      </v-row>
    </v-alert>
    <AppDialog
      v-model="showConfirmDialog"
      title="Confirm"
      :is-loading="isLoading"
      persistent
      max-width="40%"
      @close="toggleConfirmDialog">
      <template #content>
        <div align="center" class="confirm-dialog-text">Are you sure you want to close this request?</div>
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton
              id="dialog-go-back"
              :primary="false"
              size="large"
              width="200px"
              :loading="isLoading"
              @click="toggleConfirmDialog">
              Go back
            </AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton
              id="dialog-close-request"
              size="large"
              width="200px"
              :loading="isLoading"
              @click="closeAssistanceRequest">
              Close request
            </AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>
<script>
import { mapActions } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import { ASSISTANCE_REQUEST_STATUS_CODES, CRM_STATE_CODES } from '@/utils/constants'
import { useMessagesStore } from '@/stores/messages'
import alertMixin from '@/mixins/alertMixin'
import MessageService from '@/services/messageService'

export default {
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    assistanceRequestId: {
      type: String,
      required: true,
      default: ''
    }
  },
  data() {
    return {
      showConfirmDialog: false,
      isLoading: false
    }
  },
  methods: {
    ...mapActions(useMessagesStore, ['updateAssistanceRequestInStore']),

    toggleConfirmDialog() {
      this.showConfirmDialog = !this.showConfirmDialog
    },
    async closeAssistanceRequest() {
      try {
        this.isLoading = true
        const payload = {
          statusCode: ASSISTANCE_REQUEST_STATUS_CODES.CLOSED_COMPLETE,
          stateCode: CRM_STATE_CODES.INACTIVE
        }
        await MessageService.updateAssistanceRequest(this.assistanceRequestId, payload)
        await this.updateAssistanceRequestInStore(this.assistanceRequestId)
        this.setSuccessAlert('Request closed successfully')
      } catch (error) {
        this.setFailureAlert('Failed to close your request', error)
      } finally {
        this.toggleConfirmDialog()
        this.isLoading = false
      }
    }
  }
}
</script>
<style scoped>
.v-alert {
  border-color: #003466;
  background-color: #d4eaff;
}

:deep(.mdi-information-slab-circle-outline) {
  color: #003466;
}

.confirm-dialog-text {
  margin: 12px 0px;
  font-size: 1.1em;
}
</style>
