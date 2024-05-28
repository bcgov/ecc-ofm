<template>
  <v-container fluid class="pa-0">
    <FundingSearchCard :loading="loading" @search="loadFundingAgreements" />
    <h2 class="mt-8 mb-2">Funding Details</h2>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table :headers="headers" :items="fundingAgreements" item-key="guid" :items-per-page="10" density="compact" :mobile="null" mobile-breakpoint="md" class="soft-outline">
        <template #[`item.startDate`]="{ item }">
          {{ format.formatDate(item?.startDate) }}
        </template>
        <template #[`item.endDate`]="{ item }">
          {{ format.formatDate(item?.endDate) }}
        </template>
        <template #[`item.status`]="{ item }">
          <span :class="getStatusClass(item?.statusCode)" class="pt-1 pb-1 pl-2 pr-2">{{ item?.statusName }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-btn variant="text" @click="$router.push({ name: 'funding', params: { fundingGuid: item.fundingId } })">
            <v-icon v-if="showSign(item)" aria-label="Sign" size="large">mdi-signature-freehand</v-icon>
            <v-icon v-else-if="showOpen(item)" aria-label="Open" size="large">mdi-folder-open-outline</v-icon>
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

export default {
  name: 'FundingAgreementsTab',
  components: { FundingSearchCard },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      fundingAgreements: [],
      headers: [
        { title: 'Funding Agreement Number', key: 'fundingAgreementNumber' },
        { title: 'Funding Agreement Type', key: 'fundingAgreementType' },
        { title: 'Facility Name', key: 'facilityName' },
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
    this.FUNDING_AGREEMENT_STATUS_CODES = FUNDING_AGREEMENT_STATUS_CODES
  },

  methods: {
    async loadFundingAgreements(searchQueries) {
      try {
        this.loading = true
        this.fundingAgreements = []
        await Promise.all(
          searchQueries?.facilities?.map(async (facility) => {
            const facilityFas = await FundingAgreementService.getFAsByFacilityIdAndStartDate(facility.facilityId, searchQueries?.dateFrom, searchQueries?.dateTo)
            if (facilityFas) {
              facilityFas.forEach((fa) => {
                fa.fundingAgreementType = 'Base Funding' // Base Funding is the only Funding Agreement type. This field/column can be removed in the future.
                fa.priority = fa.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING ? 1 : 0
              })
              this.fundingAgreements.push(...facilityFas)
            }
          }),
        )
        this.fundingAgreements?.sort((a, b) => b.priority - a.priority) // FA Signature Pending status at the top
      } catch (error) {
        this.setFailureAlert('Failed to load funding agreements', error)
      } finally {
        this.loading = false
      }
    },

    showSign(fundingAgreement) {
      return fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING
    },

    showOpen(fundingAgreement) {
      return [FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE].includes(fundingAgreement?.statusCode)
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
