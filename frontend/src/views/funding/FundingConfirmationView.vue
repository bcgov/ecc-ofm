<template>
  <v-container class="mt-16 justify-center">
    <div class="mt-16">
      <v-row>
        <v-col class="text-center">
          <v-icon size="xxx-large" :color="iconColor">{{ icon }}</v-icon>
        </v-col>
      </v-row>

      <h2 class="mb-8 text-center">{{ confirmationMessage }}</h2>

      <v-row justify="space-around" no-gutters class="mt-10">
        <AppBackButton id="back-home-button" :primary="false" width="250px" :to="{ name: 'home' }" class="text-cemter">Home</AppBackButton>
        <AppButton id="view-applications-button" size="large" width="250px" :to="{ name: 'funding-overview' }" class="mt-2 text-center">View All Fundings</AppButton>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'

export default {
  name: 'FundingConfirmationView',
  components: { AppButton, AppBackButton },
  computed: {
    confirmationMessage() {
      return this.$route.name === 'funding-declined' ? 'Funding Agreement Declined' : 'Funding Agreement Signed'
    },
    icon() {
      return this.$route.name === 'funding-declined' ? 'mdi-close-circle' : 'mdi-check-circle'
    },
    iconColor() {
      return this.$route.name === 'funding-declined' ? 'error' : 'success'
    },
  },
}
</script>
