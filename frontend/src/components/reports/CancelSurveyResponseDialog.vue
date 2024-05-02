<template>
  <AppDialog v-model="isDisplayed" title="Confirm" :isLoading="isLoading" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <div class="confirm-dialog-text d-flex flex-column align-center">Are you sure you want to cancel this report response?</div>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-go-back" :primary="false" size="large" width="250px" :loading="isLoading" @click="closeDialog">Go back</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="450px" :loading="isLoading" @click="closeDialog">Cancel response</AppButton>
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
  },
  emits: ['close'],
  data() {
    return {
      isLoading: false,
      isDisplayed: false,
    }
  },
  computed: {},
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
    // TODO (vietle-cgi) - check with the business team to see if we should delete or cancel the survey response. If cancel, pending on CRM to add Cancelled status
    cancelResponse() {
      this.$emit('close')
    },
  },
}
</script>
