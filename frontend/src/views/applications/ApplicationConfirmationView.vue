<template>
  <v-container>
    <div class="mb-8 text-center">
      <h2>$10 a Day Funding Application Submitted</h2>
      <br />
      <strong class="mb-8 text-center">
        Thank you for your submission. For current status information, please check the application dashboard.
      </strong>
    </div>

    <v-skeleton-loader v-if="loading" :loading="loading" type="table-tbody"></v-skeleton-loader>
    <div v-else>
      <v-row class="flex justify-end mb-1">
        <v-col cols="12">
          <AppAlertBanner v-if="!hasGoodStanding" type="warning">
            {{ NOT_IN_GOOD_STANDING_WARNING_MESSAGE }}
          </AppAlertBanner>
        </v-col>
      </v-row>

      <v-card v-if="hasNonUnionFacilityGroupOrg" elevation="2" class="supp-applications-card">
        <v-card-text class="px-8" py-6>
          <v-row no-gutters class="align-center">
            <v-col cols="12" md="8">
              <p>You may be eligible for additional Allowances. Would you like to apply?</p>
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
              <AppButton
                id="apply-button"
                :primary="false"
                size="large"
                width="100px"
                :disabled="!hasGoodStanding"
                :to="{ name: 'supp-allowances-form', params: { applicationGuid: $route.params.applicationGuid } }">
                Apply
              </AppButton>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
      <v-row justify="space-around" no-gutters class="mt-10">
        <AppBackButton id="back-home-button" :primary="false" width="250px" :to="{ name: 'home' }" align="center">
          Home
        </AppBackButton>
        <AppButton
          id="view-applications-button"
          size="large"
          width="250px"
          :to="{ name: 'applications-history' }"
          align="center"
          class="mt-2">
          View Applications
        </AppButton>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppAlertBanner from '../../components/ui/AppAlertBanner.vue'
import alertMixin from '@/mixins/alertMixin'
import {
  APPLICATION_STATUS_CODES,
  GOOD_STANDING_STATUS_CODES,
  NOT_IN_GOOD_STANDING_WARNING_MESSAGE,
  PROVIDER_TYPE_CODES,
  UNION_TYPE_CODES
} from '@/utils/constants'
import { useOrgStore } from '@/stores/org'
import { useAuthStore } from '@/stores/auth'
import { useApplicationsStore } from '@/stores/applications'
import { mapState, mapActions } from 'pinia'

export default {
  name: 'ApplicationConfirmationView',
  components: { AppButton, AppBackButton, AppAlertBanner },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      facility: undefined
    }
  },
  computed: {
    ...mapState(useOrgStore, ['currentOrg']),
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useApplicationsStore, ['currentApplication']),
    hasGoodStanding() {
      return this.currentOrg?.goodStandingStatusCode === this.GOOD_STANDING_STATUS_CODES.GOOD
    },
    hasNonUnionFacilityGroupOrg() {
      if (this.currentOrg?.providerType === PROVIDER_TYPE_CODES.FAMILY) {
        return false
      }
      return this.currentApplication?.isUnionized === UNION_TYPE_CODES.NO
    }
  },
  async created() {
    try {
      this.loading = true
      this.GOOD_STANDING_STATUS_CODES = GOOD_STANDING_STATUS_CODES
      this.NOT_IN_GOOD_STANDING_WARNING_MESSAGE = NOT_IN_GOOD_STANDING_WARNING_MESSAGE

      //always re load org info to check the BC registry status after submission
      await this.getOrganizationInfo(this.userInfo?.organizationId)

      if (
        !this.currentApplication ||
        this.currentApplication.statusCode != APPLICATION_STATUS_CODES.SUBMITTED ||
        this.currentApplication?.applicationId != this.$route.params.applicationGuid
      ) {
        this.$router.push({ name: 'applications-history' })
      }
    } catch (error) {
      this.setFailureAlert('Failed to get Org Info', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    ...mapActions(useOrgStore, ['getOrganizationInfo'])
  }
}
</script>
<style scoped>
.supp-applications-card {
  border-left: 5px solid #2e8540 !important;
}
</style>
