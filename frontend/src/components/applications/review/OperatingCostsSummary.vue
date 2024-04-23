<template>
  <v-container fluid class="pa-2 pb-0">
    <AppMissingInfoError v-if="!currentApplication?.facilityType" :to="{ name: 'operating-costs', hash: '#select-facility-types', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.FACILITY_TYPE }}
    </AppMissingInfoError>
    <div v-else>
      <h4 class="mb-4 text-decoration-underline">Facility Type: {{ getFacilityTypeNameById(currentApplication?.facilityType) }}</h4>
      <AppMissingInfoError v-if="totalOperationalCost === 0" :to="{ name: 'operating-costs', hash: '#yearly-operating-cost', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.OPERATIONAL_COST }}
      </AppMissingInfoError>
      <div v-else>
        <YearlyOperatingCostSummary />
        <YearlyFacilityCostSummary class="mt-4" />
      </div>
      <div v-if="isRentLease" class="mt-4">
        <h4>Uploaded Document(s)</h4>
        <v-card class="pa-3" variant="outlined">
          <v-card class="mt-2 mb-3 pa-3">
            <AppDocumentUpload
              :readonly="true"
              :documentType="DOCUMENT_TYPES.FINANCIAL_STATEMENT"
              :uploadedDocuments="documentsFinancialStatements">
              <AppMissingInfoError v-if="!documentsFinancialStatements.length" :to="{ name: 'operating-costs', hash: '#application-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ DOCUMENT_TYPES.FINANCIAL_STATEMENT }} document upload required
              </AppMissingInfoError>
            </AppDocumentUpload>

          </v-card>
          <v-card class="pl-3">
            <AppDocumentUpload class="pt-4 pr-3"
              :readonly="true"
              :documentType="DOCUMENT_TYPES.BALANCE_SHEET"
              :uploadedDocuments="documentsBalanceSheets">
              <AppMissingInfoError v-if="!documentsBalanceSheets.length" :to="{ name: 'operating-costs', hash: '#application-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ DOCUMENT_TYPES.BALANCE_SHEET }} document upload required
              </AppMissingInfoError>
            </AppDocumentUpload>
          </v-card>
          <v-card class="pl-3 mt-3 pt-0">
            <AppDocumentUpload class="pt-4"
              :readonly="true"
              :documentType="DOCUMENT_TYPES.SUPPORTING_DOC"
              :uploadedDocuments="documentsSupporting" />
            <br>
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
import { FACILITY_TYPES, APPLICATION_ERROR_MESSAGES, DOCUMENT_TYPES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  components: { AppMissingInfoError, YearlyOperatingCostSummary, YearlyFacilityCostSummary, AppDocumentUpload },
  props: {
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
    documentsFinancialStatements() {
      return this.documents.filter(doc => doc.documentType === DOCUMENT_TYPES.FINANCIAL_STATEMENT)
    },
    documentsBalanceSheets() {
      return this.documents.filter(doc => doc.documentType === DOCUMENT_TYPES.BALANCE_SHEET)
    },
    documentsSupporting() {
      return this.documents.filter(doc => doc.documentType === DOCUMENT_TYPES.SUPPORTING_DOC)
    }
  },
  created() {
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
  },
}
</script>
