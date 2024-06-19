<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :is-loading="loading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text d-flex flex-column align-center">Are you sure you want to delete this report response?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="go-back" :primary="false" size="large" width="250px" :loading="loading" @click="closeDialog">Go back</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="delete-response" size="large" min-width="250px" max-width="450px" :loading="loading" @click="deleteResponse">Delete response</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import alertMixin from '@/mixins/alertMixin'
import ReportsService from '@/services/reportsService'

export default {
  name: 'DeleteSurveyResponseDialog',
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
  emits: ['close'],
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

    // This function will remove all question responses associated with a survey response
    // Note: the removed question responses will be copied to an Inactive version of the survey response in CRM
    async deleteResponse() {
      try {
        this.loading = true
        await ReportsService.deleteSurveyResponse(this.surveyResponseId)
        this.setSuccessAlert(`Report response deleted successfully`)
      } catch (error) {
        this.setFailureAlert(`Failed to delete your report response`, error)
      } finally {
        this.loading = false
        this.closeDialog()
      }
    },
  },
}
</script>
