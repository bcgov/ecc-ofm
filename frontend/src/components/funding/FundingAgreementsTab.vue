<template>
  <v-container fluid class="pa-0">
    <div class="mt-2 ml-2">Manage your facility's current funding requests.</div>
    <FundingSearchCard :loading="loading" class="my-6" @search="loadFundingAgreements" />
    <h2 class="mb-2">Funding Details</h2>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <v-data-table
        id="funding-agreements-table"
        :headers="headers"
        :items="fundingAgreements"
        item-key="guid"
        :items-per-page="10"
        density="compact"
        :mobile="null"
        mobile-breakpoint="md"
        class="soft-outline">
        <template #[`item.startDate`]="{ item }">
          {{ format.formatDate(item?.startDate) }}
        </template>
        <template #[`item.endDate`]="{ item }">
          {{ format.formatDate(item?.endDate) }}
        </template>
        <template #[`item.statusName`]="{ item }">
          <span v-if="item.topUpFundingAmount" :class="getStatusClassTopUp(item?.statusCode)">{{ item?.statusName }}</span>
          <span v-else :class="getStatusClass(item?.statusCode)">{{ item?.statusName }}</span>
        </template>
        <template #[`item.actions`]="{ item }">
          <v-row no-gutters class="my-2 align-center justify-end justify-md-start">
            <AppButton v-if="showSign(item)" :primary="false" size="small" @click="goToPDFViewer(item)">Sign</AppButton>
            <AppButton v-else-if="showOpen(item)" :primary="false" size="small" @click="goToPDFViewer(item)">Open</AppButton>
          </v-row>
        </template>
      </v-data-table>
    </v-skeleton-loader>
  </v-container>
</template>

<script>
import { mapState } from 'pinia'
import AppButton from '@/components/ui/AppButton.vue'
import ApplicationService from '@/services/applicationService'
import IrregularExpenseService from '@/services/irregularExpenseService'
import FundingSearchCard from '@/components/funding/FundingSearchCard.vue'
import alertMixin from '@/mixins/alertMixin.js'
import { useAuthStore } from '@/stores/auth'
import FundingAgreementService from '@/services/fundingAgreementService'
import { FUNDING_AGREEMENT_STATUS_CODES, SUPPLEMENTARY_APPLICATION_STATUS_CODES, BLANK_FIELD, APPLICATION_TYPES, IRREGULAR_EXPENSE_STATUS_CODES, TOP_UP_FUNDING_STATUS_CODES } from '@/utils/constants'
import format from '@/utils/format'

const IN_PROGRESS_STATUSES = [FUNDING_AGREEMENT_STATUS_CODES.DRAFT, FUNDING_AGREEMENT_STATUS_CODES.FA_REVIEW, FUNDING_AGREEMENT_STATUS_CODES.IN_REVIEW_WITH_MINISTRY_EA]

