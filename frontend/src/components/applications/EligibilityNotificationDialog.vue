<template>
  <AppDialog v-model="isDisplayed" title="Eligibility Notification" :is-loading="isLoading" persistent max-width="55%" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text">
        Thank you for your interest in joining the $10 a Day ChildCareBC Program. Based on the answers you have provided, your facility has not met the minimum eligibility criteria to participate at
        this time. For more information about the $10 a Day ChildCareBC Program, please visit our
        <a href="https://www2.gov.bc.ca/gov/content?id=F0D0FD2A00064CDDBF634CF83E4E2599" target="_blank">website</a>
        <span>.</span>
      </div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel-application" :primary="false" size="large" min-width="250px" max-width="450px" :loading="isLoading" @click="cancel">Cancel Application</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-close" size="large" width="250px" :loading="isLoading" @click="closeDialog">Close and Continue</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_STATUS_CODES, CRM_STATE_CODES } from '@/utils/constants'
import ApplicationService from '@/services/applicationService'

export default {
  name: 'EligibilityNotificationDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    applicationId: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'cancel'],
  data() {
    return {
      isLoading: false,
      isDisplayed: false,
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
    closeDialog() {
      this.$emit('close')
    },
    async cancel() {
      try {
        this.isLoading = true
        const payload = {
          statusCode: APPLICATION_STATUS_CODES.CANCELLED_BY_SP,
          stateCode: CRM_STATE_CODES.INACTIVE,
        }
        await ApplicationService.updateApplication(this.applicationId, payload)
        this.$emit('cancel')
        this.setSuccessAlert('Application cancelled successfully')
      } catch (error) {
        this.setFailureAlert('Failed to cancel your application', error)
      } finally {
        this.isLoading = false
        this.closeDialog()
      }
    },
  },
}
</script>
