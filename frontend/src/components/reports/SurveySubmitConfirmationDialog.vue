<template>
  <AppDialog v-model="isDisplayed" title="Success" persistent max-width="40%" @close="closeDialog">
    <template #content>
      <v-row class="mb-2">
        <v-col align="center">
          <p class="pt-4 text-h6">Your report has been submitted.</p>
        </v-col>
      </v-row>
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="return-home-button" :primary="false" size="large" width="200px" :to="{ name: 'home' }">
            Return to home
          </AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="view-reports-button" size="large" width="200px" :to="{ name: 'reporting' }">
            View reports
          </AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'

export default {
  name: 'SurveySubmitConfirmationDialog',
  components: { AppButton, AppDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDisplayed: false
    }
  },
  watch: {
    show: {
      handler(value) {
        this.isDisplayed = value
      }
    }
  },
  methods: {
    closeDialog() {
      this.$router.push({ name: 'reporting' })
    }
  }
}
</script>
