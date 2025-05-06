<template>
  <v-container fluid>
    <h1>Applications</h1>
    <div class="mt-4 mb-8">Submit an application or view the status for Base Funding, Allowances, or Irregular Expenses Funding.</div>
    <template v-if="hasPermission(PERMISSIONS.APPLY_FOR_FUNDING)">
      <h3 class="my-2">Add New Application</h3>
      <v-row class="align-end">
        <v-col cols="12" md="6">
          <v-card class="basic-card justify-center">
            <v-card-title class="text-center text-wrap">
              <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>
              $10 a Day Funding Application
            </v-card-title>
            <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">
              {{ ofmApplicationCardText }}
            </v-card-text>
            <v-card-actions class="d-flex flex-column align-center">
              <AppButton id="core-application-button" :loading="loading" :disabled="!isAddCoreApplicationAllowed" :to="{ name: APPLICATION_ROUTES.SELECT_FACILITY }" class="ma-2 mt-8">
                Add $10 a Day Application
              </AppButton>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col v-if="hasNonUnionFacilityGroupOrg" cols="12" md="6">
          <div v-if="!hasAValidApplicationAndGoodStanding && !loading">
            <AppAlertBanner v-if="!hasGoodStanding" type="warning">
              {{ NOT_IN_GOOD_STANDING_WARNING_MESSAGE }}
            </AppAlertBanner>
            <AppAlertBanner v-else type="info">If there is no active OFM application, you will not be able to submit Allowances applications.</AppAlertBanner>
          </div>
          <v-card class="basic-card justify-center">
            <v-card-title class="text-center text-wrap">
              <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>
              Allowances (Core and Discretionary Services) Application
            </v-card-title>
            <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">You must have an active OFM application for the facility to apply for Allowances.</v-card-text>
            <v-card-actions class="d-flex flex-column align-center">
              <AppButton id="supp-allowances-button" :loading="loading" :disabled="!hasAValidApplicationAndGoodStanding" :to="{ name: 'supp-allowances' }" class="ma-2 mt-8">
                Add Allowances Application
              </AppButton>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col v-if="showIrregularExpenseCard" cols="12" md="6">
          <v-card class="basic-card justify-center">
            <v-card-title class="text-center text-wrap">
              <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>
              Irregular Expenses Funding Application
            </v-card-title>
            <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">
              To apply for Irregular Expenses, you must have an active Funding Agreement in place.
              <br />
              Funding requires approval before your facility incurs expenses, and you must demonstrate need for the funding.
            </v-card-text>
            <v-card-actions class="d-flex flex-column align-center">
              <AppButton id="irregular-expense-button" :loading="loading" class="ma-2 mt-8 text-wrap" @click="toggleChangeRequestDialog">Add Irregular Expenses Funding Application</AppButton>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col v-if="!isEmpty(facilitiesForRenewal)" cols="12" md="6">
          <v-card class="basic-card justify-center">
            <v-card-title class="text-center text-wrap">
              <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>
              $10 a Day Funding Agreement Renewal
            </v-card-title>
            <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">
              Before starting a renewal, verify your organization and facility details in Account Management
              <br />
              <br />
            </v-card-text>
            <v-card-actions class="d-flex flex-column align-center">
              <AppButton id="renew-application-button" :loading="loading" :to="{ name: RENEWAL_ROUTES.SELECT_FACILITY }" class="ma-2 mt-8">Renew</AppButton>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <v-row class="mt-8 mb-2">
      <v-col cols="12" md="5">
        <h3>Applications Summary</h3>
      </v-col>
      <v-col cols="12" md="7" class="d-flex align-end">
        <FacilityFilter v-if="!loading && !isEmpty(applicationItems)" :default-show-input="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
    </v-row>
    <v-skeleton-loader id="table" :loading="loading" type="table-tbody">
      <div v-if="isEmpty(applicationItems)">You have no applications on file</div>
      <v-data-table
        v-else
        id="applications-history-table"
        :headers="headers"
        :items="filteredApplicationItems"
        item-key="applicationId"
        :mobile="null"
        mobile-breakpoint="md"
        class="soft-outline text-no-wrap"
        density="compact">
        <template #item.status="{ item }">
          <span :class="getStatusClass(item.statusCode)">{{ getStatusLabel(item) }}</span>
        </template>

        <template #item.actions="{ item }">
          <router-link v-if="item.applicationType !== APPLICATION_TYPES.IRREGULAR_EXPENSE" :to="getActionsRoute(item)">
            {{ getApplicationAction(item) }}
          </router-link>
          <a v-else href="#table" @click="getPDF(item)">View Application</a>
          <v-tooltip
            v-if="item.statusCode === APPLICATION_STATUS_CODES.REDIRECTED"
            content-class="tooltip"
            text="Redirected applications are with the $10 a Day team for review. For next steps, please check your email.">
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="text">
                <v-icon size="large" v-bind="props">mdi-information-slab-circle-outline</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>

        <template #item.submittedDate="{ item }">
          {{ format.formatDate(item.submittedDate) }}
        </template>

        <template #item.latestActivityDate="{ item }">
          {{ format.formatDate(item.latestActivityDate) }}
        </template>

        <template #item.actionButtons="{ item }">
          <v-btn v-if="isApplicationCancellable(item)" variant="text" @click="toggleCancelDialog(item)">
            <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
          </v-btn>

          <div v-if="showPDFDownloadButton(item)">
            <v-tooltip v-if="showPDFTooltip(item)" content-class="tooltip" text="This PDF will be generated when the application is approved">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="text">
                  <v-icon :disabled="true" icon="fa:fa-regular fa-file-pdf"></v-icon>
                </v-btn>
              </template>
            </v-tooltip>
            <v-btn v-else variant="text" @click="downloadPDF(item)">
              <v-icon icon="fa:fa-regular fa-file-pdf"></v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <CancelApplicationDialog :show="showCancelDialog" :application-id="cancelledApplicationId" :application-type="applicationTypeToCancel" @close="toggleCancelDialog" @cancel="cancelApplication" />
    <AppBackButton id="back-home-button" max-width="300px" :to="{ name: 'home' }">Home</AppBackButton>
    <NewRequestDialog :show="showChangeRequestDialog" :default-request-category-id="getRequestCategoryIdByName(REQUEST_CATEGORY_NAMES.IRREGULAR_EXPENSES)" @close="toggleChangeRequestDialog" />
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import alertMixin from '@/mixins/alertMixin'
import FacilityService from '@/services/facilityService'
import permissionsMixin from '@/mixins/permissionsMixin'
import { isEmpty } from 'lodash'
import format from '@/utils/format'
import CancelApplicationDialog from '@/components/applications/CancelApplicationDialog.vue'
import ApplicationService from '@/services/applicationService'
import IrregularExpenseService from '@/services/irregularExpenseService'
import FundingAgreementService from '@/services/fundingAgreementService'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import NewRequestDialog from '@/components/messages/NewRequestDialog.vue'
import DocumentService from '@/services/documentService'
import { createPDFDownloadLink } from '@/utils/common'

