<template>
  <v-container>
    <h2 class="mb-8" align="center">OFM Application Submitted</h2>
    <v-card elevation="2" class="supp-applications-card">
      <v-card-text class="px-8" py-6>
        <v-row no-gutters align="center">
          <v-col cols="12" md="8">
            <p>You may be eligible for supplementary funding. Would you like to apply?</p>
            <p class="mt-4">Available allowances:</p>
            <ul class="pl-6">
              <li>Indigenous programming</li>
              <li>Support needs programming</li>
              <li>Transportation allowance</li>
            </ul>
            <p class="mt-4">
              You may apply for one or more allowances. You can also apply through
              <router-link :to="{ name: 'applications-history' }">Applications</router-link>
              at any time.
            </p>
          </v-col>
          <v-col cols="12" md="4" align="right" class="my-4">
            <AppButton id="apply-button" :primary="false" size="large" width="100px" :to="{ name: 'supp-allowances-form', params: { applicationGuid: $route.params.applicationGuid } }">
              Apply
            </AppButton>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
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
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
  },
  created() {
    if (!this.currentApplication || this.currentApplication.statusCode != APPLICATION_STATUS_CODES.SUBMITTED || this.currentApplication?.applicationId != this.$route.params.applicationGuid) {
      this.$router.push({ name: 'applications-history' })
    }
  },
}
</script>
<style scoped>
.supp-applications-card {
  border-left: 5px solid #2e8540 !important;
}
</style>
