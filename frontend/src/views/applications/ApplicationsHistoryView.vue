<template>
  <v-container fluid>
    <v-row>
      <v-col class="pb-0">
        <h1>Applications</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        Suspendisse tristique fringilla nibh, et vehicula tortor hendrerit a. Etiam nisi erat, dictum finibus arcu feugiat, dictum vestibulum augue. In et auctor urna. Suspendisse potenti.
      </v-col>
    </v-row>
    <template v-if="hasPermission(PERMISSIONS.APPLY_FOR_FUNDING)">
      <h3 class="mt-6 mb-2">Add New Application</h3>
      <v-row class="align-end">
        <v-col cols="12" md="6">
          <v-card class="home-card justify-center">
            <v-card-title class="text-center">
              <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>
              OFM Application
            </v-card-title>
            <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">
              <div v-if="isAddCoreApplicationAllowed">Before starting an application, verify your organization and facility details in Account Management.</div>
              <div v-else>The Application intake is currently closed.</div>
            </v-card-text>
            <v-card-actions class="d-flex flex-column align-center">
              <AppButton
                id="core-application-button"
                :loading="loading"
                size="large"
                width="250px"
                :disabled="!isAddCoreApplicationAllowed"
                :to="{ name: APPLICATION_ROUTES.SELECT_FACILITY }"
                class="mt-8 mb-0">
                Add OFM Application
              </AppButton>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col cols="12" md="6">
          <div v-if="!hasAValidApplication && !loading">
            <AppAlertBanner v-if="!hasGoodStanding" type="warning">
              {{ NOT_IN_GOOD_STANDING_WARNING_MESSAGE }}
            </AppAlertBanner>
            <AppAlertBanner v-else type="info">If there is no active OFM application, you won't be able to submit a Supplementary Allowance Application.</AppAlertBanner>
          </div>
          <v-card class="home-card justify-center">
            <v-card-title class="text-center">
              <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>
              Supplementary Allowance Application
            </v-card-title>
            <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">To apply for Supplementary Funding, you must have an active OFM application for the facility.</v-card-text>
            <v-card-actions class="d-flex flex-column align-center">
              <AppButton id="supp-allowances-button" :loading="loading" size="large" width="375px" :disabled="!hasAValidApplication" :to="{ name: 'supp-allowances' }" class="mt-8">
                Add Supplementary Application
              </AppButton>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </template>
    <v-row class="mt-6">
      <v-col cols="12" md="5" lg="5" xl="5" class="mt-2">
        <h3>Applications Summary</h3>
      </v-col>
      <v-col cols="12" md="7" lg="7" xl="7" class="d-flex align-end mb-3">
        <FacilityFilter v-if="!loading" :defaultShowInput="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
    </v-row>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <div v-if="isEmpty(applicationItems)">You have no applications on file</div>
      <v-data-table v-else :headers="headers" :items="filteredApplicationItems" item-key="applicationId" class="soft-outline" density="compact">
        <template #item.status="{ item }">
          <span :class="getStatusClass(item.statusCode)" class="pt-1 pb-1 pl-2 pr-2">{{ item.status }}</span>
        </template>

        <template #item.actions="{ item }">
          <router-link :to="getActionsRoute(item)">
            {{ getApplicationAction(item) }}
          </router-link>
        </template>

        <template #item.submittedDate="{ item }">
          {{ format.formatDate(item.submittedDate) }}
        </template>

        <template #item.latestActivityDate="{ item }">
          {{ format.formatDate(item.latestActivityDate) }}
        </template>

        <template #item.actionButtons="{ item }">
          <v-btn v-if="isApplicationDownloadable(item)" variant="text" @click="false">
            <v-icon icon="fa:fa-regular fa-file-pdf"></v-icon>
          </v-btn>
          <v-btn v-if="isApplicationCancellable(item)" variant="text" @click="toggleCancelDialog(item)">
            <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <CancelApplicationDialog :show="showCancelDialog" :applicationId="cancelledApplicationId" :applicationType="applicationTypeToCancel" @close="toggleCancelDialog" @cancel="cancelApplication" />
    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import AppAlertBanner from '@/components/ui/AppAlertBanner.vue'
import alertMixin from '@/mixins/alertMixin'
import permissionsMixin from '@/mixins/permissionsMixin'
import { isEmpty } from 'lodash'
import format from '@/utils/format'
import CancelApplicationDialog from '@/components/applications/CancelApplicationDialog.vue'
import ApplicationService from '@/services/applicationService'
import FundingAgreementService from '@/services/fundingAgreementService'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'
import { APPLICATION_STATUS_CODES, APPLICATION_ROUTES, GOOD_STANDING_STATUS_CODES, SUPPLEMENTARY_APPLICATION_STATUS_CODES, NOT_IN_GOOD_STANDING_WARNING_MESSAGE } from '@/utils/constants'
import { mapState, mapActions } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useOrgStore } from '@/stores/org'

