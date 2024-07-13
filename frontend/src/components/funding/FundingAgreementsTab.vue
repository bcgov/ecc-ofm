<template>
  <v-container fluid class="pa-0">
    <div class="mt-2 ml-2">Manage your facility's current funding requests.</div>
    <FundingSearchCard :loading="loading" class="my-6" @search="loadFundingAgreements" />
    <h2 class="mb-2">Funding Details</h2>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table :headers="headers" :items="fundingAgreements" item-key="guid" :items-per-page="10" density="compact" :mobile="null" mobile-breakpoint="md" class="soft-outline">
        <template #[`item.startDate`]="{ item }">
          {{ format.formatDate(item?.startDate) }}
        </template>
        <template #[`item.endDate`]="{ item }">
          {{ format.formatDate(item?.endDate) }}
        </template>
        <template #[`item.statusName`]="{ item }">
          <span :class="getStatusClass(item?.statusCode)">{{ item?.statusName }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
            <AppButton v-if="showSign(item)" :primary="false" size="small" height="30px" @click="goToFundingAgreement(item)">Sign</AppButton>
            <AppButton v-else-if="showOpen(item)" :primary="false" size="small" height="30px" @click="goToFundingAgreement(item)">Open</AppButton>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import FundingSearchCard from '@/components/funding/FundingSearchCard.vue'
import alertMixin from '@/mixins/alertMixin.js'
import { useAuthStore } from '@/stores/auth'
import FundingAgreementService from '@/services/fundingAgreementService'
import { FUNDING_AGREEMENT_STATUS_CODES } from '@/utils/constants'
import format from '@/utils/format'

export default {
  name: 'FundingAgreementsTab',
  components: { AppButton, FundingSearchCard },
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
        { title: 'Status', key: 'statusName' },
        { title: 'Actions', key: 'actions', sortable: false },
      ],
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
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
      return fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING && this.isExpenseAuthority(fundingAgreement)
    },

    showOpen(fundingAgreement) {
      return (
        [FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE].includes(fundingAgreement?.statusCode) ||
        (fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING && !this.isExpenseAuthority(fundingAgreement))
      )
    },

    isExpenseAuthority(fundingAgreement) {
      return this.userInfo?.facilities?.some((facility) => facility.facilityId === fundingAgreement?.facilityId && facility.isExpenseAuthority)
    },

    goToFundingAgreement(fundingAgreement) {
      this.$router.push({ name: 'funding', params: { fundingGuid: fundingAgreement.fundingId } })
    },

    getStatusClass(statusCode) {
      return {
        'status-gray': [FUNDING_AGREEMENT_STATUS_CODES.DRAFT, FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW].includes(statusCode),
        'status-yellow': statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING,
        'status-green': [FUNDING_AGREEMENT_STATUS_CODES.ACTIVE, FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED].includes(statusCode),
        'status-purple': statusCode === FUNDING_AGREEMENT_STATUS_CODES.EXPIRED,
        'status-red': statusCode === FUNDING_AGREEMENT_STATUS_CODES.TERMINATED,
      }
    },
  },
}
</script>