export default {
  name: 'FundingAgreementsTab',
  components: { AppButton, FundingSearchCard },
  mixins: [alertMixin],
  data() {
    return {
      loading: false,
      fundingAgreements: [],
      applications: undefined,
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

  async created() {
    this.loading = true
    this.format = format
    this.FUNDING_AGREEMENT_STATUS_CODES = FUNDING_AGREEMENT_STATUS_CODES
    this.applications = await ApplicationService.getActiveApplications()
  },

  methods: {
    //JB TODO: show expired (but approved) supp apps... that functionality does not exist in CRM yet. to come after MVP?
    async loadApprovedSuppApps(searchQueries) {
      try {
        const applications = this.applications?.filter((application) => searchQueries?.facilities?.some((facility) => facility?.facilityId === application?.facilityId))

        this.supplementaryApplications = (
          await Promise.all(
            applications?.map((application) =>
              ApplicationService.getSupplementaryApplicationsByDate(application.applicationId, SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED, searchQueries?.dateFrom, searchQueries?.dateTo, true),
            ),
          )
        ).flat()

        this.supplementaryApplications?.forEach((app) => {
          this.fundingAgreements.push({
            startDate: app.startDate,
            endDate: app.endDate,
            fundingAgreementNumber: app.fundingAgreementNumber,
            fundingAgreementType: app.supplementaryTypeDescription,
            expenseAuthority: BLANK_FIELD,
            facilityName: applications?.find((el) => app?.applicationId === el?.applicationId)?.facilityName,
            statusCode: FUNDING_AGREEMENT_STATUS_CODES.ACTIVE, //use the FA code to highlight the statusName in green
            statusName: app.supplementaryApplicationStatus,
            supplementaryApplicationId: app.supplementaryApplicationId,
          })
        })
      } catch (error) {
        this.setFailureAlert('Failed to load applications', error)
      }
    },
    async loadFundingAgreements(searchQueries) {
      try {
        this.loading = true
        this.fundingAgreements = []
        await Promise.all(
          searchQueries?.facilities?.map(async (facility) => {
            const facilityFas = await FundingAgreementService.getFAsByFacilityId(facility.facilityId, searchQueries?.dateFrom, searchQueries?.dateTo, true, true)
            if (facilityFas) {
              facilityFas.forEach((fa) => {
                /* ofmcc-7026 - top ups get returned with the FA request,
                  because I can map them all together nicely in the backend resulting in only one extra call.
                  Additionally, it will work with the selected date queries by default. */
                if (fa.topUpFundingAmount) {
                  fa.fundingAgreementType = APPLICATION_TYPES.TOP_UP
                  fa.expenseAuthority = BLANK_FIELD
                  fa.priority = 0
                } else {
                  fa.fundingAgreementType = APPLICATION_TYPES.OFM
                  fa.priority = fa.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING ? 1 : 0
                  fa.statusName = this.getStatusName(fa)
                }
              })

              //by adding irregular expense here it will also search within the user entered date params
              const activeFA = facilityFas.find((el) => el.statusCode === FUNDING_AGREEMENT_STATUS_CODES.ACTIVE)
              if (activeFA) {
                await this.loadIrregularExpenses(activeFA)
              }
              this.fundingAgreements.push(...facilityFas)
            }
          }),
        )
        await this.loadApprovedSuppApps(searchQueries)
        this.fundingAgreements?.sort((a, b) => b.priority - a.priority) // FA Signature Pending status at the top
      } catch (error) {
        this.setFailureAlert('Failed to load funding agreements', error)
      } finally {
        this.loading = false
      }
    },
    async loadIrregularExpenses(activeFA) {
      const expenseApplications = await IrregularExpenseService.getIrregularExpenseApplications(activeFA.applicationId, IRREGULAR_EXPENSE_STATUS_CODES.APPROVED, true)
      expenseApplications?.forEach((app) => {
        this.fundingAgreements.push({
          startDate: app.startDate,
          endDate: app.endDate,
          fundingAgreementNumber: app.fundingAgreementNumber,
          fundingAgreementType: APPLICATION_TYPES.IRREGULAR_EXPENSE,
          expenseAuthority: BLANK_FIELD,
          facilityName: activeFA.facilityName,
          statusCode: FUNDING_AGREEMENT_STATUS_CODES.ACTIVE, //Use FA code to match with styling since we only show approved
          statusName: app.statusName,
          irregularExpenseId: app.irregularExpenseId,
        })
      })
    },

    showSign(fundingAgreement) {
      return fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING && this.isExpenseAuthority(fundingAgreement)
    },

    showOpen(item) {
      if (item.fundingAgreementType === APPLICATION_TYPES.OFM) {
        return (
          [FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED, FUNDING_AGREEMENT_STATUS_CODES.ACTIVE].includes(item?.statusCode) ||
          (item?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING && !this.isExpenseAuthority(item))
        )
      }
      return true
    },

    isExpenseAuthority(fundingAgreement) {
      return this.userInfo?.facilities?.some((facility) => facility.facilityId === fundingAgreement?.facilityId && facility.isExpenseAuthority)
    },

    goToPDFViewer(item) {
      let routeName
      let fundingGuid

      switch (item.fundingAgreementType) {
        case APPLICATION_TYPES.OFM:
          routeName = 'approved-base-funding'
          fundingGuid = item.fundingId
          break
        case APPLICATION_TYPES.TOP_UP:
          routeName = 'topup-funding'
          fundingGuid = item.topUpFundingId
          break
        case APPLICATION_TYPES.IRREGULAR_EXPENSE:
          routeName = 'approved-irregular-funding'
          fundingGuid = item.irregularExpenseId
          break
        default:
          routeName = 'approved-supp-funding'
          fundingGuid = item.supplementaryApplicationId
      }
      this.$router.push({ name: routeName, params: { fundingGuid } })
    },

    getStatusName(item) {
      return IN_PROGRESS_STATUSES.includes(item?.statusCode) ? 'In Progress' : item?.statusName
    },

    getStatusClass(statusCode) {
      return {
        'status-gray': IN_PROGRESS_STATUSES.includes(statusCode),
        'status-yellow': statusCode === FUNDING_AGREEMENT_STATUS_CODES.SIGNATURE_PENDING,
        'status-blue': statusCode === FUNDING_AGREEMENT_STATUS_CODES.SUBMITTED,
        'status-green': [FUNDING_AGREEMENT_STATUS_CODES.ACTIVE].includes(statusCode),
        'status-purple': statusCode === FUNDING_AGREEMENT_STATUS_CODES.EXPIRED,
        'status-red': statusCode === FUNDING_AGREEMENT_STATUS_CODES.TERMINATED,
      }
    },

    getStatusClassTopUp(statusCode) {
      return {
        'status-gray': statusCode === TOP_UP_FUNDING_STATUS_CODES.DRAFT,
        'status-blue': statusCode === TOP_UP_FUNDING_STATUS_CODES.IN_REVIEW,
        'status-green': statusCode === TOP_UP_FUNDING_STATUS_CODES.APPROVED,
      }
    },
  },
}
</script>
