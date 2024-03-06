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
    <v-row>
      <v-col class="pb-0 d-flex align-end">
        <h3>Add New Application</h3>
      </v-col>
      <v-col v-if="!hasAValidApplication && !loading" class="pb-0">
        <v-alert type="info" dense text>
          If you are totally new in OFM you need to make a OFM application before apply for Supplementary Allowances.
        </v-alert>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-1">
        <v-card class="home-card justify-center">
          <v-card-title class="text-center">
            <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>OFM Application
          </v-card-title>
          <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">
            {{ CARD_INFO_MESSAGE }}
          </v-card-text>
          <v-card-actions class="d-flex flex-column align-center">
            <AppButton id="supp-allowances-button" size="large" width="250px" :to="{ name: 'select-facility' }" class="mt-8 mb-0">Add OFM Application</AppButton>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col class="pt-1">
        <v-card class="home-card justify-center">
          <v-card-title class="text-center">
            <v-icon class="mr-2">mdi-file-document-edit-outline</v-icon>Supplementary Allowance Application
          </v-card-title>
          <v-card-text class="text-center d-flex flex-column align-center pt-4 pb-0">
            {{ CARD_INFO_MESSAGE }}
          </v-card-text>
          <v-card-actions class="d-flex flex-column align-center">
            <AppButton id="supp-allowances-button" size="large" width="250px" :disabled="!hasAValidApplication" :to="{ name: 'supp-allowances' }" class="mt-8">Add SUP Application</AppButton>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="5" lg="5" xl="5" class="mt-2">
        <h3>Applications Summary</h3>
      </v-col>
      <v-col cols="12" md="7" lg="7" xl="7" class="d-flex align-end mb-3">
        <FacilityFilter :loading="loading" :defaultShowInput="true" justify="end" @facility-filter-changed="facilityFilterChanged" />
      </v-col>
    </v-row>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <div v-if="isEmpty(applications)">You have no applications on file</div>
      <v-data-table v-else :headers="headers" :items="filteredApplications" item-key="applicationId" class="soft-outline" density="compact">

        <template #item.actions="{ item }">
          <router-link :to="{ name: 'facility-details', params: { applicationGuid: item?.applicationId } }">
            {{ getApplicationAction(item) }}
          </router-link>
        </template>

        <template #item.submittedDate="{ item }">
          {{ format.formatDate(item.submittedDate) }}
        </template>

        <template #item.latestActivity="{ item }">
          {{ format.formatDate(item.latestActivity) }}
        </template>

        <template #item.actionButtons="{ item }">
          <v-btn v-if="isApplicationDownloadable(item)" variant="text" @click="false">
            <v-icon icon="fa:fa-regular fa-file-pdf"></v-icon>
          </v-btn>
          <v-btn v-if="isApplicationCancellable(item)" variant="text" @click="toggleCancelDialog(item?.applicationId)">
            <v-icon icon="fa:fa-regular fa-trash-can"></v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-skeleton-loader>
    <CancelApplicationDialog :show="showCancelDialog" :applicationId="cancelledApplicationId" @close="toggleCancelDialog" @cancel="cancelApplication" />
    <AppBackButton id="back-home-button" width="220px" :to="{ name: 'home' }">Home</AppBackButton>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import AppBackButton from '@/components/ui/AppBackButton.vue'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'
import format from '@/utils/format'
import CancelApplicationDialog from '@/components/applications/CancelApplicationDialog.vue'
import ApplicationService from '@/services/applicationService'
import FundingAgreementService from '@/services/fundingAgreementService'
import FacilityFilter from '@/components/facilities/FacilityFilter.vue'

export default {
  components: { AppButton, AppBackButton, CancelApplicationDialog, FacilityFilter },
  mixins: [alertMixin],
  data() {
    return {
      format,
      applications: [],
      headers: [
        { title: 'Application ID', key: 'referenceNumber', width: '15%' },
        { title: 'Facility', key: 'facilityName', width: '24%' },
        { title: 'Status', key: 'status', width: '11%' },
        { title: 'Actions', key: 'actions', sortable: false, width: '18%' },
        { title: 'Date submitted', key: 'submittedDate', width: '15%' },
        { title: 'Latest activity', key: 'latestActivity', width: '14%' },
        { title: '', key: 'actionButtons', sortable: false, width: '3%' },
      ],
      loading: false,
      showCancelDialog: false,
      cancelledApplicationId: undefined,
      facilityNameFilter: undefined,
    }
  },
  computed: {
    hasAValidApplication() {
      return this.applications?.some(application => ApplicationService.isValidApplication(application))
    },
    filteredApplications() {
      if (!this.facilityNameFilter) return this.applications
      const lowerCaseFilter = this.facilityNameFilter.toLowerCase();
      return this.applications.filter(application =>
        application.facilityName.toLowerCase().includes(lowerCaseFilter)
      );
    },
  },
  async created() {
    try {
      this.CARD_INFO_MESSAGE = 'If you are totally new in OFM you need to make a OFM application before apply for Supplementary Allowances.'
      this.loading = true
      this.applications = await ApplicationService.getApplications()
      await Promise.all(
        this.applications?.map(async (application) => {
          application.fundingAgreements = await FundingAgreementService.getActiveFundingAgreementsByApplicationId(application.applicationId)
        }),
      )
    } catch (error) {
      this.setFailureAlert('Failed to get the list of applications', error)
    } finally {
      this.loading = false
    }
  },
  methods: {
    isEmpty,
    getApplicationAction(application) {
      if (application?.status === 'Draft') {
        return 'Continue application'
      }
      return 'View submission'
    },
    isApplicationCancellable(application) {
      return application?.status === 'Draft'
    },
    isApplicationDownloadable(application) {
      return ['Approved', 'Submitted'].includes(application?.status)
    },
    toggleCancelDialog(applicationId = undefined) {
      this.showCancelDialog = !this.showCancelDialog
      this.cancelledApplicationId = applicationId
    },
    cancelApplication() {
      const index = this.applications?.findIndex((item) => item.applicationId === this.cancelledApplicationId)
      if (index > -1) {
        this.applications.splice(index, 1)
      }
    },
    facilityFilterChanged(newVal) {
      this.facilityNameFilter = newVal
    },
  },
}
</script>

<style scoped>
:deep(div.v-data-table-footer) {
  padding-top: 20px;
}

.soft-outline {
  border: 1px solid #dee2e6 !important;
}
</style>
