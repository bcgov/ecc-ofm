<template>
  <v-container fluid class="pa-2 pb-0">
    <AppMissingInfoError v-if="!readonly && !currentApplication?.facilityType" :to="{ name: routeName, hash: '#select-facility-types', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.FACILITY_TYPE }}
    </AppMissingInfoError>
    <div v-else>
      <h4 class="mb-4 text-decoration-underline">Facility Type: {{ getFacilityTypeNameById(currentApplication?.facilityType) }}</h4>

      <!-- RENT/LEASE INFORMATION -->
      <div v-if="isRentLease" class="my-4">
        <h4>Rent/Lease Information</h4>
        <v-card class="my-1 px-4 py-1" variant="outlined">
          <div>
            <div>
              <v-row v-if="currentApplication?.rentLeaseStartDate && currentApplication?.rentLeaseEndDate" no-gutters class="px-2 mt-4">
                <AppLabel class="mr-2">Rent/Lease Date Range:</AppLabel>
                <span>{{ format.formatDate(currentApplication?.rentLeaseStartDate) }} to {{ format.formatDate(currentApplication?.rentLeaseEndDate) }}</span>
              </v-row>
              <AppMissingInfoError
                v-else-if="!readonly && currentApplication.monthToMonthRentLease !== 1"
                :to="{ name: routeName, hash: '#rent-lease-info', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ APPLICATION_ERROR_MESSAGES.RENT_LEASE_DATE_RANGE }}
              </AppMissingInfoError>
            </div>
            <v-checkbox v-if="currentApplication.monthToMonthRentLease" v-model="currentApplication.monthToMonthRentLease" :true-value="YES_NO_CHOICE_CRM_MAPPING.YES" disabled hide-details>
              <template #label>My facility's rent/lease is on a month-to-month basis.</template>
            </v-checkbox>
          </div>
          <div>
            <AppMissingInfoError
              v-if="!readonly && currentApplication.armsLength !== YES_NO_CHOICE_CRM_MAPPING.YES"
              :to="{ name: routeName, hash: '#arm-length', params: { applicationGuid: $route.params.applicationGuid } }">
              {{ APPLICATION_ERROR_MESSAGES.ARM_LENGTH }}
            </AppMissingInfoError>
            <v-checkbox v-else v-model="currentApplication.armsLength" :true-value="YES_NO_CHOICE_CRM_MAPPING.YES" disabled hide-details>
              <template #label>I attest that the rent/lease agreement is at Arm's Length.</template>
            </v-checkbox>
          </div>
        </v-card>
      </div>

      <!-- OPERATING COST / FACILITY COST -->
      <div>
        <AppMissingInfoError v-if="!readonly && totalOperationalCost === 0" :to="{ name: routeName, hash: '#yearly-operating-cost', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.OPERATIONAL_COST }}
        </AppMissingInfoError>
        <div v-else>
          <YearlyOperatingCostSummary />
          <YearlyFacilityCostSummary class="mt-4" />
        </div>
      </div>

      <!-- UPLOAD DOCUMENTS -->
      <div v-if="showUploadedDocs" class="mt-4">
        <h4>Uploaded Document(s)</h4>
        <v-card class="pa-3" variant="outlined">
          <v-card v-if="isRentLease" class="mt-2 mb-3 pa-3">
            <AppDocumentUpload :readonly="true" :document-type="DOCUMENT_TYPES.RENT_LEASE_AGREEMENT" :uploaded-documents="documentsRentLease" />
            <AppMissingInfoError
              v-if="!readonly && !documentsRentLease.length"
              :to="{ name: routeName, hash: '#rent-lease-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
              {{ DOCUMENT_TYPES.RENT_LEASE_AGREEMENT }} document upload required
            </AppMissingInfoError>
          </v-card>
          <v-card v-if="!isRenewal" class="mt-2 mb-3 pa-3">
            <AppDocumentUpload :readonly="true" :document-type="DOCUMENT_TYPES.INCOME_STATEMENT" :uploaded-documents="documentsFinancialStatements">
              <AppMissingInfoError
                v-if="!readonly && !documentsFinancialStatements.length"
                :to="{ name: routeName, hash: '#financial-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ DOCUMENT_TYPES.INCOME_STATEMENT }} document upload required
              </AppMissingInfoError>
            </AppDocumentUpload>
          </v-card>
          <v-card v-if="!isRenewal" class="pl-3">
            <AppDocumentUpload class="pt-4 pa-3" :readonly="true" :document-type="DOCUMENT_TYPES.BALANCE_SHEET" :uploaded-documents="documentsBalanceSheets">
              <AppMissingInfoError
                v-if="!readonly && !documentsBalanceSheets.length"
                :to="{ name: routeName, hash: '#balance-sheet-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
                {{ DOCUMENT_TYPES.BALANCE_SHEET }} document upload required
              </AppMissingInfoError>
            </AppDocumentUpload>
          </v-card>
          <v-card v-if="isOwnedWithMortgage" class="pl-3 mt-2 mb-3 pa-3">
            <AppDocumentUpload :readonly="true" :document-type="DOCUMENT_TYPES.MORTGAGE_STATEMENT" :uploaded-documents="documentsMortgage" />
            <AppMissingInfoError
              v-if="!readonly && !documentsMortgage.length"
              :to="{ name: routeName, hash: '#mortgage-statement-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
              {{ DOCUMENT_TYPES.MORTGAGE_STATEMENT }} document upload required
            </AppMissingInfoError>
          </v-card>
          <v-card v-if="showSupportingDocs" class="pl-3 mt-3 pt-0">
            <AppDocumentUpload class="pt-4 pa-3" :readonly="true" :document-type="DOCUMENT_TYPES.SUPPORTING_DOCS" :uploaded-documents="documentsSupporting" />
          </v-card>
        </v-card>
      </div>
    </div>
  </v-container>
