<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="Action Required!" persistent max-width="60%" @close="closeDialog">
      <template #content>
        <br />
        <h2 class="confirm-dialog-text d-flex flex-column text-center">You have one or more Funding Agreement(s) expiring soon.</h2>
        <div class="confirm-dialog-text d-flex flex-column text-center">Please visit the Applications tab to renew your Funding Agreement(s).</div>
        <div class="confirm-dialog-text d-flex flex-column text-center">Would you like to take action now?</div>
        <br />
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="dialog-go-back" :primary="false" size="large" width="200px" :loading="loading" @click="closeDialog">Not Now</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="500px" :loading="loading" @click="goToApplications">Yes, take me to Applications</AppButton>
          </v-col>
        </v-row>
      </template>
    </AppDialog>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { FUNDING_AGREEMENT_STATUS_CODES } from '@/utils/constants'
import AppButton from '@/components/ui/AppButton.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import FundingAgreementService from '@/services/fundingAgreementService'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin.js'

export default {
  name: 'HomeView',
  components: { AppButton, AppDialog },
  mixins: [alertMixin, permissionsMixin],
  emits: ['loading'],
  data() {
    return {
      loading: false,
      isDisplayed: false,
      fundingAgreements: [],
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),

    filteredFacilities() {
      return this.userInfo?.facilities
    },
  },

  async created() {
    await this.loadFundingAgreements()
  },

  methods: {
    closeDialog() {
      this.isDisplayed = false
    },
    goToApplications() {
      this.$router.push({ name: 'applications-history' })
    },
    async loadFundingAgreements() {
      const now = new Date()

      for (const fac of this.filteredFacilities) {
        console.log(fac)
        try {
          const activeFA = await FundingAgreementService.getActiveFundingAgreementByFacilityIdAndStatus(fac.facilityId, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE)
          console.log('Active FA:', activeFA)
          if (activeFA && activeFA.endDate) {
            const endDate = new Date(activeFA.endDate)
            const daysUntilEnd = (endDate - now) / (1000 * 60 * 60 * 24)

            if (daysUntilEnd <= 120) {
              this.isDisplayed = true
              console.log('Active FA within next 120 days:', activeFA)
              break // Active FA within next 120 days found
            }

            continue // Active FA exists but not expiring soon, skip expired FA check
          }

          // No active FA, check expired
          const expiredFA = await FundingAgreementService.getInactiveFundingAgreementByFacilityIdAndStatus(fac.facilityId, FUNDING_AGREEMENT_STATUS_CODES.EXPIRED)
          console.log('Expired FA:', expiredFA)
          if (expiredFA && expiredFA.endDate) {
            const endDate = new Date(expiredFA.endDate)
            const daysSinceEnd = (now - endDate) / (1000 * 60 * 60 * 24)

            if (daysSinceEnd <= 30) {
              this.isDisplayed = true
              console.log('Expired FA within last 30 days:', expiredFA)
              break // Recent expired FA found, expired in last 30 days
            }
          }
        } catch (error) {
          console.error(`Error processing facility ${fac.facilityId}:`, error)
        }
      }
    },
  },
}
</script>
