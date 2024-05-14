<template>
  <v-container>
    <AppDialog v-model="isDisplayed" title="Signature Required!" persistent max-width="60%" @close="closeDialog">
      <template #content>
        <v-card v-for="fundingAgreement in fundingAgreements" :key="fundingAgreement.facilityId" class="confirm-dialog-text d-flex flex-column mx-md-14 py-6 my-2">
          <v-row class="mx-md-10">
            <v-col cols="6" class="text-center">{{ fundingAgreement.fundingAgreementNumber }}</v-col>
            <v-col cols="6" class="text-center">{{ fundingAgreement.facilityName }}</v-col>
          </v-row>
        </v-card>
        <br />
        <h2 class="confirm-dialog-text d-flex flex-column text-center">You have one or more Funding Agreements ready to sign.</h2>
        <div class="confirm-dialog-text d-flex flex-column text-center">Please visit the notification center for more details.</div>
        <div class="confirm-dialog-text d-flex flex-column text-center">Would you like to take action now?</div>
        <br />
      </template>
      <template #button>
        <v-row justify="space-around">
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="dialog-go-back" :primary="false" size="large" width="200px" :loading="loading" @click="closeDialog">Not Now</AppButton>
          </v-col>
          <v-col cols="12" md="6" class="d-flex justify-center">
            <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="500px" :loading="loading" @click="goToFunding">Yes, take me to Funding</AppButton>
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
import permissionsMixin from '@/mixins/permissionsMixin.js'

const MAX_FACILITIES_DISPLAYED = 3
export default {
  name: 'HomeView',
  components: { AppButton, AppDialog },
  mixins: [permissionsMixin],
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
  },
  async created() {
    //TODO - JB: check if user has permissions to view / sign the FA before we bother loading all the Funding Agreements
    await this.loadFundingAgreements()
  },
  methods: {
    closeDialog() {
      this.isDisplayed = false
    },
    goToFunding() {
      this.$router.push({ name: 'funding-overview' })
    },
    async loadFundingAgreements() {
      try {
        this.loading = true
        this.$emit('loading', this.loading)

        //I use for of here so I can break out of the loop when I hit 3 facilities.
        //We show 3 max so the popup doesn't take over the screen, and we save on calls to Dynamics.
        for (const fac of this.userInfo.facilities) {
          const fa = await FundingAgreementService.getActiveFundingAgreementByFacilityIdAndStatus(fac.facilityId, FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING)

          if (fa) {
            this.fundingAgreements.push(fa)
          }
          if (this.fundingAgreements.length === MAX_FACILITIES_DISPLAYED) {
            break
          }
        }
        if (this.fundingAgreements.length > 0) {
          this.isDisplayed = true
        }
        this.loading = false
      } catch (error) {
        console.log(`Failed to load Funding Agreements - ${error}`)
        throw error
      }
      this.$emit('loading', this.loading)
    },
  },
}
</script>
