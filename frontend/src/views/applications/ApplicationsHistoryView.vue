<template>
  <v-container fluid>
    <h1>Applications</h1>
    <v-skeleton-loader :loading="loading" type="table-tbody">
      <div v-if="isEmpty(applications)">You have no applications on file</div>
      <v-data-table v-else :headers="headers" :items="applications" item-key="applicationId" density="compact">
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
    <AppButton id="back-home-button" class="mt-2" :primary="false" size="large" width="220px" :to="{ name: 'home' }">
      <v-icon class="pb-1">mdi-arrow-left</v-icon>
      Back to Home
    </AppButton>
  </v-container>
</template>

<script>
import AppButton from '@/components/ui/AppButton.vue'
import alertMixin from '@/mixins/alertMixin'
import { isEmpty } from 'lodash'
import format from '@/utils/format'
import CancelApplicationDialog from '@/components/applications/CancelApplicationDialog.vue'
import ApplicationService from '@/services/applicationService'

export default {
  components: { AppButton, CancelApplicationDialog },
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
    }
  },
  computed: {},
  async created() {
    try {
      this.loading = true
      this.applications = await ApplicationService.getApplications()
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
  },
}
</script>

<style scoped>
:deep(div.v-data-table-footer) {
  padding-top: 20px;
}
</style>
