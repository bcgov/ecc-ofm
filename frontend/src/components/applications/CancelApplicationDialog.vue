<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :isLoading="isLoading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text d-flex flex-column align-center">Are you sure you want to cancel this {{ getSourceApplicationType }}?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-go-back" :primary="false" size="large" width="250px" :loading="isLoading" @click="closeDialog">Go back</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="450px" :loading="isLoading" @click="cancel">Cancel {{ getSourceApplicationType }}</AppButton>
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
  computed: {
    getSourceApplicationType() {
      return this.applicationType === 'OFM' ? 'Application' : 'Supplementary Application'
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
          statusCode: APPLICATION_STATUS_CODES.CANCELLED,
          stateCode: CRM_STATE_CODES.INACTIVE,
        }
        if (this.applicationType === 'OFM') {
          await ApplicationService.updateApplication(this.applicationId, payload)
        } else {
          await ApplicationService.updateSupplementaryApplication(this.applicationId, payload)
        }
        this.$emit('cancel')
        this.setSuccessAlert(`${this.getSourceApplicationType} cancelled successfully`)
      } catch (error) {
        this.setFailureAlert(`Failed to cancel your ${this.getSourceApplicationType}`, error)
      } finally {
        this.isLoading = false
        this.closeDialog()
      }
    },
  },
}
</script>
