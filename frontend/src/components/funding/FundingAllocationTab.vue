<template>
  <v-container fluid class="pa-0">
    <div class="ma-2">View or submit a change for your centre's current monthly funding allocations. Funds can be re-allocated based on the rules below.</div>
    <!-- TODO (vietle-cgi) - update permission once we receive confirmation for this requirement -->
    <v-row v-if="hasPermission(PERMISSIONS.SUBMIT_CHANGE_REQUEST)" no-gutters class="mx-2 my-6 my-sm-2 justify-end">
      <AppButton :loading="loading" @click="toggleAssistanceRequestDialog()">Request to Re-allocate Funds</AppButton>
    </v-row>
    <h2 class="ma-2">Funding Re-Allocation Rules</h2>
    <AppAlertBanner type="info" class="ma-2 mb-4">Note: Total funds re-allocated cannot be more than the base funding for each envelope.</AppAlertBanner>
    <FundingAllocationInfoTable class="pa-2" />
    <FundingSearchCard :loading="loading" :select-single-facility="true" :show-date-filter="false" :show-reset-button="false" class="my-10" @search="loadFundingDetails" />
    <BaseFundingCard :loading="loading" :funding-details="fundingDetails" />
    <FundingReallocationRequestsTable :loading="loading" :funding-reallocation-requests="fundingReallocationRequests" class="mt-8" />
    <NewRequestDialog
      class="pa-0"
      :show="showAssistanceRequestDialog"
      :default-facility="selectedFacility"
      :default-request-category-id="getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.FUNDING_ENVELOPE_CR)"
      @close="toggleAssistanceRequestDialog" />
  </v-container>
</template>

<script>
import { mapState } from 'pinia'

import BaseFundingCard from '@/components/funding/BaseFundingCard.vue'
import FundingAllocationInfoTable from '@/components/funding/FundingAllocationInfoTable.vue'
import FundingReallocationRequestsTable from '@/components/funding/FundingReallocationRequestsTable.vue'
import FundingSearchCard from '@/components/funding/FundingSearchCard.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import FundingAgreementService from '@/services/fundingAgreementService'
import { useAppStore } from '@/stores/app'
import alertMixin from '@/mixins/alertMixin.js'
import permissionsMixin from '@/mixins/permissionsMixin'
import { FUNDING_AGREEMENT_STATUS_CODES, REQUEST_CATEGORY_NAMES } from '@/utils/constants'

export default {
  name: 'FundingAllocationTab',
  components: { AppAlertBanner, AppButton, BaseFundingCard, FundingAllocationInfoTable, FundingReallocationRequestsTable, FundingSearchCard, NewRequestDialog },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      loading: false,
      showAssistanceRequestDialog: false,
      selectedFacility: null,
      fundingDetails: {},
      fundingReallocationRequests: [],
    }
  },

  computed: {
    ...mapState(useAppStore, ['getRequestCategoryIdByName']),
  },

  created() {
    this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
  },

  methods: {
    async loadFundingDetails(searchQueries) {
      this.selectedFacility = searchQueries?.facilities
      try {
        this.loading = true
        this.fundingDetails = await FundingAgreementService.getFundingEnvelopesByFacilityIdAndStatus(this.selectedFacility?.facilityId, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE)
        this.fundingReallocationRequests = await FundingAgreementService.getFundingReallocationRequestsByFundingAgreementId(this.fundingDetails?.fundingId)
        this.sortFundingReallocationRequests()
      } catch (error) {
        this.setFailureAlert('Failed to load funding re-allocation requests', error)
      } finally {
        this.loading = false
      }
    },

    // OFMCC-6328 - Sort by status first (In Progress > Approved > Ineligible > Cancelled), and then sort by Date (newest first)
    sortFundingReallocationRequests() {
      this.fundingReallocationRequests?.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return a.statusCode > b.statusCode || dateB - dateA
      })
    },

    toggleAssistanceRequestDialog() {
      this.showAssistanceRequestDialog = !this.showAssistanceRequestDialog
    },
  },
}
</script>
