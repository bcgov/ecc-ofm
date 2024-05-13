<template>
  <AppHeroImage />
  <OrganizationHeader />
  <v-container v-bind="$attrs">
    <v-row>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
    </v-row>
    <v-row>
      <v-col cols="12" md="6" lg="4" v-if="hasPermission(PERMISSIONS.SEARCH_VIEW_REPORTS)">
        <v-card class="home-card" prepend-icon="mdi-file-chart-outline" title="Reporting" @click="$router.push({ name: 'reporting' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-currency-usd" title="Funding" @click="$router.push({ name: 'funding-overview' })">
          <v-card-text>
            Suspendisse tristique fringilla nibh, et vehicula tortor hendrerit a. Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-folder-outline" title="Documents" @click="$router.push({ name: 'documents' })">
          <v-card-text>
            Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc. Suspendisse tristique fringilla nibh, et vehicula tortor hendrerit
            a.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4" v-if="hasPermission(PERMISSIONS.VIEW_APPLICATIONS)">
        <v-card class="home-card" prepend-icon="mdi-file-document-multiple-outline" title="Applications" @click="$router.push({ name: 'applications-history' })">
          <v-card-text>
            Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti. Duis aliquet non ipsum a feugiat. Mauris felis mi, feugiat eu placerat non,
            tempor a velit.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-cog-outline" title="Account Management" @click="$router.push({ name: 'account-mgmt' })">
          <v-card-text>
            Donec iaculis nec quam vel congue. Fusce consequat mattis rhoncus. Sed id ipsum sed purus placerat euismod vel ut erat. Nullam ligula leo, fermentum vel interdum sit amet, tempor at nunc.
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="6" lg="4">
        <v-card class="home-card" prepend-icon="mdi-help" title="Resources" @click="$router.push({ name: 'resources' })">
          <v-card-text>
            Curabitur molestie pulvinar sapien. Aenean aliquet dolor at mollis laoreet. Duis vel placerat lectus, eu rutrum turpis. Morbi consequat, purus et tempus iaculis, sapien massa rhoncus ex,
            sed consectetur leo odio in magna.
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <AppDialog v-model="isDisplayed" title="Signature Required!" persistent max-width="50%" @close="closeDialog">
    <template #content>
      <v-skeleton-loader v-if="fundingAgreements.length === 0" :loading="isLoading" type="heading"></v-skeleton-loader>
      <v-card v-for="fundingAgreement in fundingAgreements" :key="fundingAgreement.facilityId" class="confirm-dialog-text d-flex flex-column mx-14 py-6">
        <v-row class="mx-10">
          <v-col cols="6" class="text-center">{{ fundingAgreement.fundingAgreementNumber }}</v-col>
          <v-col cols="6" class="text-center">{{ fundingAgreement.facilityName }}</v-col>
        </v-row>
      </v-card>
      <br />
      <h2 class="confirm-dialog-text d-flex flex-column align-center">You have one or more Funding Agreements ready to sign.</h2>
      <div class="confirm-dialog-text d-flex flex-column align-center">Please visit the notification center for more details.</div>
      <div class="confirm-dialog-text d-flex flex-column align-center">Would you like to take action now?</div>
      <br />
    </template>
    <template #button>
      <v-row justify="space-around">
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-go-back" :primary="false" size="large" width="250px" :loading="isLoading" @click="closeDialog">Not Now</AppButton>
        </v-col>
        <v-col cols="12" md="6" class="d-flex justify-center">
          <AppButton id="dialog-cancel-application" size="large" min-width="250px" max-width="500px" :loading="isLoading" @click="goToFunding">Yes, take me to Funding Overview</AppButton>
        </v-col>
      </v-row>
    </template>
  </AppDialog>
</template>

<script>
import { mapState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { FUNDING_AGREEMENT_STATUS_CODES } from '@/utils/constants'
import OrganizationHeader from '@/components/organizations/OrganizationHeader.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppHeroImage from '@/components/ui/AppHeroImage.vue'
import AppDialog from '@/components/ui/AppDialog.vue'
import FundingAgreementService from '@/services/fundingAgreementService'
import permissionsMixin from '@/mixins/permissionsMixin.js'

export default {
  name: 'HomeView',
  components: { AppHeroImage, AppButton, AppDialog, OrganizationHeader },
  mixins: [permissionsMixin],
  data() {
    return {
      isLoading: false,
      isDisplayed: false,
      fundingAgreements: [],
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },
  async created() {
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
      this.isLoading = true
      console.log(this.userInfo?.facilities)

      await Promise.all(
        this.userInfo?.facilities.map(async (fac) => {
          console.log(fac.facilityId)
          const fa = await FundingAgreementService.getActiveFundingAgreementByFacilityId(fac.facilityId)

          console.log(fa)
          if (fa?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING) {
            this.fundingAgreements.push(fa)
          }
        }),
      )

      if (this.fundingAgreements.length > 0) {
        this.isDisplayed = true
      }
      this.isLoading = false
      console.log(this.fundingAgreements)
    },
  },
}
</script>

<style>
.home-card {
  border-top: 5px solid #003366 !important;
  min-height: 225px;
}

.home-card-disabled {
  border-top: 5px solid #909090 !important;
  min-height: 225px;
}
</style>
