<template>
  <v-container class="mt-16 justify-center">
    <div class="mt-16">
      <v-row>
        <v-col class="text-center">
          <v-icon size="xxx-large" color="success">mdi-check-circle</v-icon>
        </v-col>
      </v-row>

      <h2 class="mb-8 text-center">Funding Agreement Signed</h2>

      <v-row justify="space-around" no-gutters class="mt-10">
        <AppBackButton id="back-home-button" :primary="false" width="250px" :to="{ name: 'home' }" class="text-cemter">
          Home
        </AppBackButton>
        <AppButton
          id="view-applications-button"
          size="large"
          width="250px"
          :to="{ name: 'funding-overview' }"
          class="mt-2 text-center">
          View All Fundings
        </AppButton>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'FundingConfirmationView',
  components: { AppButton, AppBackButton }
}
</script>
