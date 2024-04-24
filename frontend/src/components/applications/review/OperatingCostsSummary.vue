<template>
  <v-container fluid class="pa-2 pb-0">
    <AppMissingInfoError
      v-if="!readonly && !currentApplication?.facilityType"
      :to="{ name: APPLICATION_ROUTES.OPERATING_COSTS, hash: '#select-facility-types', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.FACILITY_TYPE }}
    </AppMissingInfoError>
    <div v-else>
      <h4 class="mb-4 text-decoration-underline">Facility Type: {{ getFacilityTypeNameById(currentApplication?.facilityType) }}</h4>
      <AppMissingInfoError
        v-if="!readonly && totalOperationalCost === 0"
        :to="{ name: APPLICATION_ROUTES.OPERATING_COSTS, hash: '#yearly-operating-cost', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.OPERATIONAL_COST }}
      </AppMissingInfoError>
      <div v-else>
        <YearlyOperatingCostSummary />
        <YearlyFacilityCostSummary class="mt-4" />
      </div>
      <div v-if="isRentLease" class="mt-4">
        <h4>Uploaded Document(s)</h4>
        <v-card v-if="isUploadedDocumentsComplete" class="my-1 pa-2" variant="outlined">
          <div v-for="document in documents" :key="document.documentId" class="px-2 py-1">{{ document.fileName }}</div>
        </v-card>
        <AppMissingInfoError v-else-if="!readonly" :to="{ name: APPLICATION_ROUTES.OPERATING_COSTS, hash: '#application-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_UPLOAD }}
        </AppMissingInfoError>
      </div>
    </div>
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import YearlyOperatingCostSummary from '@/components/applications/review/YearlyOperatingCostSummary.vue'
import YearlyFacilityCostSummary from '@/components/applications/review/YearlyFacilityCostSummary.vue'
import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import { FACILITY_TYPES, APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  components: { AppMissingInfoError, YearlyOperatingCostSummary, YearlyFacilityCostSummary },

  props: {
    readonly: {
      type: Boolean,
      default: false,
    },
    documents: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    ...mapState(useAppStore, ['getFacilityTypeNameById']),
    ...mapState(useApplicationsStore, ['currentApplication']),
    isUploadedDocumentsComplete() {
      return !this.isRentLease || (this.isRentLease && !isEmpty(this.documents))
    },
    isRentLease() {
      return this.currentApplication?.facilityType === FACILITY_TYPES.RENT_LEASE
    },
    totalOperationalCost() {
      return this.currentApplication?.totalYearlyOperatingCosts + this.currentApplication?.totalYearlyFacilityCosts
    },
  },

  created() {
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
  },
}
</script>
