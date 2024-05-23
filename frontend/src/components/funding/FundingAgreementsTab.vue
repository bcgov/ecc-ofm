<template>
  <v-container fluid class="pa-0">
    <FundingSearchCard :loading="loading" @search="loadFundingAgreements" />
    <h2 class="py-6">Funding Details</h2>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table :headers="headers" :items="fundingAgreements" item-key="guid" :items-per-page="10" density="compact" :mobile="null" mobile-breakpoint="md">
        <template #[`item.startDate`]="{ item }">
          {{ format.formatDate(item?.startDate) }}
        </template>
        <template #[`item.endDate`]="{ item }">
          {{ format.formatDate(item?.endDate) }}
        </template>
        <template #[`item.status`]="{ item }">
          <span :class="getStatusClass(item?.statusCode)" class="pt-1 pb-1 pl-2 pr-2">{{ item?.status }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn variant="text" @click="$router.push({ name: 'funding', params: { fundingGuid: item.fundingId } })">
            <v-icon v-if="item?.status === 'FA Signature Pending'" size="large">mdi-signature-freehand</v-icon>
            <v-icon v-else-if="['FA Submitted to Ministry', 'Active'].includes(item?.status)" size="large">mdi-folder-open-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import FundingSearchCard from '@/components/funding/FundingSearchCard.vue'
import alertMixin from '@/mixins/alertMixin.js'
import FundingAgreementService from '@/services/fundingAgreementService'
import { FUNDING_AGREEMENT_STATUS_CODES } from '@/utils/constants'
import format from '@/utils/format'

const STATUS_UNKNOWN = 'Unknown'

const PAYMENT_FILTER_TYPE_VALUES = {
  BASE_FUNDING: 'Base Funding',
  SUPPLEMENTARY_ALLOWANCES: 'Supplementary Allowances',
  OTHER: 'Other',
}

const statusNameMap = {
  [FUNDING_AGREEMENT_STATUS_CODES.DRAFT]: 'Draft',
  [FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW]: 'FA Review',
  [FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING]: 'FA Signature Pending',
  [FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED]: 'FA Submitted to Ministry',
  [FUNDING_AGREEMENT_STATUS_CODES.FA_IN_REVIEW]: 'In Review with Ministry EA',
  [FUNDING_AGREEMENT_STATUS_CODES.ACTIVE]: 'Active',
  [FUNDING_AGREEMENT_STATUS_CODES.EXPIRED]: 'Expired',
  [FUNDING_AGREEMENT_STATUS_CODES.TERMINATED]: 'Terminated',
}

export default {
  name: 'FundingAgreementsTab',
  components: { FundingSearchCard },
  mixins: [alertMixin],
  data() {
    return {
      tab: null,
      loading: false,
      fundingAgreements: [],
      headers: [
        { title: 'Funding Agreement Number', key: 'fundingAgreementNumber' },
        { title: 'Funding Agreement Type', key: 'fundingAgreementType' },
        { title: 'Facility Name', key: 'facility' },
        { title: 'Signing Expense Authority', key: 'expenseAuthority' },
        { title: 'Start Date', key: 'startDate' },
        { title: 'End Date', key: 'endDate' },
        { title: 'Status', key: 'status' },
        { title: 'Actions', key: 'actions' },
      ],
    }
  },

  created() {
    this.format = format
  },

  methods: {
    /**
     * TODO: Payment type is displayed in UI but is not yet integrated into this method as required CRM data is not yet in place.
     * This is a know issue and postponed to a future sprint.
     */
    async loadFundingAgreements(searchQueries) {
      try {
        console.log(searchQueries)
        this.loading = true
        this.fundingAgreements = []
        console.log(searchQueries)
        await Promise.all(
          searchQueries?.facilities?.map(async (facility) => {
            let facilityFas = []
            if (searchQueries?.dateFilterType === 'Custom') {
              facilityFas = await FundingAgreementService.getFAsByFacilityIdAndStartDate(facility.facilityId, searchQueries?.startDateFrom, searchQueries?.startDateTo)
            } else {
              facilityFas = await FundingAgreementService.getFAsByFacilityIdAndStartDate(facility.facilityId, searchQueries?.startDateThreshold)
            }
            if (facilityFas) {
              facilityFas.forEach((fa) => {
                fa.fundingAgreementType = PAYMENT_FILTER_TYPE_VALUES.BASE_FUNDING
                fa.facility = facility.facilityName
                fa.status = statusNameMap[fa.statusCode] ?? STATUS_UNKNOWN
              })
              this.fundingAgreements.push(...facilityFas)
            }
          }),
        )
      } catch (error) {
        this.setFailureAlert('Failed to load funding agreements', error)
      } finally {
        this.loading = false
      }
    },

    getStatusClass(statusCode) {
      return {
        'status-gray': [FUNDING_AGREEMENT_STATUS_CODES.DRAFT, FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE].includes(statusCode),
        'status-yellow': statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING,
        'status-green': statusCode === FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED,
        'status-purple': statusCode === FUNDING_AGREEMENT_STATUS_CODES.EXPIRED,
        'status-red': statusCode === FUNDING_AGREEMENT_STATUS_CODES.TERMINATED,
      }
    },
  },
}
</script>
