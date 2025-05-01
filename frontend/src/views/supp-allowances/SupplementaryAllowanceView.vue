<template>
  <v-container fluid>
    <h1 class="my-2">Allowances (Core and Discretionary Services)</h1>
    <div v-if="loading" align="center">
      <v-progress-circular indeterminate size="100" :width="6" color="#003366" class="min-height-screen"></v-progress-circular>
    </div>
    <div v-else>
      <div class="min-height-screen my-4">
        <template v-if="showRouterView">
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
                variant="outlined"></v-select>
            </v-col>
          </v-row>
          <v-row v-if="faSelectorActive" no-gutters class="my-8">
            <v-col cols="12" md="6" lg="4" xl="3" class="mr-md-4">
              <AppLabel>You have two funding agreements active. Which one do you want?</AppLabel>
              <div>
                <v-icon class="mr-1">mdi-information-slab-circle-outline</v-icon>
                <span>do we need a tooltip here?</span>
              </div>
            </v-col>
            <v-col cols="12" md="6" xl="4">
              <v-select
                id="select-facility"
                v-model="fundingAgreementId"
                :items="facilityFundingAgreements"
                item-title="fundingAgreementNumber"
                item-value="fundingId"
                :rules="rules.required"
                placeholder="Select a funding agreement"
                density="compact"
                variant="outlined"></v-select>
            </v-col>
          </v-row>
        </template>
        <div v-if="wasNextClicked || $route.params.applicationGuid">
          <span>You are applying for this allowance linked to your base funding &ensp;</span>
          <span class="application-number">{{ application?.referenceNumber }}</span>
          <router-view
            :key="application?.applicationId"
            :application-id="application?.applicationId"
            :funding-agreement="application?.fundingAgreement"
            :cancel="cancel"
            :back="back"
            :next="next"
            :save="save"
            :submit="submit"
            @process="process"
            @set-submit="setSubmit"
            @set-next="setNext" />
        </div>
      </div>
      <AppNavButtons
        :loading="processing"
        :show-back="showBack"
        :show-cancel="showCancel"
        :show-save="showSave"
        :show-next="showNext"
        :show-submit="showSubmit"
        :disable-submit="disableSubmit"
        :disable-next="disableNext"
        @back="toggleBack"
        @cancel="toggleCancel"
        @save="toggleSave"
        @next="toggleNext"
        @submit="toggleSubmit" />
    </div>
  </v-container>
</template>

<script>
import AppLabel from '@/components/ui/AppLabel.vue'
import AppNavButtons from '@/components/ui/AppNavButtons.vue'
import { useAuthStore } from '@/stores/auth'
import { mapState, mapActions } from 'pinia'
import ApplicationService from '@/services/applicationService'
import FundingAgreementService from '@/services/fundingAgreementService'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import { isEmpty } from 'lodash'
import rules from '@/utils/rules'
import { useOrgStore } from '@/stores/org'
import { UNION_TYPE_CODES } from '@/utils/constants'

export default {
  name: 'SupplementaryAllowanceView',
  components: { AppLabel, AppNavButtons },
  mixins: [alertMixin, permissionsMixin],
  emits: ['process'],
  data() {
    return {
      rules,
      disableSubmit: true,
      disableNext: false,
      loading: false,
      processing: false,
      back: false,
      cancel: false,
      save: false,
      next: false,
      submit: false,
      applications: [],
      application: undefined,
      facilities: [],
      facilityId: undefined,
      faSelectorActive: false,
      fundingAgreementId: undefined,
      facilityFundingAgreements: undefined,
      wasNextClicked: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    showBack() {
      return true
    },
    showCancel() {
      return this.wasNextClicked && !isEmpty(this.application) && this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
    },
    showSave() {
      return this.wasNextClicked && !isEmpty(this.application) && this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
    },
    showNext() {
      return !isEmpty(this.application) && ['supp-allowances-form'].includes(this.$route.name)
    },
    showSubmit() {
      return !isEmpty(this.application) && ['supp-allowances-submit'].includes(this.$route.name)
    },
    showRouterView() {
      return !this.$route.params.applicationGuid && !this.wasNextClicked
    },
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
    // To prevent users from accessing this page by entering url manually
    if (!window.history.state.back) {
      this.$router.push({ name: 'applications-history' })
    }
    await this.loadData()
  },

  methods: {
    isEmpty,
    ...mapActions(useOrgStore, ['getOrganizationInfo']),
    async loadData() {
      try {
        this.loading = true
        await this.getOrganizationInfo(this.userInfo?.organizationId)

        // navigate from the Application Confirmation page (after the providers have just submitted their core funding application)
        if (this.$route.params.applicationGuid) {
          this.application = await ApplicationService.getApplication(this.$route.params.applicationGuid)
          this.application.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByApplicationId(this.$route.params.applicationGuid, true)
        }
        // navigate from the Application History page
        else {
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

    process(value) {
      this.processing = value
    },

    toggleBack() {
      if (!this.application) {
        this.$router.push({ name: 'applications-history' })
      }
      this.back = !this.back
    },
    toggleCancel() {
      this.cancel = !this.cancel
    },
    toggleSave() {
      this.save = !this.save
    },
    toggleNext() {
      this.wasNextClicked = true
      this.next = !this.next
    },
    toggleSubmit() {
      this.submit = !this.submit
    },
    setSubmit(value) {
      this.disableSubmit = !value
    },
    setNext(value) {
      this.disableNext = value
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
