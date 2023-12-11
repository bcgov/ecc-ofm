<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :isLoading="isLoading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div align="center" class="confirm-dialog-text">Are you sure you want to cancel this application?</div>
    </template>
    <template #button>
      <v-row class="mt-2" justify="space-around">
        <AppButton id="dialog-go-back" :primary="false" size="large" width="200px" :loading="isLoading" @click="closeDialog">Go back</AppButton>
        <AppButton id="dialog-cancel-application" size="large" width="200px" :loading="isLoading" @click="cancel">Cancel application</AppButton>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapActions } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import { useApplicationsStore } from '@/stores/applications'
import alertMixin from '@/mixins/alertMixin'

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
  },
  emits: ['close'],
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
    ...mapActions(useApplicationsStore, ['cancelApplication']),
    closeDialog() {
      this.$emit('close')
    },
    async cancel() {
      try {
        this.isLoading = true
        await this.cancelApplication(this.applicationId)
        this.setSuccessAlert('Application is cancelled successfully')
      } catch (error) {
        this.setFailureAlert('Failed to cancel your application')
      } finally {
        this.isLoading = false
        this.closeDialog()
      }
    },
  },
}
</script>
