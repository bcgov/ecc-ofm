<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :isLoading="isLoading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text d-flex flex-column align-center">Are you sure you want to cancel this application?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-go-back" :primary="false" size="large" width="250px" :loading="isLoading" @click="closeDialog">Go Back</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="450px" :loading="isLoading" @click="cancel">Cancel Application</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import alertMixin from '@/mixins/alertMixin'
import { APPLICATION_STATUS_CODES, SUPPLEMENTARY_APPLICATION_STATUS_CODES, CRM_STATE_CODES, APPLICATION_TYPES } from '@/utils/constants'
import ApplicationService from '@/services/applicationService'

export default {
  name: 'CancelApplicationDialog',
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
    applicationType: {
      type: String,
      default: APPLICATION_TYPES.OFM, // Default to OFM application type (as opposed to Supplementary/Allowances application types)
    },
  },
  emits: ['close', 'cancel'],
  data() {
    return {
      isLoading: false,
      isDisplayed: false,
    }
  },
  computed: {
    isBaseFundingApplication() {
      return this.applicationType === APPLICATION_TYPES.OFM
    },
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
          statusCode: this.isBaseFundingApplication ? APPLICATION_STATUS_CODES.CANCELLED_BY_SP : SUPPLEMENTARY_APPLICATION_STATUS_CODES.CANCELLED,
          stateCode: CRM_STATE_CODES.INACTIVE,
        }
        if (this.isBaseFundingApplication) {
          await ApplicationService.updateApplication(this.applicationId, payload)
        } else {
          await ApplicationService.updateSupplementaryApplication(this.applicationId, payload)
        }
        this.$emit('cancel')
        this.setSuccessAlert(`Application cancelled successfully`)
      } catch (error) {
        this.setFailureAlert(`Failed to cancel your application`, error)
      } finally {
        this.isLoading = false
        this.closeDialog()
      }
    },
  },
}
</script>
