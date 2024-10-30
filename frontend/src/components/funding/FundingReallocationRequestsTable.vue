<template>
  <v-container fluid class="px-2">
    <h3>Funding Re-allocation Requests</h3>
    <div class="pt-2 pb-4">The funding re-allocation requests shown include all fiscal years of the selected facility.</div>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table
        id="funding-requests-table"
        :headers="fundingRequestsHeaders"
        :items="fundingReallocationRequests"
        item-key="fundingEnvelopeId"
        :items-per-page="10"
        density="compact"
        :mobile="null"
        mobile-breakpoint="md"
        class="soft-outline">
        <template #no-data>The selected facility has not submitted a funding re-allocation request.</template>
        <template #[`item.date`]="{ item }">
          {{ format.formatDate(item?.date) }}
        </template>
        <template #[`item.amount`]="{ item }">$ {{ format.formatDecimalNumber(item?.amount) }}</template>
        <template #[`item.statusCode`]="{ item }">
          <div class="min-width-column">
            <span :class="getStatusClass(item?.statusCode)">{{ item?.statusName }}</span>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { FUNDING_REALLOCATION_REQUEST_STATUS_CODES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  name: 'FundingReallocationRequestsTable',
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
        { title: 'Amount', key: 'amount' },
        { title: 'Status', key: 'statusCode' },
      ],
    }
  },
  created() {
    this.format = format
  },
  methods: {
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
  },
}
</script>
<style scoped>
.min-width-column {
  min-width: 105px;
}
</style>