export default {
  components: { AppButton, AppBackButton, CancelApplicationDialog, FacilityFilter, AppAlertBanner },
  mixins: [alertMixin, permissionsMixin],
  data() {
    return {
      format,
      applications: [],
      supplementaryApplications: [],
      applicationItems: [],
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
      orgInfo: undefined,
    }
  },
  computed: {
    ...mapState(useAuthStore, ['userInfo']),
    ...mapState(useOrgStore, ['currentOrg']),
    hasAValidApplication() {
      return this.applications?.some((application) => ApplicationService.isValidApplication(application)) && this.hasGoodStanding
    },
    hasGoodStanding() {
      return this.currentOrg?.goodStandingStatusCode === this.GOOD_STANDING_STATUS_CODES.GOOD
    },
    filteredApplicationItems() {
      return this.sortApplicationItems(
        this.applicationItems.filter((application) => !this.facilityNameFilter || application.facilityName.toLowerCase().includes(this.facilityNameFilter.toLowerCase())),
      )
    },
    isAddCoreApplicationAllowed() {
      return this.userInfo?.facilities?.some((facility) => facility.isAddCoreApplicationAllowed)
    },
  },
  async created() {
    try {
      this.loading = true
      this.CARD_INFO_MESSAGE = 'If you are totally new in OFM you need to make a OFM application before apply for Supplementary Allowances.'
      this.APPLICATION_STATUS_CODES = APPLICATION_STATUS_CODES
      this.APPLICATION_ROUTES = APPLICATION_ROUTES
      this.GOOD_STANDING_STATUS_CODES = GOOD_STANDING_STATUS_CODES
      this.DRAFT_STATUS_CODES = [APPLICATION_STATUS_CODES.DRAFT, SUPPLEMENTARY_APPLICATION_STATUS_CODES.DRAFT]
      this.NOT_IN_GOOD_STANDING_WARNING_MESSAGE = NOT_IN_GOOD_STANDING_WARNING_MESSAGE
      await this.getApplicationsAndFundingAgreement()
      await this.getSupplementaryApplications()
      this.mergeRegularAndSupplementaryApplications()
      if (!this.currentOrg) {
        await this.getOrganizationInfo(this.userInfo?.organizationId)
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
      if (this.DRAFT_STATUS_CODES.includes(application?.statusCode)) {
        return this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING) ? 'Continue Application' : 'View Application'
      }
      return 'View Application'
    },

    isApplicationCancellable(application) {
      return this.DRAFT_STATUS_CODES.includes(application?.statusCode) && this.hasPermission(this.PERMISSIONS.APPLY_FOR_FUNDING)
    },

    isApplicationDownloadable(application) {
      return !this.DRAFT_STATUS_CODES.includes(application?.statusCode)
    },

    toggleCancelDialog(item) {
      this.cancelledApplicationId = item?.applicationType === 'OFM' ? item?.applicationId : item?.supplementaryApplicationId
      this.showCancelDialog = !this.showCancelDialog
      if (item) {
        this.applicationTypeToCancel = item.applicationType
      }
    },

    cancelApplication() {
      let index = undefined
      const key = this.applicationTypeToCancel === 'OFM' ? 'applicationId' : 'supplementaryApplicationId'
      index = this.applicationItems?.findIndex((item) => item[key] === this.cancelledApplicationId)
      if (index > -1) {
        this.applicationItems.splice(index, 1)
      }
    },

    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },

    async getApplicationsAndFundingAgreement() {
      this.applications = await ApplicationService.getActiveApplications()
      // Applications' funding agreements are used in applications validation to enable the Add Supplementary Application button
      await Promise.all(
        this.applications?.map(async (application) => {
          application.fundingAgreement = await FundingAgreementService.getActiveFundingAgreementByApplicationId(application.applicationId)
        }),
      )
    },

    async getSupplementaryApplications() {
      this.supplementaryApplications = (await Promise.all(this.applications.map((application) => ApplicationService.getSupplementaryApplications(application.applicationId))))
        .filter((application) => application.length > 0)
        .flat()
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
          applicationType: 'OFM',
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
      this.applicationItems = [...this.applicationItems, ...supplementaryApplicationItems]
    },

    getStatusClass(statusCode) {
      if (this.DRAFT_STATUS_CODES.includes(statusCode)) {
        return 'status-gray'
      } else if (
        [APPLICATION_STATUS_CODES.IN_REVIEW, SUPPLEMENTARY_APPLICATION_STATUS_CODES.IN_REVIEW, APPLICATION_STATUS_CODES.SUBMITTED, SUPPLEMENTARY_APPLICATION_STATUS_CODES.SUBMITTED].includes(
          statusCode,
        )
      ) {
        return 'status-green'
      } else if ([APPLICATION_STATUS_CODES.APPROVED, SUPPLEMENTARY_APPLICATION_STATUS_CODES.APPROVED].includes(statusCode)) {
        return 'status-blue'
      } else if ([APPLICATION_STATUS_CODES.AWAITING_PROVIDER, SUPPLEMENTARY_APPLICATION_STATUS_CODES.ACTION_REQUIRED].includes(statusCode)) {
        return 'status-yellow'
      }
    },

    getActionsRoute(item) {
      const routeName = item.applicationType === 'OFM' ? APPLICATION_ROUTES.FACILITY_DETAILS : 'supp-allowances-form'
      return { name: routeName, params: { applicationGuid: item?.applicationId } }
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
  },
}
</script>

<style scoped>
.soft-outline {
  border: 1px solid #dee2e6 !important;
}
</style>
