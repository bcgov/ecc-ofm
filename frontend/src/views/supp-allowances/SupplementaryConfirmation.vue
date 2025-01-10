<template>
  <v-container class="mt-16">
    <div class="mt-16">
      <h2 class="mb-8 text-center">Allowances (Core and Discretionary Services) Application Submitted</h2>
      <h4 class="mb-8 text-center">
        Check your dashboard for updates on the progress of your application. We may reach out if we need more
        information
      </h4>

      <v-row justify="space-around" no-gutters class="mt-10">
        <AppBackButton id="back-home-button" :primary="false" width="250px" :to="{ name: 'home' }" class="text-cemter">
          Home
        </AppBackButton>
        <AppButton
          id="view-applications-button"
          size="large"
          width="250px"
          :to="{ name: 'applications-history' }"
          class="mt-2 text-center">
          View Applications
        </AppButton>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'ApplicationConfirmationView',
  components: { AppButton, AppBackButton }
}
</script>
<style scoped>
.supp-applications-card {
  border-left: 5px solid #2e8540 !important;
}
</style>
