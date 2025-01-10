<template>
  <v-container fluid class="pa-0">
    <div class="mt-2 ml-2">View upcoming and past payments for all funding types.</div>
    <FundingSearchCard :loading="loading" :show-payment-types-filter="true" class="my-6" @search="loadPayments" />
    <h2 class="mb-2">Payment History</h2>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table
        id="payment-history-table"
        :headers="paymentHistoryHeaders"
        :items="filteredPaymentHistory"
        item-key="paymentId"
        :items-per-page="10"
        density="compact"
        :mobile="null"
        mobile-breakpoint="md"
        class="soft-outline">
        <template #[`item.invoiceDate`]="{ item }">
          {{ format.formatDate(item?.invoiceDate) }}
        </template>
        <template #[`item.amount`]="{ item }">$ {{ format.formatDecimalNumber(item?.amount) }}</template>
      </v-data-table>
    </v-skeleton-loader>

    <h2 class="mt-8 mb-2">Scheduled Payments</h2>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table
        id="scheduled-payments-table"
        :headers="scheduledPaymentsHeaders"
        :items="filteredScheduledPayments"
        item-key="paymentId"
        :items-per-page="10"
        density="compact"
        :mobile="null"
        mobile-breakpoint="md"
        class="soft-outline">
        <template #[`item.invoiceDate`]="{ item }">
          {{ format.formatDate(item?.invoiceDate) }}
        </template>
        <template #[`item.amount`]="{ item }">$ {{ format.formatDecimalNumber(item?.amount) }}</template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import moment from 'moment'
import FundingSearchCard from '@/components/funding/FundingSearchCard.vue'
import alertMixin from '@/mixins/alertMixin.js'
import PaymentService from '@/services/paymentService'
import { PAYMENT_STATUS_CODES, DATE_FILTER_TYPES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  name: 'PaymentRecordsTab',
  components: { FundingSearchCard },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      paymentHistory: [],
      scheduledPayments: [],
      searchQueries: {},
      paymentHistoryHeaders: [
        { title: 'Payment ID', key: 'paymentNumber' },
        { title: 'Funding Agreement Number', key: 'fundingAgreementNumber' },
        { title: 'Payment Type', key: 'paymentTypeName' },
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Payment Date', key: 'invoiceDate' },
        { title: 'Payment Amount', key: 'amount' }
      ],
      scheduledPaymentsHeaders: [
        { title: 'Funding Agreement Number', key: 'fundingAgreementNumber' },
        { title: 'Payment Type', key: 'paymentTypeName' },
        { title: 'Facility Name', key: 'facilityName' },
        { title: 'Scheduled Payment Date', key: 'invoiceDate' },
        { title: 'Projected Payment Amount', key: 'amount' }
      ]
    }
  },

  computed: {
    filteredPaymentHistory() {
      const filteredPayments = this.paymentHistory?.filter((payment) =>
        this.searchQueries?.paymentFilterTypes?.includes(payment.paymentTypeCode)
      )
      filteredPayments?.sort((a, b) => {
        const dateA = new Date(a.invoiceDate)
        const dateB = new Date(b.invoiceDate)
        return dateB - dateA // descending order (the most recent Paid Payment at the top)
      })
      return filteredPayments
    },
    filteredScheduledPayments() {
      const filteredPayments = this.scheduledPayments?.filter((payment) =>
        this.searchQueries?.paymentFilterTypes?.includes(payment.paymentTypeCode)
      )
      filteredPayments?.sort((a, b) => {
        const dateA = new Date(a.invoiceDate)
        const dateB = new Date(b.invoiceDate)
        return dateA - dateB // ascending order (the most recent Scheduled/Future Payment at the top)
      })
      return filteredPayments
    }
  },

  created() {
    this.format = format
    this.DATE_FILTER_TYPES = DATE_FILTER_TYPES
  },

  methods: {
    async loadPayments(searchQueries) {
      try {
        this.loading = true
        this.searchQueries = searchQueries
        this.paymentHistory = await this.loadPaymentHistory()
        this.scheduledPayments = await this.loadScheduledPayments()
      } catch (error) {
        this.setFailureAlert('Failed to load payments', error)
      } finally {
        this.loading = false
      }
    },

    async loadPaymentHistory() {
      let paymentHistory = []
      await Promise.all(
        this.searchQueries?.facilities?.map(async (facility) => {
          const paidPaymentsForFacility = await PaymentService.getPaymentsByFacilityIdAndStatus(
            facility.facilityId,
            PAYMENT_STATUS_CODES.PAID,
            this.searchQueries?.dateFrom,
            this.searchQueries?.dateTo
          )
          paymentHistory = paymentHistory?.concat(paidPaymentsForFacility)
        })
      )
      return paymentHistory
    },

    // YTD date filter is not applicable for Scheduled Payments, so we'll return all outstanding payments if Date Filter = YTD
    async loadScheduledPayments() {
      let scheduledPayments = []
      const dateFrom =
        this.searchQueries?.dateFilterType === DATE_FILTER_TYPES.CUSTOM
          ? this.searchQueries?.dateFrom
          : moment().startOf('day')
      let dateTo
      switch (this.searchQueries?.dateFilterType) {
        case DATE_FILTER_TYPES.THREE_MONTHS:
          dateTo = moment().add(3, 'months').endOf('month')
          break
        case DATE_FILTER_TYPES.SIX_MONTHS:
          dateTo = moment().add(6, 'months').endOf('month')
          break
        case DATE_FILTER_TYPES.CUSTOM:
          dateTo = this.searchQueries?.dateTo
          break
      }
      await Promise.all(
        this.searchQueries?.facilities?.map(async (facility) => {
          const scheduledPaymentsForFacility = await PaymentService.getActivePaymentsByFacilityId(
            facility.facilityId,
            dateFrom,
            dateTo
          )
          scheduledPayments = scheduledPayments?.concat(scheduledPaymentsForFacility)
        })
      )
      return scheduledPayments
    }
  }
}
</script>
