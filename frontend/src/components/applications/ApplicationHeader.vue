<template>
  <v-container fluid class="pa-0">
    <div class="d-sm-flex flex-wrap justify-space-between mb-3">
      <h3 class="order-sm-2 header-application my-2">{{ currentApplication?.referenceNumber }}</h3>
      <h2 v-if="pageTitle" class="order-sm-1 my-2">{{ pageTitle }}</h2>
    </div>
    <h4 class="mb-8">
      Your facility:
      <span class="facility-name ml-6">{{ currentApplication?.facilityName }}</span>
    </h4>
  </v-container>
</template>
<script>
import { mapState } from 'pinia'
import { useApplicationsStore } from '@/stores/applications'
import { APPLICATION_ROUTES, RENEWAL_ROUTES } from '@/utils/constants'

export default {
  computed: {
    ...mapState(useApplicationsStore, ['currentApplication']),
    pageTitle() {
      switch (this.$route.name) {
        case APPLICATION_ROUTES.FACILITY_DETAILS:
        case RENEWAL_ROUTES.FACILITY_DETAILS:
          return 'Facility Details'
        case APPLICATION_ROUTES.ELIGIBILITY:
          return 'Eligibility'
        case APPLICATION_ROUTES.SERVICE_DELIVERY:
        case RENEWAL_ROUTES.SERVICE_DELIVERY:
          return 'Service Delivery Details'
        case APPLICATION_ROUTES.OPERATING_COSTS:
        case RENEWAL_ROUTES.OPERATING_COSTS:
          return 'Operating Costs'
        case APPLICATION_ROUTES.STAFFING:
        case RENEWAL_ROUTES.STAFFING:
          return 'Staffing'
        case APPLICATION_ROUTES.REVIEW:
        case RENEWAL_ROUTES.REVIEW:
          return 'Review'
        case APPLICATION_ROUTES.SUBMIT:
        case RENEWAL_ROUTES.SUBMIT:
          return 'Declaration'
        default:
          return null
      }
    },
  },
}
</script>
<style scoped>
.header-application {
  color: #003366;
}

.facility-name {
  color: #003366;
  font-size: 1.3em;
  text-decoration: underline;
}
</style>
