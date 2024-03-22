<template>
  <v-container>
    <h2 class="mb-8 text-center">Supplementary Allowance Submitted</h2>
    <h4 class="mb-8 text-center">Check your dashboard for updates on the progress of your application. We may reach out if we need more information</h4>

    <v-row justify="space-around" no-gutters class="mt-10">
      <AppBackButton id="back-home-button" :primary="false" width="250px" :to="{ name: 'home' }" align="center">Home</AppBackButton>
      <AppButton id="view-applications-button" size="large" width="250px" :to="{ name: 'applications-history' }" align="center" class="mt-2">View Applications</AppButton>
    </v-row>
  </v-container>
</template>

<script>
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import { APPLICATION_STATUS_CODES } from '@/utils/constants'

export default {
  name: 'ApplicationConfirmationView',
  components: { AppButton, AppBackButton },
  computed: {},
  created() {},
}
</script>
<style scoped>
.supp-applications-card {
  border-left: 5px solid #2e8540 !important;
}
</style>