import {
  APPLICATION_STATUS_CODES,
  APPLICATION_ROUTES,
  RENEWAL_ROUTES,
  GOOD_STANDING_STATUS_CODES,
  SUPPLEMENTARY_APPLICATION_STATUS_CODES,
  NOT_IN_GOOD_STANDING_WARNING_MESSAGE,
  APPLICATION_TYPES,
  REQUEST_CATEGORY_NAMES,
  FUNDING_AGREEMENT_STATUS_CODES,
  PROVIDER_TYPE_CODES,
  UNION_TYPE_CODES,
  CRM_STATE_CODES,
  APPLICATION_RENEWAL_TYPES,
} from '@/utils/constants'
import { mapState, mapActions, mapWritableState } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useOrgStore } from '@/stores/org'
import { useAppStore } from '@/stores/app'

export default {
  components: { AppButton, AppBackButton, CancelApplicationDialog, FacilityFilter, AppAlertBanner, NewRequestDialog },
  mixins: [alertMixin, permissionsMixin],

  data() {
    return {
      format,
      applications: [],
      supplementaryApplications: [],
      redirectedApplications: [],
      applicationItems: [],
      irregularExpenses: [],
      headers: [
        { title: 'Application ID', key: 'referenceNumber', width: '6%' },
        { title: 'Application Type', key: 'applicationType', width: '12%' },
        { title: 'Facility', key: 'facilityName', width: '21%' },
        { title: 'Status', key: 'status', width: '8%' },
        { title: 'Actions', key: 'actions', sortable: false, width: '9%' },
        { title: 'Date submitted', key: 'submittedDate', width: '9%' },
        { title: 'Latest activity', key: 'latestActivityDate', width: '8%' },
        { title: '', key: 'actionButtons', sortable: false, width: '3%' },
      ],
      applicationItemModel: {},
      loading: false,
      showCancelDialog: false,
      cancelledApplicationId: undefined,
      facilityNameFilter: undefined,
      applicationTypeToCancel: undefined,
      showChangeRequestDialog: false,
    }
  },

  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useOrgStore, ['currentOrg']),
    ...mapState(useAppStore, ['getRequestCategoryIdByName']),
    ...mapWritableState(useAppStore, ['facilitiesForRenewal']),

    showIrregularExpenseCard() {
      if (this.currentOrg?.providerType === PROVIDER_TYPE_CODES.FAMILY) {
        return false
      }
      return this.applications?.some((application) => application.fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.ACTIVE && application?.isUnionized === UNION_TYPE_CODES.NO)
    },

    hasGoodStanding() {
      return this.currentOrg?.goodStandingStatusCode === this.GOOD_STANDING_STATUS_CODES.GOOD
    },
    hasAValidApplicationAndGoodStanding() {
      return this.applications?.some((application) => ApplicationService.isValidApplication(application)) && this.hasGoodStanding
    },
    filteredApplicationItems() {
      return this.sortApplicationItems(
        this.applicationItems
          .filter((application) => !this.facilityNameFilter || application.facilityName?.toLowerCase().includes(this.facilityNameFilter.toLowerCase()))
          .filter((application) => application.statusCode !== APPLICATION_STATUS_CODES.REDIRECTED),
      )
    },
    ofmApplicationCardText() {
      if (!this.isIntakeWindowOpenAndValid) {
        return 'The Application intake is currently closed.'
      } else if (this.isAddCoreApplicationAllowed) {
        return 'Before starting an application, verify your organization and facility details in Account Management.'
      } else if (!this.isCCOFEnrolmentCheckSatisfied) {
        return 'Enrolment in CCOF for greater than 1 year is required to apply.'
      } else {
        return 'You do not currently have any eligible facilities to apply to OFM. Please try again later. Thank you for your interest in the program.'
      }
    },
    isAddCoreApplicationAllowed() {
      const hasDraftApplication = this.applications?.some(
        (application) =>
          application?.stateCode === CRM_STATE_CODES.ACTIVE && application?.statusCode === APPLICATION_STATUS_CODES.DRAFT && application?.applicationRenewalType === APPLICATION_RENEWAL_TYPES.NEW,
      )

      const hasMissingApplication = this.userInfo?.facilities?.some((facility) => {
        return !this.applications?.some((application) => {
          return application?.facilityId === facility.facilityId && application?.applicationRenewalType === APPLICATION_RENEWAL_TYPES.NEW
        })
      })
      return this.isIntakeWindowOpenAndValid && (hasDraftApplication || hasMissingApplication)
    },
    isIntakeWindowOpenAndValid() {
      return this.userInfo?.facilities?.some(
        (facility) =>
          facility.facilityStateCode === CRM_STATE_CODES.ACTIVE &&
          facility.intakeWindowCheckForAddApplication &&
          facility.ccofEnrolmentCheckForAddApplication &&
          !this.redirectedApplications?.some((el) => el.facilityId === facility.facilityId),
      )
    },
    isCCOFEnrolmentCheckSatisfied() {
      return this.userInfo?.facilities?.some((facility) => facility.ccofEnrolmentCheckForAddApplication)
    },
    hasNonUnionFacilityGroupOrg() {
      if (this.currentOrg?.providerType === PROVIDER_TYPE_CODES.FAMILY) {
        return false
      }

      //additional logic here to prevent access to supp apps if they leave core app after selecting not Unionized - then return to the history page
      return this.applications?.some(
        (application) => application?.isUnionized === UNION_TYPE_CODES.NO && application?.stateCode === CRM_STATE_CODES.ACTIVE && application?.statusCode !== APPLICATION_STATUS_CODES.DRAFT,
      )
    },
  },

  async created() {
    try {
      this.loading = true
      this.APPLICATION_TYPES = APPLICATION_TYPES
      this.REQUEST_CATEGORY_NAMES = REQUEST_CATEGORY_NAMES
      this.APPLICATION_STATUS_CODES = APPLICATION_STATUS_CODES
      this.APPLICATION_ROUTES = APPLICATION_ROUTES
      this.RENEWAL_ROUTES = RENEWAL_ROUTES
      this.GOOD_STANDING_STATUS_CODES = GOOD_STANDING_STATUS_CODES
      this.DRAFT_STATUS_CODES = [APPLICATION_STATUS_CODES.DRAFT, SUPPLEMENTARY_APPLICATION_STATUS_CODES.DRAFT]
      this.NOT_IN_GOOD_STANDING_WARNING_MESSAGE = NOT_IN_GOOD_STANDING_WARNING_MESSAGE
      await this.getApplicationsAndFundingAgreement()
      await this.getRedirectedApplications()
      await this.getSupplementaryApplications()
      await this.getIrregularExpenseApplications()
      this.mergeRegularAndSupplementaryApplications()

      if (!this.currentOrg) {
        await this.getOrganizationInfo(this.userInfo?.organizationId)
      }
      if (this.facilitiesForRenewal === null) {
        this.facilitiesForRenewal = await FacilityService.getRenewalFacilities()
      }
    } catch (error) {
      this.setFailureAlert('Failed to get the list of applications', error)
    } finally {
      this.loading = false
    }
  },

  methods: {
    ...mapActions(useOrgStore, ['getOrganizationInfo']),
    isEmpty,
    getApplicationAction(application) {
      if (application.statusCode === APPLICATION_STATUS_CODES.REDIRECTED) {
        return ''
      } else if (this.DRAFT_STATUS_CODES.includes(application?.statusCode)) {
        return this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING) ? 'Continue Application' : 'View Application'
      }
      return 'View Application'
    },
    isApplicationCancellable(application) {
      return this.DRAFT_STATUS_CODES.includes(application?.statusCode) && this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING) && application.applicationType !== APPLICATION_TYPES.IRREGULAR_EXPENSE
    },

    showPDFDownloadButton(application) {
      const invalidAppCodes = [APPLICATION_STATUS_CODES.INELIGIBLE, APPLICATION_STATUS_CODES.CANCELLED_BY_MINISTRY, APPLICATION_STATUS_CODES.CANCELLED_BY_SP]

      if (application.applicationType === APPLICATION_TYPES.IRREGULAR_EXPENSE || invalidAppCodes.includes(application.statusCode)) {
        return false
        //OFM core generates PDF upon submit - Supp App generates PDF only once approved
      } else if (application.applicationType === APPLICATION_TYPES.OFM) {
        return !this.DRAFT_STATUS_CODES.includes(application?.statusCode)
      }
      return application.statusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED || application.statusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.SUBMITTED
    },

    showPDFTooltip(application) {
      return application.statusCode === SUPPLEMENTARY_APPLICATION_STATUS_CODES.SUBMITTED && application.applicationType !== APPLICATION_TYPES.OFM
    },

    toggleCancelDialog(item) {
      this.cancelledApplicationId = item?.applicationType === APPLICATION_TYPES.OFM ? item?.applicationId : item?.supplementaryApplicationId
      this.showCancelDialog = !this.showCancelDialog
      if (item) {
        this.applicationTypeToCancel = item.applicationType
      }
    },

    cancelApplication() {
      let index = undefined
      const key = this.applicationTypeToCancel === APPLICATION_TYPES.OFM ? 'applicationId' : 'supplementaryApplicationId'
      index = this.applicationItems?.findIndex((item) => item[key] === this.cancelledApplicationId)
      if (index > -1) {
        this.applicationItems.splice(index, 1)
      }
    },

    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },

    async getApplicationsAndFundingAgreement() {
      let applications = await ApplicationService.getApplications()
      // Applications' funding agreements are used in applications validation to enable the Add SupplementaryApplication
      // Application button
      await Promise.all(
        applications.map(async (application) => {
          application.status = application.statusCode === APPLICATION_STATUS_CODES.VERIFIED ? 'In Review' : application.status
          // we should ignore MOD agreements below - if MOD FA is in status of not active - it will prevent the user
          // from applying for Irreg Expense funding
          application.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByApplicationId(application.applicationId, true)
        }),
      )
      this.applications = applications
    },

    async getSupplementaryApplications() {
      this.supplementaryApplications = (await Promise.all(this.applications.map((application) => ApplicationService.getSupplementaryApplications(application?.applicationId))))
        .filter((application) => application?.length > 0)
        .flat()
    },

    async getRedirectedApplications() {
      this.redirectedApplications = await ApplicationService.getRedirectedApplications(this.userInfo?.facilities.filter((fac) => !this.applications.some((el) => el.facilityId === fac.facilityId)))
      this.applications.push(...this.redirectedApplications)
    },

    /**
     * Create an array of keys to be used as the model for an application item (union of regular and supplementary applications)
     */
    createApplicationItemModel() {
      return [...this.headers.map((header) => header.key), 'applicationId', 'supplementaryApplicationId']
    },

    /**
     * Transform applications to items with the model defined in applicationItemModel
     */
    transformApplicationsToItems(applications) {
      return applications.map((application) => {
        const item = this.applicationItemModel.reduce((obj, key) => {
          obj[key] = application[key]
          return obj
        }, {})
        return {
          ...item,
          applicationType: APPLICATION_TYPES.OFM,
          applicationRenewalType: application.applicationRenewalType,
          statusCode: application.statusCode,
        }
      })
    },

    /**
     * Create a map of application items by applicationId for easy lookup
     */
    createApplicationItemsMap(applicationItems) {
      return applicationItems.reduce((map, item) => {
        map[item.applicationId] = item
        return map
      }, {})
    },

    /**
     * Transform supplementary applications to items with the model defined in applicationItemModel
     */
    transformSupplementaryApplicationsToItems(supplementaryApplications, applicationItemsMap) {
      return supplementaryApplications.map((supplementaryApplication) => {
        const correspondingApplicationItem = applicationItemsMap[supplementaryApplication.applicationId]
        return {
          supplementaryApplicationId: supplementaryApplication.supplementaryApplicationId,
          applicationId: supplementaryApplication.applicationId,
          referenceNumber: supplementaryApplication.supplementaryReferenceNumber,
          status: supplementaryApplication.supplementaryApplicationStatus,
          applicationType: supplementaryApplication.supplementaryTypeDescription,
          facilityName: correspondingApplicationItem ? correspondingApplicationItem.facilityName : '',
          submittedDate: supplementaryApplication.supplementaryApplicationSubmittedDate,
          latestActivityDate: supplementaryApplication.latestActivityDate,
          statusCode: supplementaryApplication.statusCode,
        }
      })
    },

    /**
     * Merge regular and supplementary applications into a single array
     */
    mergeRegularAndSupplementaryApplications() {
      this.applicationItemModel = this.createApplicationItemModel()
      this.applicationItems = this.transformApplicationsToItems(this.applications)
      const applicationItemsMap = this.createApplicationItemsMap(this.applicationItems)
      const supplementaryApplicationItems = this.transformSupplementaryApplicationsToItems(this.supplementaryApplications, applicationItemsMap)
      this.applicationItems = [...this.applicationItems, ...supplementaryApplicationItems, ...this.irregularExpenses]
    },
    getStatusLabel(applicationItem) {
      if ([APPLICATION_STATUS_CODES.CANCELLED_BY_SP, APPLICATION_STATUS_CODES.CANCELLED_BY_MINISTRY].includes(applicationItem.statusCode)) {
        return 'Cancelled'
      }
      return applicationItem.status
    },
    getStatusClass(statusCode) {
      if (
        this.DRAFT_STATUS_CODES.includes(statusCode) ||
        [APPLICATION_STATUS_CODES.REDIRECTED, APPLICATION_STATUS_CODES.INELIGIBLE, APPLICATION_STATUS_CODES.CANCELLED_BY_MINISTRY, APPLICATION_STATUS_CODES.CANCELLED_BY_SP].includes(statusCode)
      ) {
        return 'status-gray'
      } else if (
        [
          APPLICATION_STATUS_CODES.VERIFIED,
          APPLICATION_STATUS_CODES.IN_REVIEW,
          SUPPLEMENTARY_APPLICATION_STATUS_CODES.IN_REVIEW,
          APPLICATION_STATUS_CODES.SUBMITTED,
          SUPPLEMENTARY_APPLICATION_STATUS_CODES.SUBMITTED,
        ].includes(statusCode)
      ) {
        return 'status-green'
      } else if ([APPLICATION_STATUS_CODES.APPROVED, SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED].includes(statusCode)) {
        return 'status-blue'
      } else if ([APPLICATION_STATUS_CODES.UNSUCCESSFUL, APPLICATION_STATUS_CODES.AWAITING_PROVIDER, SUPPLEMENTARY_APPLICATION_STATUS_CODES.ACTION_REQUIRED].includes(statusCode)) {
        return 'status-yellow'
      } else if ([APPLICATION_STATUS_CODES.PROVIDER_DECLINED].includes(statusCode)) {
        return 'status-pink'
      } else if ([APPLICATION_STATUS_CODES.EXPIRED].includes(statusCode)) {
        return 'status-purple'
      }
    },

    getActionsRoute(item) {
      let routeName
      if (item.applicationType !== APPLICATION_TYPES.OFM) {
        routeName = 'supp-allowances-form'
      } else if (item.applicationRenewalType === APPLICATION_RENEWAL_TYPES.RENEWAL) {
        routeName = RENEWAL_ROUTES.FACILITY_DETAILS
      } else {
        routeName = APPLICATION_ROUTES.FACILITY_DETAILS
      }

      return { name: routeName, params: { applicationGuid: item?.applicationId } }
    },

    async getPDF(item) {
      const doc = await DocumentService.getDocuments(item?.assistanceRequestId)
      //TODO- post MVP - add a document Category / type to assistance request to find their application document
      //this will return an array - we are assuming the user uploads their PDF first.
      //we could add in to search for a file of type PDF - but we don't have requirements for this
      const file = await DocumentService.getDocumentFileByID(doc[0]?.documentId)

      try {
        createPDFDownloadLink(file, doc[0]?.fileName)
      } catch (ignoreError) {
        this.setWarningAlert('PDF Generation is still in progress. Please wait a few minutes before you try again.')
      }
    },

    sortApplicationItems(applicationItems) {
      if (!applicationItems) return []
      applicationItems.sort((a, b) => {
        // Compare statusCode
        if (a.statusCode < b.statusCode) return -1
        if (a.statusCode > b.statusCode) return 1
        // If statusCode is equal, compare by lastActivityDate
        const dateA = new Date(a.lastActivityDate)
        const dateB = new Date(b.lastActivityDate)
        return dateA - dateB // For ascending order
      })
      return applicationItems
    },
    async downloadPDF(application) {
      try {
        let resp
        if (application.applicationType === APPLICATION_TYPES.OFM) {
          resp = await ApplicationService.getApplicationPDF(application.applicationId)
        } else {
          resp = await ApplicationService.getSupplementaryApplicationPDF(application.supplementaryApplicationId)
        }

        createPDFDownloadLink(resp, application.referenceNumber)
      } catch (ignoreError) {
        this.setWarningAlert('PDF Generation is still in progress. Please wait a few minutes before you try again.')
      }
    },

    /**
     * Open the Change Request dialog
     */
    toggleChangeRequestDialog() {
      this.showChangeRequestDialog = !this.showChangeRequestDialog
    },
    async getIrregularExpenseApplications() {
      await Promise.all(
        this.applications?.map(async (application) => {
          //you can only apply for Irreg Expense if you have an active FA
          if (application?.fundingAgreement?.statusCode === FUNDING_AGREEMENT_STATUS_CODES.ACTIVE) {
            const expenses = await IrregularExpenseService.getIrregularExpenseApplications(application?.applicationId)
            expenses?.forEach((expense) => {
              this.irregularExpenses.push({
                applicationId: application?.applicationId,
                referenceNumber: expense?.referenceNumber,
                status: expense?.statusName,
                applicationType: APPLICATION_TYPES.IRREGULAR_EXPENSE,
                facilityName: application.facilityName ? application.facilityName : '',
                submittedDate: null,
                latestActivityDate: expense?.lastUpdatedTime,
                statusCode: expense?.statusCode,
                irregularExpenseId: expense?.irregularExpenseId,
                assistanceRequestId: expense?.assistanceRequestId,
              })
            })
          }
        }),
      )
    },
  },
}
</script>

<style scoped>
.soft-outline {
  border: 1px solid #dee2e6 !important;
}
</style>
