<template>
  <v-container fluid>
    <h1 class="my-2">Allowances (Core and Discretionary Services)</h1>

    <div v-if="loading" align="center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen" />
    </div>

    <div v-else>
      <div class="min-height-screen my-4">
        <template v-if="!$route.params.applicationGuid">
          <v-row no-gutters class="my-8">
            <v-col cols="12" md="6" lg="4" xl="3" class="mr-md-4">
              <AppLabel>To start your application, select a facility:</AppLabel>
              <div>
                <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
                <span>If your facility is not listed, contact your Account Manager.</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" xl="4">
              <v-select
                id="select-facility"
                v-model="facilityId"
                :items="facilities"
                item-title="facilityName"
                item-value="facilityId"
                :rules="rules.required"
                placeholder="Select a facility"
                density="compact"
                variant="outlined" />
            </v-col>
          </v-row>

          <v-row v-if="faSelectorActive" no-gutters class="my-8">
            <v-col cols="12" md="6" lg="4" xl="3" class="mr-md-4">
              <AppLabel>You have two funding agreements active. Which one do you want?</AppLabel>
              <div>
                <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
                <span>Select the agreement to proceed.</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" xl="4">
              <v-select
                id="select-funding-agreement"
                v-model="fundingAgreementId"
                :items="facilityFundingAgreements"
                item-title="fundingAgreementNumber"
                item-value="fundingId"
                :rules="rules.required"
                placeholder="Select a funding agreement"
                density="compact"
                variant="outlined" />
            </v-col>
          </v-row>
        </template>

        <div v-if="application">
          <span>You are applying for this allowance linked to your base funding &ensp;</span>
          <span class="application-number">{{ application?.referenceNumber }}</span>
        </div>
      </div>

      <AppNavButtons
        :loading="processing"
        :show-back="true"
        :show-cancel="false"
        :show-save="false"
        :show-next="!!application"
        :show-submit="false"
        :disable-submit="true"
        :disable-next="!application"
        @back="goBack"
        @next="goNext" />
    </div>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import { useAuthStore } from '@/stores/auth'
import { useOrgStore } from '@/stores/org'
import { mapState, mapActions } from 'pinia'
import ApplicationService from '@/services/applicationService'
import FundingAgreementService from '@/services/fundingAgreementService'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import rules from '@/utils/rules'
import { UNION_TYPE_CODES } from '@/utils/constants'

export default {
  name: 'SupplementaryAllowanceStart',
  components: { AppLabel, AppNavButtons },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      rules,
      loading: false,
      processing: false,
      applications: [],
      application: undefined,
      facilities: [],
      facilityId: undefined,
      faSelectorActive: false,
      fundingAgreementId: undefined,
      facilityFundingAgreements: undefined,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
  },

  watch: {
    facilityId: {
      handler(facilityId) {
        const facilityApps = this.applications.filter((fac) => fac.facilityId === facilityId)
        this.faSelectorActive = false
        this.facilityFundingAgreements = null
        this.fundingAgreementId = null
        this.application = null
        if (facilityApps.length === 1) {
          this.application = this.getValidApplication(facilityId)
        } else {
          this.faSelectorActive = true
          this.facilityFundingAgreements = facilityApps.map((app) => app.fundingAgreement)
        }
      },
    },
    fundingAgreementId: {
      handler(fundingAgreementId) {
        if (fundingAgreementId) {
          this.application = this.applications.find((application) => application.fundingAgreement?.fundingId === fundingAgreementId)
        }
      },
    },
  },

  async created() {
    if (!window.history.state.back) {
      this.$router.push({ name: 'applications-history' })
    }
    await this.loadData()
  },

  methods: {
    ...mapActions(useOrgStore, ['getOrganizationInfo']),
    async loadData() {
      try {
        this.loading = true
        await this.getOrganizationInfo(this.userInfo?.organizationId)

        if (this.$route.params.applicationGuid) {
          this.application = await ApplicationService.getApplication(this.$route.params.applicationGuid)
          this.application.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByApplicationId(this.$route.params.applicationGuid, true)
        } else {
          this.applications = await ApplicationService.getActiveApplications()
          this.applications = this.applications?.filter((application) => ApplicationService.checkApplicationStatus(application))
          await Promise.all(
            this.applications?.map(async (application) => {
              application.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByApplicationId(application.applicationId, true)
            }),
          )
          this.facilities = this.userInfo?.facilities?.filter((facility) => this.getValidApplication(facility.facilityId))
        }
      } catch (error) {
        this.setFailureAlert('Failed to load data', error)
      } finally {
        this.loading = false
      }
    },

    getValidApplication(facilityId) {
      return this.applications?.find((application) => application.facilityId === facilityId && ApplicationService.isValidApplication(application) && application?.isUnionized === UNION_TYPE_CODES.NO)
    },

    goBack() {
      this.$router.push({ name: 'applications-history' })
    },

    goNext() {
      if (this.application?.applicationId) {
        this.$router.push({
          name: 'supp-allowances-form',
          params: { applicationGuid: this.application.applicationId },
        })
      }
    },
  },
}
</script>

<style scoped>
.min-height-screen {
  min-height: 55vh;
}

.application-number {
  font-size: 1.3em;
  font-weight: 700;
}
</style>
