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
      <div class="mt-4">
        <h4>Uploaded Document(s)</h4>
        <v-card class="pa-3" variant="outlined">
          <v-card class="mt-2 mb-3 pa-3">
            <AppDocumentUpload :readonly="true" :documentType="DOCUMENT_TYPES.FINANCIAL_STATEMENT" :uploadedDocuments="documentsFinancialStatements">
              <AppMissingInfoError
                v-if="!documentsFinancialStatements.length"
                :to="{ name: 'operating-costs', hash: '#financial-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ DOCUMENT_TYPES.FINANCIAL_STATEMENT }} document upload required
              </AppMissingInfoError>
            </AppDocumentUpload>
          </v-card>
          <v-card class="pl-3">
            <AppDocumentUpload class="pt-4 pa-3" :readonly="true" :documentType="DOCUMENT_TYPES.BALANCE_SHEET" :uploadedDocuments="documentsBalanceSheets">
              <AppMissingInfoError
                v-if="!documentsBalanceSheets.length"
                :to="{ name: 'operating-costs', hash: '#balance-sheet-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ DOCUMENT_TYPES.BALANCE_SHEET }} document upload required
              </AppMissingInfoError>
            </AppDocumentUpload>
          </v-card>
          <v-card class="pl-3 mt-3 pt-0">
            <AppDocumentUpload class="pt-4 pa-3" :readonly="true" :documentType="DOCUMENT_TYPES.SUPPORTING_DOCS" :uploadedDocuments="documentsSupporting">
              <AppMissingInfoError
                v-if="isRentLease && !documentsSupporting.length"
                :to="{ name: 'operating-costs', hash: '#supporting-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ DOCUMENT_TYPES.SUPPORTING_DOCS }} upload required
              </AppMissingInfoError>
            </AppDocumentUpload>
          </v-card>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import YearlyOperatingCostSummary from '@/components/applications/review/YearlyOperatingCostSummary.vue'
import YearlyFacilityCostSummary from '@/components/applications/review/YearlyFacilityCostSummary.vue'
import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import { FACILITY_TYPES, APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES, DOCUMENT_TYPES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  components: { AppMissingInfoError, YearlyOperatingCostSummary, YearlyFacilityCostSummary, AppDocumentUpload },
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

    isRentLease() {
      return this.currentApplication?.facilityType === FACILITY_TYPES.RENT_LEASE
    },
    totalOperationalCost() {
      return this.currentApplication?.totalYearlyOperatingCosts + this.currentApplication?.totalYearlyFacilityCosts
    },
    documentsFinancialStatements() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.FINANCIAL_STATEMENT)
    },
    documentsBalanceSheets() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.BALANCE_SHEET)
    },
    documentsSupporting() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.SUPPORTING_DOCS)
    },
  },

  created() {
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
  },
}
</script>
