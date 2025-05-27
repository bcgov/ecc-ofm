<template>
  <v-container fluid class="px-2">
    <h3>Funding Re-allocation Requests</h3>
    <div class="pt-2 pb-4">The funding re-allocation requests shown include all fiscal years of the selected facility.</div>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <StatusFilter v-if="!isEmpty(fundingReallocationRequests)" :loading="loading" class="mb-4" @status-filter-changed="statusFilterChanged" />
      <v-data-table
        id="funding-requests-table"
        :headers="fundingRequestsHeaders"
        :items="filteredFundingReallocationRequests"
        item-key="fundingEnvelopeId"
        density="compact"
        :mobile="null"
        mobile-breakpoint="md"
        class="soft-outline">
        <template #no-data>
          <span v-if="isEmpty(fundingReallocationRequests)">The selected facility has not submitted a funding re-allocation request.</span>
        </template>

        <template #[`item.date`]="{ item }">
          {{ format.formatDate(item?.date) }}
        </template>
        <template #[`item.envelopeNameFrom`]="{ item }">{{ getEnvelopeName(item.fundingAllocations, 'envelopeNameFrom') }}</template>
        <template #[`item.envelopeNameTo`]="{ item }">{{ getEnvelopeName(item.fundingAllocations, 'envelopeNameTo') }}</template>
        <template #[`item.amount`]="{ item }">$ {{ sumAmounts(item) }}</template>
        <template #[`item.statusCode`]="{ item }">
          <div class="min-width-column">
            <span :class="getStatusClass(item?.statusCode)">{{ item?.statusName }}</span>
          </div>
        </template>
        <template #[`item.fundingAllocations`]="{ item }">
          <div class="min-width-column">
            <AppButton :primary="false" size="small" @click="toggleDialog(item?.fundingAllocations)">View</AppButton>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <FundingAllocationPopup :allocations="activeAllocations" :show="showDialog" @close="toggleDialog()"></FundingAllocationPopup>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import { isEmpty } from 'lodash'
import StatusFilter from '@/components/funding/StatusFilter.vue'
import { FUNDING_REALLOCATION_REQUEST_STATUS_CODES } from '@/utils/constants'
import format from '@/utils/format'
import FundingAllocationPopup from '@/components/funding/FundingAllocationPopup.vue'

export default {
  name: 'FundingReallocationRequestsTable',
  components: { AppButton, FundingAllocationPopup, StatusFilter },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    fundingReallocationRequests: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      fundingRequestsHeaders: [
        { title: 'Date', key: 'date' },
        { title: 'From', key: 'envelopeNameFrom' },
        { title: 'To', key: 'envelopeNameTo' },
        { title: 'Amount', key: 'amount', align: 'end' },
        { title: 'Status', key: 'statusCode' },
        { title: 'Actions', key: 'fundingAllocations' },
      ],
      statusFilter: null,
      showDialog: false,
      activeAllocations: undefined,
    }
  },
  computed: {
    filteredFundingReallocationRequests() {
      return isEmpty(this.statusFilter)
        ? this.fundingReallocationRequests
        : this.fundingReallocationRequests?.filter((request) => request?.statusName?.toUpperCase().includes(this.statusFilter?.toUpperCase()))
    },
  },
  created() {
    this.format = format
  },
  methods: {
    isEmpty,
    getStatusClass(statusCode) {
      switch (statusCode) {
        case FUNDING_REALLOCATION_REQUEST_STATUS_CODES.IN_PROGRESS:
          return 'status-blue'
        case FUNDING_REALLOCATION_REQUEST_STATUS_CODES.APPROVED:
          return 'status-green'
        case FUNDING_REALLOCATION_REQUEST_STATUS_CODES.CANCELLED:
          return 'status-gray'
        case FUNDING_REALLOCATION_REQUEST_STATUS_CODES.INELIGIBLE:
          return 'status-red'
        default:
          return ''
      }
    },
    statusFilterChanged(newVal) {
      this.statusFilter = newVal
    },
    sumAmounts(allocationRequest) {
      //ofmcc 7380- allocation requests can have multiple line items with dollar values. The table updates need to show the value of all line items together in the table.
      return format.formatDecimalNumber(allocationRequest.fundingAllocations.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0))
    },
    toggleDialog(allocations = []) {
      this.showDialog = !this.showDialog
      this.activeAllocations = allocations
    },
    getEnvelopeName(allocations, key) {
      if (!allocations?.length) return ''

      const uniqueNames = [...new Set(allocations.map((allocation) => allocation[key]))]

      return uniqueNames.length === 1 ? uniqueNames[0] : 'Multiple'
    },
  },
}
</script>
<style scoped>
.min-width-column {
  min-width: 105px;
}
</style>
