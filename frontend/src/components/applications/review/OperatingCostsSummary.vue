<template>
  <v-container fluid class="pa-2">
    <AppMissingInfoError v-if="!facilityType" :to="{ name: 'operating-costs', hash: '#select-facility-types', params: { applicationGuid: $route.params.applicationGuid } }">
      {{ APPLICATION_ERROR_MESSAGES.FACILITY_TYPE }}
    </AppMissingInfoError>
    <div v-else>
      <h4 class="mb-6 text-decoration-underline">Facility Type: {{ facilityType }}</h4>
      <AppMissingInfoError v-if="totalOperationalCost === 0" :to="{ name: 'operating-costs', hash: '#yearly-operating-cost', params: { applicationGuid: $route.params.applicationGuid } }">
        {{ APPLICATION_ERROR_MESSAGES.OPERATIONAL_COST }}
      </AppMissingInfoError>
      <div v-else>
        <div class="mt-2 mb-0">
          <h4>Yearly Operating Cost</h4>
          <div>This is a placeholder for Yearly Operating Cost summary</div>
        </div>
        <hr />
        <div class="mt-2 mb-0">
          <h4>Yearly Facility Cost</h4>
          <div>This is a placeholder for Yearly Facility Cost summary</div>
        </div>
      </div>
      <hr />
      <div v-if="isRentLease" class="mt-2">
        <h4>Uploaded Document(s)</h4>
        <div v-if="isUploadedDocumentsComplete">This is a placeholder for Uploaded Document summary</div>
        <AppMissingInfoError v-else :to="{ name: 'operating-costs', hash: '#application-document-upload', params: { applicationGuid: $route.params.applicationGuid } }">
          {{ APPLICATION_ERROR_MESSAGES.DOCUMENT_UPLOAD }}
        </AppMissingInfoError>
      </div>
    </div>
  </v-container>
</template>

<script>
import AppMissingInfoError from '@/components/ui/AppMissingInfoError.vue'
import { useApplicationsStore } from '@/stores/applications'
import { mapState } from 'pinia'
import { FACILITY_TYPES, APPLICATION_ERROR_MESSAGES } from '@/utils/constants'
import { isEmpty } from 'lodash'

export default {
  components: { AppMissingInfoError },
  props: {
    documents: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    facilityType() {
      switch (this.currentApplication?.facilityType) {
        case FACILITY_TYPES.RENT_LEASE:
          return 'Rent/Lease'
        case FACILITY_TYPES.OWNED_WITH_MORTGAGE:
          return 'Owned With Mortgage'
        case FACILITY_TYPES.OWNED_WITHOUT_MORTGAGE:
          return 'Owned Without Mortgage'
        case FACILITY_TYPES.PROVIDED_FREE_OF_CHARGE:
          return 'Provided Free of Charge'
        default:
          return ''
      }
    },
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
  },
}
</script>
