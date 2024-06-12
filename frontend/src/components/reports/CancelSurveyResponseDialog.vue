<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :isLoading="loading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text d-flex flex-column align-center">Are you sure you want to cancel this report response?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-go-back" :primary="false" size="large" width="250px" :loading="loading" @click="closeDialog">Go back</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="450px" :loading="loading" @click="cancel">Cancel response</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import alertMixin from '@/mixins/alertMixin'

export default {
  name: 'CancelSurveyResponseDialog',
  components: { AppButton, AppDialog },
  mixins: [alertMixin],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    surveyResponseId: {
      type: String,
      default: '',
    },
  },
  emits: ['close', 'cancel'],
  data() {
    return {
      loading: false,
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
    // TODO (vietle-cgi) - Complete this function once CRM add Bulk delete to Dynamics API.
    async cancel() {
      try {
        this.loading = true
        this.$emit('cancel', this.surveyResponseId)
        this.setSuccessAlert(`Report response cancelled successfully`)
      } catch (error) {
        this.setFailureAlert(`Failed to cancel your report response`, error)
      } finally {
        this.loading = false
        this.closeDialog()
      }
    },
  },
}
</script>