</template>

<script>
import { isEmpty } from 'lodash'
import { mapState } from 'pinia'

import AppDocumentUpload from '@/components/ui/AppDocumentUpload.vue'
import AppLabel from '@/components/ui/AppLabel.vue'
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import YearlyOperatingCostSummary from '@/components/applications/review/YearlyOperatingCostSummary.vue'
import YearlyFacilityCostSummary from '@/components/applications/review/YearlyFacilityCostSummary.vue'
import { useAppStore } from '@/stores/app'
import { useApplicationsStore } from '@/stores/applications'
import format from '@/utils/format'
import { FACILITY_TYPES, APPLICATION_ERROR_MESSAGES, APPLICATION_ROUTES, DOCUMENT_TYPES, YES_NO_CHOICE_CRM_MAPPING, RENEWAL_ROUTES } from '@/utils/constants'

export default {
  components: { AppLabel, AppMissingInfoError, YearlyOperatingCostSummary, YearlyFacilityCostSummary, AppDocumentUpload },
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
    isRenewal() {
      return !!this.$route.meta.isRenewal
    },

    isRentLease() {
      return this.currentApplication?.facilityType === FACILITY_TYPES.RENT_LEASE
    },
    isOwnedWithMortgage() {
      return this.currentApplication?.facilityType === FACILITY_TYPES.OWNED_WITH_MORTGAGE
    },
    totalOperationalCost() {
      return this.currentApplication?.totalYearlyOperatingCosts + this.currentApplication?.totalYearlyFacilityCosts
    },
    documentsFinancialStatements() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.INCOME_STATEMENT)
    },
    documentsBalanceSheets() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.BALANCE_SHEET)
    },
    documentsRentLease() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.RENT_LEASE_AGREEMENT)
    },
    documentsMortgage() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.MORTGAGE_STATEMENT)
    },
    documentsSupporting() {
      return this.documents.filter((doc) => doc.documentType === DOCUMENT_TYPES.SUPPORTING_DOCS)
    },
    showSupportingDocs() {
      return !isEmpty(this.documentsSupporting)
    },
    showUploadedDocs() {
      return this.isRentLease || this.isOwnedWithMortgage || this.showSupportingDocs
    },
    routeName() {
      return this.isRenewal ? RENEWAL_ROUTES.OPERATING_COSTS : APPLICATION_ROUTES.OPERATING_COSTS
    },
  },

  created() {
    this.format = format
    this.APPLICATION_ERROR_MESSAGES = APPLICATION_ERROR_MESSAGES
    this.APPLICATION_ROUTES = APPLICATION_ROUTES
    this.DOCUMENT_TYPES = DOCUMENT_TYPES
    this.YES_NO_CHOICE_CRM_MAPPING = YES_NO_CHOICE_CRM_MAPPING
  },
}
</script>
