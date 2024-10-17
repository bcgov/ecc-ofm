<template>
  <v-container fluid class="pa-0">
    <div class="my-2">View or submit a change for your centre's current monthly funding allocations. Funds can be re-allocated based on the rules below.</div>
    <v-row v-if="hasPermission(PERMISSIONS.SUBMIT_CHANGE_REQUEST)" no-gutters class="my-4 pr-2 justify-end">
      <AppButton :loading="loading" @click="toggleAssistanceRequestDialog()">Request to Re-allocate Funds</AppButton>
    </v-row>
    <h2 class="mb-2">Funding Re-Allocation Rules</h2>
    <AppAlertBanner type="info">Note: Total funds re-allocated cannot be more than the base funding for each envelope.</AppAlertBanner>
    <FundingSearchCard :loading="loading" :select-single-facility="true" :show-date-filter="false" class="my-6" @search="loadFundingDetails" />
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

import FundingSearchCard from '@/components/funding/FundingSearchCard.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import AppButton from '@/components/ui/AppButton.vue'
import { useAppStore } from '@/stores/app'
import alertMixin from '@/mixins/alertMixin.js'
import permissionsMixin from '@/mixins/permissionsMixin'
import { REQUEST_CATEGORY_NAMES } from '@/utils/constants'

export default {
  name: 'FundingAllocationTab',
  components: { AppAlertBanner, AppButton, FundingSearchCard, NewRequestDialog },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      loading: false,
      showAssistanceRequestDialog: false,
      selectedFacility: null,
    }
  },

  computed: {
    ...mapState(useAppStore, ['getRequestCategoryIdByName']),
  },

  created() {
    this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
  },

  methods: {
    loadFundingDetails(searchQueries) {
      this.selectedFacility = searchQueries?.facilities
    },

    toggleAssistanceRequestDialog() {
      this.showAssistanceRequestDialog = !this.showAssistanceRequestDialog
    },
  },
}
</script>
